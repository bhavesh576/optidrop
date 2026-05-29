/* OptiDrop — ocr-worker.js (Block 7)
   Runs Tesseract.js v5 OCR inside a dedicated Web Worker so the
   main UI thread stays fully responsive.

   Message IN  { file: Blob, lang: 'eng' }
   Message OUT { text, confidence, success }  |  { progress, status }  |  { error }
*/

var workerReady = false;
var tessWorker  = null;

/* Load Tesseract.js v5 from CDN (available in Worker via importScripts) */
try {
    importScripts('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    workerReady = true;
} catch (e) {
    self.postMessage({ error: 'Failed to load Tesseract.js in worker: ' + e.message });
}

self.onmessage = async function (e) {
    if (!workerReady) {
        self.postMessage({ error: 'Tesseract.js is not loaded.' });
        return;
    }

    var msg  = e.data;
    var file = msg.file;
    var lang = msg.lang || 'eng';

    self.postMessage({ progress: 0, status: 'Initializing OCR engine...' });

    try {
        /* Create (or re-use) a Tesseract worker */
        if (!tessWorker) {
            tessWorker = await Tesseract.createWorker(lang, 1, {
                logger: function (m) {
                    if (m.status === 'recognizing text') {
                        self.postMessage({
                            progress: Math.round((m.progress || 0) * 100),
                            status: 'Recognizing text...'
                        });
                    } else if (m.status === 'loading tesseract core') {
                        self.postMessage({ progress: 0, status: 'Loading OCR engine...' });
                    } else if (m.status === 'loading language traineddata') {
                        self.postMessage({ progress: 0, status: 'Loading language data...' });
                    } else if (m.status === 'initializing tesseract') {
                        self.postMessage({ progress: 0, status: 'Preparing...' });
                    }
                }
            });
        }

        self.postMessage({ progress: 5, status: 'Processing image...' });

        var result = await tessWorker.recognize(file);
        var data   = result.data;

        self.postMessage({
            text:       (data.text || '').trim(),
            confidence: data.confidence || 0,
            success:    true
        });
    } catch (err) {
        self.postMessage({ error: err.message || 'OCR processing failed' });
    }
};
