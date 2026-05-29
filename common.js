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

// ── FAQ Accordion (Smooth max-height transition) ─────────────
document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        var targetButton = e.target.closest('.faq-question');
        if (!targetButton) return;
        var item = targetButton.parentElement;
        var isOpen = item.classList.contains('open');
        // Close all items
        document.querySelectorAll('.faq-item').forEach(function (i) {
            i.classList.remove('open');
        });
        // Open clicked item if it was closed
        if (!isOpen) {
            item.classList.add('open');
        }
    });
});

// ── Homepage Search Filter (Enhanced with Dropdown) ──────────
(function () {
    var searchInput = document.getElementById('toolSearch');
    if (!searchInput) return;

    // Build search index from all tool cards on page
    var searchIndex = [];
    document.querySelectorAll('.tool-card').forEach(function (card) {
        var href = card.getAttribute('href') || '';
        var title = (card.querySelector('.tool-card-title') || {}).textContent || '';
        var desc = (card.querySelector('.tool-card-desc') || {}).textContent || '';
        var tag = (card.querySelector('.tool-card-tag') || {}).textContent || '';
        // Find parent category section
        var section = card.closest('.category-section');
        var category = '';
        if (section) {
            var catH2 = section.querySelector('h2');
            category = catH2 ? catH2.textContent : '';
        }
        if (href && title) {
            searchIndex.push({ href: href, title: title.trim(), desc: desc.trim(), tag: tag.trim(), category: category.trim() });
        }
    });

    // Create dropdown element
    var dropdown = document.createElement('div');
    dropdown.id = 'searchDropdown';
    dropdown.className = 'search-dropdown';
    dropdown.style.display = 'none';
    searchInput.parentElement.appendChild(dropdown);

    var selectedIdx = -1;

    function showDropdown(results) {
        if (results.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        dropdown.innerHTML = '';
        results.forEach(function (r, i) {
            var item = document.createElement('a');
            item.href = r.href;
            item.className = 'search-dropdown-item';
            item.dataset.index = i;
            item.innerHTML =
                '<div class="search-dropdown-title">' + escapeHtml(r.title) + '</div>' +
                '<div class="search-dropdown-meta"><span class="search-dropdown-cat">' + escapeHtml(r.category) + '</span> ' + escapeHtml(r.desc) + '</div>';
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block';
        selectedIdx = -1;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function filterAndShow() {
        var query = searchInput.value.toLowerCase().trim();
        var sections = document.querySelectorAll('.category-section');
        var cards = document.querySelectorAll('.tool-card');

        if (!query) {
            dropdown.style.display = 'none';
            if (sections.length) {
                sections.forEach(function (s) { s.style.display = ''; });
            }
            cards.forEach(function (c) { c.style.display = ''; });
            return;
        }

        // Filter results for dropdown
        var results = searchIndex.filter(function (item) {
            return item.title.toLowerCase().indexOf(query) !== -1 ||
                   item.desc.toLowerCase().indexOf(query) !== -1 ||
                   item.category.toLowerCase().indexOf(query) !== -1 ||
                   item.tag.toLowerCase().indexOf(query) !== -1;
        }).slice(0, 8);
        showDropdown(results);

        // Also filter visible cards
        if (sections.length) {
            sections.forEach(function (section) {
                var sectionCards = section.querySelectorAll('.tool-card');
                var anyVisible = false;
                sectionCards.forEach(function (card) {
                    var title = (card.querySelector('.tool-card-title') || {}).textContent || '';
                    var desc = (card.querySelector('.tool-card-desc') || {}).textContent || '';
                    var match = title.toLowerCase().indexOf(query) !== -1 || desc.toLowerCase().indexOf(query) !== -1;
                    card.style.display = match ? '' : 'none';
                    if (match) anyVisible = true;
                });
                section.style.display = anyVisible ? '' : 'none';
            });
        }
    }

    searchInput.addEventListener('input', filterAndShow);

    // Keyboard navigation
    searchInput.addEventListener('keydown', function (e) {
        var items = dropdown.querySelectorAll('.search-dropdown-item');
        if (!items.length || dropdown.style.display === 'none') return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIdx = Math.max(selectedIdx - 1, 0);
            updateHighlight(items);
        } else if (e.key === 'Enter' && selectedIdx >= 0) {
            e.preventDefault();
            window.location.href = items[selectedIdx].href;
        } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
            searchInput.blur();
        }
    });

    function updateHighlight(items) {
        items.forEach(function (item, i) {
            item.classList.toggle('highlighted', i === selectedIdx);
        });
        if (selectedIdx >= 0 && items[selectedIdx]) {
            items[selectedIdx].scrollIntoView({ block: 'nearest' });
        }
    }

    // Close dropdown on outside click
    document.addEventListener('click', function (e) {
        if (!searchInput.parentElement.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Ctrl+K / Cmd+K to focus search
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });
})();

// ── Bookmark Prompt (Block 8) ───────────────────────────────
(function () {
    var pageKey = window.location.pathname.replace(/[^a-z0-9]/gi, '_');
    var storageKey = 'optidrop_usecount_' + pageKey;
    var dismissedKey = 'optidrop_bookmark_dismissed_' + pageKey;

    // Check if already dismissed
    try {
        if (localStorage.getItem(dismissedKey)) return;
    } catch (e) {}

    // Track tool usage via action buttons
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('#btnCompress, #btnHeicConvert, #btnPdf2jpgExtract, #btnResizerResize, #btnStamperStamp, #btnSignatureProcess, #btnMergeGenerate, #btnStartOver, #btnHeicStartOver');
        if (!btn) return;

        var count = 0;
        try { count = parseInt(localStorage.getItem(storageKey) || '0', 10) + 1; } catch (e) {}
        try { localStorage.setItem(storageKey, String(count)); } catch (e) {}

        if (count === 2) {
            try { localStorage.setItem(dismissedKey, '1'); } catch (e) {}
            showBookmarkToast();
        }
    });

    function showBookmarkToast() {
        var toast = document.createElement('div');
        toast.className = 'bookmark-toast';
        toast.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg> You use this often — press <strong>Ctrl+D</strong> to bookmark it for instant access.';
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.classList.add('show');
        }, 10);
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 400);
        }, 4000);
    }
})();

