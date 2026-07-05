/* =========================================================
   OptiDrop — script.js (Dashboard + 8 Tools)
   Shared helpers (showToast, formatBytes, etc.) are in common.js
   ========================================================= */

/* ═══════════════════════════════════════════════════════════
   DASHBOARD NAVIGATION
   ═══════════════════════════════════════════════════════════ */

const toolDashboard = document.getElementById('toolDashboard');
const appSection = document.getElementById('app-section');
const btnBackToDashboard = document.getElementById('btnBackToDashboard');

// Map tool names to their panel IDs
const toolPanelMap = {
    'compress': 'mode-compress',
    'merge':    'mode-merge',
    'heic':     'mode-heic',
    'pdf2jpg':  'mode-pdf2jpg',
    'resizer':  'mode-resizer',
    'stamper':  'mode-stamper',
    'signature':'mode-signature',
    'ocr':      'mode-ocr'
};

// Tool metadata for sidebar/bottom nav
const toolMeta = {
    'compress':  { name: 'Compressor',    color: 'bg-blue-100 text-blue-600',  svg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
    'merge':     { name: 'PDF Merger',     color: 'bg-indigo-100 text-indigo-600', svg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
    'heic':      { name: 'HEIC to JPG',    color: 'bg-orange-100 text-orange-600', svg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
    'pdf2jpg':   { name: 'PDF to JPG',     color: 'bg-purple-100 text-purple-600', svg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
    'resizer':   { name: 'Photo Resizer',  color: 'bg-emerald-100 text-emerald-600', svg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>' },
    'stamper':   { name: 'Stamper',        color: 'bg-rose-100 text-rose-600',    svg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>' },
    'signature': { name: 'Signature Scan', color: 'bg-teal-100 text-teal-600',    svg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>' },
    'ocr':       { name: 'Text Extractor', color: 'bg-cyan-100 text-cyan-600',    svg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' }
};

let currentTool = null;
let isNavigating = false;

// ── Sidebar & Bottom Nav ───────────────────────────────────
function buildSidebarNav() {
    const sidebarList = document.getElementById('sidebarToolList');
    const bottomList = document.getElementById('bottomNavList');
    if (!sidebarList || !bottomList) return;

    sidebarList.innerHTML = '';
    bottomList.innerHTML = '';

    Object.keys(toolPanelMap).forEach(key => {
        const meta = toolMeta[key];
        if (!meta) return;

        // Sidebar button
        const sbBtn = document.createElement('button');
        sbBtn.className = 'sidebar-tool-btn';
        sbBtn.dataset.tool = key;
        sbBtn.innerHTML = `<span class="sidebar-icon ${meta.color}">${meta.svg}</span>${meta.name}`;
        sbBtn.addEventListener('click', () => openTool(key));
        sidebarList.appendChild(sbBtn);

        // Bottom nav button
        const bnBtn = document.createElement('button');
        bnBtn.className = 'bottom-nav-btn';
        bnBtn.dataset.tool = key;
        bnBtn.innerHTML = `<span class="bottom-nav-icon ${meta.color}">${meta.svg}</span>${meta.name}`;
        bnBtn.addEventListener('click', () => openTool(key));
        bottomList.appendChild(bnBtn);
    });
}

function updateNavHighlight(toolName) {
    document.querySelectorAll('.sidebar-tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === toolName);
    });
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === toolName);
    });
}

// ── URL Hash Routing ───────────────────────────────────────
function getToolFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return toolPanelMap[hash] ? hash : null;
}

function setToolHash(toolName) {
    if (toolName && history.pushState) {
        history.pushState(null, '', '#' + toolName);
    } else if (!toolName && history.replaceState) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
}

window.addEventListener('hashchange', () => {
    isNavigating = true;
    const tool = getToolFromHash();
    if (tool && tool !== currentTool) {
        openTool(tool);
    } else if (!tool && currentTool) {
        goToDashboard();
    }
    isNavigating = false;
});

window.addEventListener('popstate', () => {
    isNavigating = true;
    const tool = getToolFromHash();
    if (tool && tool !== currentTool) {
        openTool(tool);
    } else if (!tool && currentTool) {
        goToDashboard();
    }
    isNavigating = false;
});

// Tool card click handlers
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
        const toolName = card.dataset.tool;
        openTool(toolName);
    });
});

function openTool(toolName) {
    // Hide all panels
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.add('hidden'));

    // Show target panel
    const panelId = toolPanelMap[toolName];
    if (panelId) {
        document.getElementById(panelId).classList.remove('hidden');
    }

    // Hide dashboard, show app
    if (toolDashboard) toolDashboard.parentElement.classList.add('hidden');
    if (appSection) appSection.classList.remove('hidden');

    currentTool = toolName;
    if (!isNavigating) setToolHash(toolName);
    updateNavHighlight(toolName);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track in analytics
    if (typeof gtag === 'function') {
        gtag('event', 'tool_open', { tool_name: toolName });
    }
}

function goToDashboard() {
    // Hide app section
    if (appSection) appSection.classList.add('hidden');

    // Show dashboard
    if (toolDashboard) toolDashboard.parentElement.classList.remove('hidden');

    currentTool = null;
    if (!isNavigating) setToolHash(null);

    // Reset all tool states
    resetAllTools();

    // Scroll to tools section
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
}

if (btnBackToDashboard) btnBackToDashboard.addEventListener('click', goToDashboard);

// Build sidebar/bottom nav on load
buildSidebarNav();

// Handle hash on page load
(function() {
    const tool = getToolFromHash();
    if (tool) {
        openTool(tool);
    }
})();

function resetAllTools() {
    // Reset compress
    clearQueueMemory();
    document.getElementById('state-upload').classList.remove('hidden');
    document.getElementById('state-settings').classList.add('hidden');
    document.getElementById('state-loading').classList.add('hidden');
    document.getElementById('state-result').classList.add('hidden');

    // Reset merge
    mergeQueue.forEach(item => URL.revokeObjectURL(item.url));
    mergeQueue = [];
    document.getElementById('merge-state-upload').classList.remove('hidden');
    document.getElementById('merge-state-settings').classList.add('hidden');
    document.getElementById('merge-state-loading').classList.add('hidden');
    document.getElementById('merge-state-result').classList.add('hidden');

    // Reset HEIC
    heicQueue.forEach(item => { if (item.url) URL.revokeObjectURL(item.url); if (item.jpgUrl) URL.revokeObjectURL(item.jpgUrl); });
    heicQueue = [];
    document.getElementById('heic-state-upload').classList.remove('hidden');
    document.getElementById('heic-state-settings').classList.add('hidden');
    document.getElementById('heic-state-loading').classList.add('hidden');
    document.getElementById('heic-state-result').classList.add('hidden');

    // Reset PDF2JPG
    pdf2jpgPages.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
    pdf2jpgPages = [];
    pdf2jpgDoc = null;
    document.getElementById('pdf2jpg-state-upload').classList.remove('hidden');
    document.getElementById('pdf2jpg-state-settings').classList.add('hidden');
    document.getElementById('pdf2jpg-state-loading').classList.add('hidden');
    document.getElementById('pdf2jpg-state-result').classList.add('hidden');

    // Reset resizer — release memory (Block 3)
    if (resizerResultUrl) URL.revokeObjectURL(resizerResultUrl);
    resizerFile = null;
    resizerOriginalImg = null;
    resizerResultBlob = null;
    resizerResultUrl = null;
    var _rc = document.getElementById('resizerCanvas');
    if (_rc) { _rc.width = 1; _rc.height = 1; }
    document.getElementById('resizer-state-upload').classList.remove('hidden');
    document.getElementById('resizer-state-settings').classList.add('hidden');
    document.getElementById('resizer-state-result').classList.add('hidden');

    // Reset stamper — release memory (Block 3)
    stamperFile = null;
    stamperOriginalImg = null;
    document.getElementById('stamper-state-upload').classList.remove('hidden');
    document.getElementById('stamper-state-settings').classList.add('hidden');
    document.getElementById('stamper-state-result').classList.add('hidden');

    // Reset signature scanner — release memory (Block 3)
    signatureFile = null;
    signatureOriginalImg = null;
    if (signatureResultUrl) URL.revokeObjectURL(signatureResultUrl);
    signatureResultBlob = null;
    signatureResultUrl = null;
    document.getElementById('signature-state-upload').classList.remove('hidden');
    document.getElementById('signature-state-settings').classList.add('hidden');
    document.getElementById('signature-state-result').classList.add('hidden');

    // Reset OCR — release memory (Block 3)
    var _ocrPreview = document.getElementById('ocrPreviewImage');
    if (_ocrPreview && _ocrPreview.src) URL.revokeObjectURL(_ocrPreview.src);
    ocrFile = null;
    document.getElementById('ocr-state-upload').classList.remove('hidden');
    document.getElementById('ocr-state-processing').classList.add('hidden');
    document.getElementById('ocr-state-result').classList.add('hidden');
    document.getElementById('ocrTextOutput').value = '';
}


/* ═══════════════════════════════════════════════════════════
   LAZY-LOAD HELPERS (Block 2)
   Heavy libraries load on demand, not on page open.
   ═══════════════════════════════════════════════════════════ */

function loadScript(src) {
    return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = function () { reject(new Error('Failed to load ' + src)); };
        document.head.appendChild(s);
    });
}

function loadTesseract() {
    if (typeof Tesseract !== 'undefined') return Promise.resolve();
    return loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
}

function loadHeic2Any() {
    if (typeof heic2any !== 'undefined') return Promise.resolve();
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js');
}

function loadPdfJs() {
    if (typeof pdfjsLib !== 'undefined') return Promise.resolve();
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js').then(function () {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    });
}

function loadJsPdf() {
    if (typeof window.jspdf !== 'undefined') return Promise.resolve();
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
}

function loadJSZip() {
    if (typeof JSZip !== 'undefined') return Promise.resolve();
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
}

/* ═══════════════════════════════════════════════════════════
   TOOL 1: IMAGE COMPRESSOR
   ═══════════════════════════════════════════════════════════ */

let fileQueue = [];
const MAX_FILES = 20;

const dropzone              = document.getElementById('dropzone');
const fileInput             = document.getElementById('fileInput');
const stateUpload           = document.getElementById('state-upload');
const stateSettings         = document.getElementById('state-settings');
const stateLoading          = document.getElementById('state-loading');
const stateResult           = document.getElementById('state-result');

const targetKBInput         = document.getElementById('targetKB');
const batchPreviewContainer = document.getElementById('batchPreviewContainer');
const queueCountDisplay     = document.getElementById('queueCount');
const batchProgressText     = document.getElementById('batchProgressText');
const batchProgressBar      = document.getElementById('batchProgressBar');
const resultsContainer      = document.getElementById('resultsContainer');
const successCountDisplay   = document.getElementById('successCount');
const loadingPercent        = document.getElementById('loadingPercent');

