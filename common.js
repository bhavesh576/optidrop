/* =========================================================
   OptiDrop — common.js (Shared across all pages)
   ========================================================= */

// ── Dark Mode (Feature 6) ───────────────────────────────────
(function () {
    try {
        if (localStorage.getItem('optidrop_dark_mode') === '1') {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        }
    } catch (e) {}
})();

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
    var iconSvg = type === 'error'
        ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        : '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    toast.innerHTML = iconSvg;
    var msgSpan = document.createElement('span');
    msgSpan.textContent = message;
    toast.appendChild(msgSpan);
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

// ── Calculator URL Parameter State Sharing (Feature 5) ────
function initCalculatorUrlParams(paramMap) {
    if (!paramMap) return;

    // Read from hash parameters
    var hash = window.location.hash.replace(/^#/, '');
    var hashParams = new URLSearchParams(hash);

    // Also check query params for backwards compatibility
    var queryParams = new URLSearchParams(window.location.search);

    // Pre-fill from URL (hash first, then query)
    Object.keys(paramMap).forEach(function (key) {
        var el = document.getElementById(paramMap[key]);
        if (!el) return;
        var val = hashParams.get(key) || queryParams.get(key);
        if (val) {
            el.value = val;
        }
    });

    // Auto-calculate if hash params exist
    if (hash.length > 0) {
        var hasAny = false;
        Object.keys(paramMap).forEach(function (key) {
            if (hashParams.has(key)) hasAny = true;
        });
        if (hasAny) {
            setTimeout(function () {
                var calcBtns = document.querySelectorAll('[id^="btnCalc"], [id^="btnCalculate"], [id^="btnCompute"], #btnCheckBmi, #btnGetResults, #btnFindWeight, #btnCalcWater, #btnCalcSleep, #btnCalcAge, #btnCalcPercent, #btnCalcDate, #btnCalcTime, #btnCalcFuel, #btnConvertCurrency, #btnCalcCalorie, #btnCalcGrade, #btnCompareLoans, #btnCalcTax, #btnCalcGST, #btnCalcDiscount, #btnCalcTip, #btnCalcMortgage');
                if (calcBtns.length > 0) calcBtns[0].click();
            }, 300);
        }
    }

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
                var baseUrl = window.location.href.split('?')[0].split('#')[0];
                var parts = [];
                Object.keys(paramMap).forEach(function (key) {
                    var el = document.getElementById(paramMap[key]);
                    if (el && el.value) {
                        parts.push(key + '=' + encodeURIComponent(el.value));
                    }
                });
                var shareUrl = baseUrl + '#' + parts.join('&');
                copyToClipboard(shareUrl, 'Link copied — share it with anyone.');
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

// ════════════════════════════════════════════════════════════
// FEATURE 1 — Recently Used Tools
// ════════════════════════════════════════════════════════════
(function () {
    var path = window.location.pathname;
    // Only track visits to actual tool pages
    var toolMeta = {
        '/compress-image.html': 'Image Compressor',
        '/heic-to-jpg.html': 'HEIC to JPG',
        '/image-format-converter.html': 'Format Converter',
        '/remove-background.html': 'Background Remover',
        '/passport-photo-resizer.html': 'Photo Resizer',
        '/name-date-stamp.html': 'Name & Date Stamper',
        '/signature-scanner.html': 'Signature Scanner',
        '/image-to-text-ocr.html': 'OCR Text Extractor',
        '/compress-pdf.html': 'PDF Compressor',
        '/jpg-to-pdf.html': 'JPG to PDF',
        '/pdf-to-jpg.html': 'PDF to JPG',
        '/qr-code-generator.html': 'QR Code Generator',
        '/tools/emi-calculator.html': 'EMI Calculator',
        '/tools/gst-calculator.html': 'GST Calculator',
        '/tools/age-calculator.html': 'Age Calculator',
        '/tools/percentage-calculator.html': 'Percentage Calculator',
        '/tools/word-counter.html': 'Word Counter',
        '/tools/text-case-converter.html': 'Text Case Converter',
        '/tools/password-generator.html': 'Password Generator',
        '/tools/bmi-calculator.html': 'BMI Calculator',
        '/tools/unit-converter.html': 'Unit Converter',
        '/tools/calculators/sip-calculator.html': 'SIP Calculator',
        '/tools/calculators/income-tax-calculator.html': 'Income Tax Calculator',
        '/tools/calculators/mortgage-calculator.html': 'Mortgage Calculator',
        '/tools/calculators/tip-calculator.html': 'Tip Calculator',
        '/tools/calculators/grade-calculator.html': 'Grade Calculator',
        '/tools/calculators/loan-comparison.html': 'Loan Comparison',
        '/tools/calculators/compound-interest.html': 'Compound Interest',
        '/tools/calculators/retirement-calculator.html': 'Retirement Calculator',
        '/tools/calculators/discount-calculator.html': 'Discount Calculator',
        '/tools/calculators/date-difference.html': 'Date Difference',
        '/tools/calculators/time-calculator.html': 'Time Calculator',
        '/tools/calculators/fuel-cost.html': 'Fuel Cost',
        '/tools/calculators/currency-converter.html': 'Currency Converter',
        '/tools/calculators/calorie-calculator.html': 'Calorie Calculator',
        '/tools/calculators/401k-calculator.html': '401(k) Calculator',
        '/tools/calculators/paycheck-calculator.html': 'Paycheck Calculator',
        '/tools/calculators/savings-goal.html': 'Savings Goal',
        '/tools/calculators/invoice-tax-calculator.html': 'Sales Tax Calculator',
        '/tools/calculators/vat-calculator.html': 'VAT Calculator',
        '/tools/calculators/overtime-calculator.html': 'Overtime Calculator',
        '/tools/career/resume-builder.html': 'Resume Builder',
        '/tools/career/cover-letter.html': 'Cover Letter',
        '/tools/career/resignation-letter.html': 'Resignation Letter',
        '/tools/career/thank-you-letter.html': 'Thank You Letter',
        '/tools/career/linkedin-generator.html': 'LinkedIn Generator',
        '/tools/career/internship-letter.html': 'Internship Letter',
        '/tools/career/job-tracker.html': 'Job Tracker',
        '/tools/business/invoice-generator.html': 'Invoice Generator',
        '/tools/business/freelance-contract.html': 'Freelance Contract',
        '/tools/business/salary-slip.html': 'Salary Slip',
        '/tools/business/business-proposal.html': 'Business Proposal',
        '/tools/business/offer-letter.html': 'Offer Letter',
        '/tools/business/noc-generator.html': 'NOC Generator',
        '/tools/business/experience-letter.html': 'Experience Letter',
        '/tools/business/profit-calculator.html': 'Profit Calculator',
        '/tools/business/receipt-generator.html': 'Receipt Generator',
        '/tools/professional/email-signature.html': 'Email Signature',
        '/tools/professional/business-card.html': 'Business Card',
        '/tools/professional/bio-generator.html': 'Bio Generator',
        '/tools/professional/sop-generator.html': 'SOP Generator',
        '/tools/developer/json-formatter.html': 'JSON Formatter',
        '/tools/developer/base64.html': 'Base64 Encoder',
        '/tools/developer/url-encoder.html': 'URL Encoder',
        '/tools/developer/color-converter.html': 'Color Converter',
        '/tools/developer/markdown-preview.html': 'Markdown Preview',
        '/tools/developer/hash-generator.html': 'Hash Generator',
        '/tools/developer/css-minifier.html': 'CSS Minifier',
        '/tools/developer/jwt-decoder.html': 'JWT Decoder',
        '/tools/health/ideal-weight.html': 'Ideal Weight',
        '/tools/health/calorie-calculator.html': 'Calorie Calculator',
        '/tools/health/water-intake.html': 'Water Intake',
        '/tools/health/sleep-calculator.html': 'Sleep Calculator',
        '/tools/health/pregnancy-due-date.html': 'Pregnancy Due Date',
        '/tools/health/ovulation-calculator.html': 'Ovulation Calculator',
        '/tools/health/macro-calculator.html': 'Macro Calculator',
        '/tools/health/body-fat-calculator.html': 'Body Fat Calculator',
        '/tools/text/lorem-ipsum-generator.html': 'Lorem Ipsum',
        '/tools/text/random-name-generator.html': 'Random Name',
        '/tools/text/text-repeater.html': 'Text Repeater',
        '/tools/text/binary-to-text.html': 'Binary Converter',
        '/tools/text/character-counter.html': 'Character Counter',
        '/tools/text/remove-duplicate-lines.html': 'Remove Duplicates',
        '/tools/text/find-and-replace.html': 'Find & Replace',
        '/tools/text/number-to-words.html': 'Number to Words',
        '/tools/text/reverse-text.html': 'Reverse Text',
        '/tools/text/text-to-slug.html': 'Text to Slug',
        '/tools/text/word-frequency.html': 'Word Frequency',
        '/tools/text/sentence-reorder.html': 'Sentence Shuffler',
        '/tools/text/random-picker.html': 'Random Picker',
        '/tools/calculators/loan-amortization.html': 'Loan Amortization',
        '/tools/calculators/roi-calculator.html': 'ROI Calculator',
        '/tools/calculators/freelance-rate.html': 'Freelance Rate',
        '/tools/calculators/discount-tax-calculator.html': 'Discount & Tax',
        '/tools/developer/exif-stripper.html': 'EXIF Stripper',
        '/tools/pomodoro-timer.html': 'Pomodoro Timer',
        '/tools/aspect-ratio-calculator.html': 'Aspect Ratio',
        '/tools/health/bmr-calculator.html': 'BMR Calculator'
    };

    var toolName = toolMeta[path];
    if (!toolName) return;

    // Save visit
    try {
        var recent = JSON.parse(localStorage.getItem('optidrop_recent_tools') || '[]');
        // Remove if already exists
        recent = recent.filter(function (r) { return r.path !== path; });
        // Add to front
        recent.unshift({ name: toolName, path: path, time: Date.now() });
        // Keep last 5
        if (recent.length > 5) recent = recent.slice(0, 5);
        localStorage.setItem('optidrop_recent_tools', JSON.stringify(recent));
    } catch (e) {}
})();

// ── Render Recently Used on Homepage ────────────────────────
(function () {
    var container = document.getElementById('recentToolsSection');
    if (!container) return;
    try {
        var recent = JSON.parse(localStorage.getItem('optidrop_recent_tools') || '[]');
        if (recent.length === 0) return;
        // Show last 3
        var items = recent.slice(0, 3);
        var html = '';
        items.forEach(function (r) {
            html += '<a href="' + r.path + '" class="tool-card" style="padding:1rem;min-height:auto;">' +
                '<span class="tool-card-title" style="font-size:0.95rem;">' + r.name + '</span>' +
                '<span class="tool-card-desc" style="font-size:0.8rem;">Continue where you left off</span>' +
                '</a>';
        });
        container.innerHTML = html;
        container.parentElement.style.display = '';
    } catch (e) {}
})();

// ════════════════════════════════════════════════════════════
// FEATURE 3 — Keyboard Command Palette
// ════════════════════════════════════════════════════════════
(function () {
    var allTools = [
        { name: 'Image Compressor', href: '/compress-image.html', cat: 'Image' },
        { name: 'HEIC to JPG', href: '/heic-to-jpg.html', cat: 'Image' },
        { name: 'Format Converter', href: '/image-format-converter.html', cat: 'Image' },
        { name: 'Background Remover', href: '/remove-background.html', cat: 'Image' },
        { name: 'Photo Resizer', href: '/passport-photo-resizer.html', cat: 'Image' },
        { name: 'Name & Date Stamper', href: '/name-date-stamp.html', cat: 'Image' },
        { name: 'Signature Scanner', href: '/signature-scanner.html', cat: 'Image' },
        { name: 'OCR Text Extractor', href: '/image-to-text-ocr.html', cat: 'Image' },
        { name: 'PDF Compressor', href: '/compress-pdf.html', cat: 'PDF' },
        { name: 'JPG to PDF', href: '/jpg-to-pdf.html', cat: 'PDF' },
        { name: 'PDF to JPG', href: '/pdf-to-jpg.html', cat: 'PDF' },
        { name: 'QR Code Generator', href: '/qr-code-generator.html', cat: 'Utility' },
        { name: 'EMI Calculator', href: '/tools/emi-calculator.html', cat: 'Calculator' },
        { name: 'GST Calculator', href: '/tools/gst-calculator.html', cat: 'Calculator' },
        { name: 'Age Calculator', href: '/tools/age-calculator.html', cat: 'Calculator' },
        { name: 'Percentage Calculator', href: '/tools/percentage-calculator.html', cat: 'Calculator' },
        { name: 'SIP Calculator', href: '/tools/calculators/sip-calculator.html', cat: 'Calculator' },
        { name: 'Income Tax Calculator', href: '/tools/calculators/income-tax-calculator.html', cat: 'Calculator' },
        { name: 'Mortgage Calculator', href: '/tools/calculators/mortgage-calculator.html', cat: 'Calculator' },
        { name: 'Tip Calculator', href: '/tools/calculators/tip-calculator.html', cat: 'Calculator' },
        { name: 'Grade Calculator', href: '/tools/calculators/grade-calculator.html', cat: 'Calculator' },
        { name: 'Loan Comparison', href: '/tools/calculators/loan-comparison.html', cat: 'Calculator' },
        { name: 'Compound Interest', href: '/tools/calculators/compound-interest.html', cat: 'Calculator' },
        { name: 'Retirement Calculator', href: '/tools/calculators/retirement-calculator.html', cat: 'Calculator' },
        { name: 'Discount Calculator', href: '/tools/calculators/discount-calculator.html', cat: 'Calculator' },
        { name: 'Date Difference', href: '/tools/calculators/date-difference.html', cat: 'Calculator' },
        { name: 'Time Calculator', href: '/tools/calculators/time-calculator.html', cat: 'Calculator' },
        { name: 'Fuel Cost', href: '/tools/calculators/fuel-cost.html', cat: 'Calculator' },
        { name: 'Currency Converter', href: '/tools/calculators/currency-converter.html', cat: 'Calculator' },
        { name: 'Calorie Calculator', href: '/tools/calculators/calorie-calculator.html', cat: 'Calculator' },
        { name: '401(k) Calculator', href: '/tools/calculators/401k-calculator.html', cat: 'Calculator' },
        { name: 'Paycheck Calculator', href: '/tools/calculators/paycheck-calculator.html', cat: 'Calculator' },
        { name: 'Savings Goal', href: '/tools/calculators/savings-goal.html', cat: 'Calculator' },
        { name: 'Sales Tax Calculator', href: '/tools/calculators/invoice-tax-calculator.html', cat: 'Calculator' },
        { name: 'VAT Calculator', href: '/tools/calculators/vat-calculator.html', cat: 'Calculator' },
        { name: 'Overtime Calculator', href: '/tools/calculators/overtime-calculator.html', cat: 'Calculator' },
        { name: 'Loan Amortization', href: '/tools/calculators/loan-amortization.html', cat: 'Calculator' },
        { name: 'ROI Calculator', href: '/tools/calculators/roi-calculator.html', cat: 'Calculator' },
        { name: 'Freelance Rate', href: '/tools/calculators/freelance-rate.html', cat: 'Calculator' },
        { name: 'Discount & Tax', href: '/tools/calculators/discount-tax-calculator.html', cat: 'Calculator' },
        { name: 'Resume Builder', href: '/tools/career/resume-builder.html', cat: 'Career' },
        { name: 'Cover Letter', href: '/tools/career/cover-letter.html', cat: 'Career' },
        { name: 'Resignation Letter', href: '/tools/career/resignation-letter.html', cat: 'Career' },
        { name: 'Thank You Letter', href: '/tools/career/thank-you-letter.html', cat: 'Career' },
        { name: 'LinkedIn Generator', href: '/tools/career/linkedin-generator.html', cat: 'Career' },
        { name: 'Internship Letter', href: '/tools/career/internship-letter.html', cat: 'Career' },
        { name: 'Job Tracker', href: '/tools/career/job-tracker.html', cat: 'Career' },
        { name: 'Invoice Generator', href: '/tools/business/invoice-generator.html', cat: 'Business' },
        { name: 'Freelance Contract', href: '/tools/business/freelance-contract.html', cat: 'Business' },
        { name: 'Salary Slip', href: '/tools/business/salary-slip.html', cat: 'Business' },
        { name: 'Business Proposal', href: '/tools/business/business-proposal.html', cat: 'Business' },
        { name: 'Offer Letter', href: '/tools/business/offer-letter.html', cat: 'Business' },
        { name: 'NOC Generator', href: '/tools/business/noc-generator.html', cat: 'Business' },
        { name: 'Experience Letter', href: '/tools/business/experience-letter.html', cat: 'Business' },
        { name: 'Profit Calculator', href: '/tools/business/profit-calculator.html', cat: 'Business' },
        { name: 'Receipt Generator', href: '/tools/business/receipt-generator.html', cat: 'Business' },
        { name: 'Email Signature', href: '/tools/professional/email-signature.html', cat: 'Professional' },
        { name: 'Business Card', href: '/tools/professional/business-card.html', cat: 'Professional' },
        { name: 'Bio Generator', href: '/tools/professional/bio-generator.html', cat: 'Professional' },
        { name: 'SOP Generator', href: '/tools/professional/sop-generator.html', cat: 'Professional' },
        { name: 'JSON Formatter', href: '/tools/developer/json-formatter.html', cat: 'Developer' },
        { name: 'Base64 Encoder', href: '/tools/developer/base64.html', cat: 'Developer' },
        { name: 'URL Encoder', href: '/tools/developer/url-encoder.html', cat: 'Developer' },
        { name: 'Color Converter', href: '/tools/developer/color-converter.html', cat: 'Developer' },
        { name: 'Markdown Preview', href: '/tools/developer/markdown-preview.html', cat: 'Developer' },
        { name: 'Hash Generator', href: '/tools/developer/hash-generator.html', cat: 'Developer' },
        { name: 'CSS Minifier', href: '/tools/developer/css-minifier.html', cat: 'Developer' },
        { name: 'JWT Decoder', href: '/tools/developer/jwt-decoder.html', cat: 'Developer' },
        { name: 'EXIF Stripper', href: '/tools/developer/exif-stripper.html', cat: 'Developer' },
        { name: 'Word Counter', href: '/tools/word-counter.html', cat: 'Text' },
        { name: 'Text Case Converter', href: '/tools/text-case-converter.html', cat: 'Text' },
        { name: 'Lorem Ipsum', href: '/tools/text/lorem-ipsum-generator.html', cat: 'Text' },
        { name: 'Random Name Generator', href: '/tools/text/random-name-generator.html', cat: 'Text' },
        { name: 'Text Repeater', href: '/tools/text/text-repeater.html', cat: 'Text' },
        { name: 'Binary Converter', href: '/tools/text/binary-to-text.html', cat: 'Text' },
        { name: 'Character Counter', href: '/tools/text/character-counter.html', cat: 'Text' },
        { name: 'Remove Duplicates', href: '/tools/text/remove-duplicate-lines.html', cat: 'Text' },
        { name: 'Find & Replace', href: '/tools/text/find-and-replace.html', cat: 'Text' },
        { name: 'Number to Words', href: '/tools/text/number-to-words.html', cat: 'Text' },
        { name: 'Reverse Text', href: '/tools/text/reverse-text.html', cat: 'Text' },
        { name: 'Text to Slug', href: '/tools/text/text-to-slug.html', cat: 'Text' },
        { name: 'Word Frequency', href: '/tools/text/word-frequency.html', cat: 'Text' },
        { name: 'Sentence Shuffler', href: '/tools/text/sentence-reorder.html', cat: 'Text' },
        { name: 'Random Picker', href: '/tools/text/random-picker.html', cat: 'Text' },
        { name: 'BMI Calculator', href: '/tools/bmi-calculator.html', cat: 'Health' },
        { name: 'Ideal Weight', href: '/tools/health/ideal-weight.html', cat: 'Health' },
        { name: 'Calorie Calculator', href: '/tools/health/calorie-calculator.html', cat: 'Health' },
        { name: 'Water Intake', href: '/tools/health/water-intake.html', cat: 'Health' },
        { name: 'Sleep Calculator', href: '/tools/health/sleep-calculator.html', cat: 'Health' },
        { name: 'Pregnancy Due Date', href: '/tools/health/pregnancy-due-date.html', cat: 'Health' },
        { name: 'Ovulation Calculator', href: '/tools/health/ovulation-calculator.html', cat: 'Health' },
        { name: 'Macro Calculator', href: '/tools/health/macro-calculator.html', cat: 'Health' },
        { name: 'Body Fat Calculator', href: '/tools/health/body-fat-calculator.html', cat: 'Health' },
        { name: 'BMR Calculator', href: '/tools/health/bmr-calculator.html', cat: 'Health' },
        { name: 'Password Generator', href: '/tools/password-generator.html', cat: 'Utility' },
        { name: 'Unit Converter', href: '/tools/unit-converter.html', cat: 'Utility' },
        { name: 'Pomodoro Timer', href: '/tools/pomodoro-timer.html', cat: 'Utility' },
        { name: 'Aspect Ratio', href: '/tools/aspect-ratio-calculator.html', cat: 'Utility' }
    ];

    // Create overlay
    var overlay = document.createElement('div');
    overlay.id = 'cmdPalette';
    overlay.className = 'cmd-palette-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = '<div class="cmd-palette-box">' +
        '<input type="text" id="cmdInput" class="cmd-palette-input" placeholder="Search 90+ tools..." autocomplete="off">' +
        '<div id="cmdResults" class="cmd-palette-results"></div>' +
        '<div class="cmd-palette-footer"><span>Press <kbd>Esc</kbd> to close</span><span><kbd>Enter</kbd> to open</span></div>' +
        '</div>';
    document.body.appendChild(overlay);

    var cmdInput = document.getElementById('cmdInput');
    var cmdResults = document.getElementById('cmdResults');
    var selectedIdx = -1;

    function renderResults(query) {
        var q = (query || '').toLowerCase().trim();
        var filtered = q ? allTools.filter(function (t) {
            return t.name.toLowerCase().indexOf(q) !== -1 || t.cat.toLowerCase().indexOf(q) !== -1;
        }) : allTools;
        filtered = filtered.slice(0, 12);
        selectedIdx = -1;
        cmdResults.innerHTML = '';
        filtered.forEach(function (t, i) {
            var div = document.createElement('a');
            div.href = t.href;
            div.className = 'cmd-palette-item';
            div.dataset.index = i;
            div.innerHTML = '<span class="cmd-item-name">' + t.name + '</span><span class="cmd-item-cat">' + t.cat + '</span>';
            cmdResults.appendChild(div);
        });
    }

    function openPalette() {
        overlay.style.display = 'flex';
        cmdInput.value = '';
        renderResults('');
        setTimeout(function () { cmdInput.focus(); }, 50);
    }

    function closePalette() {
        overlay.style.display = 'none';
        cmdInput.value = '';
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closePalette();
    });

    cmdInput.addEventListener('input', function () {
        renderResults(this.value);
    });

    cmdInput.addEventListener('keydown', function (e) {
        var items = cmdResults.querySelectorAll('.cmd-palette-item');
        if (e.key === 'Escape') {
            closePalette();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
            items.forEach(function (it, i) { it.classList.toggle('highlighted', i === selectedIdx); });
            if (items[selectedIdx]) items[selectedIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIdx = Math.max(selectedIdx - 1, 0);
            items.forEach(function (it, i) { it.classList.toggle('highlighted', i === selectedIdx); });
            if (items[selectedIdx]) items[selectedIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIdx >= 0 && items[selectedIdx]) {
                window.location.href = items[selectedIdx].href;
            } else if (items[0]) {
                window.location.href = items[0].href;
            }
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            var tag = (document.activeElement || {}).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            e.preventDefault();
            openPalette();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openPalette();
        }
    });
})();

// ════════════════════════════════════════════════════════════
// FEATURE 6 — Dark Mode Toggle
// ════════════════════════════════════════════════════════════
(function () {
    var header = document.querySelector('.header-nav');
    if (!header) return;

    var btn = document.createElement('button');
    btn.className = 'dark-mode-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.innerHTML = '<svg class="dm-icon-sun" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' +
        '<svg class="dm-icon-moon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';

    var privacyBadge = header.querySelector('.privacy-badge');
    if (privacyBadge) {
        header.insertBefore(btn, privacyBadge);
    } else {
        header.appendChild(btn);
    }

    // Add keyboard shortcut hint (Feature 3)
    if (!header.querySelector('.kbd-hint')) {
        var hint = document.createElement('span');
        hint.className = 'kbd-hint hide-mobile';
        hint.innerHTML = '<kbd>/</kbd> Tools';
        hint.addEventListener('click', function () {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
        });
        header.insertBefore(hint, btn);
    }

    function apply(mode) {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
    }

    btn.addEventListener('click', function () {
        var isDark = document.body.classList.contains('dark-mode');
        apply(isDark ? 'light' : 'dark');
        try { localStorage.setItem('optidrop_dark_mode', isDark ? '0' : '1'); } catch (e) {}
    });
})();

// ════════════════════════════════════════════════════════════
// FEATURE 8 — Mobile Floating Action Button
// ════════════════════════════════════════════════════════════
(function () {
    var popularTools = [
        { name: 'Image Compressor', href: '/compress-image.html' },
        { name: 'HEIC to JPG', href: '/heic-to-jpg.html' },
        { name: 'Resume Builder', href: '/tools/career/resume-builder.html' },
        { name: 'EMI Calculator', href: '/tools/emi-calculator.html' },
        { name: 'Invoice Generator', href: '/tools/business/invoice-generator.html' },
        { name: 'PDF Compressor', href: '/compress-pdf.html' },
        { name: 'QR Code Generator', href: '/qr-code-generator.html' },
        { name: 'Word Counter', href: '/tools/word-counter.html' }
    ];

    var fab = document.createElement('button');
    fab.className = 'fab-button';
    fab.setAttribute('aria-label', 'Quick tools');
    fab.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';

    var overlay = document.createElement('div');
    overlay.className = 'fab-overlay';
    overlay.style.display = 'none';
    var grid = '<div class="fab-panel"><div class="fab-panel-header"><span>Quick Access</span><button class="fab-close" aria-label="Close"><svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div><div class="fab-grid">';
    popularTools.forEach(function (t) {
        grid += '<a href="' + t.href + '" class="fab-tool-btn">' + t.name + '</a>';
    });
    grid += '</div></div>';
    overlay.innerHTML = grid;

    document.body.appendChild(fab);
    document.body.appendChild(overlay);

    fab.addEventListener('click', function () {
        overlay.style.display = 'flex';
    });
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.closest('.fab-close')) {
            overlay.style.display = 'none';
        }
    });
})();

