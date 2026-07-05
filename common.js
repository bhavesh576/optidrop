/* =========================================================
   OptiDrop — common.js (Shared across all pages)
   Performance: Non-critical features deferred via
   requestIdleCallback. Heavy DOM (command palette, FAB,
   share-bar observer) only created when the browser is idle.
   ========================================================= */

// ── Supabase via native fetch (no CDN dependency) ─────────
async function submitUserReview(name, message, toolName) {
    var supabaseUrl = 'https://ujbldzjuzmvhgqkxyslz.supabase.co';
    var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbXN0cml3eGRyeXJxZWxmZnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjcwNTgsImV4cCI6MjA5ODg0MzA1OH0.t3sblfMlr_-eB7GAV2mBZFWD00y-k_ygTcAjneBJquo';

    try {
        var response = await fetch(supabaseUrl + '/rest/v1/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': 'Bearer ' + supabaseKey,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                name: name,
                message: message,
                tool: toolName,
                date: new Date().toLocaleDateString()
            })
        });

        if (!response.ok) throw new Error('Database rejected the request');

        if (typeof showToast === 'function') showToast('Thank you for your review!', 'success');
    } catch (error) {
        console.error('Fetch Error:', error);
        if (typeof showToast === 'function') showToast('Error submitting review', 'error');
    }
}

/* =========================================================
   ========================================================= */

// Signal JS is enabled — CSS uses html.js to hide <noscript>
document.documentElement.classList.add('js');
// Remove noscript from DOM entirely — it has inline styles (margin:2rem, padding:2rem)
// that can cause layout gaps before CSS hides it. With JS on, noscript is pointless.
(function(){ var ns = document.querySelector('noscript'); if (ns) ns.remove(); })();

// Polyfill requestIdleCallback for Safari
var _ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };

// ── Service Worker Registration (PWA Support) ──────────────
(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
    }
})();

// ── Dark Mode (Feature 6) ───────────────────────────────────
(function () {
    try {
        var saved = localStorage.getItem('optidrop_dark_mode');
        if (saved === '1') {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else if (!saved) {
            // Auto-detect system preference on first visit
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('optidrop_dark_mode', '1');
            }
        }
    } catch (e) {}
})();

// ── Hreflang Tags ───────────────────────────────────────────
(function () {
    try {
        var url = window.location.href;
        var link1 = document.createElement('link');
        link1.rel = 'alternate';
        link1.hreflang = 'en-in';
        link1.href = url;
        document.head.appendChild(link1);
        var link2 = document.createElement('link');
        link2.rel = 'alternate';
        link2.hreflang = 'en';
        link2.href = url;
        document.head.appendChild(link2);
        var link3 = document.createElement('link');
        link3.rel = 'alternate';
        link3.hreflang = 'x-default';
        link3.href = url;
        document.head.appendChild(link3);
    } catch (e) {}
})();

// ── Skip to Content Link ────────────────────────────────────
(function () {
    var skip = document.createElement('a');
    skip.href = '#main-content';
    skip.textContent = 'Skip to main content';
    skip.className = 'skip-link';
    document.body.insertBefore(skip, document.body.firstChild);
    // Add id to main content area
    var main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';
})();

// ── Analytics Event Tracking ─────────────────────────────────
window.OptiTrack = {
    toolStarted: function (name, cat) {
        if (typeof gtag === 'function') gtag('event', 'tool_started', { tool_name: name, tool_category: cat });
    },
    toolCompleted: function (name, output) {
        if (typeof gtag === 'function') gtag('event', 'tool_completed', { tool_name: name, output_type: output });
    },
    downloadDone: function (name, fmt) {
        if (typeof gtag === 'function') gtag('event', 'download_completed', { tool_name: name, file_format: fmt });
    },
    searchUsed: function (query, count) {
        if (typeof gtag === 'function') gtag('event', 'search_used', { search_query: query.slice(0, 50), result_count: count });
    }
};

// ── Canonical Tag Cleanup ────────────────────────────────────
// Ensure canonical URL points to clean base path (no query params or hash)
(function () {
    try {
        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            var cleanUrl = canonical.href.split('?')[0].split('#')[0];
            if (canonical.href !== cleanUrl) {
                canonical.href = cleanUrl;
            }
        }
    } catch (e) {}
})();

// ── Footer Year ──────────────────────────────────────────────
(function () {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
})();

// ════════════════════════════════════════════════════════════
// MEGA MENU NAVIGATION — Injected on every page
// ════════════════════════════════════════════════════════════
(function () {
    var NAV_HTML = '<header class="site-header">' +
        '<div class="header-inner">' +
            '<a href="/" class="logo-text">' +
                '<svg class="logo-mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">' +
                    '<path d="M16 2C16 2 6 14 6 20a10 10 0 0020 0C26 14 16 2 16 2z" fill="#e91e63"/>' +
                    '<path d="M11 18h10M13 21h6" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>' +
                '</svg>' +
                'Opti<span>Drop</span></a>' +
            '<nav class="header-nav">' +
                '<a href="/tools.html" class="nav-all-tools hide-mobile"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg> All Tools</a>' +
                '<div class="nav-categories hide-mobile">' +
                    '<span class="nav-link">Categories <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></span>' +
                    '<div class="mega-menu">' +
                        '<div class="mega-menu-inner">' +
                            '<div class="mega-menu-group"><h3>🖼️ Document Tools</h3>' +
                                '<a href="/category/image-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Image Tools</span><span class="mm-count">10+ tools</span></span></a>' +
                                '<a href="/category/pdf-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">PDF Tools</span><span class="mm-count">15+ tools</span></span></a>' +
                                '<a href="/category/text-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Text Tools</span><span class="mm-count">30+ tools</span></span></a>' +
                            '</div>' +
                            '<div class="mega-menu-group"><h3>💼 Work Tools</h3>' +
                                '<a href="/category/career-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Career & Resume</span><span class="mm-count">5+ tools</span></span></a>' +
                                '<a href="/category/business-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Business Documents</span><span class="mm-count">15+ tools</span></span></a>' +
                                '<a href="/category/professional-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Professional Tools</span><span class="mm-count">5+ tools</span></span></a>' +
                            '</div>' +
                            '<div class="mega-menu-group"><h3>🧮 Calculators & Tech</h3>' +
                                '<a href="/category/calculator-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Calculator Tools</span><span class="mm-count">50+ tools</span></span></a>' +
                                '<a href="/category/developer-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Developer Tools</span><span class="mm-count">35+ tools</span></span></a>' +
                                '<a href="/category/utility-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Utility Tools</span><span class="mm-count">30+ tools</span></span></a>' +
                            '</div>' +
                            '<div class="mega-menu-group"><h3>🌿 Life & Wellness</h3>' +
                                '<a href="/category/health-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Health & Fitness</span><span class="mm-count">15+ tools</span></span></a>' +
                                '<a href="/category/education-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Education</span><span class="mm-count">20+ tools</span></span></a>' +
                                '<a href="/category/fitness-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Fitness</span><span class="mm-count">5+ tools</span></span></a>' +
                                '<a href="/category/travel-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Travel</span><span class="mm-count">5+ tools</span></span></a>' +
                            '</div>' +
                            '<div class="mega-menu-group"><h3>🏠 Creative & Home</h3>' +
                                '<a href="/category/productivity-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Productivity</span><span class="mm-count">5+ tools</span></span></a>' +
                                '<a href="/category/design-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Design</span><span class="mm-count">20+ tools</span></span></a>' +
                                '<a href="/category/home-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Home & DIY</span><span class="mm-count">5+ tools</span></span></a>' +
                                '<a href="/category/fun-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Fun & Games</span><span class="mm-count">15+ tools</span></span></a>' +
                                '<a href="/category/parenting-tools.html" class="mega-menu-item"><span class="mm-info"><span class="mm-name">Parenting</span><span class="mm-count">5+ tools</span></span></a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="mega-menu-footer"><a href="/tools.html">Browse All Tools →</a></div>' +
                    '</div>' +
                '</div>' +
                '<a href="/blog/" class="hide-mobile">Blog</a>' +
                '<a href="/review.html" class="hide-mobile">Reviews</a>' +
                '<a href="/about.html" class="hide-mobile">About</a>' +
                '<a href="/contact.html" class="nav-feedback-btn hide-mobile"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>Feedback</a>' +
                '<span class="privacy-badge"><span class="dot"></span> <span>100% Private</span></span>' +
                '<span class="kbd-hint hide-mobile" onclick="document.dispatchEvent(new KeyboardEvent(\'keydown\',{key:\'k\',ctrlKey:true}))"><kbd>/</kbd> Tools</span>' +
                '<div class="user-hub hide-mobile">' +
                    '<button class="user-hub-trigger" aria-label="User menu" title="Your tools">' +
                        '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>' +
                    '</button>' +
                    '<div class="user-hub-dropdown">' +
                        '<div class="user-hub-tabs">' +
                            '<button class="user-hub-tab active" data-tab="recent">Recently Used</button>' +
                            '<button class="user-hub-tab" data-tab="saved">Saved Tools</button>' +
                        '</div>' +
                        '<div class="user-hub-panel" data-panel="recent">' +
                            '<div class="user-hub-empty">No recently used tools yet.<br><span>Start using tools and they\'ll appear here.</span></div>' +
                        '</div>' +
                        '<div class="user-hub-panel" data-panel="saved" style="display:none;">' +
                            '<div class="user-hub-empty">No saved tools yet.<br><span>Click the ☆ icon on any tool page to save it.</span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<button class="mobile-menu-toggle" aria-label="Menu">' +
                    '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
                '</button>' +
            '</nav>' +
        '</div>' +
        '<nav class="mobile-nav">' +
            '<a href="/">Home</a>' +
            '<a href="/tools.html">All Tools</a>' +
            '<div class="mobile-accordion">' +
                '<button class="mobile-accordion-trigger">Categories <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button>' +
                '<div class="mobile-accordion-content">' +
                    '<a href="/category/image-tools.html">Image Tools</a>' +
                    '<a href="/category/pdf-tools.html">PDF Tools</a>' +
                    '<a href="/category/text-tools.html">Text Tools</a>' +
                    '<a href="/category/career-tools.html">Career & Resume</a>' +
                    '<a href="/category/business-tools.html">Business Documents</a>' +
                    '<a href="/category/professional-tools.html">Professional Tools</a>' +
                    '<a href="/category/calculator-tools.html">Calculator Tools</a>' +
                    '<a href="/category/developer-tools.html">Developer Tools</a>' +
                    '<a href="/category/utility-tools.html">Utility Tools</a>' +
                    '<a href="/category/health-tools.html">Health & Fitness</a>' +
                    '<a href="/category/education-tools.html">Education</a>' +
                    '<a href="/category/fitness-tools.html">Fitness</a>' +
                    '<a href="/category/travel-tools.html">Travel</a>' +
                    '<a href="/category/productivity-tools.html">Productivity</a>' +
                    '<a href="/category/design-tools.html">Design</a>' +
                    '<a href="/category/home-tools.html">Home & DIY</a>' +
                    '<a href="/category/fun-tools.html">Fun & Games</a>' +
                    '<a href="/category/parenting-tools.html">Parenting</a>' +
                '</div>' +
            '</div>' +
            '<a href="/blog/">Blog</a>' +
            '<a href="/review.html">Reviews</a>' +
            '<a href="/about.html">About</a>' +
            '<a href="/contact.html">Give Feedback</a>' +
        '</nav>' +
    '</header>';

    function injectNavbar() {
        var existingHeader = document.querySelector('.site-header');
        if (existingHeader) {
            var temp = document.createElement('div');
            temp.innerHTML = NAV_HTML;
            existingHeader.parentNode.replaceChild(temp.firstChild, existingHeader);
        }
        // Initialize mobile hamburger toggle
        var toggle = document.querySelector('.mobile-menu-toggle');
        var mobileNav = document.querySelector('.mobile-nav');
        if (toggle && mobileNav) {
            toggle.addEventListener('click', function () {
                mobileNav.classList.toggle('open');
            });
        }
        // Initialize mobile accordion
        var accordionTrigger = document.querySelector('.mobile-accordion-trigger');
        if (accordionTrigger) {
            accordionTrigger.addEventListener('click', function () {
                this.parentElement.classList.toggle('open');
            });
        }

        // Initialize User Hub dropdown
        var userHub = document.querySelector('.user-hub');
        var userHubTrigger = document.querySelector('.user-hub-trigger');
        if (userHub && userHubTrigger) {
            userHubTrigger.addEventListener('click', function (e) {
                e.stopPropagation();
                userHub.classList.toggle('open');
            });
            document.addEventListener('click', function (e) {
                if (!userHub.contains(e.target)) userHub.classList.remove('open');
            });
            // Tab switching
            var hubTabs = userHub.querySelectorAll('.user-hub-tab');
            var hubPanels = userHub.querySelectorAll('.user-hub-panel');
            hubTabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    hubTabs.forEach(function (t) { t.classList.remove('active'); });
                    hubPanels.forEach(function (p) { p.style.display = 'none'; });
                    tab.classList.add('active');
                    var target = userHub.querySelector('.user-hub-panel[data-panel="' + tab.getAttribute('data-tab') + '"]');
                    if (target) target.style.display = '';
                });
            });
            // Populate Recent Tools
            populateUserHub();
        }
    }

    function populateUserHub() {
        var recentPanel = document.querySelector('.user-hub-panel[data-panel="recent"]');
        var savedPanel = document.querySelector('.user-hub-panel[data-panel="saved"]');
        if (!recentPanel || !savedPanel) return;

        // Load recent tools from localStorage (format: { name, path, time })
        try {
            var recent = JSON.parse(localStorage.getItem('optidrop_recent_tools') || '[]');
            if (recent.length > 0) {
                var html = '';
                recent.slice(0, 8).forEach(function (tool) {
                    if (!tool.path || !tool.name || tool.path.charAt(0) !== '/') return;
                    // Look up category from allToolsData
                    var cat = '';
                    if (typeof allToolsData !== 'undefined') {
                        var match = allToolsData.find(function (t) { return t.h === tool.path; });
                        if (match) cat = match.c || '';
                    }
                    html += '<a href="' + tool.path + '" class="user-hub-item">' +
                        '<span class="user-hub-item-name">' + tool.name + '</span>' +
                        (cat ? '<span class="user-hub-item-cat">' + cat + '</span>' : '') +
                    '</a>';
                });
                if (html) recentPanel.innerHTML = html;
            }
        } catch (e) {}

        // Load saved/favorited tools from localStorage
        try {
            var saved = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.indexOf('optidrop_fav_') === 0) {
                    var toolPath = key.replace('optidrop_fav_', '');
                    var toolData = null;
                    if (typeof allToolsData !== 'undefined') {
                        toolData = allToolsData.find(function (t) { return t.h === toolPath; });
                    }
                    if (toolData) {
                        saved.push(toolData);
                    } else {
                        var displayName = toolPath.split('/').pop().replace('.html', '').replace(/-/g, ' ');
                        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                        saved.push({ n: displayName, h: toolPath, c: '' });
                    }
                }
            }
            if (saved.length > 0) {
                var savedHtml = '';
                saved.forEach(function (tool) {
                    savedHtml += '<a href="' + tool.h + '" class="user-hub-item">' +
                        '<span class="user-hub-item-name">' + tool.n + '</span>' +
                        (tool.c ? '<span class="user-hub-item-cat">' + tool.c + '</span>' : '') +
                    '</a>';
                });
                savedPanel.innerHTML = savedHtml;
            }
        } catch (e) {}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNavbar);
    } else {
        injectNavbar();
    }
})();

// ════════════════════════════════════════════════════════════
// COMPACT FOOTER — Injected on every page
// ════════════════════════════════════════════════════════════
(function () {
    var FOOTER_HTML = '<footer class="site-footer">' +
        '<div class="footer-inner">' +
            '<div class="footer-grid">' +
                '<div class="footer-col footer-about">' +
                    '<h4>OptiDrop</h4>' +
                    '<p>Free, fast, and 100% private browser-based tools. <span data-tool-count>300+</span> tools for images, PDFs, resumes, invoices, calculators, developers, health, and more.</p>' +
                    '<p style="margin-top:0.75rem;font-size:0.75rem;color:#94a3b8;">© <span id="year"></span> OptiDrop. All rights reserved.</p>' +
                '</div>' +
                '<div class="footer-col">' +
                    '<h4>Quick Links</h4>' +
                    '<a href="/">Home</a>' +
                    '<a href="/tools.html">All Tools</a>' +
                    '<a href="/blog/">Blog</a>' +
                    '<a href="/about.html">About</a>' +
                    '<a href="/contact.html">Contact</a>' +
                    '<a href="/contact.html#feedback">Feedback</a>' +
                    '<a href="/review.html">Leave a Review</a>' +
                    '<a href="/privacy-policy.html">Privacy Policy</a>' +
                '</div>' +
                '<div class="footer-col">' +
                    '<h4>Top Tools</h4>' +
                    '<a href="/compress-image.html">Image Compressor</a>' +
                    '<a href="/heic-to-jpg.html">HEIC to JPG</a>' +
                    '<a href="/jpg-to-pdf.html">JPG to PDF</a>' +
                    '<a href="/tools/career/resume-builder.html">Resume Builder</a>' +
                    '<a href="/tools/business/invoice-generator.html">Invoice Generator</a>' +
                    '<a href="/tools/emi-calculator.html">EMI Calculator</a>' +
                '</div>' +
                '<div class="footer-col">' +
                    '<h4>Categories</h4>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0;">' +
                        '<a href="/category/image-tools.html">Image Tools</a>' +
                        '<a href="/category/pdf-tools.html">PDF Tools</a>' +
                        '<a href="/category/text-tools.html">Text Tools</a>' +
                        '<a href="/category/career-tools.html">Career Tools</a>' +
                        '<a href="/category/business-tools.html">Business Tools</a>' +
                        '<a href="/category/professional-tools.html">Professional</a>' +
                        '<a href="/category/calculator-tools.html">Calculators</a>' +
                        '<a href="/category/developer-tools.html">Developer</a>' +
                        '<a href="/category/utility-tools.html">Utility</a>' +
                        '<a href="/category/health-tools.html">Health</a>' +
                        '<a href="/category/education-tools.html">Education</a>' +
                        '<a href="/category/fitness-tools.html">Fitness</a>' +
                        '<a href="/category/travel-tools.html">Travel</a>' +
                        '<a href="/category/productivity-tools.html">Productivity</a>' +
                        '<a href="/category/design-tools.html">Design</a>' +
                        '<a href="/category/home-tools.html">Home & DIY</a>' +
                        '<a href="/category/fun-tools.html">Fun & Games</a>' +
                        '<a href="/category/parenting-tools.html">Parenting</a>' +
                    '</div>' +
                '</div>' +
                '<div class="footer-col">' +
                    '<h4>Trust</h4>' +
                    '<a href="/privacy-policy.html" style="display:flex;align-items:center;gap:0.375rem;">✓ 100% Private</a>' +
                    '<a href="/about.html" style="display:flex;align-items:center;gap:0.375rem;">✓ No Upload Required</a>' +
                    '<a href="/about.html" style="display:flex;align-items:center;gap:0.375rem;">✓ No Sign-Up</a>' +
                    '<a href="/about.html" style="display:flex;align-items:center;gap:0.375rem;">✓ Works Globally</a>' +
                '</div>' +
            '</div>' +
            '<div class="footer-bottom">' +
                '<p></p>' +
                '<div class="footer-links">' +
                    '<a href="/privacy-policy.html">Privacy Policy</a>' +
                    '<a href="/terms.html">Terms</a>' +
                    '<a href="/contact.html">Contact</a>' +
                    '<a href="/review.html">Leave a Review</a>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</footer>';

    function injectFooter() {
        var existingFooter = document.querySelector('.site-footer');
        if (existingFooter) {
            var temp = document.createElement('div');
            temp.innerHTML = FOOTER_HTML;
            existingFooter.parentNode.replaceChild(temp.firstChild, existingFooter);
        }
        // Set year
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooter);
    } else {
        injectFooter();
    }
})();

