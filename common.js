/* =========================================================
   OptiDrop — common.js (Shared across all pages)
   Performance: Non-critical features deferred via
   requestIdleCallback. Heavy DOM (command palette, FAB,
   share-bar observer) only created when the browser is idle.
   ========================================================= */

// Polyfill requestIdleCallback for Safari
var _ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };

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

// ════════════════════════════════════════════════════════════
// MEGA MENU NAVIGATION — Injected on every page
// ════════════════════════════════════════════════════════════
(function () {
    var NAV_HTML = '<header class="site-header">' +
        '<div class="header-inner">' +
            '<a href="/" class="logo-text">Opti<span>Drop</span></a>' +
            '<nav class="header-nav">' +
                '<a href="/tools.html" class="hide-mobile">Tools</a>' +
                '<div class="nav-categories hide-mobile">' +
                    '<span class="nav-link">Categories <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></span>' +
                    '<div class="mega-menu">' +
                        '<div class="mega-menu-inner">' +
                            '<div class="mega-menu-group"><h3>Document Tools</h3>' +
                                '<a href="/category/image-tools.html" class="mega-menu-item"><span class="mm-emoji">🖼️</span><span class="mm-info"><span class="mm-name">Image Tools</span><span class="mm-count">8 tools</span></span></a>' +
                                '<a href="/category/pdf-tools.html" class="mega-menu-item"><span class="mm-emoji">📄</span><span class="mm-info"><span class="mm-name">PDF Tools</span><span class="mm-count">3 tools</span></span></a>' +
                                '<a href="/category/text-tools.html" class="mega-menu-item"><span class="mm-emoji">📝</span><span class="mm-info"><span class="mm-name">Text Tools</span><span class="mm-count">14 tools</span></span></a>' +
                            '</div>' +
                            '<div class="mega-menu-group"><h3>Work Tools</h3>' +
                                '<a href="/category/career-tools.html" class="mega-menu-item"><span class="mm-emoji">💼</span><span class="mm-info"><span class="mm-name">Career & Resume</span><span class="mm-count">7 tools</span></span></a>' +
                                '<a href="/category/business-tools.html" class="mega-menu-item"><span class="mm-emoji">📊</span><span class="mm-info"><span class="mm-name">Business Documents</span><span class="mm-count">9 tools</span></span></a>' +
                                '<a href="/category/professional-tools.html" class="mega-menu-item"><span class="mm-emoji">👔</span><span class="mm-info"><span class="mm-name">Professional Tools</span><span class="mm-count">4 tools</span></span></a>' +
                            '</div>' +
                            '<div class="mega-menu-group"><h3>Calculators & Tech</h3>' +
                                '<a href="/category/calculator-tools.html" class="mega-menu-item"><span class="mm-emoji">🧮</span><span class="mm-info"><span class="mm-name">Calculator Tools</span><span class="mm-count">24 tools</span></span></a>' +
                                '<a href="/category/developer-tools.html" class="mega-menu-item"><span class="mm-emoji">💻</span><span class="mm-info"><span class="mm-name">Developer Tools</span><span class="mm-count">8 tools</span></span></a>' +
                                '<a href="/category/utility-tools.html" class="mega-menu-item"><span class="mm-emoji">🔧</span><span class="mm-info"><span class="mm-name">Utility Tools</span><span class="mm-count">4 tools</span></span></a>' +
                            '</div>' +
                            '<div class="mega-menu-group"><h3>Life & Lifestyle</h3>' +
                                '<a href="/category/health-tools.html" class="mega-menu-item"><span class="mm-emoji">❤️</span><span class="mm-info"><span class="mm-name">Health & Fitness</span><span class="mm-count">15 tools</span></span></a>' +
                                '<a href="/category/education-tools.html" class="mega-menu-item"><span class="mm-emoji">🎓</span><span class="mm-info"><span class="mm-name">Education</span><span class="mm-count">7 tools</span></span></a>' +
                                '<a href="/category/fitness-tools.html" class="mega-menu-item"><span class="mm-emoji">🏋️</span><span class="mm-info"><span class="mm-name">Fitness</span><span class="mm-count">6 tools</span></span></a>' +
                                '<a href="/category/travel-tools.html" class="mega-menu-item"><span class="mm-emoji">✈️</span><span class="mm-info"><span class="mm-name">Travel</span><span class="mm-count">2 tools</span></span></a>' +
                                '<a href="/category/productivity-tools.html" class="mega-menu-item"><span class="mm-emoji">⏱️</span><span class="mm-info"><span class="mm-name">Productivity</span><span class="mm-count">7 tools</span></span></a>' +
                                '<a href="/category/design-tools.html" class="mega-menu-item"><span class="mm-emoji">🎨</span><span class="mm-info"><span class="mm-name">Design</span><span class="mm-count">6 tools</span></span></a>' +
                                '<a href="/category/home-tools.html" class="mega-menu-item"><span class="mm-emoji">🏠</span><span class="mm-info"><span class="mm-name">Home & DIY</span><span class="mm-count">5 tools</span></span></a>' +
                                '<a href="/category/fun-tools.html" class="mega-menu-item"><span class="mm-emoji">🎮</span><span class="mm-info"><span class="mm-name">Fun & Games</span><span class="mm-count">12 tools</span></span></a>' +
                                '<a href="/category/parenting-tools.html" class="mega-menu-item"><span class="mm-emoji">👶</span><span class="mm-info"><span class="mm-name">Parenting</span><span class="mm-count">2 tools</span></span></a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="mega-menu-footer"><a href="/tools.html">Browse All 258 Tools →</a></div>' +
                    '</div>' +
                '</div>' +
                '<a href="/blog/" class="hide-mobile">Blog</a>' +
                '<a href="/about.html" class="hide-mobile">About</a>' +
                '<span class="privacy-badge"><span class="dot"></span> <span>100% Private</span></span>' +
                '<span class="kbd-hint hide-mobile" onclick="document.dispatchEvent(new KeyboardEvent(\'keydown\',{key:\'k\',ctrlKey:true}))"><kbd>/</kbd> Tools</span>' +
                '<button class="mobile-menu-toggle" aria-label="Menu">' +
                    '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
                '</button>' +
            '</nav>' +
        '</div>' +
        '<nav class="mobile-nav">' +
            '<a href="/tools.html">All Tools</a>' +
            '<div class="mobile-accordion">' +
                '<button class="mobile-accordion-trigger">Categories <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button>' +
                '<div class="mobile-accordion-content">' +
                    '<a href="/category/image-tools.html">🖼️ Image Tools</a>' +
                    '<a href="/category/pdf-tools.html">📄 PDF Tools</a>' +
                    '<a href="/category/text-tools.html">📝 Text Tools</a>' +
                    '<a href="/category/career-tools.html">💼 Career & Resume</a>' +
                    '<a href="/category/business-tools.html">📊 Business Documents</a>' +
                    '<a href="/category/professional-tools.html">👔 Professional Tools</a>' +
                    '<a href="/category/calculator-tools.html">🧮 Calculator Tools</a>' +
                    '<a href="/category/developer-tools.html">💻 Developer Tools</a>' +
                    '<a href="/category/utility-tools.html">🔧 Utility Tools</a>' +
                    '<a href="/category/health-tools.html">❤️ Health & Fitness</a>' +
                    '<a href="/category/education-tools.html">🎓 Education</a>' +
                    '<a href="/category/fitness-tools.html">🏋️ Fitness</a>' +
                    '<a href="/category/travel-tools.html">✈️ Travel</a>' +
                    '<a href="/category/productivity-tools.html">⏱️ Productivity</a>' +
                    '<a href="/category/design-tools.html">🎨 Design</a>' +
                    '<a href="/category/home-tools.html">🏠 Home & DIY</a>' +
                    '<a href="/category/fun-tools.html">🎮 Fun & Games</a>' +
                    '<a href="/category/parenting-tools.html">👶 Parenting</a>' +
                '</div>' +
            '</div>' +
            '<a href="/blog/">Blog</a>' +
            '<a href="/about.html">About</a>' +
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
            '<div class="footer-grid" style="grid-template-columns:1.5fr 1fr 1fr 1.5fr 1fr;">' +
                '<div class="footer-col footer-about">' +
                    '<h4>OptiDrop</h4>' +
                    '<p>Free, fast, and 100% private browser-based tools. 258+ tools for images, PDFs, resumes, invoices, calculators, developers, health, and more.</p>' +
                    '<p style="margin-top:0.75rem;font-size:0.75rem;color:#94a3b8;">© <span id="year"></span> OptiDrop. All rights reserved.</p>' +
                '</div>' +
                '<div class="footer-col">' +
                    '<h4>Quick Links</h4>' +
                    '<a href="/">Home</a>' +
                    '<a href="/tools.html">All Tools</a>' +
                    '<a href="/blog/">Blog</a>' +
                    '<a href="/about.html">About</a>' +
                    '<a href="/contact.html">Contact</a>' +
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
// CATEGORY PAGES — "You might also like" injection
// ════════════════════════════════════════════════════════════
(function () {
    var path = window.location.pathname;
    var categoryRelated = {
        '/category/image-tools.html': [
            {n:'PDF Tools',h:'/category/pdf-tools.html',e:'📄'},
            {n:'Developer Tools',h:'/category/developer-tools.html',e:'💻'},
            {n:'Design',h:'/category/design-tools.html',e:'🎨'}
        ],
        '/category/pdf-tools.html': [
            {n:'Image Tools',h:'/category/image-tools.html',e:'🖼️'},
            {n:'Text Tools',h:'/category/text-tools.html',e:'📝'},
            {n:'Business Tools',h:'/category/business-tools.html',e:'📊'}
        ],
        '/category/text-tools.html': [
            {n:'Developer Tools',h:'/category/developer-tools.html',e:'💻'},
            {n:'Education',h:'/category/education-tools.html',e:'🎓'},
            {n:'PDF Tools',h:'/category/pdf-tools.html',e:'📄'}
        ],
        '/category/career-tools.html': [
            {n:'Business Tools',h:'/category/business-tools.html',e:'📊'},
            {n:'Professional Tools',h:'/category/professional-tools.html',e:'👔'},
            {n:'Education',h:'/category/education-tools.html',e:'🎓'}
        ],
        '/category/business-tools.html': [
            {n:'Career Tools',h:'/category/career-tools.html',e:'💼'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',e:'🧮'},
            {n:'Professional Tools',h:'/category/professional-tools.html',e:'👔'}
        ],
        '/category/professional-tools.html': [
            {n:'Career Tools',h:'/category/career-tools.html',e:'💼'},
            {n:'Business Tools',h:'/category/business-tools.html',e:'📊'},
            {n:'Developer Tools',h:'/category/developer-tools.html',e:'💻'}
        ],
        '/category/calculator-tools.html': [
            {n:'Health Tools',h:'/category/health-tools.html',e:'❤️'},
            {n:'Fitness',h:'/category/fitness-tools.html',e:'🏋️'},
            {n:'Business Tools',h:'/category/business-tools.html',e:'📊'}
        ],
        '/category/developer-tools.html': [
            {n:'Text Tools',h:'/category/text-tools.html',e:'📝'},
            {n:'Design',h:'/category/design-tools.html',e:'🎨'},
            {n:'Utility Tools',h:'/category/utility-tools.html',e:'🔧'}
        ],
        '/category/utility-tools.html': [
            {n:'Developer Tools',h:'/category/developer-tools.html',e:'💻'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',e:'🧮'},
            {n:'Productivity',h:'/category/productivity-tools.html',e:'⏱️'}
        ],
        '/category/health-tools.html': [
            {n:'Fitness',h:'/category/fitness-tools.html',e:'🏋️'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',e:'🧮'},
            {n:'Education',h:'/category/education-tools.html',e:'🎓'}
        ],
        '/category/education-tools.html': [
            {n:'Text Tools',h:'/category/text-tools.html',e:'📝'},
            {n:'Career Tools',h:'/category/career-tools.html',e:'💼'},
            {n:'Health Tools',h:'/category/health-tools.html',e:'❤️'}
        ],
        '/category/fitness-tools.html': [
            {n:'Health Tools',h:'/category/health-tools.html',e:'❤️'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',e:'🧮'},
            {n:'Travel',h:'/category/travel-tools.html',e:'✈️'}
        ],
        '/category/travel-tools.html': [
            {n:'Productivity',h:'/category/productivity-tools.html',e:'⏱️'},
            {n:'Calculator Tools',h:'/category/calculator-tools.html',e:'🧮'},
            {n:'Fun & Games',h:'/category/fun-tools.html',e:'🎮'}
        ],
        '/category/productivity-tools.html': [
            {n:'Developer Tools',h:'/category/developer-tools.html',e:'💻'},
            {n:'Text Tools',h:'/category/text-tools.html',e:'📝'},
            {n:'Education',h:'/category/education-tools.html',e:'🎓'}
        ],
        '/category/design-tools.html': [
            {n:'Developer Tools',h:'/category/developer-tools.html',e:'💻'},
            {n:'Image Tools',h:'/category/image-tools.html',e:'🖼️'},
            {n:'Fun & Games',h:'/category/fun-tools.html',e:'🎮'}
        ],
        '/category/home-tools.html': [
            {n:'Calculator Tools',h:'/category/calculator-tools.html',e:'🧮'},
            {n:'Utility Tools',h:'/category/utility-tools.html',e:'🔧'},
            {n:'Fun & Games',h:'/category/fun-tools.html',e:'🎮'}
        ],
        '/category/fun-tools.html': [
            {n:'Health Tools',h:'/category/health-tools.html',e:'❤️'},
            {n:'Design',h:'/category/design-tools.html',e:'🎨'},
            {n:'Travel',h:'/category/travel-tools.html',e:'✈️'}
        ],
        '/category/parenting-tools.html': [
            {n:'Health Tools',h:'/category/health-tools.html',e:'❤️'},
            {n:'Education',h:'/category/education-tools.html',e:'🎓'},
            {n:'Fun & Games',h:'/category/fun-tools.html',e:'🎮'}
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
            html += '<a href="' + r.h + '" class="category-card"><span class="cat-emoji">' + r.e + '</span><span class="cat-info"><span class="cat-name">' + r.n + '</span></span><span class="cat-arrow">→</span></a>';
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
    {n:'Break Even Calculator',h:'/tools/calculators/break-even-calculator.html',c:'calculator',d:'Calculate break-even point for business costs and revenue.'},
    {n:'Tip Splitter',h:'/tools/calculators/tip-splitter-calculator.html',c:'calculator',d:'Split tip amount among multiple people.'},
    {n:'Percentage Change',h:'/tools/calculators/percentage-change-calculator.html',c:'calculator',d:'Calculate percentage change between two values.'},
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
    {n:'Invoice Tax Calculator',h:'/tools/calculators/invoice-tax-calculator.html',c:'calculator',d:'Calculate tax amounts for invoices.'}
];

var SIDEBAR_CATEGORIES = [
    {id:'all',name:'All Tools',count:258},
    {id:'image',name:'Image Tools',count:8},
    {id:'pdf',name:'PDF Tools',count:3},
    {id:'text',name:'Text Tools',count:14},
    {id:'career',name:'Career & Resume',count:7},
    {id:'business',name:'Business Documents',count:9},
    {id:'professional',name:'Professional Tools',count:4},
    {id:'calculator',name:'Calculator Tools',count:24},
    {id:'developer',name:'Developer Tools',count:8},
    {id:'utility',name:'Utility Tools',count:4},
    {id:'health',name:'Health & Fitness',count:15},
    {id:'education',name:'Education',count:7},
    {id:'fitness',name:'Fitness',count:6},
    {id:'travel',name:'Travel',count:2},
    {id:'productivity',name:'Productivity',count:7},
    {id:'design',name:'Design',count:6},
    {id:'home',name:'Home & DIY',count:5},
    {id:'fun',name:'Fun & Games',count:12},
    {id:'parenting',name:'Parenting',count:2}
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
});

// ════════════════════════════════════════════════════════════
// FEATURE 3 — Keyboard Command Palette
// ════════════════════════════════════════════════════════════
_ric(function () {
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
        { name: 'Aspect Ratio', href: '/tools/aspect-ratio-calculator.html', cat: 'Utility' },
        { name: 'CSS Gradient Generator', href: '/tools/developer/css-gradient-generator.html', cat: 'Developer' },
        { name: 'HTML Entities', href: '/tools/developer/html-entities.html', cat: 'Developer' },
        { name: 'Regex Tester', href: '/tools/developer/regex-tester.html', cat: 'Developer' },
        { name: 'UUID Generator', href: '/tools/developer/uuid-generator.html', cat: 'Developer' },
        { name: 'Timestamp Converter', href: '/tools/developer/timestamp-converter.html', cat: 'Developer' },
        { name: 'JSON to CSV', href: '/tools/developer/json-to-csv.html', cat: 'Developer' },
        { name: 'Box Shadow Generator', href: '/tools/developer/css-box-shadow-generator.html', cat: 'Developer' },
        { name: 'Blood Pressure Tracker', href: '/tools/health/blood-pressure-tracker.html', cat: 'Health' },
        { name: 'BAC Calculator', href: '/tools/health/bac-calculator.html', cat: 'Health' },
        { name: 'Dosage Calculator', href: '/tools/health/dosage-calculator.html', cat: 'Health' },
        { name: 'Cycle Calculator', href: '/tools/health/menstrual-cycle-calculator.html', cat: 'Health' },
        { name: 'BSA Calculator', href: '/tools/health/bsa-calculator.html', cat: 'Health' },
        { name: 'Target Heart Rate', href: '/tools/health/target-heart-rate.html', cat: 'Health' },
        { name: 'Reverse Sales Tax', href: '/tools/calculators/reverse-sales-tax-calculator.html', cat: 'Calculator' },
        { name: 'Bill Split Calculator', href: '/tools/calculators/bill-split-calculator.html', cat: 'Calculator' },
        { name: 'Simple Interest', href: '/tools/calculators/simple-interest-calculator.html', cat: 'Calculator' },
        { name: 'Future Value Annuity', href: '/tools/calculators/future-value-annuity.html', cat: 'Calculator' },
        { name: 'Mileage Calculator', href: '/tools/calculators/mileage-calculator.html', cat: 'Calculator' },
        { name: 'Hourly to Salary', href: '/tools/calculators/hourly-to-salary.html', cat: 'Calculator' },
        { name: 'Percent Error', href: '/tools/calculators/percent-error-calculator.html', cat: 'Calculator' },
        { name: 'Wallpaper Calculator', href: '/tools/home/wallpaper-calculator.html', cat: 'Utility' },
        { name: 'Paint Calculator', href: '/tools/home/paint-calculator.html', cat: 'Utility' },
        { name: 'Concrete Calculator', href: '/tools/home/concrete-calculator.html', cat: 'Utility' },
        { name: 'Shoe Size Converter', href: '/tools/home/shoe-size-converter.html', cat: 'Utility' },
        { name: 'Cooking Converter', href: '/tools/home/cooking-converter.html', cat: 'Utility' },
        { name: 'Random Recipe', href: '/tools/fun/random-recipe.html', cat: 'Fun' },
        { name: 'Would You Rather', href: '/tools/fun/would-you-rather.html', cat: 'Fun' },
        { name: 'Random Joke', href: '/tools/fun/random-joke.html', cat: 'Fun' },
        { name: 'Coin Flip', href: '/tools/fun/coin-flip.html', cat: 'Fun' },
        { name: 'Random Color Generator', href: '/tools/fun/random-color-generator.html', cat: 'Fun' }
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
