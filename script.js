/* =========================================================
   OptiDrop — script.js (FIXED & OPTIMIZED)
   ========================================================= */

// Update footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ── App State ──────────────────────────────────────────────
let fileQueue = [];
const MAX_FILES = 20;

// ── DOM References ─────────────────────────────────────────
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

// Feature DOM refs
const presetButtons         = document.querySelectorAll('.preset-btn');
const passportPresetButtons = document.querySelectorAll('.passport-preset-btn');
const outputFormatSelect    = document.getElementById('outputFormat');
const targetWidthInput      = document.getElementById('targetWidth');
const targetHeightInput     = document.getElementById('targetHeight');
const imageInfoPanel        = document.getElementById('imageInfoPanel');
const imageInfoContent      = document.getElementById('imageInfoContent');

// ── Helper: Toast Notification ─────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');

    const bgClass = type === 'error' ? 'bg-red-600' : 'bg-slate-800';
    toast.className = `toast ${bgClass} text-white px-6 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2`;

    toast.innerHTML = `
        ${type === 'error'
            ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            : '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}
        ${message}
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ── Helper: Format Bytes ───────────────────────────────────
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ── Helper: Extension from MIME ────────────────────────────
function getExtension(mimeType) {
    const map = {
        'image/jpeg': 'jpg',
        'image/png':  'png',
        'image/webp': 'webp'
    };
    return map[mimeType] || 'jpg';
}

// ── Feature 1: Quick Size Presets ──────────────────────────
presetButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kb = btn.dataset.kb;
        targetKBInput.value = kb;
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

targetKBInput.addEventListener('input', () => {
    presetButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.kb === targetKBInput.value);
    });
});

// ── Feature: Passport Dimension Presets ─────────────────────
passportPresetButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const w = btn.dataset.w;
        const h = btn.dataset.h;
        targetWidthInput.value = w;
        targetHeightInput.value = h;
        passportPresetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showToast(`Preset applied: ${w} × ${h} px`, 'info');
    });
});

[targetWidthInput, targetHeightInput].forEach(input => {
    input.addEventListener('input', () => {
        const w = targetWidthInput.value;
        const h = targetHeightInput.value;
        passportPresetButtons.forEach(b => {
            b.classList.toggle('active', b.dataset.w === w && b.dataset.h === h);
        });
    });
});

// ── Drag and Drop Handlers ─────────────────────────────────
if (dropzone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.add('dropzone-active'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.remove('dropzone-active'), false);
    });

    dropzone.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    }, false);

    dropzone.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

if (fileInput) {
    fileInput.addEventListener('change', function () {
        handleFiles(this.files);
    });
}

// ── Handle Selected Files ──────────────────────────────────
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

// ── Update Image Info Panel ────────────────────────────────
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
            <div class="flex justify-between"><span>Dimensions:</span> <span class="font-semibold">${this.width} × ${this.height} px</span></div>
            <div class="flex justify-between"><span>File Size:</span> <span class="font-semibold">${formatBytes(first.file.size)}</span></div>
            <div class="flex justify-between"><span>Type:</span> <span class="font-semibold">${first.file.type.split('/')[1].toUpperCase()}</span></div>
            <div class="flex justify-between"><span>Name:</span> <span class="font-semibold truncate max-w-[140px]" title="${first.file.name}">${first.file.name}</span></div>
        `;
        imageInfoPanel.classList.remove('hidden');
    };
    img.src = first.originalUrl;
}