// ════════════════════════════════════════════════════════════
// ADSENSE HIGH-VALUE CONTENT ENGINE
// Dynamically injects SEO documentation, FAQ accordion, and
// FAQPage JSON-LD schema beneath tool widgets to satisfy
// Google AdSense "High-Value Content" policy requirements.
// ════════════════════════════════════════════════════════════
_ric(function () {
    var path = window.location.pathname;

    // Skip non-tool pages (homepage, tools directory, blog, category, static pages)
    var SKIP_PREFIXES = ['/', '/index.html', '/tools.html', '/blog/', '/category/', '/about', '/contact', '/privacy', '/terms', '/404', '/reindex'];
    var skip = SKIP_PREFIXES.some(function (p) {
        return path === p || (p !== '/' && path.indexOf(p) === 0);
    });
    // Also skip if path is exactly '/' (homepage)
    if (path === '/' || path === '/index.html') skip = true;
    if (skip) return;

    // ── Tool Content Database ─────────────────────────────────
    var TOOL_CONTENT_DB = {
        '/tools/emi-calculator.html': {
            name: 'EMI Calculator',
            about: [
                'The OptiDrop EMI Calculator is a comprehensive financial planning tool that helps you determine the exact monthly installment for any type of loan. Whether you are applying for a home loan, car loan, personal loan, or education loan, this calculator provides instant and accurate EMI calculations based on the principal amount, interest rate, and loan tenure.',
                'Understanding your EMI obligations before taking a loan is essential for sound financial planning. This calculator not only shows your monthly payment but also breaks down the total interest payable and the overall cost of the loan, empowering you to compare different loan offers and choose the most affordable option.'
            ],
            steps: [
                'Enter the total loan amount (principal) you wish to borrow in the designated input field.',
                'Input the annual interest rate offered by your lender. This is typically expressed as a percentage per annum.',
                'Specify the loan tenure in months or years — the duration over which you will repay the loan.',
                'Click the "Calculate EMI" button to instantly view your monthly installment, total interest, and total payment amount.',
                'Use the share button to copy a link with your calculation parameters for future reference or to share with others.'
            ],
            faqs: [
                { q: 'What is EMI and how is it calculated?', a: 'EMI stands for Equated Monthly Installment. It is the fixed amount you pay every month toward your loan. The formula used is: EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P is the principal, R is the monthly interest rate, and N is the number of installments.' },
                { q: 'Can I use this calculator for home loans and car loans?', a: 'Yes. This EMI calculator works for all fixed-rate loan types including home loans, car loans, personal loans, education loans, and gold loans. Simply enter the loan amount, interest rate, and tenure specific to your loan.' },
                { q: 'Does the EMI amount change during the loan tenure?', a: 'For a fixed-rate loan, the EMI remains constant throughout the tenure. However, with floating-rate loans, the EMI may change when the bank revises the interest rate. This calculator assumes a fixed interest rate.' },
                { q: 'Is my financial data safe when using this calculator?', a: 'Absolutely. All calculations happen directly in your browser using JavaScript. No data is sent to any server, ensuring complete privacy and security of your financial information.' }
            ]
        },
        '/tools/gst-calculator.html': {
            name: 'GST Calculator',
            about: [
                'The OptiDrop GST Calculator simplifies Goods and Services Tax calculations for businesses and consumers across India. It supports all standard GST rates — 5%, 12%, 18%, and 28% — and can calculate both the GST amount to add to a base price and the GST component embedded in an inclusive price.',
                'Whether you are a business owner generating invoices, a freelancer quoting project fees, or a consumer checking the tax breakdown on a purchase, this tool provides instant and accurate results. It eliminates the need for manual calculations and reduces the risk of errors in tax computation.'
            ],
            steps: [
                'Enter the base amount (before tax) or the total amount (GST-inclusive) in the input field.',
                'Select the applicable GST rate from the available options: 5%, 12%, 18%, or 28%.',
                'Choose whether you want to add GST to the amount or extract GST from an inclusive price.',
                'Click "Calculate" to view the GST amount, net price, and gross total instantly.',
                'Copy the results for use in invoices, quotations, or financial records.'
            ],
            faqs: [
                { q: 'What are the different GST rates in India?', a: 'India has four primary GST slabs: 5% (essential goods), 12% (processed food, business class air tickets), 18% (most goods and services), and 28% (luxury items, automobiles). The applicable rate depends on the product or service category.' },
                { q: 'How do I calculate GST-inclusive price?', a: 'To extract GST from an inclusive price, use the formula: GST Amount = Total Amount × (GST Rate / (100 + GST Rate)). Our calculator handles this automatically when you select the "GST Inclusive" option.' },
                { q: 'Is this GST calculator applicable for all states?', a: 'Yes. GST is a unified national tax, so the rates are the same across all Indian states. For intra-state transactions, GST is split into CGST and SGST; for inter-state transactions, IGST applies at the same combined rate.' }
            ]
        },
        '/tools/age-calculator.html': {
            name: 'Age Calculator',
            about: [
                'The OptiDrop Age Calculator computes your exact age in years, months, and days from your date of birth to today or any specified date. It goes beyond simple year calculations to give you precise results that account for varying month lengths and leap years.',
                'This tool is useful for verifying age eligibility for exams, government services, insurance policies, and retirement planning. It also shows your age in total days, hours, and minutes for a fun and detailed perspective on your life timeline.'
            ],
            steps: [
                'Enter your date of birth using the date picker or by typing in DD/MM/YYYY format.',
                'Optionally, select a specific end date if you want to calculate age as of a past or future date.',
                'Click "Calculate Age" to see your exact age broken down into years, months, and days.',
                'View additional statistics like your next birthday countdown, total days lived, and zodiac sign.'
            ],
            faqs: [
                { q: 'How accurate is this age calculator?', a: 'The calculator is 100% accurate. It accounts for leap years, varying month lengths (28–31 days), and calculates the precise difference between two calendar dates down to the exact day.' },
                { q: 'Can I calculate age for a future date?', a: 'Yes. Simply select a future end date to find out how old you will be on that specific date. This is useful for retirement planning or eligibility checks.' },
                { q: 'Does this calculator account for leap years?', a: 'Absolutely. The calculation algorithm correctly handles leap years (including century leap year rules), ensuring accurate results for any date range.' }
            ]
        },
        '/tools/percentage-calculator.html': {
            name: 'Percentage Calculator',
            about: [
                'The OptiDrop Percentage Calculator handles all types of percentage computations in one place. From basic percentage-of-a-number calculations to complex percentage increase, decrease, and difference problems, this tool delivers instant and accurate results.',
                'Students, professionals, and business owners use this calculator for tasks like calculating exam scores, profit margins, discount percentages, tax rates, and statistical analysis. The intuitive interface makes even complex percentage problems simple to solve.'
            ],
            steps: [
                'Select the type of percentage calculation you need: percentage of a number, percentage change, or what percentage one number is of another.',
                'Enter the required values in the input fields provided.',
                'Click "Calculate" to get the result instantly with a clear breakdown of the computation.',
                'Use the share button to save or share your calculation with others.'
            ],
            faqs: [
                { q: 'How do I calculate percentage increase or decrease?', a: 'Percentage change = ((New Value − Old Value) / Old Value) × 100. A positive result indicates an increase; a negative result indicates a decrease. Our calculator handles this automatically.' },
                { q: 'Can I calculate what percentage one number is of another?', a: 'Yes. Use the "X is what percent of Y" mode. The formula is: (X / Y) × 100. For example, 45 is what percent of 60? Answer: 75%.' },
                { q: 'How do I calculate a discount percentage?', a: 'Enter the original price and the discounted price into the percentage change calculator. The result will show the discount percentage. You can also use the percentage-of-a-number mode to calculate the discount amount directly.' }
            ]
        },
        '/tools/bmi-calculator.html': {
            name: 'BMI Calculator',
            about: [
                'The OptiDrop BMI Calculator computes your Body Mass Index using the internationally recognized formula: weight (kg) divided by height squared (m²). It classifies your result into standard health categories — underweight, normal weight, overweight, and obese — based on WHO guidelines.',
                'BMI is a widely used screening tool to assess whether your weight is in a healthy range relative to your height. While it does not directly measure body fat, it provides a reliable general indicator used by healthcare professionals worldwide for initial health assessments.'
            ],
            steps: [
                'Enter your weight in kilograms (kg) or pounds (lbs) using the unit toggle.',
                'Enter your height in centimeters (cm) or feet and inches.',
                'Click "Calculate BMI" to see your BMI value and health category classification.',
                'Review the BMI chart reference to understand where your result falls within the standard ranges.'
            ],
            faqs: [
                { q: 'What is a healthy BMI range?', a: 'According to the World Health Organization (WHO), a BMI between 18.5 and 24.9 is considered normal and healthy. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is classified as obese.' },
                { q: 'Is BMI accurate for all body types?', a: 'BMI is a useful screening tool but has limitations. It may overestimate body fat in athletes with high muscle mass and underestimate it in older adults with reduced muscle. For a complete health assessment, consult a healthcare professional.' },
                { q: 'Does this calculator support both metric and imperial units?', a: 'Yes. You can switch between metric (kg/cm) and imperial (lbs/ft-in) units using the toggle provided. The calculator converts units automatically for accurate results.' }
            ]
        },
        '/tools/calculators/sip-calculator.html': {
            name: 'SIP Calculator',
            about: [
                'The OptiDrop SIP Calculator helps you estimate the returns on your Systematic Investment Plan (SIP) in mutual funds. By entering your monthly investment amount, expected annual return rate, and investment duration, you can see the projected maturity value and total wealth gained.',
                'SIP is one of the most popular investment strategies in India, allowing you to invest a fixed amount regularly in mutual funds. This calculator uses the future value of annuity formula to project how your investments will grow over time through the power of compounding and rupee cost averaging.'
            ],
            steps: [
                'Enter the amount you plan to invest each month in your SIP.',
                'Input the expected annual rate of return (typically 10–15% for equity mutual funds over the long term).',
                'Specify the investment duration in years.',
                'Click "Calculate" to view the total invested amount, estimated returns, and projected maturity value.'
            ],
            faqs: [
                { q: 'What is a SIP in mutual funds?', a: 'SIP stands for Systematic Investment Plan. It allows you to invest a fixed amount at regular intervals (usually monthly) in a mutual fund scheme. SIPs benefit from rupee cost averaging and the power of compounding over long periods.' },
                { q: 'What is a realistic expected return rate for SIP?', a: 'Historically, equity mutual funds in India have delivered 12–15% average annual returns over 10+ year periods. Conservative estimates of 10–12% are commonly used for planning. Debt mutual funds typically offer 6–8% returns.' },
                { q: 'Can I stop or modify my SIP anytime?', a: 'Yes. Most mutual fund houses allow you to pause, increase, decrease, or stop your SIP at any time without penalties. This flexibility is one of the key advantages of SIP investing.' }
            ]
        },
        '/tools/calculators/income-tax-calculator.html': {
            name: 'Income Tax Calculator',
            about: [
                'The OptiDrop Income Tax Calculator helps Indian taxpayers estimate their income tax liability for the financial year 2025-26 under both the old and new tax regimes. It accounts for all applicable deductions, exemptions, and surcharges to give you an accurate tax estimate.',
                'Choosing between the old and new tax regime can significantly impact your take-home income. This calculator compares both regimes side-by-side, showing you which option results in lower tax liability based on your specific income and deduction profile.'
            ],
            steps: [
                'Enter your gross annual income from all sources (salary, business, rental, etc.).',
                'Under the old regime section, input your eligible deductions such as Section 80C (up to ₹1.5 lakh), HRA, home loan interest, and NPS contributions.',
                'Click "Calculate Tax" to see a detailed comparison of tax liability under both regimes.',
                'Review the breakdown showing taxable income, tax slabs applied, cess, and the final tax payable amount.'
            ],
            faqs: [
                { q: 'Which is better — old tax regime or new tax regime?', a: 'It depends on your deductions. If your total deductions exceed ₹3.75 lakh (for salaried individuals), the old regime is usually better. If you have minimal deductions, the new regime with lower tax rates may be more beneficial. Use this calculator to compare both.' },
                { q: 'What is the standard deduction for FY 2025-26?', a: 'Under the new tax regime, the standard deduction is ₹75,000 for salaried individuals. Under the old regime, it is ₹50,000. This deduction is available automatically without any investment.' },
                { q: 'Is this calculator updated for the latest tax slabs?', a: 'Yes. This calculator is updated for the Financial Year 2025-26 (Assessment Year 2026-27) and includes the latest tax slabs, surcharges, and health & education cess as per the Union Budget.' }
            ]
        },
        '/tools/calculators/mortgage-calculator.html': {
            name: 'Mortgage Calculator',
            about: [
                'The OptiDrop Mortgage Calculator estimates your monthly mortgage payment based on the loan amount, interest rate, and loan term. It provides a complete amortization overview showing how much of each payment goes toward principal versus interest over the life of the loan.',
                'Understanding your mortgage obligations is critical before committing to a home purchase. This calculator helps you evaluate affordability, compare different loan scenarios, and plan your finances by showing the total cost of borrowing including all interest payments.'
            ],
            steps: [
                'Enter the total home loan amount you plan to borrow.',
                'Input the annual interest rate offered by your lender.',
                'Select the loan term (typically 15 or 30 years).',
                'Click "Calculate" to see your monthly payment, total interest, and total cost of the loan.'
            ],
            faqs: [
                { q: 'How is mortgage EMI calculated?', a: 'Mortgage EMI uses the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P is the loan principal, R is the monthly interest rate, and N is the total number of monthly payments.' },
                { q: 'Should I choose a 15-year or 30-year mortgage?', a: 'A 15-year mortgage has higher monthly payments but significantly lower total interest. A 30-year mortgage offers lower monthly payments but costs more in total interest. Choose based on your monthly budget and long-term financial goals.' },
                { q: 'What is the typical down payment required?', a: 'Most lenders require 10–20% of the property value as a down payment. A higher down payment reduces your loan amount, monthly EMI, and total interest cost.' }
            ]
        },
        '/tools/word-counter.html': {
            name: 'Word Counter',
            about: [
                'The OptiDrop Word Counter is a comprehensive text analysis tool that instantly counts words, characters, sentences, paragraphs, and estimates reading and speaking time. It processes text entirely in your browser, making it fast and completely private.',
                'Writers, students, content creators, and social media managers use this tool to meet word count requirements for essays, articles, tweets, meta descriptions, and other content formats. The real-time counting updates as you type or paste text.'
            ],
            steps: [
                'Paste or type your text into the text area provided.',
                'View the real-time statistics displayed below the input area: word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time.',
                'Use the clear button to reset and start with new text.',
                'Copy the analysis results or the processed text as needed.'
            ],
            faqs: [
                { q: 'How is word count calculated?', a: 'Words are counted by splitting the text on whitespace characters (spaces, tabs, line breaks). Consecutive whitespace is treated as a single separator. Punctuation attached to words is included as part of the word.' },
                { q: 'How is reading time estimated?', a: 'Reading time is calculated using an average reading speed of 200–250 words per minute for adults. Speaking time uses approximately 150 words per minute, which is the average pace for presentations and speeches.' },
                { q: 'Is there a character limit?', a: 'There is no strict character limit. The tool can handle very large texts including full research papers and book chapters. All processing happens locally in your browser for instant results.' }
            ]
        },
        '/tools/text-case-converter.html': {
            name: 'Text Case Converter',
            about: [
                'The OptiDrop Text Case Converter transforms text between multiple case formats instantly: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and more. It is an essential utility for developers, writers, and content editors.',
                'Whether you need to format a headline in title case, convert variable names to camelCase for code, or standardize text to lowercase for database entries, this tool handles all common case transformations in a single click.'
            ],
            steps: [
                'Paste or type your text into the input area.',
                'Select the desired output case format from the available options.',
                'The converted text appears instantly in the output area.',
                'Copy the result to your clipboard using the copy button.'
            ],
            faqs: [
                { q: 'What is the difference between Title Case and Sentence case?', a: 'Title Case capitalizes the first letter of every major word (e.g., "The Quick Brown Fox"). Sentence case capitalizes only the first letter of the first word in each sentence (e.g., "The quick brown fox").' },
                { q: 'What are camelCase and snake_case?', a: 'camelCase joins words with no separator and capitalizes each word boundary (e.g., "myVariableName"). snake_case joins words with underscores and uses all lowercase (e.g., "my_variable_name"). Both are common naming conventions in programming.' },
                { q: 'Does the tool preserve line breaks and formatting?', a: 'Yes. Line breaks, paragraph spacing, and other structural formatting are preserved during the case conversion. Only the letter casing is modified.' }
            ]
        },
        '/tools/password-generator.html': {
            name: 'Password Generator',
            about: [
                'The OptiDrop Password Generator creates cryptographically strong, random passwords directly in your browser. You can customize the password length and character types (uppercase, lowercase, numbers, symbols) to meet specific security requirements for any website or application.',
                'Strong passwords are your first line of defense against unauthorized access. This tool uses the browser built-in crypto.getRandomValues() API to generate truly random passwords, not pseudo-random sequences, ensuring maximum security for your accounts.'
            ],
            steps: [
                'Set the desired password length using the slider (recommended: 16+ characters).',
                'Select which character types to include: uppercase letters, lowercase letters, numbers, and special symbols.',
                'Click "Generate Password" to create a new random password.',
                'Click the copy button to save the password to your clipboard, then paste it into the password field on the target website.'
            ],
            faqs: [
                { q: 'How strong is a randomly generated password?', a: 'A 16-character password with all character types has approximately 95^16 possible combinations — that is over 4 × 10^31 possibilities. Such passwords are practically unbreakable by brute force with current technology.' },
                { q: 'Is it safe to generate passwords in a browser?', a: 'Yes. This generator uses the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers. No data is sent to any server — everything runs locally.' },
                { q: 'How often should I change my passwords?', a: 'Security experts recommend changing passwords if you suspect a breach, after a service reports a data leak, or every 6–12 months for critical accounts. Using unique passwords for each account is more important than frequent changes.' }
            ]
        },
        '/tools/developer/json-formatter.html': {
            name: 'JSON Formatter',
            about: [
                'The OptiDrop JSON Formatter & Validator formats, beautifies, and validates JSON data instantly in your browser. It detects syntax errors, highlights the exact error location, and pretty-prints your JSON with proper indentation for easy reading and debugging.',
                'Developers use this tool daily to format API responses, debug configuration files, and validate JSON payloads before sending them to servers. The minify option compresses formatted JSON into a compact single-line format suitable for production use.'
            ],
            steps: [
                'Paste your raw JSON text into the input editor area.',
                'Click "Format / Beautify" to pretty-print the JSON with proper indentation and line breaks.',
                'If the JSON contains errors, the tool highlights the exact line and character position of the syntax issue.',
                'Use "Minify" to compress the formatted JSON back into a compact single-line string for production use.'
            ],
            faqs: [
                { q: 'What is JSON format?', a: 'JSON (JavaScript Object Notation) is a lightweight data interchange format that uses human-readable text to store and transmit data objects consisting of key-value pairs and arrays. It is the most common format for REST API responses.' },
                { q: 'Can this tool handle large JSON files?', a: 'Yes. The formatter can process large JSON documents including API responses with thousands of entries. All processing happens locally in your browser for instant results and complete privacy.' },
                { q: 'What is the difference between formatting and minifying?', a: 'Formatting (beautifying) adds indentation and line breaks to make JSON readable. Minifying removes all unnecessary whitespace to create the smallest possible file size, which is ideal for network transmission.' }
            ]
        },
        '/tools/career/resume-builder.html': {
            name: 'Resume Builder',
            about: [
                'The OptiDrop Resume Builder helps you create a professional, ATS-friendly resume in minutes. Choose from multiple modern templates, fill in your details using the guided form, and download a polished PDF resume ready for job applications.',
                'Every section is designed to pass Applicant Tracking Systems (ATS) used by major employers. The builder includes sections for personal details, work experience, education, skills, projects, and certifications — all formatted to industry standards.'
            ],
            steps: [
                'Select a resume template from the available professional designs.',
                'Fill in your personal information: name, email, phone number, and LinkedIn profile.',
                'Add your work experience entries with job title, company name, duration, and key responsibilities.',
                'Enter your education details, technical skills, and any certifications or projects.',
                'Preview the resume and click "Download PDF" to save a print-ready copy.'
            ],
            faqs: [
                { q: 'Is this resume builder really free?', a: 'Yes, completely free with no hidden charges. You can create, edit, and download unlimited resumes without signing up or providing payment information.' },
                { q: 'Are the resumes ATS-friendly?', a: 'Yes. All templates use clean formatting with standard section headings that Applicant Tracking Systems can easily parse. Avoid using tables, graphics, or unusual fonts for best ATS compatibility.' },
                { q: 'Can I edit my resume after downloading?', a: 'Your resume data is automatically saved in your browser. You can return to the tool anytime to make changes and download an updated version. We recommend re-downloading after any edits.' }
            ]
        },
        '/tools/business/invoice-generator.html': {
            name: 'Invoice Generator',
            about: [
                'The OptiDrop Invoice Generator creates professional, GST-compliant invoices for freelancers, small businesses, and service providers. It supports automatic tax calculations, itemized billing, discount application, and generates print-ready PDF invoices.',
                'Whether you need a simple receipt or a detailed commercial invoice with multiple line items, this tool handles it all. All calculations — subtotal, tax, discount, and grand total — are computed automatically as you enter line items.'
            ],
            steps: [
                'Enter your business details: company name, address, GSTIN, and contact information.',
                'Add the client or customer details including their name, address, and GSTIN (if applicable).',
                'Add line items with description, quantity, unit price, and applicable tax rate for each item.',
                'Review the auto-calculated subtotal, tax breakdown, discounts, and grand total.',
                'Click "Download PDF" to generate a professional invoice ready for sending.'
            ],
            faqs: [
                { q: 'Can I add GST to my invoices?', a: 'Yes. The invoice generator supports GST calculations at all standard rates (5%, 12%, 18%, 28%). It automatically splits GST into CGST and SGST for intra-state transactions or applies IGST for inter-state transactions.' },
                { q: 'Can I customize the invoice number?', a: 'Yes. You can set a custom invoice number prefix and starting number. The generator also auto-increments invoice numbers for sequential billing.' },
                { q: 'Is the invoice legally valid?', a: 'The generated invoice contains all fields required for a valid tax invoice under GST rules. However, you should verify compliance with your local tax regulations and consult a chartered accountant for specific legal advice.' }
            ]
        },
        '/tools/pdf/pdf-merger.html': {
            name: 'PDF Merger',
            about: [
                'The OptiDrop PDF Merger combines multiple PDF files into a single document in seconds. Simply upload your PDFs, arrange them in the desired order, and download the merged file. The entire process happens in your browser — no file uploads to external servers.',
                'This tool is perfect for combining invoices, merging report chapters, consolidating signed documents, or creating a single PDF from multiple scanned pages. You can drag and drop files to reorder them before merging.'
            ],
            steps: [
                'Upload two or more PDF files using the file selector or by dragging and dropping them into the upload area.',
                'Arrange the files in the desired merge order by dragging them up or down in the list.',
                'Click "Merge PDFs" to combine all files into a single PDF document.',
                'Download the merged PDF file to your device.'
            ],
            faqs: [
                { q: 'Is there a limit to how many PDFs I can merge?', a: 'There is no strict file count limit. The tool can handle merging multiple PDFs, though very large combined file sizes (over 100MB) may be slower depending on your device processing power.' },
                { q: 'Will the quality of my PDFs be affected?', a: 'No. The merger preserves the original quality of all pages. Text, images, and vector graphics retain their original resolution and formatting in the merged document.' },
                { q: 'Is my data private?', a: 'Absolutely. All PDF processing happens locally in your browser using JavaScript. Your files are never uploaded to any server, ensuring complete privacy and data security.' }
            ]
        },
        '/tools/text/remove-duplicate-lines.html': {
            name: 'Duplicate Line Remover',
            about: [
                'The OptiDrop Duplicate Line Remover instantly identifies and removes duplicate lines from any text. It processes large lists, datasets, and text files entirely in your browser, preserving the original order of unique lines while eliminating all repetitions.',
                'This tool is invaluable for cleaning up email lists, deduplicating keyword research data, removing repeated entries from spreadsheets, and sanitizing data before import. It handles files with thousands of lines in seconds.'
            ],
            steps: [
                'Paste your text into the input area or upload a text file.',
                'Click "Remove Duplicates" to process the text.',
                'View the results showing the original line count, number of duplicates removed, and the cleaned output.',
                'Copy the deduplicated text or download it as a new file.'
            ],
            faqs: [
                { q: 'Does the tool preserve the order of lines?', a: 'Yes. The tool keeps the first occurrence of each unique line and removes subsequent duplicates, preserving the original order of the remaining lines.' },
                { q: 'Is the comparison case-sensitive?', a: 'By default, the comparison is case-sensitive (uppercase and lowercase versions are treated as different lines). Many tools also offer a case-insensitive option for more aggressive deduplication.' },
                { q: 'Can it handle very large files?', a: 'Yes. The tool can process files with tens of thousands of lines. All processing happens locally in your browser, so performance depends on your device capabilities.' }
            ]
        },
        '/tools/developer/base64.html': {
            name: 'Base64 Encoder/Decoder',
            about: [
                'The OptiDrop Base64 Encoder & Decoder converts text and files to and from Base64 encoding instantly. Base64 is a binary-to-text encoding scheme widely used in web development, email attachments, and data URLs for embedding images in HTML and CSS.',
                'Developers use Base64 encoding when they need to transmit binary data over text-based protocols like HTTP, JSON, or XML. This tool handles both text strings and file encoding with a single click.'
            ],
            steps: [
                'Paste your text or upload a file into the input area.',
                'Click "Encode" to convert the input to Base64 format, or "Decode" to convert Base64 back to readable text.',
                'The result appears instantly in the output area.',
                'Copy the encoded or decoded result to your clipboard.'
            ],
            faqs: [
                { q: 'What is Base64 encoding?', a: 'Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format. It uses a set of 64 characters (A-Z, a-z, 0-9, +, /) to encode data, making it safe for transmission over text-based channels.' },
                { q: 'Is Base64 the same as encryption?', a: 'No. Base64 is an encoding scheme, not encryption. It does not provide any security — anyone can decode a Base64 string. It is designed for data compatibility, not confidentiality.' },
                { q: 'Why is Base64 used in web development?', a: 'Base64 is commonly used for embedding images in CSS (data URLs), encoding binary data in JSON, transmitting files via APIs, and encoding email attachments (MIME). It ensures binary data survives text-only transmission channels.' }
            ]
        }
    };

    // ── Fallback Content Generator ────────────────────────────
    function generateFallbackContent(toolName, toolDesc) {
        var safe = toolName || 'This Tool';
        return {
            name: safe,
            about: [
                'The OptiDrop ' + safe + ' is a free, browser-based utility designed to help you accomplish tasks quickly and efficiently. ' + (toolDesc ? toolDesc.charAt(0).toUpperCase() + toolDesc.slice(1) : 'It provides a clean, intuitive interface for fast and accurate results.') + ' There is no software to install and no account required — just open the page and start using it.',
                'Built for students, professionals, and everyday users, this tool processes everything locally in your web browser. Whether you need a quick one-time calculation or use it regularly for work, the ' + safe + ' delivers reliable results in seconds with zero learning curve.'
            ],
            steps: [
                'Open the ' + safe + ' page on OptiDrop by clicking the tool link or searching for it in the tools directory.',
                'Enter your input data, values, or files in the designated fields provided by the tool interface.',
                'Click the action button (such as Calculate, Generate, Convert, or Process) to execute the operation.',
                'Review the results displayed on screen and use the Copy or Download button to save your output.'
            ],
            faqs: [
                { q: 'Is the ' + safe + ' free to use?', a: 'Yes, OptiDrop provides this tool completely free of charge. There are no hidden fees, premium tiers, or sign-up requirements. All features are available to every user.' },
                { q: 'Is my data safe when using this tool?', a: 'Absolutely. All processing happens directly in your browser using local JavaScript APIs. Your input data, files, and results are never transmitted to or stored on any external server.' },
                { q: 'Does this tool work on mobile devices?', a: 'Yes. The ' + safe + ' is fully responsive and works on smartphones, tablets, laptops, and desktops. It is compatible with all modern browsers including Chrome, Firefox, Safari, and Edge.' }
            ]
        };
    }

    // ── Security Statement ────────────────────────────────────
    var SECURITY_STATEMENT = 'All processing in the OptiDrop ' + '%%NAME%%' + ' executes entirely within your web browser using local JavaScript APIs and the Web Workers framework. Your input data, files, and generated results are never transmitted across the network to any external server. This client-side architecture guarantees complete data privacy, eliminates the risk of data breaches, and ensures the tool works offline after the initial page load. No account creation, login credentials, or personal information is required at any point.';

    // ── Detect Current Tool ───────────────────────────────────
    var toolData = TOOL_CONTENT_DB[path];
    var toolName, toolDesc;

    if (!toolData && typeof allToolsData !== 'undefined') {
        var match = allToolsData.filter(function (t) { return t.h === path; });
        if (match.length > 0) {
            toolName = match[0].n;
            toolDesc = match[0].d;
        }
    }

    // Skip if no tool identified and no DB entry
    if (!toolData && !toolName) return;

    // Use DB data or generate fallback
    var content = toolData || generateFallbackContent(toolName, toolDesc);
    var name = content.name;

    // ── Skip if Content Already Exists ────────────────────────
    // Check for existing hardcoded SEO content to avoid duplication
    var existingH2s = document.querySelectorAll('h2');
    var hasAbout = false;
    var hasFaq = false;
    for (var i = 0; i < existingH2s.length; i++) {
        var txt = existingH2s[i].textContent.toLowerCase();
        if (txt.indexOf('about') !== -1 && txt.indexOf(name.toLowerCase()) !== -1) hasAbout = true;
        if (txt.indexOf('frequently asked') !== -1 || txt.indexOf('faq') !== -1) hasFaq = true;
    }
    if (hasAbout && hasFaq) return; // Both exist — skip injection

    // ── Build Documentation HTML ──────────────────────────────
    var docHtml = '<section class="tool-doc-section" id="tool-about-section">';

    if (!hasAbout) {
        // First sentence visible, rest collapsed
        var firstAbout = content.about[0] || '';
        var restAbout = content.about.slice(1);

        docHtml += '<h2 class="text-xl md:text-2xl font-semibold text-slate-100 mt-8 mb-4">About ' + name + '</h2>';
        docHtml += '<p>' + firstAbout + '</p>';

        if (restAbout.length > 0 || content.steps.length > 0) {
            docHtml += '<details class="seo-collapse"><summary>Learn more about this tool</summary><div class="seo-collapse-content">';
            restAbout.forEach(function (p) {
                docHtml += '<p>' + p + '</p>';
            });
            if (content.steps.length > 0) {
                docHtml += '<h3 style="font-size:1rem;font-weight:700;margin:1rem 0 0.5rem;">How to Use the ' + name + '</h3>';
                docHtml += '<ol class="list-decimal list-inside space-y-2">';
                content.steps.forEach(function (s) {
                    docHtml += '<li>' + s + '</li>';
                });
                docHtml += '</ol>';
            }
            docHtml += '<p>' + SECURITY_STATEMENT.replace('%%NAME%%', name) + '</p>';
            docHtml += '</div></details>';
        }
    }

    // ── FAQ Accordion ─────────────────────────────────────────
    if (!hasFaq && content.faqs.length > 0) {
        docHtml += '<h2 class="text-xl md:text-2xl font-semibold text-slate-100 mt-8 mb-4">Frequently Asked Questions</h2>';
        docHtml += '<div class="space-y-3">';
        content.faqs.forEach(function (faq) {
            docHtml += '<div class="faq-item border border-slate-200 rounded-xl overflow-hidden">' +
                '<button class="faq-question w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors">' +
                    '<span>' + faq.q + '</span>' +
                    '<svg class="faq-icon w-5 h-5 text-slate-400 flex-shrink-0 ml-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>' +
                '</button>' +
                '<div class="faq-answer px-5 text-slate-600 leading-relaxed">' + faq.a + '</div>' +
            '</div>';
        });
        docHtml += '</div>';
    }

    docHtml += '</section>';

    // ── Related Tools Section (injected before SEO docs) ────
    var relatedHtml = '';
    try {
        var currentPath = window.location.pathname;
        var currentTool = allToolsData.find(function(t) { return t.h === currentPath; });
        if (currentTool && currentTool.c) {
            var related = allToolsData.filter(function(t) {
                return t.c === currentTool.c && t.h !== currentPath;
            }).slice(0, 4);
            if (related.length > 0) {
                relatedHtml = '<section class="tool-doc-section" style="padding-top:1rem;padding-bottom:0;">' +
                    '<h2 style="font-size:1.15rem;font-weight:800;color:var(--color-slate-900,#0f172a);margin-bottom:1rem;">Related Tools</h2>' +
                    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;">';
                related.forEach(function(t) {
                    relatedHtml += '<a href="' + t.h + '" class="next-step-card" style="padding:0.875rem 1rem;">' +
                        '<span style="font-weight:700;font-size:0.875rem;color:var(--color-slate-900,#0f172a);">' + t.n + '</span>' +
                    '</a>';
                });
                relatedHtml += '</div></section>';
            }
        }
    } catch(e) {}

    // ── Inject Documentation into DOM ─────────────────────────
    var footer = document.querySelector('.site-footer');
    // Find the tool widget (glass-panel) for related tools placement
    var glassPanel = document.querySelector('.glass-panel');
    var insertTarget = glassPanel ? glassPanel.parentElement : footer;
    if (footer) {
        // Inject related tools right after the tool widget
        if (relatedHtml) {
            var relWrapper = document.createElement('div');
            relWrapper.innerHTML = relatedHtml;
            var relNode = relWrapper.firstChild;
            if (glassPanel && glassPanel.parentElement) {
                // Insert after the glass-panel's parent section
                var widgetSection = glassPanel.closest('section') || glassPanel.parentElement;
                if (widgetSection && widgetSection.nextSibling) {
                    widgetSection.parentNode.insertBefore(relNode, widgetSection.nextSibling);
                } else {
                    footer.parentNode.insertBefore(relNode, footer);
                }
            } else {
                footer.parentNode.insertBefore(relNode, footer);
            }
        }
        // Inject SEO docs after related tools (before footer)
        var wrapper = document.createElement('div');
        wrapper.innerHTML = docHtml;
        var section = wrapper.firstChild;
        footer.parentNode.insertBefore(section, footer);

        // Attach FAQ accordion listeners
        section.querySelectorAll('.faq-question').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = this.parentElement;
                var isOpen = item.classList.contains('open');
                section.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    // ── Inject FAQPage JSON-LD Schema ─────────────────────────
    if (!hasFaq && content.faqs.length > 0) {
        // Check if a FAQPage schema already exists
        var existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
        var hasFaqSchema = false;
        for (var j = 0; j < existingSchemas.length; j++) {
            if (existingSchemas[j].textContent.indexOf('"FAQPage"') !== -1) {
                hasFaqSchema = true;
                break;
            }
        }

        if (!hasFaqSchema) {
            var faqEntities = content.faqs.map(function (faq) {
                return {
                    '@type': 'Question',
                    'name': faq.q,
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': faq.a
                    }
                };
            });

            var schema = {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                'mainEntity': faqEntities
            };

            var script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema, null, 2);
            document.head.appendChild(script);
        }
    }

    // ── Inject WebApplication JSON-LD Schema ──────────────────
    // Check if a WebApplication/SoftwareApplication schema already exists
    var existingAppSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    var hasAppSchema = false;
    for (var k = 0; k < existingAppSchemas.length; k++) {
        var txt = existingAppSchemas[k].textContent;
        if (txt.indexOf('"WebApplication"') !== -1 || txt.indexOf('"SoftwareApplication"') !== -1) {
            hasAppSchema = true;
            break;
        }
    }

    if (!hasAppSchema) {
        var appSchema = {
            '@context': 'https://schema.org',
            '@type': ['WebApplication', 'SoftwareApplication'],
            'name': name,
            'url': window.location.href,
            'description': content.about[0],
            'applicationCategory': 'UtilityApplication',
            'operatingSystem': 'Any',
            'browserRequirements': 'Requires JavaScript',
            'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'USD'
            },
            'dateModified': '2026-06-09'
        };

        var appScript = document.createElement('script');
        appScript.type = 'application/ld+json';
        appScript.textContent = JSON.stringify(appSchema, null, 2);
        document.head.appendChild(appScript);
    }

    // AdSense Auto Ads handles placement automatically.
    // No manual ad slot injection needed.
});

