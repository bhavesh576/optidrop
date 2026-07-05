/* OptiDrop — compress-worker.js (Block 7)
   Offloads the iterative image-compression loop to a Web Worker
   using OffscreenCanvas + createImageBitmap.

   Message IN  { file: Blob, targetBytes, format, forcedWidth, forcedHeight }
   Message OUT { blob, width, height, success }  or  { error }

   The worker re-decodes the source file Blob whenever it needs to
   re-draw at a new dimension, because an ImageBitmap can only be
   drawn once after .close().
*/

self.onmessage = async function (e) {
    var msg = e.data;
    try {
        /* ---- decode source image ---- */
        var bitmap = await createImageBitmap(msg.file);

        var w = msg.forcedWidth  > 0 ? msg.forcedWidth  : bitmap.width;
        var h = msg.forcedHeight > 0 ? msg.forcedHeight : bitmap.height;

        if (msg.forcedWidth > 0 && msg.forcedHeight <= 0) {
            h = Math.round(bitmap.height * (msg.forcedWidth / bitmap.width));
        } else if (msg.forcedHeight > 0 && msg.forcedWidth <= 0) {
            w = Math.round(bitmap.width * (msg.forcedHeight / bitmap.height));
        }

        var format      = msg.format      || 'image/jpeg';
        var targetBytes = msg.targetBytes  || 102400;

        /* helper: (re)draw a bitmap onto an OffscreenCanvas */
        function draw(cvs, ctx, bm, cw, ch) {
            cvs.width  = cw;
            cvs.height = ch;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, cw, ch);
            ctx.drawImage(bm, 0, 0, cw, ch);
        }

        /* ---- initial draw ---- */
        var canvas = new OffscreenCanvas(w, h);
        var ctx    = canvas.getContext('2d');
        draw(canvas, ctx, bitmap, w, h);
        bitmap.close();

        /* ==== PNG — dimension-only reduction (lossless) ==== */
        if (format === 'image/png') {
            self.postMessage({ progress: 10 });
            var pngBlob = await canvas.convertToBlob({ type: 'image/png' });
            var iter = 0;
            while (pngBlob.size > targetBytes && iter < 8) {
                iter++;
                var sf = Math.sqrt(targetBytes / pngBlob.size);
                w = Math.max(1, Math.floor(w * sf));
                h = Math.max(1, Math.floor(h * sf));
                var bm = await createImageBitmap(msg.file);
                canvas = new OffscreenCanvas(w, h);
                ctx = canvas.getContext('2d');
                draw(canvas, ctx, bm, w, h);
                bm.close();
                pngBlob = await canvas.convertToBlob({ type: 'image/png' });
                self.postMessage({ progress: Math.min(90, 10 + Math.round(iter * 80 / 8)) });
            }
            self.postMessage({ blob: pngBlob, width: w, height: h, success: true }, [pngBlob]);
            return;
        }

        /* ==== JPG / WebP — binary-search quality + dimension shrink ==== */
        self.postMessage({ progress: 10 });
        var bestBlob = await canvas.convertToBlob({ type: format, quality: 0.9 });
        if (bestBlob.size <= targetBytes) {
            self.postMessage({ blob: bestBlob, width: w, height: h, success: true }, [bestBlob]);
            return;
        }

        for (var iter = 0; iter < 5; iter++) {
            self.postMessage({ progress: Math.min(90, 10 + Math.round(iter * 80 / 5)) });
            var lo = 0.05, hi = 0.9;
            for (var j = 0; j < 8; j++) {
                var q = (lo + hi) / 2;
                var test = await canvas.convertToBlob({ type: format, quality: q });
                if (test.size > targetBytes) hi = q;
                else { lo = q; bestBlob = test; }
            }
            if (bestBlob.size <= targetBytes) break;

            /* shrink dimensions */
            var sc = Math.sqrt(targetBytes / bestBlob.size) * 0.9;
            sc = Math.max(0.4, Math.min(0.85, sc));
            w = Math.max(1, Math.floor(w * sc));
            h = Math.max(1, Math.floor(h * sc));

            var bm = await createImageBitmap(msg.file);
            canvas = new OffscreenCanvas(w, h);
            ctx = canvas.getContext('2d');
            draw(canvas, ctx, bm, w, h);
            bm.close();
            bestBlob = await canvas.convertToBlob({ type: format, quality: 0.5 });
        }

        /* final fallback */
        if (bestBlob.size > targetBytes) {
            w = Math.max(1, Math.floor(w * 0.5));
            h = Math.max(1, Math.floor(h * 0.5));
            var bm = await createImageBitmap(msg.file);
            canvas = new OffscreenCanvas(w, h);
            ctx = canvas.getContext('2d');
            draw(canvas, ctx, bm, w, h);
            bm.close();
            bestBlob = await canvas.convertToBlob({ type: format, quality: 0.05 });
        }

        self.postMessage({ blob: bestBlob, width: w, height: h, success: true }, [bestBlob]);
    } catch (err) {
        self.postMessage({ error: err.message || 'Compression failed' });
    }
};