const btnCancel             = document.getElementById('btnCancel');
const btnCompress           = document.getElementById('btnCompress');
const btnDownloadZip        = document.getElementById('btnDownloadZip');
const btnStartOver          = document.getElementById('btnStartOver');

const presetButtons         = document.querySelectorAll('.preset-btn');
const passportPresetButtons = document.querySelectorAll('.passport-preset-btn');
const outputFormatSelect    = document.getElementById('outputFormat');
const targetWidthInput      = document.getElementById('targetWidth');
const targetHeightInput     = document.getElementById('targetHeight');
const imageInfoPanel        = document.getElementById('imageInfoPanel');
const imageInfoContent      = document.getElementById('imageInfoContent');

// Quick Size Presets
presetButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kb = btn.dataset.kb;
        targetKBInput.value = kb;
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

if (targetKBInput) targetKBInput.addEventListener('input', () => {
    presetButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.kb === targetKBInput.value);
    });
});

// Passport Dimension Presets
passportPresetButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        targetWidthInput.value = btn.dataset.w;
        targetHeightInput.value = btn.dataset.h;
        passportPresetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showToast(`Preset applied: ${btn.dataset.w} x ${btn.dataset.h} px`);
    });
});

[targetWidthInput, targetHeightInput].forEach(input => {
    if (input) input.addEventListener('input', () => {
        passportPresetButtons.forEach(b => {
            b.classList.toggle('active', b.dataset.w === targetWidthInput.value && b.dataset.h === targetHeightInput.value);
        });
    });
});

// Dropzone
setupDropzone(dropzone, fileInput, handleFiles);

function handleFiles(files) {
    if (files.length === 0) return;
    let addedCount = 0;
    let skippedCount = 0;

    Array.from(files).forEach(file => {
        if (fileQueue.length >= MAX_FILES) { skippedCount++; return; }
        if (!file.type.match('image.*')) return;
        if (file.size > 50 * 1024 * 1024) return;

        const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        const originalUrl = URL.createObjectURL(file);

        fileQueue.push({
            id: fileId,
            file: file,
            status: 'pending',
            originalUrl: originalUrl,
            compressedBlob: null,
            compressedUrl: null,
            newSize: 0,
            originalWidth: 0,
            originalHeight: 0
        });
        addedCount++;
    });

    if (addedCount > 0) {
        renderBatchPreview();
        updateImageInfo();
        if (!targetKBInput.value) {
            let suggestion = Math.floor(fileQueue[0].file.size / 1024 * 0.8);
            if (suggestion > 200) suggestion = 200;
            if (suggestion < 20) suggestion = 50;
            targetKBInput.value = suggestion;
            presetButtons.forEach(b => {
                b.classList.toggle('active', b.dataset.kb === String(suggestion));
            });
        }
        stateUpload.classList.add('hidden');
        stateSettings.classList.remove('hidden');
    }

    if (skippedCount > 0 || fileQueue.length === MAX_FILES) {
        showToast(`Max ${MAX_FILES} images allowed per batch. Some were skipped.`, 'info');
    }
}

function updateImageInfo() {
    if (fileQueue.length === 0) {
        imageInfoPanel.classList.add('hidden');
        return;
    }
    const first = fileQueue[0];
    const img = new Image();
    img.onload = function() {
        first.originalWidth = this.width;
        first.originalHeight = this.height;
        imageInfoContent.innerHTML = `
            <div class="flex justify-between"><span>Dimensions:</span> <span class="font-semibold">${this.width} x ${this.height} px</span></div>
            <div class="flex justify-between"><span>File Size:</span> <span class="font-semibold">${formatBytes(first.file.size)}</span></div>
            <div class="flex justify-between"><span>Type:</span> <span class="font-semibold">${first.file.type.split('/')[1].toUpperCase()}</span></div>
            <div class="flex justify-between"><span>Name:</span> <span class="font-semibold truncate max-w-[140px]" title="${first.file.name}">${first.file.name}</span></div>
        `;
        imageInfoPanel.classList.remove('hidden');
    };
    img.src = first.originalUrl;
}

function renderBatchPreview() {
    queueCountDisplay.textContent = fileQueue.length;
    // Dynamic button text based on file count
    const btnText = document.getElementById('btnCompressText');
    if (btnText) {
        btnText.textContent = fileQueue.length === 1 ? 'Compress Image' : 'Compress All (' + fileQueue.length + ')';
    }
    batchPreviewContainer.innerHTML = '';
    fileQueue.forEach(item => {
        const div = document.createElement('div');
        div.className = 'relative group rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center';
        div.innerHTML = `
            <img src="${item.originalUrl}" class="object-cover w-full h-full" alt="Preview">
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onclick="removeFile('${item.id}')" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] font-medium px-2 py-2 truncate">
                ${formatBytes(item.file.size)}
            </div>
        `;
        batchPreviewContainer.appendChild(div);
    });
}

window.removeFile = function (id) {
    const index = fileQueue.findIndex(f => f.id === id);
    if (index > -1) {
        URL.revokeObjectURL(fileQueue[index].originalUrl);
        fileQueue.splice(index, 1);
        renderBatchPreview();
        updateImageInfo();
        if (fileQueue.length === 0) {
            stateSettings.classList.add('hidden');
            stateUpload.classList.remove('hidden');
        }
    }
};

// Compression Engine — uses Web Worker (OffscreenCanvas) when available,
// falls back to main-thread canvas loop otherwise.
var _compressWorker = null;
var _compressWorkerSupported = (typeof OffscreenCanvas !== 'undefined');

function _getCompressWorker() {
    if (!_compressWorker && _compressWorkerSupported) {
        try {
            _compressWorker = new Worker('compress-worker.js');
        } catch (e) {
            _compressWorkerSupported = false;
        }
    }
    return _compressWorker;
}

function _compressViaWorker(file, targetBytes, outputFormat, forcedWidth, forcedHeight) {
    return new Promise(function (resolve, reject) {
        var worker = _getCompressWorker();
        if (!worker) return reject(new Error('Worker not available'));

        var timedOut = false;
        var timer = setTimeout(function () {
            timedOut = true;
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            _compressWorkerSupported = false;
            reject(new Error('Worker timeout'));
        }, 30000);

        var onMsg = function (e) {
            if (timedOut) return;
            // Ignore progress messages — only resolve on final result
            if (e.data && e.data.progress !== undefined) return;
            clearTimeout(timer);
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            if (e.data && e.data.error) reject(new Error(e.data.error));
            else resolve(e.data.blob);
        };
        var onErr = function (e) {
            if (timedOut) return;
            clearTimeout(timer);
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            _compressWorkerSupported = false;
            reject(new Error('Worker error'));
        };

        worker.addEventListener('message', onMsg);
        worker.addEventListener('error', onErr);
        worker.postMessage({
            file: file,
            targetBytes: targetBytes,
            format: outputFormat,
            forcedWidth: forcedWidth,
            forcedHeight: forcedHeight
        });
    });
}

async function processCompression(targetBytes, imageUrl, outputFormat, forcedWidth, forcedHeight, sourceFile) {
    /* ---- try Web Worker first ---- */
    if (_compressWorkerSupported && sourceFile) {
        try {
            return await _compressViaWorker(sourceFile, targetBytes, outputFormat, forcedWidth, forcedHeight);
        } catch (e) {
            console.warn('Compress worker failed, falling back to main thread:', e);
        }
    }

    /* ---- main-thread fallback ---- */
    return new Promise(async (resolve, reject) => {
        try {
            const img = await loadImage(imageUrl);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let currentWidth  = (forcedWidth  > 0) ? forcedWidth  : img.width;
            let currentHeight = (forcedHeight > 0) ? forcedHeight : img.height;

            if (forcedWidth > 0 && forcedHeight <= 0) {
                currentHeight = Math.round(img.height * (forcedWidth / img.width));
            } else if (forcedHeight > 0 && forcedWidth <= 0) {
                currentWidth = Math.round(img.width * (forcedHeight / img.height));
            }

            canvas.width  = currentWidth;
            canvas.height = currentHeight;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

            let initialBlob = await getCanvasBlob(canvas, outputFormat, 0.9);
            if (initialBlob.size <= targetBytes) return resolve(initialBlob);

            if (outputFormat === 'image/png') {
                let pngBlob = initialBlob;
                let iterations = 0;
                while (pngBlob.size > targetBytes && iterations < 8) {
                    iterations++;
                    const scaleFactor = Math.sqrt(targetBytes / pngBlob.size);
                    currentWidth  = Math.max(1, Math.floor(currentWidth  * scaleFactor));
                    currentHeight = Math.max(1, Math.floor(currentHeight * scaleFactor));
                    canvas.width  = currentWidth;
                    canvas.height = currentHeight;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
                    pngBlob = await getCanvasBlob(canvas, outputFormat);
                }
                return resolve(pngBlob);
            }

            let bestBlob = initialBlob;
            let iterationCount = 0;
            while (bestBlob.size > targetBytes && iterationCount < 5) {
                iterationCount++;
                let minQ = 0.05, maxQ = 0.95;
                for (let i = 0; i < 8; i++) {
                    const quality = (minQ + maxQ) / 2;
                    const tempBlob = await getCanvasBlob(canvas, outputFormat, quality);
                    if (tempBlob.size > targetBytes) { maxQ = quality; }
                    else { minQ = quality; bestBlob = tempBlob; }
                }
                const lowestQBlob = await getCanvasBlob(canvas, outputFormat, 0.05);
                if (lowestQBlob.size <= targetBytes) break;

                let scaleFactor = Math.sqrt(targetBytes / lowestQBlob.size);
                scaleFactor = Math.max(0.4, Math.min(0.85, scaleFactor));
                currentWidth  = Math.max(1, Math.floor(currentWidth  * scaleFactor));
                currentHeight = Math.max(1, Math.floor(currentHeight * scaleFactor));
                canvas.width  = currentWidth;
                canvas.height = currentHeight;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
                bestBlob = await getCanvasBlob(canvas, outputFormat, 0.5);
            }

            if (bestBlob.size > targetBytes) {
                canvas.width  = Math.max(1, Math.floor(currentWidth  * 0.5));
                canvas.height = Math.max(1, Math.floor(currentHeight * 0.5));
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                bestBlob = await getCanvasBlob(canvas, outputFormat, 0.05);
            }
            resolve(bestBlob);
        } catch (error) { reject(error); }
    });
}