// ════════════════════════════════════════════════════════════
// CLIENT-SIDE STAR RATING SYSTEM
// 5-star rating widget injected on tool pages.
// Ratings saved to localStorage keyed by page path.
// ════════════════════════════════════════════════════════════
_ric(function () {
    var path = window.location.pathname;

    // Only inject on actual tool pages (skip homepage, tools dir, blog, category, static)
    var SKIP_RATING = ['/', '/index.html', '/tools.html', '/blog/', '/category/', '/about', '/contact', '/privacy', '/terms', '/404', '/reindex'];
    var skipRating = SKIP_RATING.some(function (p) {
        return path === p || (p !== '/' && path.indexOf(p) === 0);
    });
    if (path === '/' || path === '/index.html') skipRating = true;
    if (skipRating) return;

    // Skip if a rating widget already exists on the page
    if (document.getElementById('od-star-rating')) return;

    var storageKey = 'optidrop_rating_' + path;
    var existingRating = 0;

    // Check for saved rating
    try {
        var saved = localStorage.getItem(storageKey);
        if (saved) existingRating = parseInt(saved, 10) || 0;
    } catch (e) {}

    // Build the star rating widget
    var wrapper = document.createElement('div');
    wrapper.id = 'od-star-rating';
    wrapper.className = 'od-star-rating-widget';

    var starSvgEmpty = '<svg class="od-star-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>';
    var starSvgFilled = '<svg class="od-star-icon od-star-filled" width="28" height="28" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>';

    var starsHtml = '';
    for (var i = 1; i <= 5; i++) {
        starsHtml += '<button class="od-star-btn" data-star="' + i + '" aria-label="Rate ' + i + ' stars">' +
            (i <= existingRating ? starSvgFilled : starSvgEmpty) +
        '</button>';
    }

    var thankYouHtml = existingRating > 0
        ? '<span class="od-rating-thankyou">Thank you for your feedback!</span>'
        : '<span class="od-rating-thankyou" style="display:none;">Thank you for your feedback!</span>';

    wrapper.innerHTML =
        '<div class="od-rating-container">' +
            '<p class="od-rating-prompt">Was this tool helpful? Rate your experience</p>' +
            '<div class="od-stars-row">' + starsHtml + '</div>' +
            thankYouHtml +
        '</div>';

    // Find insertion point: before footer, or before the ad/documentation sections
    var footer = document.querySelector('.site-footer');
    var aboutSection = document.getElementById('tool-about-section');
    var insertBefore = aboutSection || footer;

    if (insertBefore) {
        insertBefore.parentNode.insertBefore(wrapper, insertBefore);
    }

    // If already rated, disable further clicks
    var isRated = existingRating > 0;

    // Attach click handlers
    var buttons = wrapper.querySelectorAll('.od-star-btn');
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (isRated) return;
            var rating = parseInt(this.getAttribute('data-star'), 10);

            // Fill stars up to the clicked one
            buttons.forEach(function (b, idx) {
                var svg = b.querySelector('.od-star-icon');
                if (idx < rating) {
                    svg.setAttribute('fill', '#f59e0b');
                    svg.setAttribute('stroke', '#f59e0b');
                    svg.classList.add('od-star-filled');
                } else {
                    svg.setAttribute('fill', 'none');
                    svg.setAttribute('stroke', 'currentColor');
                    svg.classList.remove('od-star-filled');
                }
            });

            // Save to localStorage
            try { localStorage.setItem(storageKey, String(rating)); } catch (e) {}

            // Show thank you message
            var thankYou = wrapper.querySelector('.od-rating-thankyou');
            if (thankYou) thankYou.style.display = 'inline';

            isRated = true;
        });

        // Hover preview (only if not yet rated)
        btn.addEventListener('mouseenter', function () {
            if (isRated) return;
            var hoverRating = parseInt(this.getAttribute('data-star'), 10);
            buttons.forEach(function (b, idx) {
                var svg = b.querySelector('.od-star-icon');
                if (idx < hoverRating) {
                    svg.setAttribute('fill', '#fbbf24');
                    svg.setAttribute('stroke', '#fbbf24');
                } else {
                    svg.setAttribute('fill', 'none');
                    svg.setAttribute('stroke', 'currentColor');
                }
            });
        });
    });

    // Reset hover preview when leaving the star row
    var starsRow = wrapper.querySelector('.od-stars-row');
    if (starsRow) {
        starsRow.addEventListener('mouseleave', function () {
            if (isRated) return;
            buttons.forEach(function (b) {
                var svg = b.querySelector('.od-star-icon');
                if (!svg.classList.contains('od-star-filled')) {
                    svg.setAttribute('fill', 'none');
                    svg.setAttribute('stroke', 'currentColor');
                }
            });
        });
    }
});

