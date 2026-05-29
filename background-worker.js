/* OptiDrop — background-worker.js (Block 7)
   Attempts to run @imgly/background-removal inside a Web Worker.
   Falls back gracefully if the library cannot initialise in the
   worker context (e.g. missing WebAssembly or DOM stubs).

   Message IN  { file: Blob }
   Message OUT { blob, success }  |  { progress, status }  |  { error, fallback }
*/

var libReady = false;

/* Attempt to load @imgly/background-removal UMD build.
   In a Worker the UMD wrapper binds to `self` instead of `window`. */
try {
    importScripts('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/index.umd.js');
    if (typeof self.removeBackground === 'function') {
        libReady = true;
    } else if (typeof removeBackground === 'function') {
        libReady = true;
    }
} catch (e) {
    /* Library could not load in Worker — signal fallback */
    self.postMessage({ error: 'Worker load failed: ' + e.message, fallback: true });
}

self.onmessage = async function (e) {
    var msg  = e.data;
    var file = msg.file;

    /* ---- Library available in Worker ---- */
    if (libReady) {
        self.postMessage({ progress: 0, status: 'Starting background removal...' });

        try {
            var removeFn = (typeof self.removeBackground === 'function')
                ? self.removeBackground
                : removeBackground;

            var result = await removeFn(file, {
                progress: function (key, current, total) {
                    if (key === 'compute:inference') {
                        self.postMessage({
                            progress: Math.round((current / total) * 100),
                            status: 'Processing: ' + Math.round((current / total) * 100) + '%'
                        });
                    } else if (key && key.startsWith('fetch:')) {
                        self.postMessage({ progress: 0, status: 'Downloading AI model...' });
                    }
                }
            });

            self.postMessage({ blob: result, success: true }, [result]);
        } catch (err) {
            self.postMessage({ error: err.message || 'Background removal failed', fallback: true });
        }
        return;
    }

    /* ---- Library not available — signal main-thread fallback ---- */
    self.postMessage({
        error: 'Background removal library not available in worker context.',
        fallback: true
    });
};