// ── Render Batch Preview Grid ──────────────────────────────
function renderBatchPreview() {
    queueCountDisplay.textContent = fileQueue.length;
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

// ── Core: Canvas Blob Helper ───────────────────────────────
function getCanvasBlob(canvas, mimeType, quality) {
    return new Promise((resolve) => {
        if (mimeType === 'image/png') {
            canvas.toBlob((blob) => resolve(blob), mimeType);
        } else {
            canvas.toBlob((blob) => resolve(blob), mimeType, quality);
        }
    });
}

// ── Core: Compression Engine ───────────────────────────────
async function processCompression(targetBytes, imageUrl, outputFormat, forcedWidth, forcedHeight) {
    return new Promise(async (resolve, reject) => {
        try {
            const img = new Image();
            img.src = imageUrl;
            await new Promise(r => { img.onload = r; });

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
            if (initialBlob.size <= targetBytes) {
                return resolve(initialBlob);
            }

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

                let minQ = 0.05;
                let maxQ = 0.95;

                for (let i = 0; i < 8; i++) {
                    const quality = (minQ + maxQ) / 2;
                    const tempBlob = await getCanvasBlob(canvas, outputFormat, quality);
                    if (tempBlob.size > targetBytes) {
                        maxQ = quality;
                    } else {
                        minQ = quality;
                        bestBlob = tempBlob;
                    }
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

        } catch (error) {
            reject(error);
        }
    });
}

// ── Flow Control: Cancel / Start Over ─────────────────────
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

// ── Compress Button ────────────────────────────────────────
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
                    const blob = await processCompression(targetBytes, item.originalUrl, outputFormat, forcedWidth, forcedHeight);
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

// ── Render Results ─────────────────────────────────────────
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
                <button onclick="openCompare('${item.id}')"
                    class="btn-compare"
                    title="Compare Before/After">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                <button onclick="downloadAsPdf('${item.id}', '${newFilename}')"
                    class="btn-pdf"
                    title="Download as PDF">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 14v-3m0 3h4m-4 0h4"/>
                    </svg>
                </button>
            </div>
        `;
        resultsContainer.appendChild(div);
    });
}

// ── Download: Single Image ─────────────────────────────────
window.downloadSingle = function (id, filename) {
    console.log('downloadSingle called:', id, filename);

    const item = fileQueue.find(f => f.id === id);
    if (!item) {
        console.error('Item not found:', id);
        showToast('File not found. Please refresh and try again.', 'error');
        return;
    }

    if (!item.compressedUrl) {
        console.error('Compressed URL not available for:', id);
        showToast('Image not ready. Please wait for compression to complete.', 'error');
        return;
    }

    try {
        // Create download link
        const link = document.createElement('a');
        link.href = item.compressedUrl;
        link.download = filename || 'downloaded-image.jpg';
        link.style.display = 'none';

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();

        // Small delay before removal to ensure download starts
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);

        showToast('Image downloaded successfully!');
    } catch (err) {
        console.error('Download failed:', err);
        showToast('Download failed. Please try again.', 'error');
    }
};

// ── Feature: Before/After Comparison ───────────────────────
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

    // Slider setup
    const startDrag = () => isDragging = true;
    const stopDrag = () => isDragging = false;

    slider.addEventListener('mousedown', startDrag);
    container.addEventListener('mousemove', (e) => {
        if (isDragging) updateSlider(e.clientX);
    });
    document.addEventListener('mouseup', stopDrag);

    slider.addEventListener('touchstart', startDrag);
    container.addEventListener('touchmove', (e) => {
        if (isDragging) updateSlider(e.touches[0].clientX);
    });
    document.addEventListener('touchend', stopDrag);
};

window.closeCompareModal = function() {
    document.getElementById('compareModal').classList.add('hidden');
};

// ── Feature 4: Download as PDF ─────────────────────────────
window.downloadAsPdf = function (id, filename) {
    console.log('downloadAsPdf called:', id, filename);

    const item = fileQueue.find(f => f.id === id);
    if (!item) {
        console.error('Item not found for PDF:', id);
        showToast('File not found. Please refresh and try again.', 'error');
        return;
    }

    if (!item.compressedBlob) {
        console.error('Compressed blob not available for:', id);
        showToast('Image not ready. Please wait for compression to complete.', 'error');
        return;
    }

    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF library not loaded');
        showToast('PDF library is still loading. Please wait and try again.', 'error');
        return;
    }

    try {
        // Create image from compressed URL
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS for canvas operations

        img.onload = function () {
            console.log('Image loaded for PDF conversion, dimensions:', img.width, 'x', img.height);

            try {
                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // Fill with white background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw image
                ctx.drawImage(img, 0, 0);

                // Get data URL
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                console.log('Canvas data URL created, length:', dataUrl.length);

                // Create PDF
                const { jsPDF } = window.jspdf;
                const pxToMm = 0.264583;
                const widthMm = img.width * pxToMm;
                const heightMm = img.height * pxToMm;

                console.log('PDF dimensions (mm):', widthMm, 'x', heightMm);

                const doc = new jsPDF({
                    orientation: widthMm > heightMm ? 'l' : 'p',
                    unit: 'mm',
                    format: [widthMm, heightMm]
                });

                // Add image to PDF
                doc.addImage(dataUrl, 'JPEG', 0, 0, widthMm, heightMm);

                // Generate filename
                const baseName = filename ? filename.substring(0, filename.lastIndexOf('.')) || filename : 'image';
                const pdfFilename = `${baseName}.pdf`;

                console.log('Saving PDF as:', pdfFilename);

                // Save the PDF
                doc.save(pdfFilename);

                showToast('PDF downloaded successfully!');
            } catch (pdfErr) {
                console.error('PDF generation error:', pdfErr);
                showToast('Failed to generate PDF. Please try again.', 'error');
            }
        };

        img.onerror = function(err) {
            console.error('Image load error for PDF:', err);
            showToast('Failed to load image for PDF conversion.', 'error');
        };

        // Set the source
        img.src = item.compressedUrl;
        console.log('Loading image from:', item.compressedUrl);

    } catch (err) {
        console.error('PDF download error:', err);
        showToast('PDF download failed. Please try again.', 'error');
    }
};

// ── Download All as ZIP ────────────────────────────────────
if (btnDownloadZip) {
    btnDownloadZip.addEventListener('click', async () => {
        if (typeof JSZip === 'undefined') {
            showToast('ZIP library is still loading. Please try again in a second.', 'error');
            return;
        }

        const zip       = new JSZip();
        const targetKB  = targetKBInput.value;
        let addedCount  = 0;

        const originalBtnHTML = btnDownloadZip.innerHTML;
        btnDownloadZip.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Zipping...';
        btnDownloadZip.disabled = true;

        setTimeout(async () => {
            try {
                fileQueue.forEach(item => {
                    if (item.status === 'done' && item.compressedBlob) {
                        const ext         = getExtension(item.mimeType || 'image/jpeg');
                        const originalName  = item.file.name;
                        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
                        const newFilename  = `${nameWithoutExt}-${targetKB}kb.${ext}`;
                        zip.file(newFilename, item.compressedBlob);
                        addedCount++;
                    }
                });

                if (addedCount > 0) {
                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    const zipUrl  = URL.createObjectURL(zipBlob);

                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href     = zipUrl;
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
                showToast('Error generating ZIP file.', 'error');
            } finally {
                btnDownloadZip.innerHTML = originalBtnHTML;
                btnDownloadZip.disabled  = false;
            }
        }, 100);
    });
}


/* ═══════════════════════════════════════════════════════════
   MODE 2: IMAGES TO PDF MERGER
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

// ── Tab Switching Logic (CLEAN & FIXED) ────────────────────
const tabCompress = document.getElementById('tab-compress');
const tabMerge    = document.getElementById('tab-merge');
const modeCompress = document.getElementById('mode-compress');
const modeMerge    = document.getElementById('mode-merge');

if (tabCompress && tabMerge) {
    tabCompress.addEventListener('click', (e) => {
        e.preventDefault();
        tabCompress.classList.add('active');
        tabCompress.classList.remove('text-slate-500', 'hover:text-slate-700');
        
        tabMerge.classList.remove('active');
        tabMerge.classList.add('text-slate-500', 'hover:text-slate-700');
        
        modeCompress.classList.remove('hidden');
        modeMerge.classList.add('hidden');
    });

    tabMerge.addEventListener('click', (e) => {
        e.preventDefault();
        tabMerge.classList.add('active');
        tabMerge.classList.remove('text-slate-500', 'hover:text-slate-700');
        
        tabCompress.classList.remove('active');
        tabCompress.classList.add('text-slate-500', 'hover:text-slate-700');
        
        modeMerge.classList.remove('hidden');
        modeCompress.classList.add('hidden');
    });
}

// ── Merge Dropzone Handlers ────────────────────────────────
if (mergeDropzone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        mergeDropzone.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        mergeDropzone.addEventListener(eventName, () => mergeDropzone.classList.add('dropzone-active'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        mergeDropzone.addEventListener(eventName, () => mergeDropzone.classList.remove('dropzone-active'), false);
    });

    mergeDropzone.addEventListener('drop', (e) => {
        handleMergeFiles(e.dataTransfer.files);
    }, false);

    mergeDropzone.addEventListener('click', () => {
        mergeFileInput.value = '';
        mergeFileInput.click();
    });
}

if (mergeFileInput) {
    mergeFileInput.addEventListener('change', function () {
        handleMergeFiles(this.files);
    });
}

if (btnMergeAddMore) {
    btnMergeAddMore.addEventListener('click', () => {
        mergeFileInput.value = '';
        mergeFileInput.click();
    });
}

// ── Handle Merge Files ─────────────────────────────────────
function handleMergeFiles(files) {
    if (files.length === 0) return;

    let addedCount = 0;
    let skippedCount = 0;

    Array.from(files).forEach(file => {
        if (mergeQueue.length >= MAX_MERGE_FILES) { skippedCount++; return; }
        if (!file.type.match('image.*')) return;
        if (file.size > 50 * 1024 * 1024) return;

        const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        const url = URL.createObjectURL(file);

        mergeQueue.push({
            id: fileId,
            file: file,
            url: url,
            width: 0,
            height: 0
        });
        addedCount++;
    });

    if (addedCount > 0) {
        renderMergeQueue();
        mergeStateUpload.classList.add('hidden');
        mergeStateSettings.classList.remove('hidden');
    }

    if (skippedCount > 0) {
        showToast(`Max ${MAX_MERGE_FILES} images allowed. Some were skipped.`, 'info');
    }
}

// ── Render Merge Queue ───────────────────────────────────
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

        // Drag and drop reordering
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
            div.classList.add('dragging');
        });
        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
        });
        div.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
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

// ── Generate PDF ───────────────────────────────────────────
let generatedPdfDoc = null;
let generatedPdfFilename = '';

if (btnMergeGenerate) {
    btnMergeGenerate.addEventListener('click', async () => {
        if (mergeQueue.length === 0) {
            showToast('Please add at least one image.', 'error');
            return;
        }

        if (typeof window.jspdf === 'undefined') {
            showToast('PDF library is still loading. Please wait and try again.', 'error');
            return;
        }

        mergeStateLoading.classList.remove('hidden');
        mergeStateSettings.classList.add('hidden');

        const pageSize    = mergePageSize.value;
        const orientation = mergeOrientation.value;
        const marginMm    = parseInt(mergeMargin.value, 10);
        const filename    = mergeFilename.value.trim() || 'merged-document';

        const { jsPDF } = window.jspdf;

        let pdf;
        const sizes = {
            a4:     { w: 210, h: 297 },
            letter: { w: 216, h: 279 }
        };

        if (pageSize === 'auto') {
            const firstImg = await loadImage(mergeQueue[0].url);
            const firstRatio = firstImg.width / firstImg.height;
            const autoOrient = firstRatio > 1 ? 'l' : 'p';
            pdf = new jsPDF({ orientation: autoOrient, unit: 'mm' });
        } else {
            const size = sizes[pageSize];
            const orient = orientation === 'auto' ? 'p' : orientation;
            pdf = new jsPDF({
                orientation: orient,
                unit: 'mm',
                format: [size.w, size.h]
            });
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
                else if (i === 0) {
                    pdf = new jsPDF({ orientation: orient, unit: 'mm', format: [imgW, imgH] });
                }

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

                pdf.addImage(dataUrl, 'JPEG', 0, 0, imgW, imgH);
            } else {
                const size = sizes[pageSize];
                const pw = size.w;
                const ph = size.h;

                let orient = orientation;
                if (orient === 'auto') {
                    orient = (img.width / img.height) > (pw / ph) ? 'l' : 'p';
                }

                if (i > 0) pdf.addPage([pw, ph], orient);
                else if (orient !== pdf.internal.pageSize.orientation) {
                    pdf = new jsPDF({ orientation: orient, unit: 'mm', format: [pw, ph] });
                }

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
                if (imgRatio > availRatio) {
                    drawW = availW;
                    drawH = availW / imgRatio;
                } else {
                    drawH = availH;
                    drawW = availH * imgRatio;
                }
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

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}

if (btnMergeDownload) {
    btnMergeDownload.addEventListener('click', () => {
        if (!generatedPdfDoc) {
            showToast('No PDF generated yet. Please generate a PDF first.', 'error');
            return;
        }

        try {
            generatedPdfDoc.save(generatedPdfFilename);
            showToast('PDF downloaded successfully!');
        } catch (err) {
            console.error('PDF download failed:', err);
            showToast('PDF download failed. Please try again.', 'error');
        }
    });
}


/* ═══════════════════════════════════════════════════════════
   FAQ ACCORDION (EVENT BUBBLING FIX)
   ═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Prevent inner SVG tracking bugs
        const targetButton = e.target.closest('.faq-question');
        if (!targetButton) return;

        const item = targetButton.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('open');

        // Close all other elements cleanly
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            const ans = i.querySelector('.faq-answer');
            if (ans) ans.classList.add('hidden');
        });

        if (!isOpen) {
            item.classList.add('open');
            if (answer) answer.classList.remove('hidden');
        }
    });
});