function clearQueueMemory() {
    fileQueue.forEach(item => {
        if (item.originalUrl)   URL.revokeObjectURL(item.originalUrl);
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    });
    fileQueue = [];
    fileInput.value = '';
    presetButtons.forEach(b => b.classList.remove('active'));
    passportPresetButtons.forEach(b => b.classList.remove('active'));
    targetWidthInput.value = '';
    targetHeightInput.value = '';
    imageInfoPanel.classList.add('hidden');
}

if (btnCancel) {
    btnCancel.addEventListener('click', () => {
        clearQueueMemory();
        stateSettings.classList.add('hidden');
        stateUpload.classList.remove('hidden');
    });
}

if (btnStartOver) {
    btnStartOver.addEventListener('click', () => {
        clearQueueMemory();
        stateResult.classList.add('hidden');
        stateUpload.classList.remove('hidden');
    });
}

if (btnCompress) {
    btnCompress.addEventListener('click', async () => {
        const targetKB = parseFloat(targetKBInput.value);
        if (isNaN(targetKB) || targetKB <= 0) {
            showToast('Please enter a valid target size in KB.', 'error');
            return;
        }
        const targetBytes   = targetKB * 1024;
        const outputFormat  = outputFormatSelect.value;
        const forcedWidth   = parseInt(targetWidthInput.value,  10) || 0;
        const forcedHeight  = parseInt(targetHeightInput.value, 10) || 0;

        stateLoading.classList.remove('hidden');
        stateSettings.classList.add('hidden');
        batchProgressText.textContent = `0 / ${fileQueue.length} completed`;
        batchProgressBar.style.width = '0%';
        loadingPercent.textContent = '0%';

        setTimeout(async () => {
            let successCount = 0;
            for (let i = 0; i < fileQueue.length; i++) {
                const item = fileQueue[i];
                item.status = 'processing';
                await new Promise(resolve => setTimeout(resolve, 15));
                try {
                    const blob = await processCompression(targetBytes, item.originalUrl, outputFormat, forcedWidth, forcedHeight, item.file);
                    item.compressedBlob = blob;
                    item.compressedUrl  = URL.createObjectURL(blob);
                    item.newSize        = blob.size;
                    item.mimeType       = outputFormat;
                    item.status         = 'done';
                    successCount++;
                } catch (err) {
                    console.error('Failed to compress:', item.file.name, err);
                    item.status = 'error';
                }
                const pct = Math.round(((i + 1) / fileQueue.length) * 100);
                batchProgressText.textContent = `${i + 1} / ${fileQueue.length} completed`;
                batchProgressBar.style.width  = `${pct}%`;
                loadingPercent.textContent = `${pct}%`;
                await new Promise(resolve => setTimeout(resolve, 15));
            }
            successCountDisplay.textContent = successCount;
            renderBatchResults(targetKB);
            stateLoading.classList.add('hidden');
            stateResult.classList.remove('hidden');
            showToast(`Successfully compressed ${successCount} image(s)!`);
        }, 100);
    });
}

function renderBatchResults(targetKB) {
    resultsContainer.innerHTML = '';
    fileQueue.forEach(item => {
        if (item.status !== 'done') return;
        const ext          = getExtension(item.mimeType || 'image/jpeg');
        const originalName = item.file.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const newFilename  = `${nameWithoutExt}-${targetKB}kb.${ext}`;

        const div = document.createElement('div');
        div.className = 'bg-white border border-slate-200 p-3 sm:p-4 rounded-xl flex items-center justify-between gap-3 shadow-sm hover:shadow transition-shadow';
        div.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden">
                <img src="${item.compressedUrl}" class="w-12 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0" alt="Thumb">
                <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-800 truncate" title="${newFilename}">${newFilename}</p>
                    <div class="flex items-center gap-2 text-xs mt-1">
                        <span class="text-slate-400 line-through">${formatBytes(item.file.size)}</span>
                        <svg class="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        <span class="text-brand-600 font-bold">${formatBytes(item.newSize)}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
                <button onclick="downloadSingle('${item.id}', '${newFilename}')"
                    class="p-2 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors border border-transparent hover:border-brand-200"
                    title="Download Image">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
                <button onclick="openCompare('${item.id}')" class="btn-compare" title="Compare Before/After">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                <button onclick="downloadAsPdf('${item.id}', '${newFilename}')" class="btn-pdf" title="Download as PDF">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14v-3m0 3h4m-4 0h4"/>
                    </svg>
                </button>
            </div>
        `;
        resultsContainer.appendChild(div);
    });
}

// Download Single
window.downloadSingle = function (id, filename) {
    const item = fileQueue.find(f => f.id === id);
    if (!item || !item.compressedUrl) { showToast('File not found.', 'error'); return; }
    const link = document.createElement('a');
    link.href = item.compressedUrl;
    link.download = filename || 'downloaded-image.jpg';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => document.body.removeChild(link), 100);
    showToast('Image downloaded!');
};

// Before/After Comparison — clean up previous listeners to prevent memory leaks
var _compareHandlers = null;
window.openCompare = function(id) {
    const item = fileQueue.find(f => f.id === id);
    if (!item) return;
    const modal = document.getElementById('compareModal');
    const originalImg = document.getElementById('compareOriginal');
    const compressedImg = document.getElementById('compareCompressed');
    const overlay = document.getElementById('compareOverlay');
    const slider = document.getElementById('compareSliderHandle');

    originalImg.src = item.originalUrl;
    compressedImg.src = item.compressedUrl;
    overlay.style.width = '50%';
    slider.style.left = '50%';
    modal.classList.remove('hidden');

    // Remove previous listeners if modal was opened before
    if (_compareHandlers) {
        slider.removeEventListener('mousedown', _compareHandlers.startDrag);
        slider.removeEventListener('touchstart', _compareHandlers.startDrag);
        document.removeEventListener('mouseup', _compareHandlers.stopDrag);
        document.removeEventListener('touchend', _compareHandlers.stopDrag);
    }

    let isDragging = false;
    const container = document.getElementById('compareContainer');
    function updateSlider(clientX) {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const pct = (x / rect.width) * 100;
        overlay.style.width = pct + '%';
        slider.style.left = pct + '%';
    }
    const startDrag = () => isDragging = true;
    const stopDrag = () => isDragging = false;
    const onMouseMove = (e) => { if (isDragging) updateSlider(e.clientX); };
    const onTouchMove = (e) => { if (isDragging) updateSlider(e.touches[0].clientX); };

    slider.addEventListener('mousedown', startDrag);
    container.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
    slider.addEventListener('touchstart', startDrag);
    container.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', stopDrag);

    _compareHandlers = { startDrag, stopDrag };
};

window.closeCompareModal = function() {
    document.getElementById('compareModal').classList.add('hidden');
};

// Download as PDF
window.downloadAsPdf = async function (id, filename) {
    const item = fileQueue.find(f => f.id === id);
    if (!item || !item.compressedBlob) { showToast('Image not ready.', 'error'); return; }
    showToast('Preparing PDF engine...');
    try { await loadJsPdf(); } catch (e) { showToast('Failed to load PDF engine.', 'error'); return; }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const { jsPDF } = window.jspdf;
            const pxToMm = 0.264583;
            const widthMm = img.width * pxToMm;
            const heightMm = img.height * pxToMm;
            const doc = new jsPDF({
                orientation: widthMm > heightMm ? 'l' : 'p',
                unit: 'mm',
                format: [widthMm, heightMm]
            });
            doc.addImage(dataUrl, 'JPEG', 0, 0, widthMm, heightMm);
            const baseName = filename ? filename.substring(0, filename.lastIndexOf('.')) || filename : 'image';
            doc.save(`${baseName}.pdf`);
            showToast('PDF downloaded!');
        } catch (pdfErr) {
            console.error('PDF generation error:', pdfErr);
            showToast('Failed to generate PDF.', 'error');
        }
    };
    img.onerror = () => showToast('Failed to load image for PDF.', 'error');
    img.src = item.compressedUrl;
};

// Download All as ZIP
if (btnDownloadZip) {
    btnDownloadZip.addEventListener('click', async () => {
        showToast('Preparing ZIP engine...');
        try { await loadJSZip(); } catch (e) { showToast('Failed to load ZIP library.', 'error'); return; }
        const zip = new JSZip();
        const targetKB = targetKBInput.value;
        let addedCount = 0;
        const originalBtnHTML = btnDownloadZip.innerHTML;
        btnDownloadZip.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Zipping...';
        btnDownloadZip.disabled = true;

        setTimeout(async () => {
            try {
                fileQueue.forEach(item => {
                    if (item.status === 'done' && item.compressedBlob) {
                        const ext = getExtension(item.mimeType || 'image/jpeg');
                        const originalName = item.file.name;
                        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
                        zip.file(`${nameWithoutExt}-${targetKB}kb.${ext}`, item.compressedBlob);
                        addedCount++;
                    }
                });
                if (addedCount > 0) {
                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    const zipUrl = URL.createObjectURL(zipBlob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = zipUrl;
                    a.download = `OptiDrop-${targetKB}KB-Batch.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(zipUrl);
                } else {
                    showToast('No files to download.', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Error generating ZIP.', 'error');
            } finally {
                btnDownloadZip.innerHTML = originalBtnHTML;
                btnDownloadZip.disabled = false;
            }
        }, 100);
    });
}


/* ═══════════════════════════════════════════════════════════
   TOOL 2: IMAGES TO PDF MERGER
   ═══════════════════════════════════════════════════════════ */

let mergeQueue = [];
const MAX_MERGE_FILES = 50;

const mergeDropzone         = document.getElementById('mergeDropzone');
const mergeFileInput        = document.getElementById('mergeFileInput');
const mergeStateUpload      = document.getElementById('merge-state-upload');
const mergeStateSettings    = document.getElementById('merge-state-settings');
const mergeStateLoading     = document.getElementById('merge-state-loading');
const mergeStateResult      = document.getElementById('merge-state-result');
const mergeQueueContainer   = document.getElementById('mergeQueueContainer');
const mergeQueueCount       = document.getElementById('mergeQueueCount');
const mergeProgressText     = document.getElementById('mergeProgressText');
const mergeProgressBar      = document.getElementById('mergeProgressBar');
const mergeSuccessCount     = document.getElementById('mergeSuccessCount');
const btnMergeAddMore       = document.getElementById('btnMergeAddMore');
const btnMergeCancel        = document.getElementById('btnMergeCancel');
const btnMergeGenerate      = document.getElementById('btnMergeGenerate');
const btnMergeDownload      = document.getElementById('btnMergeDownload');
const btnMergeStartOver     = document.getElementById('btnMergeStartOver');
const mergePageSize         = document.getElementById('mergePageSize');
const mergeOrientation      = document.getElementById('mergeOrientation');
const mergeMargin           = document.getElementById('mergeMargin');
const mergeFilename         = document.getElementById('mergeFilename');

setupDropzone(mergeDropzone, mergeFileInput, handleMergeFiles);