// ── Share Bar Injection (appears in result cards after task completion) ──
(function () {
    var SHARE_URL = 'https://optidrop.online';
    var SHARE_TEXT = 'Found this useful? Share with a friend.';
    var SHARE_BTN = 'Copy Share Link';
    var SHARE_DONE = '✓ Link copied!';

    function createShareBar() {
        var wrapper = document.createElement('div');
        wrapper.className = 'optidrop-share-bar mt-4 pt-3 border-t border-slate-200 dark:border-slate-600';
        wrapper.innerHTML =
            '<div class="flex flex-col sm:flex-row items-center justify-between gap-2">' +
                '<span class="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">' + SHARE_TEXT + '</span>' +
                '<button type="button" class="optidrop-share-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ' +
                    'bg-slate-100 hover:bg-slate-200 text-slate-700 ' +
                    'dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 ' +
                    'border border-slate-200 dark:border-slate-600 ' +
                    'transition-all duration-200 cursor-pointer flex-shrink-0">' +
                    '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" ' +
                        'd="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>' +
                    '</svg>' +
                    '<span class="optidrop-share-btn-text">' + SHARE_BTN + '</span>' +
                '</button>' +
            '</div>';
        return wrapper;
    }

    function handleShareClick(btn) {
        var btnText = btn.querySelector('.optidrop-share-btn-text');
        if (!btnText) return;
        var originalText = btnText.textContent;
        if (btnText.textContent === SHARE_DONE) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(SHARE_URL).then(function () {
                flashSuccess(btn, btnText);
            }).catch(function () {
                fallbackCopyShare(btn, btnText);
            });
        } else {
            fallbackCopyShare(btn, btnText);
        }
    }

    function fallbackCopyShare(btn, btnText) {
        var ta = document.createElement('textarea');
        ta.value = SHARE_URL;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            flashSuccess(btn, btnText);
        } catch (e) {
            // silent fail
        }
        document.body.removeChild(ta);
    }

    function flashSuccess(btn, btnText) {
        btnText.textContent = SHARE_DONE;
        btn.classList.remove('bg-slate-100', 'hover:bg-slate-200', 'text-slate-700',
            'dark:bg-slate-700', 'dark:hover:bg-slate-600', 'dark:text-slate-200',
            'border-slate-200', 'dark:border-slate-600');
        btn.classList.add('bg-green-100', 'text-green-700', 'border-green-300',
            'dark:bg-green-900', 'dark:text-green-300', 'dark:border-green-700');
        setTimeout(function () {
            btnText.textContent = SHARE_BTN;
            btn.classList.remove('bg-green-100', 'text-green-700', 'border-green-300',
                'dark:bg-green-900', 'dark:text-green-300', 'dark:border-green-700');
            btn.classList.add('bg-slate-100', 'hover:bg-slate-200', 'text-slate-700',
                'dark:bg-slate-700', 'dark:hover:bg-slate-600', 'dark:text-slate-200',
                'border-slate-200', 'dark:border-slate-600');
        }, 2500);
    }

    // Target result containers — IDs that end with "result" or "Result"
    var RESULT_ID_PATTERNS = [
        'state-result', 'state-result', 'merge-state-result', 'heic-state-result',
        'pdf2jpg-state-result', 'resizer-state-result', 'stamper-state-result',
        'signature-state-result', 'ocr-state-result', 'stateResult'
    ];

    // Also target common result section classes/IDs on standalone tool pages
    var RESULT_SELECTORS = [
        '[id$="-result"]:not([id*="upload"]):not([id*="settings"])',
        '[id$="Result"]:not([id*="upload"]):not([id*="settings"])',
        '[id$="Results"]:not([id*="upload"]):not([id*="settings"])',
        '[id$="results"]:not([id*="upload"]):not([id*="settings"])',
        '[id="resultSection"]',
        '[id="results"]',
        '[id="resultArea"]',
        '#resultSection',
        '#results',
        '#resultArea',
        '[id*="ResultSection"]',
        '[id*="resultSection"]'
    ];

    function injectShareBars() {
        // Inject into known result state containers
        var selector = RESULT_SELECTORS.join(', ');
        document.querySelectorAll(selector).forEach(function (el) {
            if (el.querySelector('.optidrop-share-bar')) return;
            // Only inject if the element is currently visible
            if (el.classList.contains('hidden')) return;
            if (el.style.display === 'none') return;
            var bar = createShareBar();
            el.appendChild(bar);
            // Attach click handler
            var btn = bar.querySelector('.optidrop-share-btn');
            if (btn) {
                btn.addEventListener('click', function () { handleShareClick(btn); });
            }
        });
    }

    // Use MutationObserver to detect when result containers become visible
    var observer = null;

    function startObserving() {
        if (observer) return;
        if (typeof MutationObserver === 'undefined') return;

        observer = new MutationObserver(function (mutations) {
            var shouldInject = false;
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) {
                    var el = m.target;
                    // Check if a result-container-like element just became visible
                    var id = el.id || '';
                    var hasResultId = id.toLowerCase().indexOf('result') !== -1;
                    var isVisible = !el.classList.contains('hidden') && el.style.display !== 'none';
                    if (hasResultId && isVisible) {
                        shouldInject = true;
                        break;
                    }
                }
                if (m.type === 'childList' && m.addedNodes.length > 0) {
                    for (var j = 0; j < m.addedNodes.length; j++) {
                        var node = m.addedNodes[j];
                        if (node.nodeType !== 1) continue;
                        var nid = node.id || '';
                        if (nid.indexOf('result') !== -1 || nid.indexOf('Result') !== -1) {
                            shouldInject = true;
                            break;
                        }
                    }
                }
                if (shouldInject) break;
            }
            if (shouldInject) {
                // Small delay to let DOM settle
                setTimeout(injectShareBars, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // Initial injection on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            injectShareBars();
            startObserving();
        });
    } else {
        injectShareBars();
        startObserving();
    }

    // Also expose globally so tool scripts can call it after dynamic result rendering
    window.injectShareBar = function (container) {
        if (!container) return;
        if (container.querySelector('.optidrop-share-bar')) return;
        var bar = createShareBar();
        container.appendChild(bar);
        var btn = bar.querySelector('.optidrop-share-btn');
        if (btn) {
            btn.addEventListener('click', function () { handleShareClick(btn); });
        }
    };
})();