// ════════════════════════════════════════════════════════════
// CATEGORY PAGES — "You might also like" injection
// ════════════════════════════════════════════════════════════
(function () {
    var path = window.location.pathname;
    // SVG icon map for categories (replaces emoji icons)
    var catIcons = {
        'image': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
        'pdf': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
        'text': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
        'career': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
        'business': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
        'professional': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
        'calculator': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
        'developer': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>',
        'utility': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>',
        'health': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>',
        'education': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>',
        'fitness': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>',
        'travel': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>',
        'productivity': '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" opacity="0.2"/><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        'design': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>',
        'home': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
        'fun': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        'parenting': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
    };

    // Icon color map — single brand accent (cerise) for all categories
    var catColors = {
        'image': 'brand', 'pdf': 'brand', 'text': 'brand', 'career': 'brand',
        'business': 'brand', 'professional': 'brand', 'calculator': 'brand',
        'developer': 'brand', 'utility': 'brand', 'health': 'brand',
        'education': 'brand', 'fitness': 'brand', 'travel': 'brand',
        'productivity': 'brand', 'design': 'brand', 'home': 'brand',
        'fun': 'brand', 'parenting': 'brand'
    };

    var categoryRelated = {
        '/category/image-tools.html': [
            {n:'PDF Tools',h:'/category/pdf-tools.html',c:'pdf'},
            {n:'Developer Tools',h:'/category/developer-tools.html',c:'developer'},
            {n:'Design',h:'/category/design-tools.html',c:'design'}
        ],
        '/category/pdf-tools.html': [
            {n:'Image Tools',h:'/category/image-tools.html',c:'image'},
            {n:'Text Tools',h:'/category/text-tools.html',c:'text'},
            {n:'Business Tools',h:'/category/business-tools.html',c:'business'}
        ],
        '/category/text-tools.html': [
            {n:'Developer Tools',h:'/category/developer-tools.html',c:'developer'},
            {n:'Education',h:'/category/education-tools.html',c:'education'},
            {n:'PDF Tools',h:'/category/pdf-tools.html',c:'pdf'}
        ],
        '/category/career-tools.html': [
            {n:'Business Tools',h:'/category/business-tools.html',c:'business'},
            {n:'Professional Tools',h:'/category/professional-tools.html',c:'professional'},
            {n:'Education',h:'/category/education-tools.html',c:'education'}
        ],
        '/category/business-tools.html': [
            {n:'Career Tools',h:'/category/career-tools.html',c:'career'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',c:'calculator'},
            {n:'Professional Tools',h:'/category/professional-tools.html',c:'professional'}
        ],
        '/category/professional-tools.html': [
            {n:'Career Tools',h:'/category/career-tools.html',c:'career'},
            {n:'Business Tools',h:'/category/business-tools.html',c:'business'},
            {n:'Developer Tools',h:'/category/developer-tools.html',c:'developer'}
        ],
        '/category/calculator-tools.html': [
            {n:'Health Tools',h:'/category/health-tools.html',c:'health'},
            {n:'Fitness',h:'/category/fitness-tools.html',c:'fitness'},
            {n:'Business Tools',h:'/category/business-tools.html',c:'business'}
        ],
        '/category/developer-tools.html': [
            {n:'Text Tools',h:'/category/text-tools.html',c:'text'},
            {n:'Design',h:'/category/design-tools.html',c:'design'},
            {n:'Utility Tools',h:'/category/utility-tools.html',c:'utility'}
        ],
        '/category/utility-tools.html': [
            {n:'Developer Tools',h:'/category/developer-tools.html',c:'developer'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',c:'calculator'},
            {n:'Productivity',h:'/category/productivity-tools.html',c:'productivity'}
        ],
        '/category/health-tools.html': [
            {n:'Fitness',h:'/category/fitness-tools.html',c:'fitness'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',c:'calculator'},
            {n:'Education',h:'/category/education-tools.html',c:'education'}
        ],
        '/category/education-tools.html': [
            {n:'Text Tools',h:'/category/text-tools.html',c:'text'},
            {n:'Career Tools',h:'/category/career-tools.html',c:'career'},
            {n:'Health Tools',h:'/category/health-tools.html',c:'health'}
        ],
        '/category/fitness-tools.html': [
            {n:'Health Tools',h:'/category/health-tools.html',c:'health'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',c:'calculator'},
            {n:'Travel',h:'/category/travel-tools.html',c:'travel'}
        ],
        '/category/travel-tools.html': [
            {n:'Productivity',h:'/category/productivity-tools.html',c:'productivity'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',c:'calculator'},
            {n:'Fun & Games',h:'/category/fun-tools.html',c:'fun'}
        ],
        '/category/productivity-tools.html': [
            {n:'Developer Tools',h:'/category/developer-tools.html',c:'developer'},
            {n:'Text Tools',h:'/category/text-tools.html',c:'text'},
            {n:'Education',h:'/category/education-tools.html',c:'education'}
        ],
        '/category/design-tools.html': [
            {n:'Developer Tools',h:'/category/developer-tools.html',c:'developer'},
            {n:'Image Tools',h:'/category/image-tools.html',c:'image'},
            {n:'Fun & Games',h:'/category/fun-tools.html',c:'fun'}
        ],
        '/category/home-tools.html': [
            {n:'Calculator Tools',h:'/category/calculator-tools.html',c:'calculator'},
            {n:'Utility Tools',h:'/category/utility-tools.html',c:'utility'},
            {n:'Fun & Games',h:'/category/fun-tools.html',c:'fun'}
        ],
        '/category/fun-tools.html': [
            {n:'Health Tools',h:'/category/health-tools.html',c:'health'},
            {n:'Design',h:'/category/design-tools.html',c:'design'},
            {n:'Travel',h:'/category/travel-tools.html',c:'travel'}
        ],
        '/category/parenting-tools.html': [
            {n:'Health Tools',h:'/category/health-tools.html',c:'health'},
            {n:'Education',h:'/category/education-tools.html',c:'education'},
            {n:'Fun & Games',h:'/category/fun-tools.html',c:'fun'}
        ]
    };

    var related = categoryRelated[path];
    if (!related) return;

    _ric(function () {
        var footer = document.querySelector('.site-footer');
        if (!footer) return;
        var section = document.createElement('section');
        section.className = 'w-full max-w-6xl mx-auto px-4 sm:px-6 py-10';
        var html = '<h2 class="text-xl font-bold text-slate-900 mb-5 text-center">You might also like</h2><div class="category-grid" style="max-width:700px;margin:0 auto;">';
        related.forEach(function (r) {
            var icon = catIcons[r.c] || catIcons['utility'];
            var color = catColors[r.c] || 'blue';
            html += '<a href="' + r.h + '" class="category-card"><span class="premium-icon-wrapper ' + color + '">' + icon + '</span><span class="cat-info"><span class="cat-name">' + r.n + '</span></span><span class="cat-arrow">→</span></a>';
        });
        html += '</div>';
        section.innerHTML = html;
        footer.parentNode.insertBefore(section, footer);
    });
})();

// ════════════════════════════════════════════════════════════
// TOOLS DIRECTORY — Sidebar + Lazy Loading (tools.html only)
// ════════════════════════════════════════════════════════════
var allToolsData = [
    {n:'Image Compressor',h:'/compress-image.html',c:'image',d:'Compress photos to exact KB limits for portals and forms.'},
    {n:'HEIC to JPG Converter',h:'/heic-to-jpg.html',c:'image',d:'Convert iPhone HEIC photos to JPG format instantly.'},
    {n:'Image Format Converter',h:'/image-format-converter.html',c:'image',d:'Convert between JPG, PNG, WebP, and BMP formats.'},
    {n:'Background Remover',h:'/remove-background.html',c:'image',d:'Remove background from any photo. Create transparent PNGs.'},
    {n:'Photo Resizer',h:'/passport-photo-resizer.html',c:'image',d:'Resize photos to passport dimensions at 300 DPI.'},
    {n:'Name & Date Stamper',h:'/name-date-stamp.html',c:'image',d:'Overlay name and date on photos for exam forms.'},
    {n:'Signature Scanner',h:'/signature-scanner.html',c:'image',d:'Scan and extract signatures from documents.'},
    {n:'Image to Text (OCR)',h:'/image-to-text-ocr.html',c:'image',d:'Extract text from images using browser-based OCR.'},
    {n:'PDF Compressor',h:'/compress-pdf.html',c:'pdf',d:'Reduce PDF file size while keeping quality.'},
    {n:'JPG to PDF',h:'/jpg-to-pdf.html',c:'pdf',d:'Convert JPG images to PDF documents.'},
    {n:'PDF to JPG',h:'/pdf-to-jpg.html',c:'pdf',d:'Extract pages from PDF as JPG images.'},
    {n:'PDF Merger',h:'/tools/pdf/pdf-merger.html',c:'pdf',d:'Combine multiple PDF files into a single document.'},
    {n:'PDF Splitter',h:'/tools/pdf/pdf-splitter.html',c:'pdf',d:'Split PDF into individual pages or page ranges.'},
    {n:'PDF Watermark',h:'/tools/pdf/pdf-watermark.html',c:'pdf',d:'Add text watermarks to all pages of a PDF.'},
    {n:'PDF Page Numbering',h:'/tools/pdf/pdf-page-numbering.html',c:'pdf',d:'Add page numbers to PDF in any position and format.'},
    {n:'PDF Extract Text',h:'/tools/pdf/pdf-extract-text.html',c:'pdf',d:'Extract all text content from PDF documents.'},
    {n:'PDF Grayscale',h:'/tools/pdf/pdf-grayscale.html',c:'pdf',d:'Convert PDF pages to grayscale for printing.'},
    {n:'HTML to PDF',h:'/tools/pdf/html-to-pdf.html',c:'pdf',d:'Convert HTML code to PDF with live preview.'},
    {n:'Markdown to PDF',h:'/tools/pdf/markdown-to-pdf.html',c:'pdf',d:'Convert Markdown text to formatted PDF document.'},
    {n:'PDF Margin Adjuster',h:'/tools/pdf/pdf-margin-adjuster.html',c:'pdf',d:'Adjust PDF page margins for printing or binding.'},
    {n:'PDF Password Protector',h:'/tools/pdf/pdf-password-protector.html',c:'pdf',d:'Add password protection to PDF files.'},
    {n:'PDF Unlock',h:'/tools/pdf/pdf-unlock.html',c:'pdf',d:'Remove password protection from PDF files.'},
    {n:'Image to PDF Advanced',h:'/tools/pdf/image-to-pdf-advanced.html',c:'pdf',d:'Convert images to PDF with custom layout options.'},
    {n:'PDF Compressor Advanced',h:'/tools/pdf/pdf-compressor-advanced.html',c:'pdf',d:'Advanced PDF compression with quality control.'},
    {n:'Multi PDF Combiner',h:'/tools/pdf/multi-pdf-combiner.html',c:'pdf',d:'Combine multiple PDFs with interleave or append mode.'},
    {n:'PDF Page Rotator',h:'/tools/pdf/pdf-page-rotator.html',c:'pdf',d:'Rotate PDF pages by 90, 180, or 270 degrees.'},
    {n:'Resume Builder',h:'/tools/career/resume-builder.html',c:'career',d:'Build professional resumes with multiple templates.'},
    {n:'Cover Letter Generator',h:'/tools/career/cover-letter.html',c:'career',d:'Create tailored cover letters for job applications.'},
    {n:'Resignation Letter',h:'/tools/career/resignation-letter.html',c:'career',d:'Generate professional resignation letters.'},
    {n:'Thank You Letter',h:'/tools/career/thank-you-letter.html',c:'career',d:'Create professional thank you letters after interviews.'},
    {n:'LinkedIn Generator',h:'/tools/career/linkedin-generator.html',c:'career',d:'Generate optimized LinkedIn about section and headline.'},
    {n:'Internship Letter',h:'/tools/career/internship-letter.html',c:'career',d:'Create internship application and request letters.'},
    {n:'Job Tracker',h:'/tools/career/job-tracker.html',c:'career',d:'Track job applications with status and notes.'},
    {n:'Invoice Generator',h:'/tools/business/invoice-generator.html',c:'business',d:'Create professional invoices with auto-calculations.'},
    {n:'Freelance Contract',h:'/tools/business/freelance-contract.html',c:'business',d:'Generate freelance work contracts with key terms.'},
    {n:'Salary Slip Generator',h:'/tools/business/salary-slip.html',c:'business',d:'Create salary slips with deductions and allowances.'},
    {n:'Business Proposal',h:'/tools/business/business-proposal.html',c:'business',d:'Generate professional business proposals.'},
    {n:'Offer Letter Generator',h:'/tools/business/offer-letter.html',c:'business',d:'Create job offer letters with terms and conditions.'},
    {n:'NOC Generator',h:'/tools/business/noc-generator.html',c:'business',d:'Generate No Objection Certificates for various purposes.'},
    {n:'Experience Letter',h:'/tools/business/experience-letter.html',c:'business',d:'Create work experience certificates for employees.'},
    {n:'Profit Calculator',h:'/tools/business/profit-calculator.html',c:'business',d:'Calculate profit margins, markup, and net profit.'},
    {n:'Receipt Generator',h:'/tools/business/receipt-generator.html',c:'business',d:'Generate payment receipts with auto-numbering.'},
    {n:'Relieving Letter',h:'/tools/business/relieving-letter.html',c:'business',d:'Generate relieving letters for employees leaving.'},
    {n:'Payslip Generator Pro',h:'/tools/business/payslip-generator-pro.html',c:'business',d:'Advanced payslip generator with deductions and allowances.'},
    {n:'Fee Receipt',h:'/tools/business/fee-receipt.html',c:'business',d:'Generate fee receipts for schools and colleges.'},
    {n:'Quotation Generator',h:'/tools/business/quotation-generator.html',c:'business',d:'Generate business quotations with itemized pricing.'},
    {n:'Purchase Order',h:'/tools/business/purchase-order.html',c:'business',d:'Generate purchase orders for vendors.'},
    {n:'Delivery Challan',h:'/tools/business/delivery-challan.html',c:'business',d:'Generate delivery challans for shipments.'},
    {n:'Cash Voucher',h:'/tools/business/cash-voucher.html',c:'business',d:'Generate cash and payment vouchers.'},
    {n:'Proforma Invoice',h:'/tools/business/proforma-invoice.html',c:'business',d:'Generate proforma invoices for clients.'},
    {n:'NDA Generator',h:'/tools/business/nda-generator.html',c:'business',d:'Generate Non-Disclosure Agreements for business.'},
    {n:'Experience Letter Pro',h:'/tools/business/experience-letter-pro.html',c:'business',d:'Advanced experience letter generator with achievements.'},
    {n:'Email Signature Generator',h:'/tools/professional/email-signature.html',c:'professional',d:'Create professional email signatures with styles.'},
    {n:'Business Card Maker',h:'/tools/professional/business-card.html',c:'professional',d:'Design business cards with multiple templates.'},
    {n:'Bio Generator',h:'/tools/professional/bio-generator.html',c:'professional',d:'Generate professional bios for social media and websites.'},
    {n:'SOP Generator',h:'/tools/professional/sop-generator.html',c:'professional',d:'Create Statement of Purpose for university applications.'},
    {n:'EMI Calculator',h:'/tools/emi-calculator.html',c:'calculator',d:'Calculate monthly EMI for any loan type.'},
    {n:'GST Calculator',h:'/tools/gst-calculator.html',c:'calculator',d:'Calculate GST at 5%, 12%, 18%, or 28%.'},
    {n:'Age Calculator',h:'/tools/age-calculator.html',c:'calculator',d:'Calculate exact age in years, months, and days.'},
    {n:'Percentage Calculator',h:'/tools/percentage-calculator.html',c:'calculator',d:'Calculate percentages, increase, and decrease.'},
    {n:'SIP Calculator',h:'/tools/calculators/sip-calculator.html',c:'calculator',d:'Calculate mutual fund SIP returns and maturity value.'},
    {n:'Income Tax Calculator',h:'/tools/calculators/income-tax-calculator.html',c:'calculator',d:'Compare old vs new tax regime for FY 2025-26.'},
    {n:'Mortgage Calculator',h:'/tools/calculators/mortgage-calculator.html',c:'calculator',d:'Calculate monthly mortgage payments and total interest.'},
    {n:'Tip Calculator',h:'/tools/calculators/tip-calculator.html',c:'calculator',d:'Calculate tip and split the bill between people.'},
    {n:'Grade Calculator',h:'/tools/calculators/grade-calculator.html',c:'calculator',d:'Calculate final grades with weighted assignments.'},
    {n:'Loan Comparison',h:'/tools/calculators/loan-comparison.html',c:'calculator',d:'Compare two loans side by side to find the better deal.'},
    {n:'Compound Interest',h:'/tools/calculators/compound-interest.html',c:'calculator',d:'Calculate compound interest with different compounding frequencies.'},
    {n:'Retirement Calculator',h:'/tools/calculators/retirement-calculator.html',c:'calculator',d:'Estimate how much you need to save for retirement.'},
    {n:'Discount Calculator',h:'/tools/calculators/discount-calculator.html',c:'calculator',d:'Calculate discounted price with multiple discount levels.'},
    {n:'Date Difference',h:'/tools/calculators/date-difference.html',c:'calculator',d:'Calculate the difference between two dates.'},
    {n:'Time Calculator',h:'/tools/calculators/time-calculator.html',c:'calculator',d:'Add and subtract time durations easily.'},
    {n:'Fuel Cost Calculator',h:'/tools/calculators/fuel-cost.html',c:'calculator',d:'Estimate fuel cost for a trip based on distance and mileage.'},
    {n:'Currency Converter',h:'/tools/calculators/currency-converter.html',c:'calculator',d:'Convert between world currencies with live-like rates.'},
    {n:'Calorie Calculator',h:'/tools/calculators/calorie-calculator.html',c:'calculator',d:'Calculate daily calorie needs for weight goals.'},
    {n:'401(k) Calculator',h:'/tools/calculators/401k-calculator.html',c:'calculator',d:'Estimate 401(k) retirement savings with employer match.'},
    {n:'Paycheck Calculator',h:'/tools/calculators/paycheck-calculator.html',c:'calculator',d:'Calculate US take-home pay after taxes and deductions.'},
    {n:'Savings Goal',h:'/tools/calculators/savings-goal.html',c:'calculator',d:'Calculate how long to reach your savings goal.'},
    {n:'Sales Tax Calculator',h:'/tools/calculators/invoice-tax-calculator.html',c:'calculator',d:'Calculate sales tax for US states and custom rates.'},
    {n:'VAT Calculator',h:'/tools/calculators/vat-calculator.html',c:'calculator',d:'Add or remove VAT for UK, EU, and global rates.'},
    {n:'Overtime Calculator',h:'/tools/calculators/overtime-calculator.html',c:'calculator',d:'Calculate overtime pay with different rate multipliers.'},
    {n:'Loan Amortization',h:'/tools/calculators/loan-amortization.html',c:'calculator',d:'Monthly payment schedule with principal vs interest breakdown.'},
    {n:'ROI Calculator',h:'/tools/calculators/roi-calculator.html',c:'calculator',d:'Calculate return on investment percentage and net profit.'},
    {n:'Freelance Rate Calculator',h:'/tools/calculators/freelance-rate.html',c:'calculator',d:'Calculate required hourly and daily rates for freelancers.'},
    {n:'Discount & Tax Calculator',h:'/tools/calculators/discount-tax-calculator.html',c:'calculator',d:'Calculate final price after discount and sales tax combined.'},
    {n:'Reverse Sales Tax',h:'/tools/calculators/reverse-sales-tax-calculator.html',c:'calculator',d:'Calculate pre-tax price from total including tax.'},
    {n:'Bill Split Calculator',h:'/tools/calculators/bill-split-calculator.html',c:'calculator',d:'Split bills evenly with custom tip percentage.'},
    {n:'Simple Interest',h:'/tools/calculators/simple-interest-calculator.html',c:'calculator',d:'Calculate simple interest on principal over time.'},
    {n:'Future Value Annuity',h:'/tools/calculators/future-value-annuity.html',c:'calculator',d:'Calculate future value of regular annuity payments.'},
    {n:'Mileage Calculator',h:'/tools/calculators/mileage-calculator.html',c:'calculator',d:'Calculate fuel mileage and cost per kilometer.'},
    {n:'Hourly to Salary',h:'/tools/calculators/hourly-to-salary.html',c:'calculator',d:'Convert hourly wage to annual salary and vice versa.'},
    {n:'Percent Error Calculator',h:'/tools/calculators/percent-error-calculator.html',c:'calculator',d:'Calculate percent error between experimental and theoretical values.'},
    {n:'Net Worth Calculator',h:'/tools/calculators/net-worth-calculator.html',c:'calculator',d:'Calculate total net worth by tracking assets and liabilities.'},
    {n:'Student Loan Calculator',h:'/tools/calculators/student-loan-calculator.html',c:'calculator',d:'Estimate monthly payments and total interest on student loans.'},
    {n:'Expense Splitter',h:'/tools/calculators/expense-splitter.html',c:'calculator',d:'Split expenses among friends with unequal shares.'},
    {n:'Salary Negotiator',h:'/tools/calculators/salary-negotiator.html',c:'calculator',d:'Calculate target salary with inflation and market adjustments.'},
    {n:'Break Even Calculator',h:'/tools/calculators/break-even-analysis.html',c:'calculator',d:'Calculate break-even point for business costs and revenue.'},
    {n:'Tip Splitter',h:'/tools/calculators/tip-splitter.html',c:'calculator',d:'Split tip amount among multiple people.'},
    {n:'Percentage Change',h:'/tools/calculators/percentage-change.html',c:'calculator',d:'Calculate percentage change between two values.'},
    {n:'Days Until Date',h:'/tools/calculators/days-until-date.html',c:'calculator',d:'Count days remaining until any future date.'},
    {n:'Advanced Retirement',h:'/tools/calculators/advanced-retirement-calculator.html',c:'calculator',d:'Advanced retirement planning with inflation and returns.'},
    {n:'Budget Planner',h:'/tools/calculators/budget-planner.html',c:'calculator',d:'Plan monthly budget with income and expense categories.'},
    {n:'Inflation Calculator',h:'/tools/calculators/inflation-calculator.html',c:'calculator',d:'Calculate the effect of inflation on purchasing power.'},
    {n:'Credit Card Payoff',h:'/tools/calculators/credit-card-payoff.html',c:'calculator',d:'Calculate how long to pay off credit card debt.'},
    {n:'Car Loan Calculator',h:'/tools/calculators/car-loan-calculator.html',c:'calculator',d:'Calculate monthly payments for auto loans.'},
    {n:'Rule of 72',h:'/tools/calculators/rule-of-72.html',c:'calculator',d:'Estimate years to double your money at a given rate.'},
    {n:'Tax Deduction Calculator',h:'/tools/calculators/tax-deduction-calculator.html',c:'calculator',d:'Calculate tax savings from deductions and exemptions.'},
    {n:'Word Counter',h:'/tools/word-counter.html',c:'text',d:'Count words, characters, sentences, and paragraphs.'},
    {n:'Text Case Converter',h:'/tools/text-case-converter.html',c:'text',d:'Convert text between uppercase, lowercase, title case.'},
    {n:'Lorem Ipsum Generator',h:'/tools/text/lorem-ipsum-generator.html',c:'text',d:'Generate Lorem Ipsum placeholder text for designs.'},
    {n:'Random Name Generator',h:'/tools/text/random-name-generator.html',c:'text',d:'Generate random names for testing and creative projects.'},
    {n:'Text Repeater',h:'/tools/text/text-repeater.html',c:'text',d:'Repeat any text multiple times with custom separator.'},
    {n:'Binary Converter',h:'/tools/text/binary-to-text.html',c:'text',d:'Convert between binary, text, decimal, and hex.'},
    {n:'Character Counter',h:'/tools/text/character-counter.html',c:'text',d:'Count characters with and without spaces.'},
    {n:'Remove Duplicate Lines',h:'/tools/text/remove-duplicate-lines.html',c:'text',d:'Remove duplicate lines from text instantly.'},
    {n:'Find and Replace',h:'/tools/text/find-and-replace.html',c:'text',d:'Find and replace text with regex support.'},
    {n:'Number to Words',h:'/tools/text/number-to-words.html',c:'text',d:'Convert numbers to words in multiple languages.'},
    {n:'Reverse Text',h:'/tools/text/reverse-text.html',c:'text',d:'Reverse any text string character by character.'},
    {n:'Text to Slug',h:'/tools/text/text-to-slug.html',c:'text',d:'Convert text to URL-friendly slug format.'},
    {n:'Word Frequency Counter',h:'/tools/text/word-frequency.html',c:'text',d:'Count word frequency and find most common words.'},
    {n:'Sentence Shuffler',h:'/tools/text/sentence-reorder.html',c:'text',d:'Randomly shuffle sentences in any text.'},
    {n:'Random Picker',h:'/tools/text/random-picker.html',c:'text',d:'Pick a random item from a list of options.'},
    {n:'Password Generator',h:'/tools/password-generator.html',c:'utility',d:'Generate strong passwords with custom options.'},
    {n:'Unit Converter',h:'/tools/unit-converter.html',c:'utility',d:'Convert between units of length, weight, temperature.'},
    {n:'Pomodoro Timer',h:'/tools/pomodoro-timer.html',c:'utility',d:'Focus timer with 25-minute work and 5-minute break sessions.'},
    {n:'Aspect Ratio Calculator',h:'/tools/aspect-ratio-calculator.html',c:'utility',d:'Calculate aspect ratio and resize dimensions proportionally.'},
    {n:'JSON Formatter',h:'/tools/developer/json-formatter.html',c:'developer',d:'Format, validate, and minify JSON data.'},
    {n:'Base64 Encoder',h:'/tools/developer/base64.html',c:'developer',d:'Encode and decode Base64 strings and files.'},
    {n:'URL Encoder',h:'/tools/developer/url-encoder.html',c:'developer',d:'Encode and decode URLs and query parameters.'},
    {n:'Color Converter',h:'/tools/developer/color-converter.html',c:'developer',d:'Convert between HEX, RGB, HSL color formats.'},
    {n:'Markdown Preview',h:'/tools/developer/markdown-preview.html',c:'developer',d:'Live preview Markdown with split-pane editor.'},
    {n:'Hash Generator',h:'/tools/developer/hash-generator.html',c:'developer',d:'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.'},
    {n:'CSS Minifier',h:'/tools/developer/css-minifier.html',c:'developer',d:'Minify CSS code to reduce file size.'},
    {n:'JWT Decoder',h:'/tools/developer/jwt-decoder.html',c:'developer',d:'Decode and inspect JWT tokens without verification.'},
    {n:'EXIF Stripper',h:'/tools/developer/exif-stripper.html',c:'developer',d:'View and strip EXIF metadata from images.'},
    {n:'CSS Gradient Generator',h:'/tools/developer/css-gradient-generator.html',c:'developer',d:'Create CSS gradients with live preview.'},
    {n:'HTML Entities',h:'/tools/developer/html-entities.html',c:'developer',d:'Encode and decode HTML entities.'},
    {n:'Regex Tester',h:'/tools/developer/regex-tester.html',c:'developer',d:'Test regular expressions with live match highlighting.'},
    {n:'UUID Generator',h:'/tools/developer/uuid-generator.html',c:'developer',d:'Generate v4 UUIDs using crypto.getRandomValues.'},
    {n:'Timestamp Converter',h:'/tools/developer/timestamp-converter.html',c:'developer',d:'Convert between Unix timestamps and human-readable dates.'},
    {n:'JSON to CSV',h:'/tools/developer/json-to-csv.html',c:'developer',d:'Convert JSON arrays to CSV format.'},
    {n:'Box Shadow Generator',h:'/tools/developer/css-box-shadow-generator.html',c:'developer',d:'Create CSS box shadows with live preview.'},
    {n:'JS Minifier',h:'/tools/developer/js-minifier.html',c:'developer',d:'Minify JavaScript code to reduce file size.'},
    {n:'Lorem Ipsum (Dev)',h:'/tools/developer/lorem-ipsum.html',c:'developer',d:'Generate Lorem Ipsum for development testing.'},
    {n:'API Response Formatter',h:'/tools/developer/api-response-formatter.html',c:'developer',d:'Format API responses for documentation.'},
    {n:'Git Command Cheatsheet',h:'/tools/developer/git-command-cheatsheet.html',c:'developer',d:'Quick reference for common Git commands.'},
    {n:'Base64 Image Converter',h:'/tools/developer/base64-image-converter.html',c:'developer',d:'Convert images to Base64 and back.'},
    {n:'Terminal Simulator',h:'/tools/developer/terminal-command-simulator.html',c:'developer',d:'Practice terminal commands in a safe environment.'},
    {n:'Morse Code Translator',h:'/tools/developer/morse-code-translator.html',c:'developer',d:'Translate text to Morse code and back.'},
    {n:'Caesar Cipher',h:'/tools/developer/caesar-cipher.html',c:'developer',d:'Encrypt and decrypt text using Caesar cipher.'},
    {n:'HTML to Markdown',h:'/tools/developer/html-to-markdown.html',c:'developer',d:'Convert HTML code to Markdown format.'},
    {n:'Meta Tag Generator',h:'/tools/developer/meta-tag-generator.html',c:'developer',d:'Generate HTML meta tags for SEO and social sharing.'},
    {n:'Color Palette Generator',h:'/tools/developer/color-palette-generator.html',c:'developer',d:'Generate beautiful color palettes for design projects.'},
    {n:'ASCII Art Converter',h:'/tools/developer/ascii-art-converter.html',c:'developer',d:'Convert text to ASCII art with different fonts.'},
    {n:'Markdown Table Generator',h:'/tools/developer/markdown-table-generator.html',c:'developer',d:'Create Markdown tables with visual editor.'},
    {n:'QR Code Generator',h:'/qr-code-generator.html',c:'utility',d:'Generate QR codes for URLs, text, and contact info.'},
    {n:'BMI Calculator',h:'/tools/bmi-calculator.html',c:'health',d:'Calculate Body Mass Index with health categories.'},
    {n:'Ideal Weight Calculator',h:'/tools/health/ideal-weight.html',c:'health',d:'Calculate ideal body weight using multiple formulas.'},
    {n:'Calorie Calculator (Health)',h:'/tools/health/calorie-calculator.html',c:'health',d:'Calculate daily calorie needs based on activity level.'},
    {n:'Water Intake Calculator',h:'/tools/health/water-intake.html',c:'health',d:'Calculate recommended daily water intake.'},
    {n:'Sleep Calculator',h:'/tools/health/sleep-calculator.html',c:'health',d:'Find the best time to wake up based on sleep cycles.'},
    {n:'Pregnancy Due Date',h:'/tools/health/pregnancy-due-date.html',c:'health',d:'Calculate expected due date from last period.'},
    {n:'Ovulation Calculator',h:'/tools/health/ovulation-calculator.html',c:'health',d:'Track fertile window and ovulation dates.'},
    {n:'Macro Calculator',h:'/tools/health/macro-calculator.html',c:'health',d:'Calculate protein, carbs, and fat macros for goals.'},
    {n:'Body Fat Calculator',h:'/tools/health/body-fat-calculator.html',c:'health',d:'Estimate body fat percentage using measurements.'},
    {n:'BMR Calculator',h:'/tools/health/bmr-calculator.html',c:'health',d:'Calculate Basal Metabolic Rate for calorie planning.'},
    {n:'Blood Pressure Tracker',h:'/tools/health/blood-pressure-tracker.html',c:'health',d:'Log and classify BP readings with history tracking.'},
    {n:'BAC Calculator',h:'/tools/health/bac-calculator.html',c:'health',d:'Estimate Blood Alcohol Content based on drinks consumed.'},
    {n:'Dosage Calculator',h:'/tools/health/dosage-calculator.html',c:'health',d:'Calculate medication dosage based on weight and age.'},
    {n:'Menstrual Cycle Calculator',h:'/tools/health/menstrual-cycle-calculator.html',c:'health',d:'Track menstrual cycles and predict next period.'},
    {n:'BSA Calculator',h:'/tools/health/bsa-calculator.html',c:'health',d:'Calculate Body Surface Area for medical dosing.'},
    {n:'Target Heart Rate',h:'/tools/health/target-heart-rate.html',c:'health',d:'Calculate target heart rate zones for exercise.'},
    {n:'Stress Level Assessor',h:'/tools/health/stress-level-assessor.html',c:'health',d:'Assess stress levels with personalized recommendations.'},
    {n:'Citation Generator',h:'/tools/education/citation-generator.html',c:'education',d:'Generate APA, MLA, and Chicago style citations.'},
    {n:'Essay Word Counter',h:'/tools/education/essay-word-counter.html',c:'education',d:'Count words, pages, and reading time for essays.'},
    {n:'Final Grade Calculator',h:'/tools/education/final-grade-calculator.html',c:'education',d:'Calculate what score you need on the final exam.'},
    {n:'Flashcard Generator',h:'/tools/education/flashcard-generator.html',c:'education',d:'Create study flashcards from any topic.'},
    {n:'GPA Calculator',h:'/tools/education/gpa-calculator.html',c:'education',d:'Calculate semester and cumulative GPA.'},
    {n:'Quiz Generator',h:'/tools/education/quiz-generator.html',c:'education',d:'Generate practice quizzes from study material.'},
    {n:'Study Timer',h:'/tools/education/study-timer.html',c:'education',d:'Pomodoro-style study timer with session tracking.'},
    {n:'Bonafide Certificate',h:'/tools/education/bonafide-certificate.html',c:'education',d:'Generate bonafide certificates for students.'},
    {n:'Character Certificate',h:'/tools/education/character-certificate.html',c:'education',d:'Generate character certificates for students.'},
    {n:'Gap Certificate',h:'/tools/education/gap-certificate.html',c:'education',d:'Generate gap year certificates for students.'},
    {n:'Internship Certificate',h:'/tools/education/internship-certificate.html',c:'education',d:'Generate internship completion certificates.'},
    {n:'Marksheet Generator',h:'/tools/education/marksheet-generator.html',c:'education',d:'Generate mark sheets with grades and percentages.'},
    {n:'Study Leave Letter',h:'/tools/education/study-leave-letter.html',c:'education',d:'Generate study leave application letters.'},
    {n:'Sick Leave Application',h:'/tools/education/sick-leave-application.html',c:'education',d:'Generate sick leave applications for students.'},
    {n:'Principal Application',h:'/tools/education/principal-application.html',c:'education',d:'Generate formal applications to school principals.'},
    {n:'Scholarship Application',h:'/tools/education/scholarship-application.html',c:'education',d:'Generate scholarship applications with achievements.'},
    {n:'Recommendation Letter',h:'/tools/education/recommendation-letter.html',c:'education',d:'Generate recommendation letters for students.'},
    {n:'SOP Builder',h:'/tools/education/sop-builder.html',c:'education',d:'Build Statement of Purpose for university applications.'},
    {n:'Student Bio Data',h:'/tools/education/student-bio-data.html',c:'education',d:'Generate student bio data with personal details.'},
    {n:'Project Certificate',h:'/tools/education/project-certificate.html',c:'education',d:'Generate project completion certificates.'},
    {n:'Training Certificate',h:'/tools/education/training-certificate.html',c:'education',d:'Generate training completion certificates.'},
    {n:'Academic Declaration',h:'/tools/education/academic-declaration.html',c:'education',d:'Generate academic declaration and undertaking letters.'},
    {n:'BMR/TDEE Advanced',h:'/tools/fitness/bmr-tdee-advanced.html',c:'fitness',d:'Advanced BMR and TDEE with multiple formula options.'},
    {n:'Body Measurement Tracker',h:'/tools/fitness/body-measurement-tracker.html',c:'fitness',d:'Track body measurements over time with charts.'},
    {n:'Exercise Calorie Burn',h:'/tools/fitness/exercise-calorie-burn.html',c:'fitness',d:'Calculate calories burned for different exercises.'},
    {n:'Heart Rate Zone Calculator',h:'/tools/fitness/heart-rate-zone-calculator.html',c:'fitness',d:'Calculate training heart rate zones by age.'},
    {n:'One Rep Max Calculator',h:'/tools/fitness/one-rep-max-calculator.html',c:'fitness',d:'Estimate one-rep max from submaximal lifts.'},
    {n:'Walking Calorie Burn',h:'/tools/fitness/walking-calorie-burn.html',c:'fitness',d:'Calculate calories burned while walking.'},
    {n:'Trip Cost Estimator',h:'/tools/travel/trip-cost-estimator.html',c:'travel',d:'Estimate total trip cost with all expenses.'},
    {n:'Packing List Generator',h:'/tools/travel/packing-list-generator.html',c:'travel',d:'Generate packing lists based on destination and duration.'},
    {n:'Todo List Advanced',h:'/tools/productivity/todo-list-advanced.html',c:'productivity',d:'Advanced todo list with priorities and categories.'},
    {n:'Goal Tracker',h:'/tools/productivity/goal-tracker.html',c:'productivity',d:'Set and track progress toward personal goals.'},
    {n:'Meeting Notes Template',h:'/tools/productivity/meeting-notes-template.html',c:'productivity',d:'Structured meeting notes with action items.'},
    {n:'Daily Planner',h:'/tools/productivity/daily-planner.html',c:'productivity',d:'Plan your day with time blocks and priorities.'},
    {n:'Brainstorm Idea Generator',h:'/tools/productivity/brainstorm-idea-generator.html',c:'productivity',d:'Generate creative ideas with random prompts.'},
    {n:'Time Block Scheduler',h:'/tools/productivity/time-block-scheduler.html',c:'productivity',d:'Schedule tasks in time blocks for focused work.'},
    {n:'Priority Matrix',h:'/tools/productivity/priority-matrix.html',c:'productivity',d:'Prioritize tasks using the Eisenhower matrix.'},
    {n:'Avatar Generator',h:'/tools/design/avatar-generator.html',c:'design',d:'Generate unique avatars with customizable features.'},
    {n:'Button Generator',h:'/tools/design/button-generator.html',c:'design',d:'Create CSS buttons with live preview and export.'},
    {n:'CSS Border Generator',h:'/tools/design/css-border-generator.html',c:'design',d:'Create CSS border styles with visual editor.'},
    {n:'Favicon Generator',h:'/tools/design/favicon-generator.html',c:'design',d:'Generate favicons from text or emoji.'},
    {n:'Gradient Text Generator',h:'/tools/design/gradient-text-generator.html',c:'design',d:'Create CSS gradient text effects.'},
    {n:'Social Media Mockup',h:'/tools/design/social-media-mockup.html',c:'design',d:'Preview how posts look on different platforms.'},
    {n:'Indian Passport Photo',h:'/tools/design/indian-passport-photo.html',c:'design',d:'Make Indian passport photos at 35x45mm, 300 DPI.'},
    {n:'US Passport Photo',h:'/tools/design/us-passport-photo.html',c:'design',d:'Make US passport photos at 2x2 inches, 300 DPI.'},
    {n:'UK Passport Photo',h:'/tools/design/uk-passport-photo.html',c:'design',d:'Make UK passport photos at 35x45mm, 300 DPI.'},
    {n:'Canada Passport Photo',h:'/tools/design/canada-passport-photo.html',c:'design',d:'Make Canada passport photos at 50x70mm, 300 DPI.'},
    {n:'Visa Photo Generator',h:'/tools/design/visa-photo-generator.html',c:'design',d:'Generate visa photos with custom dimensions.'},
    {n:'ID Card Generator',h:'/tools/design/id-card-generator.html',c:'design',d:'Generate ID cards with photo and details.'},
    {n:'Employee ID Card',h:'/tools/design/employee-id-card.html',c:'design',d:'Generate employee ID cards with company details.'},
    {n:'Student ID Card',h:'/tools/design/student-id-card.html',c:'design',d:'Generate student ID cards with institution details.'},
    {n:'Signature Drawer',h:'/tools/design/signature-drawer.html',c:'design',d:'Draw signatures using mouse or touch on canvas.'},
    {n:'Text Signature Generator',h:'/tools/design/text-signature-generator.html',c:'design',d:'Generate stylized text signatures with multiple fonts.'},
    {n:'Scanner Simulator',h:'/tools/design/scanner-simulator.html',c:'design',d:'Simulate a scanned document look from photos.'},
    {n:'Document Cropper',h:'/tools/design/document-cropper.html',c:'design',d:'Crop documents from photos with precision.'},
    {n:'Image Stamp Tool',h:'/tools/design/image-stamp-tool.html',c:'design',d:'Add date and time stamps to images.'},
    {n:'Watermark Creator',h:'/tools/design/watermark-creator.html',c:'design',d:'Add text watermarks to images with custom options.'},
    {n:'Certificate Generator',h:'/tools/design/certificate-generator.html',c:'design',d:'Generate customizable certificates with templates.'},
    {n:'Wallpaper Calculator',h:'/tools/home/wallpaper-calculator.html',c:'home',d:'Calculate wallpaper rolls needed for any room.'},
    {n:'Paint Calculator',h:'/tools/home/paint-calculator.html',c:'home',d:'Estimate gallons of paint needed for any room.'},
    {n:'Concrete Calculator',h:'/tools/home/concrete-calculator.html',c:'home',d:'Calculate concrete volume for slabs and footings.'},
    {n:'Shoe Size Converter',h:'/tools/home/shoe-size-converter.html',c:'home',d:'Convert shoe sizes between US, UK, EU systems.'},
    {n:'Cooking Converter',h:'/tools/home/cooking-converter.html',c:'home',d:'Convert between cups, tablespoons, ml, and grams.'},
    {n:'Bingo Card Generator',h:'/tools/fun/bingo-card-generator.html',c:'fun',d:'Create custom bingo cards for any occasion.'},
    {n:'Birthday Fortune',h:'/tools/fun/birthday-fortune.html',c:'fun',d:'Get fun birthday fortunes and personality insights.'},
    {n:'Coin Flip',h:'/tools/fun/coin-flip.html',c:'fun',d:'Flip a virtual coin with heads or tails.'},
    {n:'Dice Roller',h:'/tools/fun/dice-roller.html',c:'fun',d:'Roll virtual dice with custom sides and count.'},
    {n:'Daily Horoscope',h:'/tools/fun/horoscope-daily.html',c:'fun',d:'Get your daily horoscope for all zodiac signs.'},
    {n:'Meme Text Generator',h:'/tools/fun/meme-text-generator.html',c:'fun',d:'Generate meme-style text with top and bottom captions.'},
    {n:'Password Game',h:'/tools/fun/password-game.html',c:'fun',d:'Fun challenge: create a password meeting absurd rules.'},
    {n:'Random Color Generator',h:'/tools/fun/random-color-generator.html',c:'fun',d:'Generate random colors with HEX, RGB values.'},
    {n:'Random Joke',h:'/tools/fun/random-joke.html',c:'fun',d:'Get random jokes to brighten your day.'},
    {n:'Random Recipe',h:'/tools/fun/random-recipe.html',c:'fun',d:'Get a random recipe suggestion for any meal.'},
    {n:'Rock Paper Scissors',h:'/tools/fun/rock-paper-scissors.html',c:'fun',d:'Play rock paper scissors against the computer.'},
    {n:'Trivia Quiz',h:'/tools/fun/trivia-quiz.html',c:'fun',d:'Test your knowledge with random trivia questions.'},
    {n:'Would You Rather',h:'/tools/fun/would-you-rather.html',c:'fun',d:'Fun dilemma game with community stats.'},
    {n:'Tile Calculator',h:'/tools/home/tile-calculator.html',c:'home',d:'Calculate tiles needed for floors and walls.'},
    {n:'Medication Reminder',h:'/tools/health/medication-reminder.html',c:'health',d:'Set medication reminders with dosage tracking.'},
    {n:'Savings Goal Tracker',h:'/tools/calculators/savings-goal-tracker.html',c:'calculator',d:'Track progress toward your savings goals.'},
    {n:'Compress Image for Instagram',h:'/compress-image-for-instagram.html',c:'image',d:'Optimize images for Instagram post and story dimensions.'},
    {n:'Reading Time Calculator',h:'/tools/text/reading-time-calculator.html',c:'text',d:'Estimate reading and speaking time for any text.'},
    {n:'Text Diff Checker',h:'/tools/text/text-diff-checker.html',c:'text',d:'Compare two texts and highlight differences.'},
    {n:'Typing Speed Test',h:'/tools/text/typing-speed-test.html',c:'text',d:'Test typing speed with WPM and accuracy measurement.'},
    {n:'Acronym Generator',h:'/tools/text/acronym-generator.html',c:'text',d:'Generate acronyms from phrases with reverse lookup.'},
    {n:'Anagram Solver',h:'/tools/text/anagram-solver.html',c:'text',d:'Find valid anagrams from any word.'},
    {n:'Password Phrase Generator',h:'/tools/text/password-phrase-generator.html',c:'text',d:'Generate secure diceware-style passphrases.'},
    {n:'Text to Speech Preview',h:'/tools/text/text-to-speech-preview.html',c:'text',d:'Preview browser text-to-speech with voice controls.'},
    {n:'Bulk Text Replacer',h:'/tools/text/bulk-text-replacer.html',c:'text',d:'Apply multiple find-replace rules at once.'},
    {n:'Keyword Density Checker',h:'/tools/text/keyword-density-checker.html',c:'text',d:'Analyze keyword density for SEO optimization.'},
    {n:'Word Scramble Game',h:'/tools/text/word-scramble.html',c:'text',d:'Unscramble words in this fun vocabulary game.'},
    {n:'Number Trivia',h:'/tools/text/number-trivia.html',c:'text',d:'Fun facts and mathematical properties about any number.'},
    {n:'Rhyming Words Finder',h:'/tools/text/rhyming-words-finder.html',c:'text',d:'Find rhyming words for poetry and songwriting.'},
    {n:'Phonetic Spelling Converter',h:'/tools/text/phonetic-spelling-converter.html',c:'text',d:'Convert text to phonetic spelling.'},
    {n:'Letter Count Analyzer',h:'/tools/text/letter-count-analyzer.html',c:'text',d:'Analyze letter frequency and distribution.'},
    {n:'Story Prompt Generator',h:'/tools/text/story-prompt-generator.html',c:'text',d:'Generate creative writing prompts and story ideas.'},
    {n:'Email Subject Line Generator',h:'/tools/text/email-subject-line-generator.html',c:'text',d:'Generate effective email subject lines.'},
    {n:'Advanced Case Converter',h:'/tools/text/case-converter-advanced.html',c:'text',d:'Convert to camelCase, snake_case, kebab-case, and more.'},
    {n:'YouTube Timestamp Linker',h:'/tools/developer/youtube-timestamp-linker.html',c:'developer',d:'Generate timestamped YouTube links and embed codes.'},
    {n:'HTML Encoder',h:'/tools/developer/html-encoder.html',c:'developer',d:'Encode and decode HTML entities and special characters.'},
    {n:'Markdown to HTML',h:'/tools/developer/markdown-to-html.html',c:'developer',d:'Convert Markdown text to HTML markup.'},
    {n:'Color Picker',h:'/tools/developer/color-picker.html',c:'developer',d:'Pick colors with HEX, RGB, and HSL output.'},
    {n:'BMI with Body Fat',h:'/tools/utility/bmi-with-body-fat.html',c:'utility',d:'Combined BMI calculator and body fat percentage estimator.'},
    {n:'Pack Weight Calculator',h:'/tools/utility/pack-weight-calculator.html',c:'utility',d:'Estimate travel packing weight with airline limits.'},
    {n:'Random Decision Maker',h:'/tools/utility/random-decision-maker.html',c:'utility',d:'Spin the wheel to make random decisions.'},
    {n:'Habit Tracker',h:'/tools/utility/habit-tracker-simple.html',c:'utility',d:'Track daily habits with streak counting.'},
    {n:'Screen Ruler',h:'/tools/utility/screen-ruler.html',c:'utility',d:'Measure pixels on screen with a draggable ruler.'},
    {n:'World Clock',h:'/tools/utility/world-clock.html',c:'utility',d:'View live clocks for multiple cities worldwide.'},
    {n:'File Size Converter',h:'/tools/utility/file-size-converter.html',c:'utility',d:'Convert between bytes, KB, MB, GB, and TB.'},
    {n:'Timezone Converter',h:'/tools/utility/timezone-converter.html',c:'utility',d:'Convert times between different time zones.'},
    {n:'Date Calculator',h:'/tools/utility/date-calculator.html',c:'utility',d:'Add or subtract days from any date.'},
    {n:'Binary Converter (Utility)',h:'/tools/utility/binary-converter.html',c:'utility',d:'Convert between binary, octal, decimal, and hex.'},
    {n:'Roman Numeral Converter',h:'/tools/utility/roman-numeral-converter.html',c:'utility',d:'Convert between Roman numerals and standard numbers.'},
    {n:'Screen Resolution Checker',h:'/tools/utility/screen-resolution-checker.html',c:'utility',d:'View your screen resolution and viewport size.'},
    {n:'IP Address Lookup',h:'/tools/utility/ip-address-lookup.html',c:'utility',d:'View your public IP address and location.'},
    {n:'Recipe Scaler',h:'/tools/utility/recipe-scaler.html',c:'utility',d:'Scale recipe ingredients up or down.'},
    {n:'Book Reading Tracker',h:'/tools/utility/book-reading-tracker.html',c:'utility',d:'Track books you are reading with progress and notes.'},
    {n:'Movie Watchlist',h:'/tools/utility/movie-watchlist.html',c:'utility',d:'Manage your movie watchlist with ratings.'},
    {n:'Password Strength Tester',h:'/tools/utility/password-strength-tester-advanced.html',c:'utility',d:'Test password strength and get improvement suggestions.'},
    {n:'Unit Price Comparator',h:'/tools/utility/unit-price-comparator.html',c:'utility',d:'Compare unit prices to find the best deal.'},
    {n:'Age in Different Units',h:'/tools/utility/age-in-different-units.html',c:'utility',d:'Convert age into different time units.'},
    {n:'Random Quote Generator',h:'/tools/utility/random-quote-generator.html',c:'utility',d:'Generate random inspirational quotes.'},
    {n:'Yes or No Decider',h:'/tools/fun/yes-no-decider.html',c:'fun',d:'Magic 8-ball style yes or no answers.'},
    {n:'Would You Rather Advanced',h:'/tools/fun/would-you-rather-advanced.html',c:'fun',d:'Would you rather with custom scenarios and voting.'},
    {n:'Plant Watering Reminder',h:'/tools/home/plant-watering-reminder.html',c:'home',d:'Track plant care schedules with watering reminders.'},
    {n:'Itinerary Planner',h:'/tools/travel/itinerary-planner.html',c:'travel',d:'Plan daily travel itineraries with activities.'},
    {n:'Flight Time Calculator',h:'/tools/travel/flight-time-calculator.html',c:'travel',d:'Estimate flight duration between cities.'},
    {n:'Visa Requirement Checker',h:'/tools/travel/visa-requirement-checker.html',c:'travel',d:'Check visa requirements by passport and destination.'},
    {n:'Currency Trip Converter',h:'/tools/travel/currency-trip-converter.html',c:'travel',d:'Convert currencies with trip budget tracking.'},
    {n:'Hotel Cost Comparator',h:'/tools/travel/hotel-cost-comparator.html',c:'travel',d:'Compare hotel costs across dates and locations.'},
    {n:'Baby Name Generator',h:'/tools/parenting/baby-name-generator.html',c:'parenting',d:'Search and generate baby names by origin and meaning.'},
    {n:'Feeding Schedule',h:'/tools/parenting/feeding-schedule.html',c:'parenting',d:'Track baby feeding schedules and patterns.'},
    {n:'Height Prediction',h:'/tools/parenting/height-prediction.html',c:'parenting',d:'Predict child adult height from parents heights.'},
    {n:'Milestone Tracker',h:'/tools/parenting/milestone-tracker.html',c:'parenting',d:'Track baby developmental milestones by age.'},
    {n:'Sleep Schedule Planner',h:'/tools/parenting/sleep-schedule-planner.html',c:'parenting',d:'Plan baby and toddler sleep schedules.'},
    {n:'PAN Card Validator',h:'/tools/utility/pan-card-validator.html',c:'utility',d:'Validate Indian PAN card number format and identify card type.'},
    {n:'Indian Number Format',h:'/tools/utility/indian-number-format.html',c:'utility',d:'Convert numbers to Indian format with lakh, crore, and arab.'},
    {n:'UPI QR Generator',h:'/tools/utility/upi-qr-generator.html',c:'utility',d:'Generate UPI payment QR codes for receiving money.'},
    {n:'Vehicle Number Validator',h:'/tools/utility/vehicle-number-validator.html',c:'utility',d:'Validate Indian vehicle registration numbers and identify state.'},
    {n:'WiFi QR Generator',h:'/tools/developer/wifi-qr-generator.html',c:'developer',d:'Generate QR codes to share WiFi passwords securely.'},
    {n:'Cron Builder',h:'/tools/developer/cron-builder.html',c:'developer',d:'Build cron expressions visually with human-readable descriptions.'},
    {n:'Color Contrast Checker',h:'/tools/developer/color-contrast-checker.html',c:'developer',d:'Check WCAG color contrast ratios for accessibility compliance.'},
    {n:'SQL Formatter',h:'/tools/developer/sql-formatter.html',c:'developer',d:'Format and beautify SQL queries with proper indentation.'},
    {n:'Robots.txt Generator',h:'/tools/developer/robots-txt-generator.html',c:'developer',d:'Generate robots.txt files for search engine crawling rules.'},
    {n:'JWT Generator',h:'/tools/developer/jwt-generator.html',c:'developer',d:'Generate and decode JWT tokens with HMAC-SHA256 signing.'},
    {n:'Pincode Search',h:'/tools/utility/pincode-search.html',c:'utility',d:'Search Indian pincodes to find area, city, and state.'}
];

// Dynamic tool count from registry
var OPTI_TOOL_COUNT = allToolsData.length;
var OPTI_TOOL_COUNT_STR = OPTI_TOOL_COUNT + '+';

// Global tool-count updater — single source of truth for every page
// Replaces ALL hardcoded tool-count strings ("330+","300+","317+",etc.)
// in title, meta, OG, Twitter, JSON-LD, and visible body text.
function OPTI_updateToolCounts() {
    if (typeof OPTI_TOOL_COUNT_STR === 'undefined') return;
    var count = OPTI_TOOL_COUNT_STR;
    var patterns = ['371+', '330+', '317+', '300+'];

    function replaceIn(str) {
        for (var i = 0; i < patterns.length; i++) {
            str = str.split(patterns[i]).join(count);
        }
        return str;
    }

    // <title>
    if (document.title) document.title = replaceIn(document.title);

    // <meta> tags (description, og:*, twitter:*)
    document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]').forEach(function (m) {
        if (m.content) m.content = replaceIn(m.content);
    });

    // JSON-LD <script> blocks
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) {
        if (s.textContent) {
            var replaced = replaceIn(s.textContent);
            if (replaced !== s.textContent) {
                try { JSON.parse(replaced); s.textContent = replaced; } catch (e) {}
            }
        }
    });

    // Visible body text: [data-tool-count] elements
    document.querySelectorAll('[data-tool-count]').forEach(function (el) {
        el.textContent = count;
    });

    // Visible body text: all text nodes containing any pattern
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(function (node) {
        var original = node.nodeValue;
        var replaced = replaceIn(original);
        if (replaced !== original) node.nodeValue = replaced;
    });

    // Search input placeholders
    document.querySelectorAll('input[placeholder]').forEach(function (input) {
        input.placeholder = replaceIn(input.placeholder);
    });
}