// ── Calculator URL Parameter State Sharing (Block 3) ────────
function initCalculatorUrlParams(paramMap) {
    if (!paramMap) return;
    var params = new URLSearchParams(window.location.search);

    // Pre-fill from URL
    Object.keys(paramMap).forEach(function (key) {
        var el = document.getElementById(paramMap[key]);
        if (el && params.has(key)) {
            el.value = params.get(key);
        }
    });

    // Add share button after calculate button
    var calcBtns = document.querySelectorAll('[id^="btnCalc"], [id^="btnCalculate"], [id^="btnCompute"], #btnCheckBmi, #btnGetResults, #btnFindWeight, #btnCalcWater, #btnCalcSleep, #btnCalcAge, #btnCalcPercent, #btnCalcDate, #btnCalcTime, #btnCalcFuel, #btnConvertCurrency, #btnCalcCalorie, #btnCalcGrade, #btnCompareLoans, #btnCalcTax, #btnCalcGST, #btnCalcDiscount, #btnCalcTip, #btnCalcMortgage');
    calcBtns.forEach(function (btn) {
        if (btn && !document.getElementById('btnShareCalc')) {
            var shareBtn = document.createElement('button');
            shareBtn.id = 'btnShareCalc';
            shareBtn.className = 'share-calc-btn';
            shareBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg> Share this calculation';
            shareBtn.style.display = 'none';
            btn.parentElement.appendChild(shareBtn);

            shareBtn.addEventListener('click', function () {
                var url = new URL(window.location.href.split('?')[0]);
                Object.keys(paramMap).forEach(function (key) {
                    var el = document.getElementById(paramMap[key]);
                    if (el && el.value) {
                        url.searchParams.set(key, el.value);
                    }
                });
                copyToClipboard(url.toString(), 'Link copied — share it with anyone.');
            });

            // Show share button after first calculation
            btn.addEventListener('click', function () {
                setTimeout(function () { shareBtn.style.display = 'inline-flex'; }, 500);
            });
        }
    });
}