if (btnMergeAddMore) {
    btnMergeAddMore.addEventListener('click', () => {
        mergeFileInput.value = '';
        mergeFileInput.click();
    });
}

function handleMergeFiles(files) {
    if (files.length === 0) return;
    let addedCount = 0;
    Array.from(files).forEach(file => {
        if (mergeQueue.length >= MAX_MERGE_FILES) return;
        if (!file.type.match('image.*')) return;
        if (file.size > 50 * 1024 * 1024) return;
        const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        mergeQueue.push({ id: fileId, file: file, url: URL.createObjectURL(file), width: 0, height: 0 });
        addedCount++;
    });
    if (addedCount > 0) {
        renderMergeQueue();
        mergeStateUpload.classList.add('hidden');
        mergeStateSettings.classList.remove('hidden');
    }
}

function renderMergeQueue() {
    mergeQueueCount.textContent = mergeQueue.length;
    mergeQueueContainer.innerHTML = '';
    mergeQueue.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'merge-queue-item';
        div.draggable = true;
        div.dataset.index = index;
        div.innerHTML = `
            <span class="merge-page-num">${index + 1}</span>
            <img src="${item.url}" class="merge-thumb" alt="Page ${index + 1}">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-800 truncate" title="${item.file.name}">${item.file.name}</p>
                <p class="text-xs text-slate-500">${formatBytes(item.file.size)}</p>
            </div>
            <div class="merge-controls">
                <button class="merge-btn" onclick="moveMergeItem(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''} title="Move Up">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                </button>
                <button class="merge-btn" onclick="moveMergeItem(${index}, 1)" ${index === mergeQueue.length - 1 ? 'disabled style="opacity:0.3"' : ''} title="Move Down">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
            </div>
            <button class="merge-btn remove" onclick="removeMergeItem(${index})" title="Remove">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;
        div.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', index); div.classList.add('dragging'); });
        div.addEventListener('dragend', () => div.classList.remove('dragging'));
        div.addEventListener('dragover', (e) => e.preventDefault());
        div.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const toIndex = parseInt(div.dataset.index);
            if (fromIndex !== toIndex) {
                const moved = mergeQueue.splice(fromIndex, 1)[0];
                mergeQueue.splice(toIndex, 0, moved);
                renderMergeQueue();
            }
        });
        mergeQueueContainer.appendChild(div);
    });
}

window.moveMergeItem = function(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= mergeQueue.length) return;
    const temp = mergeQueue[index];
    mergeQueue[index] = mergeQueue[newIndex];
    mergeQueue[newIndex] = temp;
    renderMergeQueue();
};

window.removeMergeItem = function(index) {
    URL.revokeObjectURL(mergeQueue[index].url);
    mergeQueue.splice(index, 1);
    renderMergeQueue();
    if (mergeQueue.length === 0) {
        mergeStateSettings.classList.add('hidden');
        mergeStateUpload.classList.remove('hidden');
    }
};

if (btnMergeCancel) {
    btnMergeCancel.addEventListener('click', () => {
        mergeQueue.forEach(item => URL.revokeObjectURL(item.url));
        mergeQueue = [];
        mergeFileInput.value = '';
        mergeStateSettings.classList.add('hidden');
        mergeStateUpload.classList.remove('hidden');
    });
}

if (btnMergeStartOver) {
    btnMergeStartOver.addEventListener('click', () => {
        mergeQueue.forEach(item => URL.revokeObjectURL(item.url));
        mergeQueue = [];
        mergeFileInput.value = '';
        mergeStateResult.classList.add('hidden');
        mergeStateUpload.classList.remove('hidden');
    });
}

// Generate PDF
let generatedPdfDoc = null;
let generatedPdfFilename = '';

if (btnMergeGenerate) {
    btnMergeGenerate.addEventListener('click', async () => {
        if (mergeQueue.length === 0) { showToast('Please add at least one image.', 'error'); return; }

        mergeStateLoading.classList.remove('hidden');
        mergeStateSettings.classList.add('hidden');
        mergeProgressText.textContent = 'Preparing PDF engine...';

        try { await loadJsPdf(); } catch (e) {
            showToast('Failed to load PDF engine.', 'error');
            mergeStateLoading.classList.add('hidden');
            mergeStateSettings.classList.remove('hidden');
            return;
        }

        const pageSize    = mergePageSize.value;
        const orientation = mergeOrientation.value;
        const marginMm    = parseInt(mergeMargin.value, 10);
        const filename    = mergeFilename.value.trim() || 'merged-document';
        const { jsPDF } = window.jspdf;

        let pdf;
        const sizes = { a4: { w: 210, h: 297 }, letter: { w: 216, h: 279 } };

        if (pageSize === 'auto') {
            const firstImg = await loadImage(mergeQueue[0].url);
            const firstRatio = firstImg.width / firstImg.height;
            pdf = new jsPDF({ orientation: firstRatio > 1 ? 'l' : 'p', unit: 'mm' });
        } else {
            const size = sizes[pageSize];
            pdf = new jsPDF({ orientation: orientation === 'auto' ? 'p' : orientation, unit: 'mm', format: [size.w, size.h] });
        }

        const total = mergeQueue.length;
        let processed = 0;

        for (let i = 0; i < total; i++) {
            const item = mergeQueue[i];
            const img = await loadImage(item.url);
            processed++;
            const pct = Math.round((processed / total) * 100);
            mergeProgressText.textContent = `${processed} / ${total} pages added`;
            mergeProgressBar.style.width = `${pct}%`;

            if (pageSize === 'auto') {
                const pxToMm = 0.264583;
                const imgW = img.width * pxToMm;
                const imgH = img.height * pxToMm;
                const orient = imgW > imgH ? 'l' : 'p';
                if (i > 0) pdf.addPage([imgW, imgH], orient);
                else if (i === 0) pdf = new jsPDF({ orientation: orient, unit: 'mm', format: [imgW, imgH] });
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, imgW, imgH);
            } else {
                const size = sizes[pageSize];
                const pw = size.w, ph = size.h;
                let orient = orientation;
                if (orient === 'auto') orient = (img.width / img.height) > (pw / ph) ? 'l' : 'p';
                if (i > 0) pdf.addPage([pw, ph], orient);
                else if (orient !== pdf.internal.pageSize.orientation) pdf = new jsPDF({ orientation: orient, unit: 'mm', format: [pw, ph] });

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

                const availW = pw - (marginMm * 2);
                const availH = ph - (marginMm * 2);
                const imgRatio = img.width / img.height;
                const availRatio = availW / availH;
                let drawW, drawH, drawX, drawY;
                if (imgRatio > availRatio) { drawW = availW; drawH = availW / imgRatio; }
                else { drawH = availH; drawW = availH * imgRatio; }
                drawX = (pw - drawW) / 2;
                drawY = (ph - drawH) / 2;
                pdf.addImage(dataUrl, 'JPEG', drawX, drawY, drawW, drawH);
            }
            await new Promise(r => setTimeout(r, 10));
        }

        generatedPdfDoc = pdf;
        generatedPdfFilename = `${filename}.pdf`;
        mergeSuccessCount.textContent = total;
        mergeStateLoading.classList.add('hidden');
        mergeStateResult.classList.remove('hidden');
        showToast(`PDF created with ${total} page(s)!`);
    });
}

if (btnMergeDownload) {
    btnMergeDownload.addEventListener('click', () => {
        if (!generatedPdfDoc) { showToast('No PDF generated.', 'error'); return; }
        try {
            generatedPdfDoc.save(generatedPdfFilename);
            showToast('PDF downloaded!');
        } catch (err) {
            console.error('PDF download failed:', err);
            showToast('PDF download failed.', 'error');
        }
    });
}


/* ═══════════════════════════════════════════════════════════
   TOOL 3: HEIC TO JPG CONVERTER
   ═══════════════════════════════════════════════════════════ */

let heicQueue = [];
const MAX_HEIC_FILES = 20;

const heicDropzone       = document.getElementById('heicDropzone');
const heicFileInput      = document.getElementById('heicFileInput');
const heicStateUpload    = document.getElementById('heic-state-upload');
const heicStateSettings  = document.getElementById('heic-state-settings');
const heicStateLoading   = document.getElementById('heic-state-loading');
const heicStateResult    = document.getElementById('heic-state-result');
const heicPreviewContainer = document.getElementById('heicPreviewContainer');
const heicQueueCount     = document.getElementById('heicQueueCount');
const heicQuality        = document.getElementById('heicQuality');
const heicProgressText   = document.getElementById('heicProgressText');
const heicProgressBar    = document.getElementById('heicProgressBar');
const heicLoadingPercent = document.getElementById('heicLoadingPercent');
const heicResultsContainer = document.getElementById('heicResultsContainer');
const heicSuccessCount   = document.getElementById('heicSuccessCount');
const btnHeicCancel      = document.getElementById('btnHeicCancel');
const btnHeicConvert     = document.getElementById('btnHeicConvert');
const btnHeicDownloadZip = document.getElementById('btnHeicDownloadZip');
const btnHeicStartOver   = document.getElementById('btnHeicStartOver');

setupDropzone(heicDropzone, heicFileInput, handleHeicFiles);

function handleHeicFiles(files) {
    if (files.length === 0) return;
    let addedCount = 0;
    Array.from(files).forEach(file => {
        if (heicQueue.length >= MAX_HEIC_FILES) return;
        const name = file.name.toLowerCase();
        if (!name.endsWith('.heic') && !name.endsWith('.heif') && !file.type.match('heic|heif')) return;
        const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        heicQueue.push({ id: fileId, file: file, url: null, jpgBlob: null, jpgUrl: null, status: 'pending' });
        addedCount++;
    });
    if (addedCount > 0) {
        renderHeicPreview();
        heicStateUpload.classList.add('hidden');
        heicStateSettings.classList.remove('hidden');
    }
    if (addedCount === 0) {
        showToast('No valid HEIC/HEIF files found.', 'error');
    }
}

function renderHeicPreview() {
    heicQueueCount.textContent = heicQueue.length;
    // Dynamic button text based on file count
    const heicBtnText = document.getElementById('btnHeicConvertText');
    if (heicBtnText) {
        heicBtnText.textContent = heicQueue.length === 1 ? 'Convert to JPG' : 'Convert All (' + heicQueue.length + ')';
    }
    heicPreviewContainer.innerHTML = '';
    heicQueue.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'relative rounded-xl overflow-hidden bg-orange-50 border border-orange-200 aspect-square flex items-center justify-center';
        div.innerHTML = `
            <div class="text-center p-2">
                <svg class="w-8 h-8 text-orange-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
                <p class="text-[10px] font-semibold text-orange-700 truncate px-1">${item.file.name}</p>
            </div>
            <button onclick="removeHeicFile(${index})" class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow" style="padding:2px;">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;
        heicPreviewContainer.appendChild(div);
    });
}