// Run automatically on every page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', OPTI_updateToolCounts);
} else {
    OPTI_updateToolCounts();
}

var SIDEBAR_CATEGORIES = [
    {id:'all',name:'All Tools',count: OPTI_TOOL_COUNT_STR},
    {id:'image',name:'Image Tools',count:'10+'},
    {id:'pdf',name:'PDF Tools',count:'15+'},
    {id:'text',name:'Text Tools',count:'30+'},
    {id:'career',name:'Career & Resume',count:'5+'},
    {id:'business',name:'Business Documents',count:'15+'},
    {id:'professional',name:'Professional Tools',count:'5+'},
    {id:'calculator',name:'Calculator Tools',count:'50+'},
    {id:'developer',name:'Developer Tools',count:'35+'},
    {id:'utility',name:'Utility Tools',count:'30+'},
    {id:'health',name:'Health & Fitness',count:'15+'},
    {id:'education',name:'Education',count:'20+'},
    {id:'fitness',name:'Fitness',count:'5+'},
    {id:'travel',name:'Travel',count:'5+'},
    {id:'productivity',name:'Productivity',count:'5+'},
    {id:'design',name:'Design',count:'20+'},
    {id:'home',name:'Home & DIY',count:'5+'},
    {id:'fun',name:'Fun & Games',count:'15+'},
    {id:'parenting',name:'Parenting',count:'5+'}
];

