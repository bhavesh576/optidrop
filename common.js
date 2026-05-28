/* =========================================================
   OptiDrop — common.js (Shared across all pages)
   ========================================================= */

// ── Footer Year ──────────────────────────────────────────────
(function () {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
})();

// ── Toast Notification ───────────────────────────────────────
function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    var bgClass = type === 'error' ? 'bg-red-600' : 'bg-slate-800';
    toast.className = 'toast ' + bgClass + ' text-white px-6 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2';
    toast.innerHTML =
        (type === 'error'
            ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            : '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>') +
        message;
    container.appendChild(toast);
    setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
}

// ── Format Bytes ─────────────────────────────────────────────
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ── Extension from MIME ──────────────────────────────────────
function getExtension(mimeType) {
    var map = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    return map[mimeType] || 'jpg';
}

// ── Load Image ───────────────────────────────────────────────
function loadImage(src) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = reject;
        img.src = src;
    });
}

// ── Canvas to Blob ───────────────────────────────────────────
function getCanvasBlob(canvas, mimeType, quality) {
    return new Promise(function (resolve) {
        if (mimeType === 'image/png') {
            canvas.toBlob(function (blob) { resolve(blob); }, mimeType);
        } else {
            canvas.toBlob(function (blob) { resolve(blob); }, mimeType, quality);
        }
    });
}

// ── Prevent Defaults (for dropzones) ─────────────────────────
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// ── Setup Dropzone ───────────────────────────────────────────
function setupDropzone(dropzoneEl, fileInputEl, callback, acceptMultiple) {
    if (!dropzoneEl) return;
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
        dropzoneEl.addEventListener(eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(function (eventName) {
        dropzoneEl.addEventListener(eventName, function () { dropzoneEl.classList.add('dropzone-active'); }, false);
    });
    ['dragleave', 'drop'].forEach(function (eventName) {
        dropzoneEl.addEventListener(eventName, function () { dropzoneEl.classList.remove('dropzone-active'); }, false);
    });
    dropzoneEl.addEventListener('drop', function (e) { callback(e.dataTransfer.files); }, false);
    dropzoneEl.addEventListener('click', function () { fileInputEl.value = ''; fileInputEl.click(); });
    if (fileInputEl) {
        fileInputEl.addEventListener('change', function () { callback(this.files); });
    }
}

// ── Copy to Clipboard ───────────────────────────────────────
function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
            showToast(successMsg || 'Copied to clipboard!');
        }).catch(function () {
            fallbackCopy(text, successMsg);
        });
    } else {
        fallbackCopy(text, successMsg);
    }
}
function fallbackCopy(text, successMsg) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast(successMsg || 'Copied to clipboard!'); }
    catch (e) { showToast('Copy failed. Please select and copy manually.', 'error'); }
    document.body.removeChild(ta);
}

// ── localStorage Auto-Save ───────────────────────────────────
function autoSave(key, data) {
    try { localStorage.setItem('optidrop_' + key, JSON.stringify(data)); } catch (e) {}
}
function autoLoad(key) {
    try { var d = localStorage.getItem('optidrop_' + key); return d ? JSON.parse(d) : null; } catch (e) { return null; }
}

// ── Format Currency ──────────────────────────────────────────
function formatCurrency(num, symbol) {
    symbol = symbol || 'Rs. ';
    return symbol + Math.round(num).toLocaleString('en-IN');
}

// ── Download Text as File ────────────────────────────────────
function downloadTextFile(content, filename) {
    var blob = new Blob([content], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ── Tools Directory Search + Filter ──────────────────────────
function initToolsDirectory() {
    var searchInput = document.getElementById('dirSearch');
    var chips = document.querySelectorAll('.category-chip');
    var cards = document.querySelectorAll('.tool-card[data-category]');
    if (!searchInput || !cards.length) return;

    var activeCategory = 'all';

    function filterCards() {
        var query = searchInput.value.toLowerCase().trim();
        cards.forEach(function (card) {
            var title = (card.querySelector('.tool-card-title') || {}).textContent || '';
            var desc = (card.querySelector('.tool-card-desc') || {}).textContent || '';
            var cat = card.getAttribute('data-category') || '';
            var matchSearch = !query || title.toLowerCase().indexOf(query) !== -1 || desc.toLowerCase().indexOf(query) !== -1;
            var matchCat = activeCategory === 'all' || cat === activeCategory;
            card.style.display = (matchSearch && matchCat) ? '' : 'none';
        });
    }

    searchInput.addEventListener('input', filterCards);
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            activeCategory = chip.getAttribute('data-filter') || 'all';
            filterCards();
        });
    });
}

// ── FAQ Accordion ────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        var targetButton = e.target.closest('.faq-question');
        if (!targetButton) return;
        var item = targetButton.parentElement;
        var answer = item.querySelector('.faq-answer');
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function (i) {
            i.classList.remove('open');
            var ans = i.querySelector('.faq-answer');
            if (ans) ans.classList.add('hidden');
        });
        if (!isOpen) {
            item.classList.add('open');
            if (answer) answer.classList.remove('hidden');
        }
    });
});

// ── Homepage Search Filter ───────────────────────────────────
(function () {
    var searchInput = document.getElementById('toolSearch');
    if (!searchInput) return;
    searchInput.addEventListener('input', function () {
        var query = this.value.toLowerCase().trim();
        var sections = document.querySelectorAll('.category-section');
        var cards = document.querySelectorAll('.tool-card');
        if (sections.length) {
            sections.forEach(function (section) {
                var sectionCards = section.querySelectorAll('.tool-card');
                var anyVisible = false;
                sectionCards.forEach(function (card) {
                    var title = (card.querySelector('.tool-card-title') || {}).textContent || '';
                    var desc = (card.querySelector('.tool-card-desc') || {}).textContent || '';
                    var match = !query || title.toLowerCase().indexOf(query) !== -1 || desc.toLowerCase().indexOf(query) !== -1;
                    card.style.display = match ? '' : 'none';
                    if (match) anyVisible = true;
                });
                section.style.display = anyVisible ? '' : 'none';
            });
        } else {
            cards.forEach(function (card) {
                var title = (card.querySelector('.tool-card-title') || {}).textContent || '';
                var desc = (card.querySelector('.tool-card-desc') || {}).textContent || '';
                var match = !query || title.toLowerCase().indexOf(query) !== -1 || desc.toLowerCase().indexOf(query) !== -1;
                card.style.display = match ? '' : 'none';
            });
        }
    });
})();