window.removeHeicFile = function(index) {
    heicQueue.splice(index, 1);
    renderHeicPreview();
    if (heicQueue.length === 0) {
        heicStateSettings.classList.add('hidden');
        heicStateUpload.classList.remove('hidden');
    }
};

if (btnHeicCancel) {
    btnHeicCancel.addEventListener('click', () => {
        heicQueue.forEach(item => { if (item.url) URL.revokeObjectURL(item.url); if (item.jpgUrl) URL.revokeObjectURL(item.jpgUrl); });
        heicQueue = [];
        heicFileInput.value = '';
        heicStateSettings.classList.add('hidden');
        heicStateUpload.classList.remove('hidden');
    });
}

if (btnHeicStartOver) {
    btnHeicStartOver.addEventListener('click', () => {
        heicQueue.forEach(item => { if (item.url) URL.revokeObjectURL(item.url); if (item.jpgUrl) URL.revokeObjectURL(item.jpgUrl); });
        heicQueue = [];
        heicFileInput.value = '';
        heicStateResult.classList.add('hidden');
        heicStateUpload.classList.remove('hidden');
    });
}

if (btnHeicConvert) {
    btnHeicConvert.addEventListener('click', async () => {
        if (heicQueue.length === 0) { showToast('Please add HEIC files.', 'error'); return; }

        heicStateLoading.classList.remove('hidden');
        heicStateSettings.classList.add('hidden');
        heicProgressText.textContent = 'Loading HEIC converter...';

        try { await loadHeic2Any(); } catch (e) {
            showToast('Failed to load HEIC library.', 'error');
            heicStateLoading.classList.add('hidden');
            heicStateSettings.classList.remove('hidden');
            return;
        }
        const quality = parseFloat(heicQuality.value);
        let successCount = 0;
        const total = heicQueue.length;

        for (let i = 0; i < total; i++) {
            const item = heicQueue[i];
            heicProgressText.textContent = `${i + 1} / ${total} converting...`;
            heicLoadingPercent.textContent = `${Math.round(((i + 1) / total) * 100)}%`;
            heicProgressBar.style.width = `${Math.round(((i + 1) / total) * 100)}%`;

            try {
                const result = await heic2any({
                    blob: item.file,
                    toType: 'image/jpeg',
                    quality: quality
                });
                // heic2any returns a blob or array of blobs
                const blob = Array.isArray(result) ? result[0] : result;
                item.jpgBlob = blob;
                item.jpgUrl = URL.createObjectURL(blob);
                item.status = 'done';
                successCount++;
            } catch (err) {
                console.error('HEIC conversion failed:', item.file.name, err);
                item.status = 'error';
            }
            await new Promise(r => setTimeout(r, 10));
        }

        heicSuccessCount.textContent = successCount;
        renderHeicResults();
        heicStateLoading.classList.add('hidden');
        heicStateResult.classList.remove('hidden');
        showToast(`Converted ${successCount} HEIC photo(s) to JPG!`);
    });
}

function renderHeicResults() {
    heicResultsContainer.innerHTML = '';
    heicQueue.forEach((item, index) => {
        if (item.status !== 'done') return;
        const originalName = item.file.name.replace(/\.(heic|heif)$/i, '');
        const div = document.createElement('div');
        div.className = 'bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm';
        div.innerHTML = `
            <img src="${item.jpgUrl}" class="w-12 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0" alt="Converted">
            <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-slate-800 truncate">${originalName}.jpg</p>
                <p class="text-xs text-slate-500">${formatBytes(item.jpgBlob.size)}</p>
            </div>
            <a href="${item.jpgUrl}" download="${originalName}.jpg" class="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors border border-transparent hover:border-orange-200 flex-shrink-0" title="Download JPG">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </a>
        `;
        heicResultsContainer.appendChild(div);
    });
}

if (btnHeicDownloadZip) {
    btnHeicDownloadZip.addEventListener('click', async () => {
        showToast('Preparing ZIP engine...');
        try { await loadJSZip(); } catch (e) { showToast('Failed to load ZIP library.', 'error'); return; }
        const zip = new JSZip();
        let count = 0;
        heicQueue.forEach(item => {
            if (item.status === 'done' && item.jpgBlob) {
                const originalName = item.file.name.replace(/\.(heic|heif)$/i, '');
                zip.file(`${originalName}.jpg`, item.jpgBlob);
                count++;
            }
        });
        if (count === 0) { showToast('No files to download.', 'error'); return; }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = 'OptiDrop-HEIC-to-JPG.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(zipUrl);
        showToast('ZIP downloaded!');
    });
}


/* ═══════════════════════════════════════════════════════════
   TOOL 4: PDF TO JPG EXTRACTOR
   ═══════════════════════════════════════════════════════════ */

let pdf2jpgDoc = null;
let pdf2jpgPages = [];

const pdf2jpgDropzone       = document.getElementById('pdf2jpgDropzone');
const pdf2jpgFileInput      = document.getElementById('pdf2jpgFileInput');
const pdf2jpgStateUpload    = document.getElementById('pdf2jpg-state-upload');
const pdf2jpgStateSettings  = document.getElementById('pdf2jpg-state-settings');
const pdf2jpgStateLoading   = document.getElementById('pdf2jpg-state-loading');
const pdf2jpgStateResult    = document.getElementById('pdf2jpg-state-result');
const pdf2jpgFileName       = document.getElementById('pdf2jpgFileName');
const pdf2jpgPageCount      = document.getElementById('pdf2jpgPageCount');
const pdf2jpgQuality        = document.getElementById('pdf2jpgQuality');
const pdf2jpgScale          = document.getElementById('pdf2jpgScale');
const pdf2jpgProgressText   = document.getElementById('pdf2jpgProgressText');
const pdf2jpgProgressBar    = document.getElementById('pdf2jpgProgressBar');
const pdf2jpgLoadingPercent = document.getElementById('pdf2jpgLoadingPercent');
const pdf2jpgResultsContainer = document.getElementById('pdf2jpgResultsContainer');
const pdf2jpgSuccessCount   = document.getElementById('pdf2jpgSuccessCount');
const btnPdf2jpgCancel      = document.getElementById('btnPdf2jpgCancel');
const btnPdf2jpgExtract     = document.getElementById('btnPdf2jpgExtract');
const btnPdf2jpgDownloadZip = document.getElementById('btnPdf2jpgDownloadZip');
const btnPdf2jpgStartOver   = document.getElementById('btnPdf2jpgStartOver');

setupDropzone(pdf2jpgDropzone, pdf2jpgFileInput, handlePdf2jpgFile);

async function handlePdf2jpgFile(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        showToast('Please select a PDF file.', 'error');
        return;
    }

    /* Lazy-load PDF.js on first use */
    try {
        await loadPdfJs();
    } catch (e) {
        showToast('Failed to load PDF engine. Please check your connection.', 'error');
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        pdf2jpgDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        pdf2jpgFileName.textContent = file.name;
        pdf2jpgPageCount.textContent = `${pdf2jpgDoc.numPages} pages detected`;
        pdf2jpgStateUpload.classList.add('hidden');
        pdf2jpgStateSettings.classList.remove('hidden');
    } catch (err) {
        console.error('Failed to load PDF:', err);
        showToast('Failed to load PDF. It may be corrupted or password-protected.', 'error');
    }
}

if (btnPdf2jpgCancel) {
    btnPdf2jpgCancel.addEventListener('click', () => {
        pdf2jpgDoc = null;
        pdf2jpgPages.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
        pdf2jpgPages = [];
        pdf2jpgFileInput.value = '';
        pdf2jpgStateSettings.classList.add('hidden');
        pdf2jpgStateUpload.classList.remove('hidden');
    });
}

if (btnPdf2jpgStartOver) {
    btnPdf2jpgStartOver.addEventListener('click', () => {
        pdf2jpgDoc = null;
        pdf2jpgPages.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
        pdf2jpgPages = [];
        pdf2jpgFileInput.value = '';
        pdf2jpgStateResult.classList.add('hidden');
        pdf2jpgStateUpload.classList.remove('hidden');
    });
}