function initToolsDirectoryV2() {
    var sidebar = document.getElementById('toolsSidebar');
    var toolsGrid = document.getElementById('toolsGrid');
    var dirSearch = document.getElementById('dirSearch');
    var resultCount = document.getElementById('resultCount');
    var loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!sidebar || !toolsGrid) return;

    var PAGE_SIZE = 30;
    var currentCategory = 'all';
    var currentQuery = '';
    var displayed = 0;
    var filtered = allToolsData.slice();

    function renderSidebar() {
        var html = '<div class="tools-sidebar-title">Categories</div>';
        SIDEBAR_CATEGORIES.forEach(function (cat) {
            html += '<button class="tools-sidebar-item' + (cat.id === currentCategory ? ' active' : '') + '" data-cat="' + cat.id + '">' +
                '<span>' + cat.name + '</span>' +
                '<span class="sidebar-count">' + cat.count + '</span>' +
                '</button>';
        });
        sidebar.innerHTML = html;

        sidebar.querySelectorAll('.tools-sidebar-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentCategory = this.getAttribute('data-cat');
                displayed = 0;
                applyFilter();
                renderSidebar();
            });
        });
    }

    function applyFilter() {
        filtered = allToolsData.filter(function (t) {
            var matchCat = currentCategory === 'all' || t.c === currentCategory;
            var matchQuery = !currentQuery ||
                t.n.toLowerCase().indexOf(currentQuery) !== -1 ||
                t.d.toLowerCase().indexOf(currentQuery) !== -1;
            return matchCat && matchQuery;
        });
        displayed = 0;
        toolsGrid.innerHTML = '';
        renderBatch();
    }

    function renderBatch() {
        var batch = filtered.slice(displayed, displayed + PAGE_SIZE);
        batch.forEach(function (t) {
            var card = document.createElement('a');
            card.href = t.h;
            card.className = 'tool-card';
            card.setAttribute('data-category', t.c);
            card.innerHTML = '<h3 class="tool-card-title">' + escapeHtmlV2(t.n) + '</h3>' +
                '<p class="tool-card-desc">' + escapeHtmlV2(t.d) + '</p>' +
                '<span class="tool-card-tag blue" style="font-size:0.65rem;">' + escapeHtmlV2(t.c) + '</span>';
            toolsGrid.appendChild(card);
        });
        displayed += batch.length;
        if (resultCount) resultCount.textContent = filtered.length + ' tools found';
        if (loadMoreBtn) loadMoreBtn.style.display = displayed < filtered.length ? '' : 'none';
    }

    function escapeHtmlV2(s) {
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(s));
        return d.innerHTML;
    }

    // Search
    if (dirSearch) {
        dirSearch.addEventListener('input', function () {
            currentQuery = this.value.toLowerCase().trim();
            currentCategory = 'all';
            applyFilter();
            renderSidebar();
        });
        // Pre-fill from URL query parameter (?search= or ?q=)
        var urlParams = new URLSearchParams(window.location.search);
        var searchQuery = urlParams.get('search') || urlParams.get('q');
        if (searchQuery) {
            dirSearch.value = searchQuery;
            currentQuery = searchQuery.toLowerCase().trim();
            applyFilter();
            renderSidebar();
        }
    }

    // Load More
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            renderBatch();
        });
    }

    renderSidebar();
    applyFilter();
}