// ── Drag-and-Drop File Routing (Block 4) ────────────────────
function getToolForFile(file) {
    var type = file.type || '';
    var name = (file.name || '').toLowerCase();
    if (type === 'image/heic' || type === 'image/heif' || name.endsWith('.heic') || name.endsWith('.heif')) return '/heic-to-jpg.html';
    if (type === 'application/pdf' || name.endsWith('.pdf')) return '/compress-pdf.html';
    if (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp' || type === 'image/bmp') return '/compress-image.html';
    if (type.startsWith('image/')) return '/image-format-converter.html';
    return null;
}

// ── SessionStorage File Pre-load (Block 4) ──────────────────
function checkSessionFile(inputEl, callback) {
    try {
        var stored = sessionStorage.getItem('optidrop_pending_file');
        if (!stored) return;
        sessionStorage.removeItem('optidrop_pending_file');
        var data = JSON.parse(stored);
        if (data && data.name && data.type && data.dataUrl) {
            fetch(data.dataUrl)
                .then(function (r) { return r.blob(); })
                .then(function (blob) {
                    var file = new File([blob], data.name, { type: data.type });
                    if (callback) callback(file);
                    else if (inputEl) {
                        var dt = new DataTransfer();
                        dt.items.add(file);
                        inputEl.files = dt.files;
                        inputEl.dispatchEvent(new Event('change'));
                    }
                })
                .catch(function () {});
        }
    } catch (e) {}
}

// ── Auto-Save Helpers (Block 6) ─────────────────────────────
function initAutoSave(key, formSelector, excludeSelector) {
    var form = document.querySelector(formSelector);
    if (!form) return;

    function collectData() {
        var data = {};
        form.querySelectorAll('input, select, textarea').forEach(function (el) {
            if (!el.id && !el.name) return;
            if (excludeSelector && el.matches(excludeSelector)) return;
            var k = el.id || el.name;
            if (el.type === 'checkbox') data[k] = el.checked;
            else if (el.type === 'radio') { if (el.checked) data[k] = el.value; }
            else data[k] = el.value;
        });
        return data;
    }

    function applyData(data) {
        if (!data) return;
        Object.keys(data).forEach(function (k) {
            var el = form.querySelector('#' + CSS.escape(k)) || form.querySelector('[name="' + CSS.escape(k) + '"]');
            if (!el) return;
            if (el.type === 'checkbox') el.checked = data[k];
            else if (el.type === 'radio') {
                var radio = form.querySelector('[name="' + CSS.escape(k) + '"][value="' + CSS.escape(data[k]) + '"]');
                if (radio) radio.checked = true;
            }
            else el.value = data[k];
        });
    }

    // Load saved state
    var saved = autoLoad(key);
    if (saved && Object.keys(saved).length > 0) {
        showDraftBar(key, function () {
            applyData(saved);
            showToast('Draft restored!');
        }, function () {
            autoSave(key, {});
        });
    }

    // Auto-save on input
    var saveTimer;
    form.addEventListener('input', function () {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
            autoSave(key, collectData());
        }, 500);
    });
    form.addEventListener('change', function () {
        autoSave(key, collectData());
    });
}

function showDraftBar(key, onContinue, onStartFresh) {
    var bar = document.createElement('div');
    bar.className = 'draft-bar';
    bar.innerHTML = '<span>You have an unsaved draft from your last visit. Resume editing?</span>' +
        '<div class="draft-bar-actions"><button class="draft-btn-continue">Continue</button><button class="draft-btn-fresh">Start Fresh</button></div>';
    document.body.insertBefore(bar, document.body.firstChild);
    setTimeout(function () { bar.classList.add('show'); }, 50);

    bar.querySelector('.draft-btn-continue').addEventListener('click', function () {
        if (onContinue) onContinue();
        bar.classList.remove('show');
        setTimeout(function () { bar.remove(); }, 300);
    });
    bar.querySelector('.draft-btn-fresh').addEventListener('click', function () {
        try { localStorage.removeItem('optidrop_' + key); } catch (e) {}
        if (onStartFresh) onStartFresh();
        bar.classList.remove('show');
        setTimeout(function () { bar.remove(); }, 300);
        showToast('Draft cleared. Starting fresh.');
    });
}