if (btnPdf2jpgExtract) {
    btnPdf2jpgExtract.addEventListener('click', async () => {
        if (!pdf2jpgDoc) { showToast('No PDF loaded.', 'error'); return; }

        pdf2jpgStateLoading.classList.remove('hidden');
        pdf2jpgStateSettings.classList.add('hidden');

        const qualityMap = { high: 0.95, medium: 0.85, low: 0.7 };
        const jpegQuality = qualityMap[pdf2jpgQuality.value] || 0.95;
        const scale = parseFloat(pdf2jpgScale.value) || 2;
        const total = pdf2jpgDoc.numPages;
        pdf2jpgPages = [];

        for (let i = 1; i <= total; i++) {
            const pct = Math.round((i / total) * 100);
            pdf2jpgProgressText.textContent = `${i} / ${total} pages extracted`;
            pdf2jpgProgressBar.style.width = `${pct}%`;
            pdf2jpgLoadingPercent.textContent = `${pct}%`;

            try {
                const page = await pdf2jpgDoc.getPage(i);
                const viewport = page.getViewport({ scale: scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                const blob = await new Promise(resolve => {
                    canvas.toBlob(b => resolve(b), 'image/jpeg', jpegQuality);
                });

                pdf2jpgPages.push({
                    pageNum: i,
                    blob: blob,
                    url: URL.createObjectURL(blob)
                });
            } catch (err) {
                console.error(`Failed to extract page ${i}:`, err);
            }
            await new Promise(r => setTimeout(r, 10));
        }

        pdf2jpgSuccessCount.textContent = pdf2jpgPages.length;
        renderPdf2jpgResults();
        pdf2jpgStateLoading.classList.add('hidden');
        pdf2jpgStateResult.classList.remove('hidden');
        showToast(`Extracted ${pdf2jpgPages.length} pages as JPG!`);
    });
}

function renderPdf2jpgResults() {
    pdf2jpgResultsContainer.innerHTML = '';
    pdf2jpgPages.forEach(item => {
        const div = document.createElement('div');
        div.className = 'pdf2jpg-result-item';
        div.innerHTML = `
            <img src="${item.url}" alt="Page ${item.pageNum}">
            <div class="pdf2jpg-item-actions justify-between items-center px-2">
                <span class="text-xs font-bold text-slate-600">Page ${item.pageNum}</span>
                <a href="${item.url}" download="page-${item.pageNum}.jpg" class="text-purple-600 hover:text-purple-800 p-1" title="Download">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </a>
            </div>
        `;
        pdf2jpgResultsContainer.appendChild(div);
    });
}

if (btnPdf2jpgDownloadZip) {
    btnPdf2jpgDownloadZip.addEventListener('click', async () => {
        showToast('Preparing ZIP engine...');
        try { await loadJSZip(); } catch (e) { showToast('Failed to load ZIP library.', 'error'); return; }
        if (pdf2jpgPages.length === 0) { showToast('No pages extracted.', 'error'); return; }
        const zip = new JSZip();
        pdf2jpgPages.forEach(item => {
            zip.file(`page-${item.pageNum}.jpg`, item.blob);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = 'OptiDrop-PDF-Pages.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(zipUrl);
        showToast('ZIP downloaded!');
    });
}


/* ═══════════════════════════════════════════════════════════
   TOOL 5: 300 DPI PHOTO RESIZER
   ═══════════════════════════════════════════════════════════ */

let resizerFile = null;
let resizerOriginalImg = null;
let resizerResultBlob = null;
let resizerResultUrl = null;

const resizerDropzone      = document.getElementById('resizerDropzone');
const resizerFileInput     = document.getElementById('resizerFileInput');
const resizerStateUpload   = document.getElementById('resizer-state-upload');
const resizerStateSettings = document.getElementById('resizer-state-settings');
const resizerStateResult   = document.getElementById('resizer-state-result');
const resizerCanvas        = document.getElementById('resizerCanvas');
const resizerWidthInput    = document.getElementById('resizerWidth');
const resizerHeightInput   = document.getElementById('resizerHeight');
const resizerDPI           = document.getElementById('resizerDPI');
const resizerBg            = document.getElementById('resizerBg');
const resizerResultDims    = document.getElementById('resizerResultDims');
const resizerResultDPI     = document.getElementById('resizerResultDPI');
const resizerResultPreview = document.getElementById('resizerResultPreview');
const btnResizerCancel     = document.getElementById('btnResizerCancel');
const btnResizerResize     = document.getElementById('btnResizerResize');
const btnResizerDownload   = document.getElementById('btnResizerDownload');
const btnResizerStartOver  = document.getElementById('btnResizerStartOver');
const resizerPresetBtns    = document.querySelectorAll('.resizer-preset-btn');

setupDropzone(resizerDropzone, resizerFileInput, handleResizerFile);

function handleResizerFile(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.match('image.*')) { showToast('Please select an image file.', 'error'); return; }

    resizerFile = file;
    const url = URL.createObjectURL(file);
    resizerOriginalImg = new Image();
    resizerOriginalImg.onload = function() {
        // Set default dimensions if empty
        if (!resizerWidthInput.value && !resizerHeightInput.value) {
            resizerWidthInput.value = this.width;
            resizerHeightInput.value = this.height;
        }
        drawResizerPreview();
        resizerStateUpload.classList.add('hidden');
        resizerStateSettings.classList.remove('hidden');
    };
    resizerOriginalImg.src = url;
}

// Resizer presets
resizerPresetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        resizerWidthInput.value = btn.dataset.w;
        resizerHeightInput.value = btn.dataset.h;
        resizerPresetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawResizerPreview();
        showToast(`Preset: ${btn.dataset.label} (${btn.dataset.w}x${btn.dataset.h})`);
    });
});

[resizerWidthInput, resizerHeightInput].forEach(input => {
    input.addEventListener('input', () => {
        resizerPresetBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.w === resizerWidthInput.value && b.dataset.h === resizerHeightInput.value);
        });
        drawResizerPreview();
    });
});

function drawResizerPreview() {
    if (!resizerOriginalImg || !resizerCanvas) return;
    const ctx = resizerCanvas.getContext('2d');
    const container = resizerCanvas.parentElement;
    const maxW = container.clientWidth || 400;
    const maxH = 300;

    const imgW = resizerOriginalImg.width;
    const imgH = resizerOriginalImg.height;
    const ratio = Math.min(maxW / imgW, maxH / imgH, 1);
    const displayW = Math.floor(imgW * ratio);
    const displayH = Math.floor(imgH * ratio);

    resizerCanvas.width = displayW;
    resizerCanvas.height = displayH;
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, displayW, displayH);
    ctx.drawImage(resizerOriginalImg, 0, 0, displayW, displayH);

    // Draw crop overlay if dimensions are set
    const targetW = parseInt(resizerWidthInput.value) || 0;
    const targetH = parseInt(resizerHeightInput.value) || 0;
    if (targetW > 0 && targetH > 0) {
        const cropRatio = targetW / targetH;
        const imgActualRatio = imgW / imgH;
        let cropW, cropH, cropX, cropY;
        if (cropRatio > imgActualRatio) {
            cropW = imgW;
            cropH = imgW / cropRatio;
            cropX = 0;
            cropY = (imgH - cropH) / 2;
        } else {
            cropH = imgH;
            cropW = imgH * cropRatio;
            cropX = (imgW - cropW) / 2;
            cropY = 0;
        }
        // Draw dimmed overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, displayW, displayH);
        // Clear crop area
        ctx.drawImage(resizerOriginalImg, cropX, cropY, cropW, cropH, cropX * ratio, cropY * ratio, cropW * ratio, cropH * ratio);
        // Draw crop border
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropX * ratio, cropY * ratio, cropW * ratio, cropH * ratio);
    }
}

if (btnResizerCancel) {
    btnResizerCancel.addEventListener('click', () => {
        resizerFile = null;
        resizerOriginalImg = null;
        resizerWidthInput.value = '';
        resizerHeightInput.value = '';
        resizerPresetBtns.forEach(b => b.classList.remove('active'));
        resizerStateSettings.classList.add('hidden');
        resizerStateUpload.classList.remove('hidden');
    });
}

if (btnResizerStartOver) {
    btnResizerStartOver.addEventListener('click', () => {
        if (resizerResultUrl) URL.revokeObjectURL(resizerResultUrl);
        resizerFile = null;
        resizerOriginalImg = null;
        resizerResultBlob = null;
        resizerResultUrl = null;
        resizerWidthInput.value = '';
        resizerHeightInput.value = '';
        resizerPresetBtns.forEach(b => b.classList.remove('active'));
        resizerStateResult.classList.add('hidden');
        resizerStateUpload.classList.remove('hidden');
    });
}

if (btnResizerResize) {
    btnResizerResize.addEventListener('click', async () => {
        if (!resizerOriginalImg) { showToast('Please upload a photo first.', 'error'); return; }

        const targetW = parseInt(resizerWidthInput.value) || 0;
        const targetH = parseInt(resizerHeightInput.value) || 0;
        if (targetW <= 0 || targetH <= 0) {
            showToast('Please enter valid width and height.', 'error');
            return;
        }

        const dpi = parseInt(resizerDPI.value) || 300;
        const bgType = resizerBg.value;

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (bgType === 'transparent') {
            ctx.clearRect(0, 0, targetW, targetH);
        } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, targetW, targetH);
        }

        // Center-crop to fit target aspect ratio
        const imgW = resizerOriginalImg.width;
        const imgH = resizerOriginalImg.height;
        const targetRatio = targetW / targetH;
        const imgRatio = imgW / imgH;

        let sx, sy, sw, sh;
        if (targetRatio > imgRatio) {
            sh = imgH;
            sw = imgH * targetRatio;
            sx = (imgW - sw) / 2;
            sy = 0;
        } else {
            sw = imgW;
            sh = imgW / targetRatio;
            sx = 0;
            sy = (imgH - sh) / 2;
        }

        ctx.drawImage(resizerOriginalImg, sx, sy, sw, sh, 0, 0, targetW, targetH);

        const mimeType = bgType === 'transparent' ? 'image/png' : 'image/jpeg';
        const quality = bgType === 'transparent' ? undefined : 0.95;

        resizerResultBlob = await new Promise(resolve => {
            canvas.toBlob(b => resolve(b), mimeType, quality);
        });

        if (resizerResultUrl) URL.revokeObjectURL(resizerResultUrl);
        resizerResultUrl = URL.createObjectURL(resizerResultBlob);

        resizerResultDims.textContent = `${targetW} x ${targetH} px`;
        resizerResultDPI.textContent = `${dpi} DPI`;
        resizerResultPreview.innerHTML = `<img src="${resizerResultUrl}" class="max-w-[200px] max-h-[200px] object-contain rounded-lg border border-slate-200" alt="Resized">`;

        resizerStateSettings.classList.add('hidden');
        resizerStateResult.classList.remove('hidden');
        showToast('Photo resized successfully!');
    });
}