// ── Lazy-Load Helpers (Block 2) ───────────────────────────────
function _loadScript(src) {
    return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = function () { reject(new Error('Failed to load ' + src)); };
        document.head.appendChild(s);
    });
}

function loadJsPDF() {
    if (typeof window.jspdf !== 'undefined') return Promise.resolve();
    return _loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
}

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
// Guard: only attach listeners on pages that have FAQs
(function () {
    var faqBtns = document.querySelectorAll('.faq-question');
    if (!faqBtns.length) return;
    faqBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            var targetButton = e.target.closest('.faq-question');
            if (!targetButton) return;
            var item = targetButton.parentElement;
            var isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(function (i) {
                i.classList.remove('open');
            });
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
})();

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

    // Search button click handler
    var searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            var query = searchInput.value.trim();
            if (query) {
                window.location.href = '/tools.html?q=' + encodeURIComponent(query);
            }
        });
    }

    // Keyboard navigation
    searchInput.addEventListener('keydown', function (e) {
        var items = dropdown.querySelectorAll('.search-dropdown-item');

        if (e.key === 'ArrowDown' && items.length && dropdown.style.display !== 'none') {
            e.preventDefault();
            selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
            updateHighlight(items);
        } else if (e.key === 'ArrowUp' && items.length && dropdown.style.display !== 'none') {
            e.preventDefault();
            selectedIdx = Math.max(selectedIdx - 1, 0);
            updateHighlight(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIdx >= 0 && items[selectedIdx]) {
                window.location.href = items[selectedIdx].href;
            } else {
                var query = searchInput.value.trim();
                if (query) {
                    window.location.href = '/tools.html?q=' + encodeURIComponent(query);
                }
            }
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
_ric(function () {
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
});

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
_ric(function () {
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
        '/tools/health/bmr-calculator.html': 'BMR Calculator',
        '/tools/developer/css-gradient-generator.html': 'CSS Gradient Generator',
        '/tools/developer/html-entities.html': 'HTML Entities',
        '/tools/developer/regex-tester.html': 'Regex Tester',
        '/tools/developer/uuid-generator.html': 'UUID Generator',
        '/tools/developer/timestamp-converter.html': 'Timestamp Converter',
        '/tools/developer/json-to-csv.html': 'JSON to CSV',
        '/tools/developer/css-box-shadow-generator.html': 'Box Shadow Generator',
        '/tools/health/blood-pressure-tracker.html': 'Blood Pressure Tracker',
        '/tools/health/bac-calculator.html': 'BAC Calculator',
        '/tools/health/dosage-calculator.html': 'Dosage Calculator',
        '/tools/health/menstrual-cycle-calculator.html': 'Cycle Calculator',
        '/tools/health/bsa-calculator.html': 'BSA Calculator',
        '/tools/health/target-heart-rate.html': 'Target Heart Rate',
        '/tools/calculators/reverse-sales-tax-calculator.html': 'Reverse Sales Tax',
        '/tools/calculators/bill-split-calculator.html': 'Bill Split Calculator',
        '/tools/calculators/simple-interest-calculator.html': 'Simple Interest',
        '/tools/calculators/future-value-annuity.html': 'Future Value Annuity',
        '/tools/calculators/mileage-calculator.html': 'Mileage Calculator',
        '/tools/calculators/hourly-to-salary.html': 'Hourly to Salary',
        '/tools/calculators/percent-error-calculator.html': 'Percent Error',
        '/tools/home/wallpaper-calculator.html': 'Wallpaper Calculator',
        '/tools/home/paint-calculator.html': 'Paint Calculator',
        '/tools/home/concrete-calculator.html': 'Concrete Calculator',
        '/tools/home/shoe-size-converter.html': 'Shoe Size Converter',
        '/tools/home/cooking-converter.html': 'Cooking Converter',
        '/tools/fun/random-recipe.html': 'Random Recipe',
        '/tools/fun/would-you-rather.html': 'Would You Rather',
        '/tools/fun/random-joke.html': 'Random Joke',
        '/tools/fun/coin-flip.html': 'Coin Flip',
        '/tools/fun/random-color-generator.html': 'Random Color'
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
});

// ── trackRecentTool — callable from any tool page ─────────
function trackRecentTool(toolName, toolPath) {
    if (!toolName || !toolPath) return;
    try {
        var recent = JSON.parse(localStorage.getItem('optidrop_recent_tools') || '[]');
        recent = recent.filter(function (r) { return r.path !== toolPath; });
        recent.unshift({ name: toolName, path: toolPath, time: Date.now() });
        if (recent.length > 5) recent = recent.slice(0, 5);
        localStorage.setItem('optidrop_recent_tools', JSON.stringify(recent));
    } catch (e) {}
}

// ── Render Recently Used on Homepage ────────────────────────
_ric(function () {
    var container = document.getElementById('recentToolsSection');
    if (!container) return;
    try {
        var recent = JSON.parse(localStorage.getItem('optidrop_recent_tools') || '[]');
        if (recent.length === 0) return;
        // Show last 3
        var items = recent.slice(0, 3);
        items.forEach(function (r) {
            if (!r.path || !r.name || r.path.charAt(0) !== '/') return;
            var a = document.createElement('a');
            a.href = r.path;
            a.className = 'tool-card';
            a.style.cssText = 'padding:1rem;min-height:auto;';
            var title = document.createElement('span');
            title.className = 'tool-card-title';
            title.style.cssText = 'font-size:0.95rem;';
            title.textContent = r.name;
            var desc = document.createElement('span');
            desc.className = 'tool-card-desc';
            desc.style.cssText = 'font-size:0.8rem;';
            desc.textContent = 'Continue where you left off';
            a.appendChild(title);
            a.appendChild(desc);
            container.appendChild(a);
        });
        container.parentElement.style.display = '';
    } catch (e) {}
});

// ════════════════════════════════════════════════════════════
// FEATURE 3 — Keyboard Command Palette
// ════════════════════════════════════════════════════════════
_ric(function () {
    /* Derive command palette from allToolsData — always in sync */
    var _catMap = {image:'Image',pdf:'PDF',text:'Text',career:'Career',business:'Business',professional:'Professional',calculator:'Calculator',developer:'Developer',utility:'Utility',health:'Health',education:'Education',fitness:'Fitness',travel:'Travel',productivity:'Productivity',design:'Design',home:'Home',fun:'Fun',parenting:'Parenting'};
    var allTools = (typeof allToolsData !== 'undefined') ? allToolsData.map(function (t) {
        return { name: t.n, href: t.h, cat: _catMap[t.c] || t.c };
    }) : [];

    // Create overlay
    var overlay = document.createElement('div');
    overlay.id = 'cmdPalette';
    overlay.className = 'cmd-palette-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = '<div class="cmd-palette-box">' +
        '<input type="text" id="cmdInput" class="cmd-palette-input" placeholder="Search 300+ tools..." autocomplete="off">' +
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
});

// ════════════════════════════════════════════════════════════
// FEATURE 6 — Dark Mode Toggle
// ════════════════════════════════════════════════════════════
_ric(function () {
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
});

// ════════════════════════════════════════════════════════════
// FEATURE 8 — Mobile Floating Action Button
// ════════════════════════════════════════════════════════════
_ric(function () {
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
});

// ── Share Bar Injection (appears in result cards after task completion) ──
_ric(function () {
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
});

// ════════════════════════════════════════════════════════════
// FEATURE 9 — Favorites / Bookmarks System
// Users can star their most-used tools for quick access
// ════════════════════════════════════════════════════════════
_ric(function () {
    var FAVORITES_KEY = 'optidrop_favorites';

    function getFavorites() {
        try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch (e) { return []; }
    }

    function saveFavorites(favs) {
        try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs)); } catch (e) {}
    }

    function isFavorited(path) {
        return getFavorites().some(function (f) { return f.path === path; });
    }

    function toggleFavorite(name, path) {
        var favs = getFavorites();
        var idx = favs.findIndex(function (f) { return f.path === path; });
        if (idx >= 0) {
            favs.splice(idx, 1);
            showToast('Removed from favorites');
        } else {
            favs.unshift({ name: name, path: path, time: Date.now() });
            if (favs.length > 20) favs = favs.slice(0, 20);
            showToast('Added to favorites ★');
        }
        saveFavorites(favs);
        return idx < 0;
    }

    // Expose globally for tool pages
    window.OptiDropFavorites = {
        get: getFavorites,
        toggle: toggleFavorite,
        isFavorited: isFavorited
    };

    // Inject favorite button on tool pages
    var path = window.location.pathname;
    var SKIP = ['/', '/index.html', '/tools.html', '/blog/', '/category/', '/about', '/contact', '/privacy', '/terms', '/404'];
    var isToolPage = !SKIP.some(function (p) { return path === p || (p !== '/' && path.indexOf(p) === 0); });
    if (path === '/' || path === '/index.html') isToolPage = false;

    if (isToolPage) {
        // Find tool name from document title
        var titleParts = document.title.split('—');
        var toolName = titleParts[0] ? titleParts[0].replace(/Online Free|Free/gi, '').trim() : '';

        if (toolName) {
            var favBtn = document.createElement('button');
            favBtn.className = 'fav-btn';
            favBtn.setAttribute('aria-label', 'Toggle favorite');
            favBtn.title = 'Add to favorites';
            favBtn.innerHTML = '<svg class="fav-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>';

            // Set initial state
            if (isFavorited(path)) {
                favBtn.classList.add('favorited');
                favBtn.querySelector('.fav-icon').setAttribute('fill', '#f59e0b');
                favBtn.querySelector('.fav-icon').setAttribute('stroke', '#f59e0b');
            }

            favBtn.addEventListener('click', function () {
                var nowFav = toggleFavorite(toolName, path);
                if (nowFav) {
                    favBtn.classList.add('favorited');
                    favBtn.querySelector('.fav-icon').setAttribute('fill', '#f59e0b');
                    favBtn.querySelector('.fav-icon').setAttribute('stroke', '#f59e0b');
                } else {
                    favBtn.classList.remove('favorited');
                    favBtn.querySelector('.fav-icon').setAttribute('fill', 'none');
                    favBtn.querySelector('.fav-icon').setAttribute('stroke', 'currentColor');
                }
            });

            // Position near the header or h1
            var h1 = document.querySelector('main h1');
            if (h1) {
                h1.style.display = 'inline-flex';
                h1.style.alignItems = 'center';
                h1.style.gap = '0.5rem';
                h1.appendChild(favBtn);
            }
        }
    }

    // Show favorites section on homepage
    if (path === '/' || path === '/index.html') {
        var container = document.getElementById('recentToolsSection');
        if (container) {
            var favs = getFavorites();
            if (favs.length > 0) {
                var wrapper = document.getElementById('recentToolsWrapper');
                // Create favorites section
                var favSection = document.createElement('section');
                favSection.className = 'w-full max-w-6xl mx-auto px-4 sm:px-6 pb-6';
                favSection.innerHTML = '<div class="flex items-center justify-between mb-4"><h2 class="text-lg font-bold text-slate-900">★ Your Favorites</h2></div><div class="grid grid-cols-1 sm:grid-cols-3 gap-4" id="favoritesGrid"></div>';
                var main = document.querySelector('main');
                var firstSection = main.querySelector('section:nth-child(2)');
                if (firstSection) {
                    main.insertBefore(favSection, firstSection);
                }
                var favGrid = document.getElementById('favoritesGrid');
                if (favGrid) {
                    favs.slice(0, 6).forEach(function (f) {
                        if (!f.path || !f.name || f.path.charAt(0) !== '/') return;
                        var a = document.createElement('a');
                        a.href = f.path;
                        a.className = 'tool-card';
                        a.style.cssText = 'padding:1rem;min-height:auto;';
                        a.innerHTML = '<span class="tool-card-title" style="font-size:0.95rem;">★ ' + escapeHtml(f.name) + '</span><span class="tool-card-desc" style="font-size:0.8rem;">Quick access</span>';
                        favGrid.appendChild(a);
                    });
                }
            }
        }
    }

    function escapeHtml(s) {
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(s));
        return d.innerHTML;
    }
});

// ════════════════════════════════════════════════════════════
// FEATURE 10 — Enhanced Search with Fuzzy Matching
// ════════════════════════════════════════════════════════════
_ric(function () {
    // Enhance the command palette search with fuzzy matching
    var originalRender = null;

    function fuzzyMatch(query, text) {
        if (!query) return true;
        query = query.toLowerCase();
        text = text.toLowerCase();
        // Exact substring match
        if (text.indexOf(query) !== -1) return true;
        // Fuzzy: each query char must appear in order
        var qi = 0;
        for (var ti = 0; ti < text.length && qi < query.length; ti++) {
            if (text[ti] === query[qi]) qi++;
        }
        return qi === query.length;
    }

    // Override the command palette render function
    var cmdInput = document.getElementById('cmdInput');
    if (cmdInput) {
        cmdInput.addEventListener('input', function () {
            var query = this.value.trim();
            if (!query || query.length < 2) return;

            // Use fuzzy matching for better results
            var results = allToolsData.filter(function (t) {
                return fuzzyMatch(query, t.n) || fuzzyMatch(query, t.d);
            }).slice(0, 12);

            var cmdResults = document.getElementById('cmdResults');
            if (cmdResults && results.length > 0) {
                cmdResults.innerHTML = '';
                results.forEach(function (t) {
                    var div = document.createElement('a');
                    div.href = t.h;
                    div.className = 'cmd-palette-item';
                    div.innerHTML = '<span class="cmd-item-name">' + t.n + '</span><span class="cmd-item-cat">' + (t.c || '') + '</span>';
                    cmdResults.appendChild(div);
                });
            }
        }, true); // Use capture to run before the original handler
    }
});

// ════════════════════════════════════════════════════════════
// FEATURE 10b — Scroll-aware header (adds .scrolled class after 10px)
// ════════════════════════════════════════════════════════════
_ric(function () {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
        if (window.scrollY > 10) { header.classList.add('scrolled'); }
        else { header.classList.remove('scrolled'); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});

// FEATURE 11 — Scroll to Top Button
// ════════════════════════════════════════════════════════════
_ric(function () {
    var btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>';
    btn.style.cssText = 'position:fixed;bottom:80px;right:20px;width:44px;height:44px;border-radius:50%;background:#e91e63;color:white;display:none;align-items:center;justify-content:center;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(233,30,99,0.4);z-index:999;transition:opacity 0.3s,transform 0.3s;';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            btn.style.display = 'flex';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        } else {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(10px)';
            setTimeout(function () { if (window.scrollY <= 400) btn.style.display = 'none'; }, 300);
        }
    });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ── AdSense Empty Slot Handler ───────────────────────────────
// Hides empty ad containers so they don't leave blank gaps.
// Only hides the ad element itself — never its parent (which caused blank pages).
(function () {
    function check() {
        document.querySelectorAll('ins.adsbygoogle').forEach(function (el) {
            if (!el.offsetHeight || el.innerHTML.trim() === '') {
                el.style.display = 'none';
            }
        });
    }
    setTimeout(check, 3000);
    setTimeout(check, 6000);
})();

// ════════════════════════════════════════════════════════════
// INDEXEDDB HELPER — Shared auto-save for tool pages
// ════════════════════════════════════════════════════════════
var OptiDB = {
    _db: null,
    open: function () {
        if (this._db) return Promise.resolve(this._db);
        var self = this;
        return new Promise(function (res, rej) {
            var req = indexedDB.open('optidrop_autosave', 1);
            req.onupgradeneeded = function (e) {
                var db = e.target.result;
                if (!db.objectStoreNames.contains('drafts')) {
                    db.createObjectStore('drafts', { keyPath: 'id' });
                }
            };
            req.onsuccess = function (e) {
                self._db = e.target.result;
                res(self._db);
            };
            req.onerror = function () { rej(req.error); };
        });
    },
    save: function (id, data) {
        return this.open().then(function (db) {
            return new Promise(function (res, rej) {
                var tx = db.transaction('drafts', 'readwrite');
                tx.objectStore('drafts').put({ id: id, data: data, savedAt: Date.now() });
                tx.oncomplete = res;
                tx.onerror = function () { rej(tx.error); };
            });
        });
    },
    load: function (id) {
        return this.open().then(function (db) {
            return new Promise(function (res, rej) {
                var req = db.transaction('drafts', 'readonly').objectStore('drafts').get(id);
                req.onsuccess = function () { res(req.result ? req.result.data : null); };
                req.onerror = function () { rej(req.error); };
            });
        });
    }
};
window.OptiDB = OptiDB;

// ════════════════════════════════════════════════════════════
// PHASE 4A — SEARCH BAR WIRING
// Homepage: Enter redirects to /tools.html?q=query
// Tools page: instant client-side filtering of tool cards
// ════════════════════════════════════════════════════════════
(function () {
    var searchInput = document.getElementById('toolSearch');
    var searchBtn = document.getElementById('searchBtn');
    if (!searchInput) return;

    var isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    var isToolsPage = window.location.pathname === '/tools.html' || window.location.pathname.indexOf('/tools.html') !== -1;

    function doSearch() {
        var query = searchInput.value.trim();
        if (!query) return;

        if (isHomepage) {
            // Redirect to tools page with search query
            window.location.href = '/tools.html?q=' + encodeURIComponent(query);
        } else if (isToolsPage) {
            // Filter tool cards on the tools page
            filterToolCards(query);
        } else {
            // On any other page, redirect to tools with query
            window.location.href = '/tools.html?q=' + encodeURIComponent(query);
        }
    }

    function filterToolCards(query) {
        query = query.toLowerCase();
        var cards = document.querySelectorAll('.tool-card');
        var visibleCount = 0;

        cards.forEach(function (card) {
            var title = (card.querySelector('.tool-card-title') || card.querySelector('.featured-name') || {}).textContent || '';
            var desc = (card.querySelector('.tool-card-desc') || card.querySelector('.featured-desc') || {}).textContent || '';
            var tag = (card.querySelector('.tool-card-tag') || {}).textContent || '';
            var searchText = (title + ' ' + desc + ' ' + tag).toLowerCase();

            if (!query || searchText.indexOf(query) !== -1) {
                card.style.display = '';
                card.style.opacity = '1';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });

        // Update result count if it exists
        var resultCount = document.querySelector('.result-count');
        if (resultCount) {
            resultCount.textContent = visibleCount + ' tools found';
        }

        // Track search
        if (typeof OptiTrack !== 'undefined' && OptiTrack.searchUsed) {
            OptiTrack.searchUsed(query, visibleCount);
        }
    }

    // Enter key triggers search
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            doSearch();
        }
    });

    // Button click triggers search
    if (searchBtn) {
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            doSearch();
        });
    }

    // On tools page, also do live filtering as user types
    if (isToolsPage) {
        var debounceTimer = null;
        searchInput.addEventListener('input', function () {
            var query = this.value.trim();
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                filterToolCards(query);
            }, 200);
        });

        // Pre-fill search from URL params
        try {
            var urlParams = new URLSearchParams(window.location.search);
            var q = urlParams.get('q');
            if (q) {
                searchInput.value = q;
                filterToolCards(q);
            }
        } catch (e) {}
    }
})();

// ════════════════════════════════════════════════════════════
// PHASE 4B — PUBLIC REVIEW WALL (review.html)
// Pre-populated with authentic mock reviews
// ════════════════════════════════════════════════════════════
(function () {
    // Only run on review.html
    if (window.location.pathname.indexOf('review') === -1) return;

    // Check for either reviewWall or reviewFeed container
    var container = document.getElementById('reviewWall') || document.getElementById('reviewFeed');
    if (!container) return;

    // Only inject if container has no existing review cards
    if (container.children.length > 0 && container.querySelector('.review-card')) return;

    var reviews = [
        {
            name: 'Sarah M.',
            role: 'Freelance Photographer',
            rating: 5,
            text: "I compress hundreds of photos daily for client galleries. OptiDrop's Image Compressor lets me hit exact KB targets for web uploads — and the fact that nothing gets uploaded to a server is a game-changer for client confidentiality. This is the only tool I trust.",
            tool: 'Image Compressor',
            date: 'June 2026'
        },
        {
            name: 'Rajesh K.',
            role: 'Small Business Owner, India',
            rating: 5,
            text: "The Invoice Generator saved me from buying expensive software. I create GST-compliant invoices in seconds, and everything stays on my laptop. The privacy aspect is what sold me — my financial data never leaves my browser. Absolutely brilliant for a free tool.",
            tool: 'Invoice Generator',
            date: 'May 2026'
        },
        {
            name: 'Emily T.',
            role: 'University Student, UK',
            rating: 5,
            text: "I used the Resume Builder before my graduation and got three interview callbacks within a week. The templates are clean and ATS-friendly. Best part? No sign-up, no watermark, no paywall. Just a genuinely free tool that actually works.",
            tool: 'Resume Builder',
            date: 'June 2026'
        },
        {
            name: 'Marcus L.',
            role: 'Software Engineer, Germany',
            rating: 5,
            text: "As a developer, I use the JSON Formatter and Base64 encoder daily. What I love about OptiDrop is the 100% client-side processing — I can use it on sensitive production data without worrying about data leaks. The command palette (Ctrl+K) is a nice touch too.",
            tool: 'JSON Formatter',
            date: 'April 2026'
        },
        {
            name: 'Priya S.',
            role: 'Government Exam Aspirant, India',
            rating: 5,
            text: "The Passport Photo Resizer is a lifesaver. I needed exact pixel dimensions for my exam application, and this tool resized my photo perfectly in one click. No uploads, no waiting, no watermarks. I've recommended it to everyone in my study group.",
            tool: 'Passport Photo Resizer',
            date: 'May 2026'
        },
        {
            name: 'David W.',
            role: 'Retired Teacher, USA',
            rating: 5,
            text: "I'm not tech-savvy at all, but OptiDrop is incredibly easy to use. I converted all my old iPhone photos from HEIC to JPG so I could print them. The interface is clean, the buttons are big enough to tap on my phone, and nothing confusing happened. Highly recommend for anyone who isn't a computer expert.",
            tool: 'HEIC to JPG Converter',
            date: 'March 2026'
        }
    ];

    var starSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>';

    var html = '';
    reviews.forEach(function (r) {
        var stars = '';
        for (var i = 0; i < r.rating; i++) stars += starSvg;

        html += '<div class="review-card" style="background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.5rem;display:flex;flex-direction:column;gap:0.75rem;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);will-change:transform,box-shadow;">' +
            '<div style="display:flex;align-items:center;gap:0.75rem;">' +
                '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#dbeafe,#e0e7ff);display:flex;align-items:center;justify-content:center;font-weight:800;color:#2563eb;font-size:1rem;">' + r.name.charAt(0) + '</div>' +
                '<div>' +
                    '<div style="font-weight:700;font-size:0.9rem;color:#0f172a;">' + r.name + '</div>' +
                    '<div style="font-size:0.75rem;color:#64748b;">' + r.role + '</div>' +
                '</div>' +
            '</div>' +
            '<div style="display:flex;gap:2px;">' + stars + '</div>' +
            '<p style="font-size:0.875rem;line-height:1.7;color:#475569;margin:0;">' + r.text + '</p>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;">' +
                '<span style="font-size:0.7rem;font-weight:700;color:#2563eb;background:#eff6ff;padding:0.2rem 0.6rem;border-radius:9999px;">' + r.tool + '</span>' +
                '<span style="font-size:0.7rem;color:#94a3b8;">' + r.date + '</span>' +
            '</div>' +
        '</div>';
    });

    container.innerHTML = html;

    // Add hover effects via JS (since inline styles can't do :hover)
    container.querySelectorAll('.review-card').forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            this.style.borderColor = 'transparent';
            this.style.boxShadow = '0 8px 20px -4px rgba(59,130,246,0.12), 0 4px 8px -2px rgba(0,0,0,0.06)';
            this.style.transform = 'translateY(-3px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
            this.style.transform = 'translateY(0)';
        });
    });
})();