if (btnResizerDownload) {
    btnResizerDownload.addEventListener('click', () => {
        if (!resizerResultUrl) { showToast('No resized photo available.', 'error'); return; }
        const ext = resizerBg.value === 'transparent' ? 'png' : 'jpg';
        const a = document.createElement('a');
        a.href = resizerResultUrl;
        a.download = `optidrop-resized-${resizerWidthInput.value}x${resizerHeightInput.value}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Photo downloaded!');
    });
}


/* ═══════════════════════════════════════════════════════════
   TOOL 6: NAME & DATE STAMPER
   ═══════════════════════════════════════════════════════════ */

let stamperFile = null;
let stamperOriginalImg = null;
let stamperResultBlob = null;
let stamperResultUrl = null;

const stamperDropzone      = document.getElementById('stamperDropzone');
const stamperFileInput     = document.getElementById('stamperFileInput');
const stamperStateUpload   = document.getElementById('stamper-state-upload');
const stamperStateSettings = document.getElementById('stamper-state-settings');
const stamperStateResult   = document.getElementById('stamper-state-result');
const stamperCanvas        = document.getElementById('stamperCanvas');
const stamperNameInput     = document.getElementById('stamperName');
const stamperDateInput     = document.getElementById('stamperDate');
const stamperPosition      = document.getElementById('stamperPosition');
const stamperFontSize      = document.getElementById('stamperFontSize');
const stamperResultPreview = document.getElementById('stamperResultPreview');
const btnStamperCancel     = document.getElementById('btnStamperCancel');
const btnStamperStamp      = document.getElementById('btnStamperStamp');
const btnStamperDownload   = document.getElementById('btnStamperDownload');
const btnStamperStartOver  = document.getElementById('btnStamperStartOver');
const stamperColorBtns     = document.querySelectorAll('.stamper-color-btn');

let stamperColor = 'white';

// Set default date to today
if (stamperDateInput) {
    const today = new Date();
    stamperDateInput.value = today.toISOString().split('T')[0];
}

setupDropzone(stamperDropzone, stamperFileInput, handleStamperFile);

function handleStamperFile(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.match('image.*')) { showToast('Please select an image file.', 'error'); return; }

    stamperFile = file;
    const url = URL.createObjectURL(file);
    stamperOriginalImg = new Image();
    stamperOriginalImg.onload = function() {
        drawStamperPreview();
        stamperStateUpload.classList.add('hidden');
        stamperStateSettings.classList.remove('hidden');
    };
    stamperOriginalImg.src = url;
}

// Color picker
stamperColorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        stamperColor = btn.dataset.color;
        stamperColorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawStamperPreview();
    });
});

// Live preview on input changes
[stamperNameInput, stamperDateInput, stamperPosition, stamperFontSize].forEach(el => {
    if (el) {
        el.addEventListener('input', drawStamperPreview);
        el.addEventListener('change', drawStamperPreview);
    }
});

function drawStamperPreview() {
    if (!stamperOriginalImg || !stamperCanvas) return;
    const ctx = stamperCanvas.getContext('2d');
    const container = stamperCanvas.parentElement;
    const maxW = container.clientWidth || 400;
    const maxH = 300;

    const imgW = stamperOriginalImg.width;
    const imgH = stamperOriginalImg.height;
    const ratio = Math.min(maxW / imgW, maxH / imgH, 1);
    const displayW = Math.floor(imgW * ratio);
    const displayH = Math.floor(imgH * ratio);

    stamperCanvas.width = displayW;
    stamperCanvas.height = displayH;
    ctx.drawImage(stamperOriginalImg, 0, 0, displayW, displayH);

    // Draw stamp text
    const name = stamperNameInput.value.trim();
    const dateVal = stamperDateInput.value;
    if (!name && !dateVal) return;

    let dateFormatted = '';
    if (dateVal) {
        const d = new Date(dateVal);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        dateFormatted = `${day}/${month}/${year}`;
    }

    const stampText = [name, dateFormatted].filter(Boolean).join('  |  ');

    const fontSizeMap = { small: 0.025, medium: 0.035, large: 0.05 };
    const fontSizeRatio = fontSizeMap[stamperFontSize.value] || 0.035;
    const fontSize = Math.max(10, Math.floor(imgW * fontSizeRatio));
    const scaledFontSize = fontSize * ratio;

    ctx.font = `bold ${scaledFontSize}px Inter, Arial, sans-serif`;
    ctx.textBaseline = 'bottom';

    const padding = Math.floor(scaledFontSize * 0.5);
    const textMetrics = ctx.measureText(stampText);
    const textW = textMetrics.width;
    const textH = scaledFontSize;

    // Position
    let x, y, textAlign;
    const pos = stamperPosition.value;
    switch (pos) {
        case 'bottom-left':
            x = padding;
            y = displayH - padding;
            textAlign = 'left';
            break;
        case 'bottom-center':
            x = displayW / 2;
            y = displayH - padding;
            textAlign = 'center';
            break;
        case 'bottom-right':
            x = displayW - padding;
            y = displayH - padding;
            textAlign = 'right';
            break;
        case 'top-left':
            x = padding;
            y = padding + textH;
            textAlign = 'left';
            break;
        case 'top-right':
            x = displayW - padding;
            y = padding + textH;
            textAlign = 'right';
            break;
        default:
            x = padding;
            y = displayH - padding;
            textAlign = 'left';
    }

    ctx.textAlign = textAlign;

    // Draw background strip
    const bgPad = Math.floor(scaledFontSize * 0.3);
    let bgX;
    if (textAlign === 'left') bgX = x - bgPad;
    else if (textAlign === 'center') bgX = x - textW / 2 - bgPad;
    else bgX = x - textW - bgPad;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(bgX, y - textH - bgPad, textW + bgPad * 2, textH + bgPad * 2);

    // Draw text
    const colorMap = { white: '#FFFFFF', black: '#000000', red: '#FF0000', blue: '#0066FF' };
    ctx.fillStyle = colorMap[stamperColor] || '#FFFFFF';
    ctx.fillText(stampText, x, y);
}

if (btnStamperCancel) {
    btnStamperCancel.addEventListener('click', () => {
        stamperFile = null;
        stamperOriginalImg = null;
        stamperStateSettings.classList.add('hidden');
        stamperStateUpload.classList.remove('hidden');
    });
}

if (btnStamperStartOver) {
    btnStamperStartOver.addEventListener('click', () => {
        if (stamperResultUrl) URL.revokeObjectURL(stamperResultUrl);
        stamperFile = null;
        stamperOriginalImg = null;
        stamperResultBlob = null;
        stamperResultUrl = null;
        stamperStateResult.classList.add('hidden');
        stamperStateUpload.classList.remove('hidden');
    });
}

if (btnStamperStamp) {
    btnStamperStamp.addEventListener('click', async () => {
        if (!stamperOriginalImg) { showToast('Please upload a photo first.', 'error'); return; }

        const name = stamperNameInput.value.trim();
        const dateVal = stamperDateInput.value;
        if (!name && !dateVal) {
            showToast('Please enter a name or select a date.', 'error');
            return;
        }

        const imgW = stamperOriginalImg.width;
        const imgH = stamperOriginalImg.height;

        const canvas = document.createElement('canvas');
        canvas.width = imgW;
        canvas.height = imgH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(stamperOriginalImg, 0, 0, imgW, imgH);

        let dateFormatted = '';
        if (dateVal) {
            const d = new Date(dateVal);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            dateFormatted = `${day}/${month}/${year}`;
        }

        const stampText = [name, dateFormatted].filter(Boolean).join('  |  ');

        const fontSizeMap = { small: 0.025, medium: 0.035, large: 0.05 };
        const fontSizeRatio = fontSizeMap[stamperFontSize.value] || 0.035;
        const fontSize = Math.max(12, Math.floor(imgW * fontSizeRatio));

        ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
        ctx.textBaseline = 'bottom';

        const padding = Math.floor(fontSize * 0.5);
        const textMetrics = ctx.measureText(stampText);
        const textW = textMetrics.width;
        const textH = fontSize;

        let x, y, textAlign;
        const pos = stamperPosition.value;
        switch (pos) {
            case 'bottom-left':
                x = padding; y = imgH - padding; textAlign = 'left'; break;
            case 'bottom-center':
                x = imgW / 2; y = imgH - padding; textAlign = 'center'; break;
            case 'bottom-right':
                x = imgW - padding; y = imgH - padding; textAlign = 'right'; break;
            case 'top-left':
                x = padding; y = padding + textH; textAlign = 'left'; break;
            case 'top-right':
                x = imgW - padding; y = padding + textH; textAlign = 'right'; break;
            default:
                x = padding; y = imgH - padding; textAlign = 'left';
        }

        ctx.textAlign = textAlign;

        const bgPad = Math.floor(fontSize * 0.3);
        let bgX;
        if (textAlign === 'left') bgX = x - bgPad;
        else if (textAlign === 'center') bgX = x - textW / 2 - bgPad;
        else bgX = x - textW - bgPad;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(bgX, y - textH - bgPad, textW + bgPad * 2, textH + bgPad * 2);

        const colorMap = { white: '#FFFFFF', black: '#000000', red: '#FF0000', blue: '#0066FF' };
        ctx.fillStyle = colorMap[stamperColor] || '#FFFFFF';
        ctx.fillText(stampText, x, y);

        stamperResultBlob = await new Promise(resolve => {
            canvas.toBlob(b => resolve(b), 'image/jpeg', 0.95);
        });

        if (stamperResultUrl) URL.revokeObjectURL(stamperResultUrl);
        stamperResultUrl = URL.createObjectURL(stamperResultBlob);

        stamperResultPreview.innerHTML = `<img src="${stamperResultUrl}" class="max-w-[250px] max-h-[250px] object-contain rounded-lg border border-slate-200" alt="Stamped">`;

        stamperStateSettings.classList.add('hidden');
        stamperStateResult.classList.remove('hidden');
        showToast('Photo stamped successfully!');
    });
}

if (btnStamperDownload) {
    btnStamperDownload.addEventListener('click', () => {
        if (!stamperResultUrl) { showToast('No stamped photo available.', 'error'); return; }
        const a = document.createElement('a');
        a.href = stamperResultUrl;
        const baseName = stamperFile ? stamperFile.name.replace(/\.[^.]+$/, '') : 'photo';
        a.download = `${baseName}-stamped.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Stamped photo downloaded!');
    });
}


/* ═══════════════════════════════════════════════════════════
   TOOL 7: SIGNATURE SCANNER
   ═══════════════════════════════════════════════════════════ */

let signatureFile = null;
let signatureOriginalImg = null;
let signatureResultBlob = null;
let signatureResultUrl = null;

const signatureDropzone      = document.getElementById('signatureDropzone');
const signatureFileInput     = document.getElementById('signatureFileInput');
const signatureStateUpload   = document.getElementById('signature-state-upload');
const signatureStateSettings = document.getElementById('signature-state-settings');
const signatureStateResult   = document.getElementById('signature-state-result');
const signatureCanvas        = document.getElementById('signatureCanvas');
const signatureThreshold     = document.getElementById('signatureThreshold');
const signatureThresholdVal  = document.getElementById('signatureThresholdVal');
const signatureSizeLimit     = document.getElementById('signatureSizeLimit');
const signatureResultSize    = document.getElementById('signatureResultSize');
const signatureResultPreview = document.getElementById('signatureResultPreview');
const btnSignatureCancel     = document.getElementById('btnSignatureCancel');
const btnSignatureProcess    = document.getElementById('btnSignatureProcess');
const btnSignatureDownload   = document.getElementById('btnSignatureDownload');
const btnSignatureStartOver  = document.getElementById('btnSignatureStartOver');

if (signatureThreshold) {
    signatureThreshold.addEventListener('input', () => {
        signatureThresholdVal.textContent = signatureThreshold.value;
        if (signatureOriginalImg) drawSignaturePreview();
    });
}

setupDropzone(signatureDropzone, signatureFileInput, handleSignatureFile);

function handleSignatureFile(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.match('image.*')) { showToast('Please select an image file.', 'error'); return; }

    signatureFile = file;
    const url = URL.createObjectURL(file);
    signatureOriginalImg = new Image();
    signatureOriginalImg.onload = function() {
        drawSignaturePreview();
        signatureStateUpload.classList.add('hidden');
        signatureStateSettings.classList.remove('hidden');
    };
    signatureOriginalImg.src = url;
}

function drawSignaturePreview() {
    if (!signatureOriginalImg || !signatureCanvas) return;
    const ctx = signatureCanvas.getContext('2d');
    const container = signatureCanvas.parentElement;
    const maxW = container.clientWidth || 400;
    const maxH = 300;

    const imgW = signatureOriginalImg.width;
    const imgH = signatureOriginalImg.height;
    const ratio = Math.min(maxW / imgW, maxH / imgH, 1);
    const displayW = Math.floor(imgW * ratio);
    const displayH = Math.floor(imgH * ratio);

    signatureCanvas.width = displayW;
    signatureCanvas.height = displayH;
    ctx.drawImage(signatureOriginalImg, 0, 0, displayW, displayH);

    // Apply threshold preview
    const threshold = parseInt(signatureThreshold.value) || 140;
    try {
        const imageData = ctx.getImageData(0, 0, displayW, displayH);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            const val = gray > threshold ? 255 : 0;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
        }
        ctx.putImageData(imageData, 0, 0);
    } catch (e) {
        // Canvas tainted - just show original
    }
}

if (btnSignatureCancel) {
    btnSignatureCancel.addEventListener('click', () => {
        signatureFile = null;
        signatureOriginalImg = null;
        signatureStateSettings.classList.add('hidden');
        signatureStateUpload.classList.remove('hidden');
    });
}

if (btnSignatureStartOver) {
    btnSignatureStartOver.addEventListener('click', () => {
        if (signatureResultUrl) URL.revokeObjectURL(signatureResultUrl);
        signatureFile = null;
        signatureOriginalImg = null;
        signatureResultBlob = null;
        signatureResultUrl = null;
        signatureStateResult.classList.add('hidden');
        signatureStateUpload.classList.remove('hidden');
    });
}

if (btnSignatureProcess) {
    btnSignatureProcess.addEventListener('click', async () => {
        if (!signatureOriginalImg) { showToast('Please upload a signature photo.', 'error'); return; }

        const threshold = parseInt(signatureThreshold.value) || 140;
        const sizeLimitKB = parseInt(signatureSizeLimit.value) || 20;
        const sizeLimitBytes = sizeLimitKB * 1024;

        const canvas = document.createElement('canvas');
        canvas.width = signatureOriginalImg.width;
        canvas.height = signatureOriginalImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(signatureOriginalImg, 0, 0);

        // Apply B&W threshold
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            const val = gray > threshold ? 255 : 0;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);

        // Try to fit under size limit by reducing dimensions
        let blob = await new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/jpeg', 0.92));
        let currentW = canvas.width;
        let currentH = canvas.height;

        // Iteratively reduce if over limit
        while (blob.size > sizeLimitBytes && (currentW > 100 || currentH > 100)) {
            const scale = Math.sqrt(sizeLimitBytes / blob.size) * 0.9;
            currentW = Math.max(100, Math.floor(currentW * scale));
            currentH = Math.max(100, Math.floor(currentH * scale));

            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = currentW;
            tmpCanvas.height = currentH;
            const tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.drawImage(canvas, 0, 0, currentW, currentH);
            blob = await new Promise(resolve => tmpCanvas.toBlob(b => resolve(b), 'image/jpeg', 0.85));
        }

        // If still over, try lower quality
        if (blob.size > sizeLimitBytes) {
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = currentW;
            tmpCanvas.height = currentH;
            const tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.drawImage(canvas, 0, 0, currentW, currentH);
            blob = await new Promise(resolve => tmpCanvas.toBlob(b => resolve(b), 'image/jpeg', 0.6));
        }

        if (signatureResultUrl) URL.revokeObjectURL(signatureResultUrl);
        signatureResultBlob = blob;
        signatureResultUrl = URL.createObjectURL(blob);

        signatureResultSize.textContent = formatBytes(blob.size);
        signatureResultPreview.innerHTML = `<img src="${signatureResultUrl}" class="max-w-[250px] max-h-[200px] object-contain" style="background:#f1f5f9;" alt="Clean signature">`;

        signatureStateSettings.classList.add('hidden');
        signatureStateResult.classList.remove('hidden');
        showToast('Signature cleaned and compressed!');
    });
}

if (btnSignatureDownload) {
    btnSignatureDownload.addEventListener('click', () => {
        if (!signatureResultUrl) { showToast('No signature available.', 'error'); return; }
        const a = document.createElement('a');
        a.href = signatureResultUrl;
        const baseName = signatureFile ? signatureFile.name.replace(/\.[^.]+$/, '') : 'signature';
        a.download = `${baseName}-clean.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Signature downloaded!');
    });
}


/* ═══════════════════════════════════════════════════════════
   TOOL 8: IMAGE TEXT EXTRACTOR (OCR)
   ═══════════════════════════════════════════════════════════ */

let ocrFile = null;

const ocrDropzone      = document.getElementById('ocrDropzone');
const ocrFileInput     = document.getElementById('ocrFileInput');
const ocrStateUpload   = document.getElementById('ocr-state-upload');
const ocrStateProcessing = document.getElementById('ocr-state-processing');
const ocrStateResult   = document.getElementById('ocr-state-result');
const ocrProgressText  = document.getElementById('ocrProgressText');
const ocrPreviewImage  = document.getElementById('ocrPreviewImage');
const ocrTextOutput    = document.getElementById('ocrTextOutput');
const ocrConfidence    = document.getElementById('ocrConfidence');
const btnOcrCopy       = document.getElementById('btnOcrCopy');
const btnOcrStartOver  = document.getElementById('btnOcrStartOver');

setupDropzone(ocrDropzone, ocrFileInput, handleOcrFile);

/* OCR Web Worker support — offloads Tesseract.js to keep UI responsive */
var _ocrWorker = null;
var _ocrWorkerSupported = (typeof Worker !== 'undefined');

function _getOcrWorker() {
    if (!_ocrWorker && _ocrWorkerSupported) {
        try {
            _ocrWorker = new Worker('ocr-worker.js');
            _ocrWorker.addEventListener('error', function () {
                _ocrWorkerSupported = false;
                _ocrWorker = null;
            });
        } catch (e) {
            _ocrWorkerSupported = false;
        }
    }
    return _ocrWorker;
}

function _ocrViaWorker(file) {
    return new Promise(function (resolve, reject) {
        var worker = _getOcrWorker();
        if (!worker) return reject(new Error('Worker not available'));

        var timedOut = false;
        var timer = setTimeout(function () {
            timedOut = true;
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            _ocrWorkerSupported = false;
            _ocrWorker = null;
            reject(new Error('Worker timeout'));
        }, 30000);

        var onMsg = function (e) {
            if (timedOut) return;
            var d = e.data;
            if (d.progress !== undefined) {
                ocrProgressText.textContent = d.status || 'Processing...';
            }
            if (d.error) {
                clearTimeout(timer);
                worker.removeEventListener('message', onMsg);
                worker.removeEventListener('error', onErr);
                _ocrWorkerSupported = false;
                _ocrWorker = null;
                reject(new Error(d.error));
            } else if (d.success) {
                clearTimeout(timer);
                worker.removeEventListener('message', onMsg);
                worker.removeEventListener('error', onErr);
                resolve({ text: d.text, confidence: d.confidence });
            }
        };
        var onErr = function () {
            if (timedOut) return;
            clearTimeout(timer);
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            _ocrWorkerSupported = false;
            _ocrWorker = null;
            reject(new Error('Worker error'));
        };
        worker.addEventListener('message', onMsg);
        worker.addEventListener('error', onErr);
        worker.postMessage({ file: file, lang: 'eng' });
    });
}

function handleOcrFile(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.match('image.*')) { showToast('Please select an image file.', 'error'); return; }

    ocrFile = file;
    ocrStateUpload.classList.add('hidden');
    ocrStateProcessing.classList.remove('hidden');
    ocrProgressText.textContent = 'Initializing OCR engine...';

    /* ---- try Web Worker first ---- */
    if (_ocrWorkerSupported) {
        _ocrViaWorker(file).then(function (result) {
            ocrPreviewImage.src = URL.createObjectURL(ocrFile);
            ocrTextOutput.value = result.text;
            ocrConfidence.textContent = result.confidence + '%';

            ocrStateProcessing.classList.add('hidden');
            ocrStateResult.classList.remove('hidden');

            if (result.text.length > 0) {
                showToast('Text extracted successfully!');
            } else {
                showToast('No text found in the image. Try a clearer image.', 'info');
            }
        }).catch(function (err) {
            console.warn('OCR worker failed, falling back to main thread:', err);
            _ocrMainFallback(file);
        });
        return;
    }

    /* ---- main-thread fallback ---- */
    _ocrMainFallback(file);
}

function _ocrMainFallback(file) {
    ocrProgressText.textContent = 'Loading OCR engine... (first time only)';
    loadTesseract().then(function () {
        return _ocrMainFallbackRun(file);
    }).catch(function () {
        showToast('Failed to load OCR engine. Please check your connection.', 'error');
        ocrStateProcessing.classList.add('hidden');
        ocrStateUpload.classList.remove('hidden');
    });
}

function _ocrMainFallbackRun(file) {
    const imageUrl = URL.createObjectURL(file);

    Tesseract.recognize(imageUrl, 'eng', {
        logger: (m) => {
            if (m.status === 'recognizing text') {
                const pct = Math.round((m.progress || 0) * 100);
                ocrProgressText.textContent = `Recognizing text... ${pct}%`;
            } else if (m.status === 'loading tesseract core') {
                ocrProgressText.textContent = 'Loading OCR engine...';
            } else if (m.status === 'loading language traineddata') {
                ocrProgressText.textContent = 'Loading language data...';
            } else if (m.status === 'initializing tesseract') {
                ocrProgressText.textContent = 'Preparing...';
            }
        }
    }).then(({ data: { text, confidence } }) => {
        URL.revokeObjectURL(imageUrl);

        ocrPreviewImage.src = URL.createObjectURL(ocrFile);
        ocrTextOutput.value = text.trim();
        ocrConfidence.textContent = confidence + '%';

        ocrStateProcessing.classList.add('hidden');
        ocrStateResult.classList.remove('hidden');

        if (text.trim().length > 0) {
            showToast('Text extracted successfully!');
        } else {
            showToast('No text found in the image. Try a clearer image.', 'info');
        }
    }).catch((err) => {
        console.error('OCR error:', err);
        URL.revokeObjectURL(imageUrl);
        showToast('Failed to extract text. Please try again.', 'error');
        ocrStateProcessing.classList.add('hidden');
        ocrStateUpload.classList.remove('hidden');
    });
}

if (btnOcrCopy) {
    btnOcrCopy.addEventListener('click', () => {
        const text = ocrTextOutput.value;
        if (!text) { showToast('No text to copy.', 'error'); return; }
        navigator.clipboard.writeText(text).then(() => {
            showToast('Text copied to clipboard!');
            btnOcrCopy.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!`;
            setTimeout(() => {
                btnOcrCopy.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg> Copy`;
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            ocrTextOutput.select();
            document.execCommand('copy');
            showToast('Text copied!');
        });
    });
}

if (btnOcrStartOver) {
    btnOcrStartOver.addEventListener('click', () => {
        ocrFile = null;
        if (ocrPreviewImage.src) URL.revokeObjectURL(ocrPreviewImage.src);
        ocrTextOutput.value = '';
        ocrStateResult.classList.add('hidden');
        ocrStateUpload.classList.remove('hidden');
    });
}
