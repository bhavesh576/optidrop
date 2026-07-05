# OptiDrop — Complete Site Documentation

**Live:** [https://optidrop.online](https://optidrop.online)
**Contact:** codenza21@gmail.com
**Built by:** A solo developer in India

---

## Table of Contents

- [What OptiDrop Is](#what-optidrop-is)
- [Design System](#design-system)
- [Site Architecture](#site-architecture)
- [Homepage — Every Section](#homepage--every-section)
- [Tool Pages — Structure & Behavior](#tool-pages--structure--behavior)
- [Blog Pages — Structure](#blog-pages--structure)
- [Category Pages](#category-pages)
- [Other Pages](#other-pages)
- [Navigation System](#navigation-system)
- [Interactive Features](#interactive-features)
- [All 317 Tools — Complete List](#all-317-tools--complete-list)
- [Technical Architecture](#technical-architecture)
- [SEO Structure](#seo-structure)
- [Deployment & Performance](#deployment--performance)
- [File Structure](#file-structure)
- [Privacy & Data](#privacy--data)
- [Ads & Monetization](#ads--monetization)
- [Known Issues & Roadmap](#known-issues--roadmap)

---

## What OptiDrop Is

OptiDrop is a **static website** (no backend, no database, no server-side code) with **317+ free browser-based tools** across **18 categories**. Every tool runs entirely in the user's browser using JavaScript — files are never uploaded to any server. The site is deployed on Vercel as static HTML/CSS/JS files.

**Core differentiator:** Privacy. All processing happens client-side. No sign-up, no file uploads, no data collection. This is the primary marketing claim on the homepage and throughout the site.

**Target audience:** Students, professionals, freelancers, and everyday users who need quick utility tools (image compression, PDF manipulation, calculators, resume builders, etc.) without creating accounts or uploading sensitive files.

---

## Design System

### Brand Color: Cerise (#e91e63)

The site uses a **single signature accent color** — cerise/magenta-pink — with neutrals. This is a deliberate design choice: one accent color creates brand recognition instead of a rainbow of decorative hues.

**Color tokens (CSS custom properties in `styles.css`):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-brand-50` | `#fdf2f8` | Lightest tint — icon backgrounds, badge fills |
| `--color-brand-100` | `#fce7f3` | Light hover states |
| `--color-brand-200` | `#f9a8d4` | Light borders |
| `--color-brand-500` | `#ec4899` | Medium accent |
| `--color-brand` | `#e91e63` | **Primary accent** — buttons, links, logo, hover borders |
| `--color-brand-700` | `#be185b` | Hover/active states |
| `--color-brand-800` | `#9d174d` | Dark mode text |

**Status colors (semantic use only — not decorative):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success-500` | `#10b981` | Success toasts, form validation |
| `--color-error-500` | `#ef4444` | Error states |
| `--color-info-500` | `#64748b` | Neutral info |

**Neutral scale (Slate):**

| Token | Hex |
|-------|-----|
| `--color-slate-50` | `#f8fafc` |
| `--color-slate-100` | `#f1f5f9` |
| `--color-slate-200` | `#e2e8f0` |
| `--color-slate-300` | `#cbd5e1` |
| `--color-slate-400` | `#94a3b8` |
| `--color-slate-500` | `#64748b` |
| `--color-slate-600` | `#475569` |
| `--color-slate-700` | `#334155` |
| `--color-slate-800` | `#1e293b` |
| `--color-slate-900` | `#0f172a` |

**Shadows (brand-tinted):**

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 12px -2px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 8px 20px -4px rgba(233,30,99,0.10)` |
| `--shadow-xl` | `0 12px 24px -6px rgba(233,30,99,0.10)` |

### Border Radius Scale

| Token | Value |
|-------|-------|
| `--radius-sm` | `6px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--radius-xl` | `16px` |
| `--radius-2xl` | `24px` |
| `--radius-pill` | `9999px` |

### Typography

- **Font:** Inter (Google Fonts), loaded via `<link>` on every page
- **Weights used:** 400 (body), 500 (labels), 600 (nav links), 700 (headings), 800 (hero, card titles)
- **Body size:** 15px base, 0.9375rem on mobile (600px breakpoint)
- **H1:** 1.625rem mobile → 3rem desktop
- **H2:** 1.2rem mobile → 1.5rem desktop
- **Line height:** 1.75 for body text, 1.3-1.4 for headings

### Dark Mode

- **Toggle:** Sun/moon button in the header, saves to `localStorage` under `optidrop_dark_mode`
- **Inline script in `<head>`:** Prevents flash of wrong theme by applying `.dark-mode` class before CSS loads
- **Base background:** `#1c1f26` (softer charcoal, not pure black)
- **Card surfaces:** `#272a33` (elevated from base)
- **Borders:** `#3d4455` (visible boundaries)
- **Text:** `#e2e8f0` (primary), `#a1a7b3` (secondary)
- **Accent:** Cerise tones — `#f472b6` (light), `#3b0f2a` (background tint)

### Design Tokens Summary

All design decisions flow through CSS custom properties in `styles.css` lines 6-53. Changing a token value updates every component that uses it site-wide.

---

## Site Architecture

### Page Types

| Type | Count | Template | Example |
|------|-------|----------|---------|
| Homepage | 1 | `index.html` | [optidrop.online](https://optidrop.online) |
| Tool pages | 317 | Individual HTML files | `/compress-image.html`, `/tools/calculators/sip-calculator.html` |
| Category pages | 18 | `category/*.html` | `/category/image-tools.html` |
| Blog index | 1 | `blog/index.html` | `/blog/` |
| Blog posts | 21 | `blog/*.html` | `/blog/how-to-compress-images-for-whatsapp.html` |
| Static pages | 6 | Individual HTML | `about.html`, `contact.html`, `privacy-policy.html`, `terms.html`, `review.html`, `tools.html` |
| SEO pages | 3 | `vs/`, `best/`, `use-cases/` | `/vs/ilovepdf.html` |
| Error page | 1 | `404.html` | Custom 404 |

### Shared Components (injected by `common.js`)

Every page loads `common.js` which injects:
- **Header** (`<header class="site-header">`) — logo, nav links, mega-menu, mobile hamburger, user hub dropdown, keyboard shortcut hint
- **Footer** (`<footer class="site-footer">`) — 6-column grid with tool links, category links, about links
- **Floating Action Button** — mobile-only quick-access overlay with 8 popular tools
- **Scroll-to-top button** — appears after scrolling 400px
- **Command palette** — triggered by `/` or `Ctrl+K`, full-screen search overlay

---

## Homepage — Every Section

The homepage (`index.html`) is structured as a series of `<section>` elements:

### 1. Hero Section
- **Headline:** "Your files never leave your browser." — cerise gradient on the second line
- **Subhead:** "371+ tools for compressing images, building resumes, generating invoices, and more — all running locally in your browser. Built by a solo developer in India who got tired of tools that upload your files."
- **Search bar:** Full-width input with search icon, placeholder "Search tools...", triggers command palette on focus or `/` key
- **Stats strip:** "Runs in your browser • No sign-up • Free" — three claims separated by dots

### 2. Most Used Tools
- **Section header:** "Most Used Tools" with "View All →" link
- **Layout:** Horizontal scrollable row of 6 featured tool cards
- **Cards shown:** Image Compressor, HEIC to JPG, JPG to PDF, Resume Builder, Invoice Generator, EMI Calculator
- **Card style:** Each has a cerise top border (always visible), premium icon wrapper, tool name, short description, and a badge ("Most Used" or "Popular")

### 3. Browse by Category
- **Section header:** "Browse by Category" with "All 18 Categories →" link
- **Layout:** 4-column CSS grid showing top 8 categories (sorted by tool count)
- **Categories shown:** Image Tools, PDF Tools, Calculators, Developer, Text Tools, Business, Education, Health
- **Card style:** Flat cards with icon, category name, tool count, and arrow — no lift on hover, just border color change

### 4. New Tools Strip
- **Section header:** "New Tools"
- **Layout:** Horizontal row of pill-shaped links with "New" badge
- **Shows:** Recently added tools (Body Fat Calculator, 401(k) Calculator, Macro Calculator, JWT Decoder)

### 5. How It Works
- **Section header:** "How OptiDrop Works"
- **Layout:** 3-column grid
- **Steps:** "Choose a Tool" → "Set Your Options" → "Download Instantly"
- **Each step:** Has a premium icon wrapper, heading, and short description

### 6. Trust Signals
- **Layout:** 3-column grid with icon, heading, and subtext
- **Claims:** "No files uploaded — Everything stays on your device" / "No sign-up — Open a tool and start using it" / "Free, no catch — No watermarks, no hidden paywalls"

### 7. About OptiDrop
- **Prose section:** 3 paragraphs explaining what OptiDrop is, how it works, and why it's free
- **Purpose:** AdSense compliance content + SEO

### 8. FAQ
- **4 accordion items:** "What is OptiDrop?", "Is OptiDrop really free?", "How does OptiDrop protect my privacy?", "What file types are supported?"
- **Each has:** Visible question + expandable answer
- **Schema:** FAQPage JSON-LD matching visible content

---

## Tool Pages — Structure & Behavior

Every tool page follows the same template structure:

### HTML Structure
```
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags, JSON-LD schemas, CSS -->
</head>
<body>
    <header class="site-header"></header>  <!-- Injected by common.js -->
    
    <main class="flex-grow">
        <!-- H1 + description -->
        <section class="max-w-4xl mx-auto px-4 pt-8 pb-4 text-center">
            <h1>Tool Name</h1>
            <p>Short description</p>
        </section>
        
        <!-- Tool widget -->
        <section class="max-w-4xl mx-auto px-4 pb-8">
            <div class="glass-panel rounded-3xl shadow-xl overflow-hidden">
                <!-- Tool UI (forms, buttons, dropzones, results) -->
            </div>
        </section>
        
        <!-- SEO prose content (below fold) -->
        <section class="max-w-4xl mx-auto px-4 py-8">
            <h2>About this tool</h2>
            <p>Explanatory text...</p>
        </section>
        
        <!-- FAQ section -->
        <section class="max-w-4xl mx-auto px-4 py-8">
            <h2>Frequently Asked Questions</h2>
            <!-- 4 accordion items -->
        </section>
    </main>
    
    <footer class="site-footer"></footer>  <!-- Injected by common.js -->
    <script src="/common.js"></script>
    <script>/* Tool-specific JS */</script>
</body>
```

### Tool Widget Types

**File-based tools** (image compressor, PDF tools, background remover):
1. **Upload state:** Dropzone with drag-and-drop + click-to-browse
2. **Settings state:** Options panel (quality slider, format selector, dimension inputs)
3. **Loading state:** Spinner with progress bar and percentage
4. **Result state:** Before/after comparison, download button, file size display

**Calculator tools** (EMI, SIP, tax, etc.):
1. **Input form:** Number inputs with labels and placeholders
2. **Calculate button:** Triggers computation
3. **Result panel:** Formatted output with breakdown
4. **Share button:** Copies URL with hash parameters for sharing

**Text tools** (word counter, case converter, lorem ipsum):
1. **Input textarea:** Large text area
2. **Action buttons:** Convert, copy, clear
3. **Output panel:** Processed text with stats

### Ad Placement on Tool Pages

Each tool page has two ad slots:
1. **Leaderboard (728x90):** Between `</header>` and `<main>` — wrapped in `<div class="ad-slot ad-slot-leaderboard">`
2. **Rectangle (336x280):** Inside `<main>`, after the tool widget — wrapped in `<div class="ad-slot ad-slot-rectangle">`

Both are clamped to `max-height: 100px` on mobile via CSS.

---

## Blog Pages — Structure

### Blog Index (`blog/index.html`)
- **Grid layout:** `blog-grid` — responsive CSS grid, `minmax(300px, 1fr)` columns
- **Blog cards:** Thumbnail (SVG icon on gradient background), tag, title, excerpt, meta (date + read time)
- **Card hover:** Cerise border color change, subtle lift

### Blog Posts (`blog/*.html`)
- **Structure:** H1 title, meta (author, date, read time), featured image area, prose content
- **Content:** 1000-3000 words of SEO-optimized tutorial/guide content
- **Internal links:** Each post links to 1-3 relevant tool pages
- **Ad placement:** Leaderboard after header, rectangle after article
- **Schema:** Article JSON-LD with headline, datePublished, author

### Existing Blog Posts (21)

1. How to Compress Images for WhatsApp
2. EMI Calculator Guide India
3. PAN Card Format Explained
4. UPI QR Code Guide
5. Free Resume Builder Guide
6. How to Compress PDF for Email
7. How to Convert HEIC to JPG
8. How to Resize Passport Photo Online
9. Passport Photo Size Guide All Countries
10. Compress Image for Visa Application
11. CSS Gradient Generator Guide
12. CSS Minification Guide
13. Blood Pressure Tracking Without Apps
14. GST Calculator India How to Use
15. EMI vs SIP Calculator Difference
16. Paycheck Calculator US Taxes
17. Resume Tips ATS Friendly
18. Wall Paint Estimate DIY Calculator
19. Macro Calculator Diet Planning
20. Fun Tools to Break Boredom
21. 401k Calculator Guide

---

## Category Pages

Each category page (`category/*.html`) lists all tools in that category as tool cards in a responsive grid.

**Layout:** `tools-grid` — CSS grid with `repeat(auto-fill, minmax(200px, 1fr))`

**Tool card structure:**
- Premium icon wrapper (cerise accent)
- Tool name
- Short description
- Link to tool page

**Categories (18 total):**

| Category | File | Tool Count |
|----------|------|------------|
| Image Tools | `category/image-tools.html` | 10+ |
| PDF Tools | `category/pdf-tools.html` | 15+ |
| Text Tools | `category/text-tools.html` | 30+ |
| Calculator Tools | `category/calculator-tools.html` | 50+ |
| Developer Tools | `category/developer-tools.html` | 35+ |
| Career & Resume | `category/career-tools.html` | 5+ |
| Business Documents | `category/business-tools.html` | 15+ |
| Professional Tools | `category/professional-tools.html` | 5+ |
| Health Tools | `category/health-tools.html` | 15+ |
| Education Tools | `category/education-tools.html` | 20+ |
| Fitness Tools | `category/fitness-tools.html` | 5+ |
| Utility Tools | `category/utility-tools.html` | 30+ |
| Fun & Games | `category/fun-tools.html` | 15+ |
| Home & DIY | `category/home-tools.html` | 5+ |
| Productivity | `category/productivity-tools.html` | 5+ |
| Travel Tools | `category/travel-tools.html` | 5+ |
| Design Tools | `category/design-tools.html` | 20+ |
| Parenting Tools | `category/parenting-tools.html` | 5+ |

---

## Other Pages

### About Page (`about.html`)
- **Sections:** Hero, Stats (300+ tools, 0 uploads, 0 sign-ups), How We Build Our Tools (3 cards), About the Builder, Update Frequency, FAQ (4 items)
- **Builder bio:** "OptiDrop is built and maintained by a solo developer in India."
- **Organization schema:** JSON-LD with name, URL, logo, contact email

### Contact Page (`contact.html`)
- **Email link:** `codenza21@gmail.com` — clicking opens a compose modal (Formsubmit.co)
- **Feedback form:** Name, email, subject dropdown, message textarea — submits to Formsubmit.co
- **Success state:** Green checkmark with "Thank you for your feedback!"
- **Error state:** Alert with direct email fallback

### Review Page (`review.html`)
- **Hero:** "What Users Say About OptiDrop"
- **Sample reviews:** 10 example reviews with names, avatars, star ratings, tool badges — labeled as "Sample feedback — your review will appear above once submitted."
- **User-submitted reviews:** Appear at top of feed, stored in localStorage, persist across refreshes
- **Review form:** Star rating selector, name, tool dropdown, message textarea
- **No fabricated stats:** Aggregate numbers (rating, count, percentage) have been removed

### Tools Directory (`tools.html`)
- **Full tool list:** All 317+ tools searchable with filters
- **Category filter chips:** 18 category buttons
- **Search bar:** Instant client-side filtering with 200ms debounce
- **URL parameter:** `?q=` pre-fills search on load

### Privacy Policy (`privacy-policy.html`)
- **Sections:** What we collect (nothing), localStorage usage, Google Analytics, AdSense/cookies, third-party services, data retention, children's privacy, changes, contact
- **Contact email:** codenza21@gmail.com
- **Last updated:** May 2026

### Terms of Service (`terms.html`)
- **9 sections:** Acceptance, free service, user ownership, no warranties, limitation of liability, privacy, intellectual property, changes, contact
- **Contact email:** codenza21@gmail.com

---

## Navigation System

### Desktop Header (sticky, `position: sticky; top: 0; z-index: 1000`)
- **Logo:** SVG drop mark + "OptiDrop" text (cerise accent on "Drop")
- **Nav links:** "All Tools" (accent-styled button), Categories (mega-menu dropdown), Blog, Reviews, About
- **Right side:** Feedback button (cerise outline), privacy badge ("100% Private" with green dot), keyboard shortcut hint (`/` key), user hub dropdown (recently used + saved tools)
- **Scroll behavior:** Header becomes more opaque with stronger shadow after scrolling 10px (`.scrolled` class)

### Mobile Header (below 768px)
- **Logo:** Same as desktop
- **Hamburger button:** Opens `.mobile-nav` dropdown
- **Mobile nav:** Full-width dropdown with links to Home, All Tools, Categories (accordion with all 18), Blog, Reviews, About, Give Feedback

### Mega-Menu (desktop, on Categories hover)
- **Layout:** 5-column grid grouped by theme
- **Groups:** Document Tools, Work Tools, Calculators & Tech, Life & Wellness, Creative & Home
- **Footer:** "Browse All Tools →" link

### Floating Action Button (mobile only, below 768px)
- **Position:** Fixed bottom-right, cerise circle with hamburger icon
- **Overlay:** Full-screen dark overlay with 2-column grid of 8 popular tools
- **Z-index:** 998 (below header at 1000)

### Command Palette (all pages)
- **Trigger:** `/` key, `Ctrl+K`, or clicking the search bar
- **UI:** Full-screen overlay with search input, real-time filtered results
- **Features:** Fuzzy matching, arrow key navigation, Enter to open, Escape to close
- **Data source:** `allToolsData` array in `common.js`

---

## Interactive Features

### Dark Mode Toggle
- **Location:** Header (sun/moon icon)
- **Storage:** `localStorage` under `optidrop_dark_mode`
- **Implementation:** Inline `<script>` in `<head>` applies `.dark-mode` class before CSS loads (prevents flash)

### Favorites System
- **Star button:** On every tool page title
- **Storage:** `localStorage` under `optidrop_favorites` (up to 20)
- **Display:** "Your Favorites" section on homepage

### Recently Used Tools
- **Tracking:** `localStorage` under `optidrop_recent_tools` (stores last 5, displays last 3)
- **Display:** "Pick Up Where You Left Off" section on homepage
- **User Hub:** Dropdown in header shows recently used + saved tools

### Auto-Save for Form Tools
- **Applies to:** Resume builder, cover letter, invoice generator, salary slip, SOP generator, budget planner, habit tracker, body measurement tracker, plant watering reminder, quiz generator, flashcard generator
- **Storage:** IndexedDB via `OptiDB` helper (`optidrop_autosave` database)
- **Recovery:** Draft recovery bar appears on return visits

### Clipboard Paste Detection (homepage)
- **Image paste:** Shows toast linking to Image Compressor
- **Text paste (>20 chars):** Shows toast linking to Word Counter

### Drag-and-Drop File Routing (homepage)
- **Detection:** Homepage detects dragged file type
- **Routing:** Images → compressor, HEIC → converter, PDFs → PDF compressor
- **Transfer:** Files passed via sessionStorage

### Parametric URL Sharing (calculators)
- **After calculation:** Inputs encoded into URL hash
- **Share button:** Copies full URL
- **On load:** Hash parameters pre-fill inputs and auto-calculate

### Bookmark Prompt
- **Trigger:** After using the same tool twice
- **Action:** One-time toast suggesting Ctrl+D
- **Tracking:** Per-tool via localStorage

### Scroll-to-Top Button
- **Appears:** After scrolling 400px
- **Position:** Fixed bottom-right (above FAB)
- **Color:** Cerise accent

---

## All 317 Tools — Complete List

### Image Tools (10)

| Tool | Path | Description |
|------|------|-------------|
| Image Compressor | `/compress-image.html` | Compress photos to exact KB limits (20KB, 50KB, 100KB) for passport photos, forms, WhatsApp |
| Compress Image for Instagram | `/compress-image-for-instagram.html` | Optimize images for Instagram post and story dimensions |
| HEIC to JPG Converter | `/heic-to-jpg.html` | Convert iPhone HEIC photos to universal JPG format |
| Image Format Converter | `/image-format-converter.html` | Convert between JPG, PNG, WebP, and BMP formats |
| Background Remover | `/remove-background.html` | Remove backgrounds from photos with AI-powered processing |
| Passport Photo Resizer | `/passport-photo-resizer.html` | Resize photos to passport and visa dimensions at 300 DPI |
| Name & Date Stamper | `/name-date-stamp.html` | Add name and date stamps to exam and ID photos |
| Signature Scanner | `/signature-scanner.html` | Scan and extract clean signatures from paper documents |
| Image to Text (OCR) | `/image-to-text-ocr.html` | Extract text from images using browser-based OCR |
| JPG to PDF (iPhone) | `/jpg-to-pdf-iphone.html` | Convert JPG photos to PDF on iPhone |

### PDF Tools (15)

| Tool | Path | Description |
|------|------|-------------|
| PDF Compressor | `/compress-pdf.html` | Reduce PDF file size while keeping quality |
| JPG to PDF | `/jpg-to-pdf.html` | Merge multiple images into a single PDF document |
| PDF to JPG | `/pdf-to-jpg.html` | Extract pages from PDF as high-quality JPG images |
| PDF Merger | `/tools/pdf/pdf-merger.html` | Combine multiple PDF files into a single document |
| PDF Splitter | `/tools/pdf/pdf-splitter.html` | Split PDF into individual pages or page ranges |
| PDF Watermark | `/tools/pdf/pdf-watermark.html` | Add text watermarks to all pages of a PDF |
| PDF Page Rotator | `/tools/pdf/pdf-page-rotator.html` | Rotate PDF pages by 90, 180, or 270 degrees |
| PDF Page Numbering | `/tools/pdf/pdf-page-numbering.html` | Add page numbers to PDF in any position and format |
| PDF Extract Text | `/tools/pdf/pdf-extract-text.html` | Extract all text content from PDF documents |
| PDF Grayscale | `/tools/pdf/pdf-grayscale.html` | Convert PDF pages to grayscale for printing |
| HTML to PDF | `/tools/pdf/html-to-pdf.html` | Convert HTML code to PDF with live preview |
| Markdown to PDF | `/tools/pdf/markdown-to-pdf.html` | Convert Markdown text to formatted PDF document |
| PDF Margin Adjuster | `/tools/pdf/pdf-margin-adjuster.html` | Adjust PDF page margins for printing or binding |
| Image to PDF Advanced | `/tools/pdf/image-to-pdf-advanced.html` | Convert images to PDF with custom layout options |
| PDF Password Protector | `/tools/pdf/pdf-password-protector.html` | Add password protection to PDF files |
| PDF Unlock | `/tools/pdf/pdf-unlock.html` | Remove password protection from PDF files |
| PDF Compressor Advanced | `/tools/pdf/pdf-compressor-advanced.html` | Advanced PDF compression with quality control |
| Multi PDF Combiner | `/tools/pdf/multi-pdf-combiner.html` | Combine multiple PDFs with interleave or append mode |

### Calculator Tools (48)

| Tool | Path |
|------|------|
| EMI Calculator | `/tools/emi-calculator.html` |
| SIP Calculator | `/tools/calculators/sip-calculator.html` |
| Income Tax Calculator | `/tools/calculators/income-tax-calculator.html` |
| Mortgage Calculator | `/tools/calculators/mortgage-calculator.html` |
| Tip Calculator | `/tools/calculators/tip-calculator.html` |
| Grade Calculator | `/tools/calculators/grade-calculator.html` |
| Loan Comparison | `/tools/calculators/loan-comparison.html` |
| Compound Interest | `/tools/calculators/compound-interest.html` |
| Retirement Calculator | `/tools/calculators/retirement-calculator.html` |
| Discount Calculator | `/tools/calculators/discount-calculator.html` |
| Date Difference | `/tools/calculators/date-difference.html` |
| Time Calculator | `/tools/calculators/time-calculator.html` |
| Fuel Cost Calculator | `/tools/calculators/fuel-cost.html` |
| Currency Converter | `/tools/calculators/currency-converter.html` |
| Calorie Calculator | `/tools/calculators/calorie-calculator.html` |
| GST Calculator | `/tools/gst-calculator.html` |
| Age Calculator | `/tools/age-calculator.html` |
| Percentage Calculator | `/tools/percentage-calculator.html` |
| 401(k) Calculator | `/tools/calculators/401k-calculator.html` |
| Paycheck Calculator | `/tools/calculators/paycheck-calculator.html` |
| Savings Goal | `/tools/calculators/savings-goal.html` |
| US Sales Tax Calculator | `/tools/calculators/invoice-tax-calculator.html` |
| VAT Calculator | `/tools/calculators/vat-calculator.html` |
| Overtime Calculator | `/tools/calculators/overtime-calculator.html` |
| Loan Amortization | `/tools/calculators/loan-amortization.html` |
| ROI Calculator | `/tools/calculators/roi-calculator.html` |
| Freelance Rate Calculator | `/tools/calculators/freelance-rate.html` |
| Discount & Tax Calculator | `/tools/calculators/discount-tax-calculator.html` |
| Bill Split Calculator | `/tools/calculators/bill-split-calculator.html` |
| Simple Interest | `/tools/calculators/simple-interest-calculator.html` |
| Savings Goal Tracker | `/tools/calculators/savings-goal-tracker.html` |
| Budget Planner | `/tools/calculators/budget-planner.html` |
| Inflation Calculator | `/tools/calculators/inflation-calculator.html` |
| Credit Card Payoff | `/tools/calculators/credit-card-payoff.html` |
| Car Loan Calculator | `/tools/calculators/car-loan-calculator.html` |
| Rule of 72 | `/tools/calculators/rule-of-72.html` |
| Tax Deduction Calculator | `/tools/calculators/tax-deduction-calculator.html` |
| Advanced Retirement | `/tools/calculators/advanced-retirement-calculator.html` |
| Net Worth Calculator | `/tools/calculators/net-worth-calculator.html` |
| Student Loan Calculator | `/tools/calculators/student-loan-calculator.html` |
| Expense Splitter | `/tools/calculators/expense-splitter.html` |
| Salary Negotiator | `/tools/calculators/salary-negotiator.html` |
| Break-Even Analysis | `/tools/calculators/break-even-analysis.html` |
| Tip Splitter | `/tools/calculators/tip-splitter.html` |
| Percentage Change | `/tools/calculators/percentage-change.html` |
| Days Until Date | `/tools/calculators/days-until-date.html` |
| Future Value Annuity | `/tools/calculators/future-value-annuity.html` |
| Mileage Calculator | `/tools/calculators/mileage-calculator.html` |
| Hourly to Salary | `/tools/calculators/hourly-to-salary.html` |
| Percent Error | `/tools/calculators/percent-error-calculator.html` |
| Reverse Sales Tax | `/tools/calculators/reverse-sales-tax-calculator.html` |
| Compound Interest Calculator | `/tools/calculators/compound-interest-calculator.html` |

### Text Tools (31)

| Tool | Path |
|------|------|
| Word Counter | `/tools/word-counter.html` |
| Text Case Converter | `/tools/text-case-converter.html` |
| Lorem Ipsum Generator | `/tools/text/lorem-ipsum-generator.html` |
| Random Name Generator | `/tools/text/random-name-generator.html` |
| Text Repeater | `/tools/text/text-repeater.html` |
| Binary to Text | `/tools/text/binary-to-text.html` |
| Character Counter | `/tools/text/character-counter.html` |
| Remove Duplicate Lines | `/tools/text/remove-duplicate-lines.html` |
| Find and Replace | `/tools/text/find-and-replace.html` |
| Number to Words | `/tools/text/number-to-words.html` |
| Reverse Text | `/tools/text/reverse-text.html` |
| Text to Slug | `/tools/text/text-to-slug.html` |
| Word Frequency Counter | `/tools/text/word-frequency.html` |
| Sentence Shuffler | `/tools/text/sentence-reorder.html` |
| Random Picker | `/tools/text/random-picker.html` |
| Reading Time Calculator | `/tools/text/reading-time-calculator.html` |
| Text Diff Checker | `/tools/text/text-diff-checker.html` |
| Typing Speed Test | `/tools/text/typing-speed-test.html` |
| Acronym Generator | `/tools/text/acronym-generator.html` |
| Anagram Solver | `/tools/text/anagram-solver.html` |
| Password Phrase Generator | `/tools/text/password-phrase-generator.html` |
| Text to Speech Preview | `/tools/text/text-to-speech-preview.html` |
| Bulk Text Replacer | `/tools/text/bulk-text-replacer.html` |
| Keyword Density Checker | `/tools/text/keyword-density-checker.html` |
| Word Scramble Game | `/tools/text/word-scramble.html` |
| Number Trivia | `/tools/text/number-trivia.html` |
| Rhyming Words Finder | `/tools/text/rhyming-words-finder.html` |
| Phonetic Spelling | `/tools/text/phonetic-spelling-converter.html` |
| Letter Count Analyzer | `/tools/text/letter-count-analyzer.html` |
| Story Prompt Generator | `/tools/text/story-prompt-generator.html` |
| Email Subject Line Generator | `/tools/text/email-subject-line-generator.html` |
| Advanced Case Converter | `/tools/text/case-converter-advanced.html` |

### Developer Tools (42)

| Tool | Path |
|------|------|
| JSON Formatter | `/tools/developer/json-formatter.html` |
| Base64 Encoder | `/tools/developer/base64.html` |
| URL Encoder | `/tools/developer/url-encoder.html` |
| Color Converter | `/tools/developer/color-converter.html` |
| Markdown Preview | `/tools/developer/markdown-preview.html` |
| Hash Generator | `/tools/developer/hash-generator.html` |
| CSS Minifier | `/tools/developer/css-minifier.html` |
| JWT Decoder | `/tools/developer/jwt-decoder.html` |
| EXIF Metadata Stripper | `/tools/developer/exif-stripper.html` |
| CSS Box Shadow Generator | `/tools/developer/css-box-shadow-generator.html` |
| CSS Gradient Generator | `/tools/developer/css-gradient-generator.html` |
| HTML Entities Encoder | `/tools/developer/html-entities.html` |
| JSON to CSV Converter | `/tools/developer/json-to-csv.html` |
| Regex Tester | `/tools/developer/regex-tester.html` |
| Timestamp Converter | `/tools/developer/timestamp-converter.html` |
| UUID Generator | `/tools/developer/uuid-generator.html` |
| JS Minifier | `/tools/developer/js-minifier.html` |
| Lorem Ipsum Generator | `/tools/developer/lorem-ipsum.html` |
| Morse Code Translator | `/tools/developer/morse-code-translator.html` |
| Caesar Cipher | `/tools/developer/caesar-cipher.html` |
| HTML to Markdown | `/tools/developer/html-to-markdown.html` |
| YouTube Timestamp Linker | `/tools/developer/youtube-timestamp-linker.html` |
| Meta Tag Generator | `/tools/developer/meta-tag-generator.html` |
| Color Palette Generator | `/tools/developer/color-palette-generator.html` |
| ASCII Art Converter | `/tools/developer/ascii-art-converter.html` |
| Markdown Table Generator | `/tools/developer/markdown-table-generator.html` |
| API Response Formatter | `/tools/developer/api-response-formatter.html` |
| Git Command Cheatsheet | `/tools/developer/git-command-cheatsheet.html` |
| Base64 Image Converter | `/tools/developer/base64-image-converter.html` |
| Terminal Command Simulator | `/tools/developer/terminal-command-simulator.html` |
| HTML Encoder | `/tools/developer/html-encoder.html` |
| Markdown to HTML | `/tools/developer/markdown-to-html.html` |
| Color Picker | `/tools/developer/color-picker.html` |
| CSS Border Generator | `/tools/design/css-border-generator.html` |
| WiFi QR Code Generator | `/tools/developer/wifi-qr-generator.html` |
| Cron Expression Builder | `/tools/developer/cron-builder.html` |
| WCAG Color Contrast Checker | `/tools/developer/color-contrast-checker.html` |
| SQL Formatter | `/tools/developer/sql-formatter.html` |
| Robots.txt Generator | `/tools/developer/robots-txt-generator.html` |
| JWT Generator | `/tools/developer/jwt-generator.html` |
| Barcode Generator | `/tools/developer/barcode-generator.html` |
| Code to Image | `/tools/developer/code-to-image.html` |

### Health Tools (19)

| Tool | Path |
|------|------|
| BMI Calculator | `/tools/bmi-calculator.html` |
| Ideal Weight Calculator | `/tools/health/ideal-weight-calculator.html` |
| Calorie Calculator | `/tools/health/calorie-calculator.html` |
| Water Intake Calculator | `/tools/health/water-intake-calculator.html` |
| Sleep Calculator | `/tools/health/sleep-calculator.html` |
| Pregnancy Due Date | `/tools/health/pregnancy-due-date.html` |
| Ovulation Calculator | `/tools/health/ovulation-calculator.html` |
| Macro Calculator | `/tools/health/macro-calculator.html` |
| Body Fat Calculator | `/tools/health/body-fat-calculator.html` |
| BMR Calculator | `/tools/health/bmr-calculator.html` |
| Blood Pressure Tracker | `/tools/health/blood-pressure-tracker.html` |
| BAC Calculator | `/tools/health/bac-calculator.html` |
| Dosage Calculator | `/tools/health/dosage-calculator.html` |
| Menstrual Cycle Calculator | `/tools/health/menstrual-cycle-calculator.html` |
| BSA Calculator | `/tools/health/bsa-calculator.html` |
| Target Heart Rate | `/tools/health/target-heart-rate.html` |
| Stress Level Assessor | `/tools/health/stress-level-assessor.html` |
| Medication Reminder | `/tools/health/medication-reminder.html` |
| Water Intake | `/tools/health/water-intake.html` |

### Utility Tools (30)

| Tool | Path |
|------|------|
| QR Code Generator | `/qr-code-generator.html` |
| Unit Converter | `/tools/unit-converter.html` |
| Password Generator | `/tools/password-generator.html` |
| Pomodoro Timer | `/tools/pomodoro-timer.html` |
| Aspect Ratio Calculator | `/tools/aspect-ratio-calculator.html` |
| BMI with Body Fat | `/tools/utility/bmi-with-body-fat.html` |
| Pack Weight Calculator | `/tools/utility/pack-weight-calculator.html` |
| Random Decision Maker | `/tools/utility/random-decision-maker.html` |
| Habit Tracker | `/tools/utility/habit-tracker-simple.html` |
| Screen Ruler | `/tools/utility/screen-ruler.html` |
| World Clock | `/tools/utility/world-clock.html` |
| File Size Converter | `/tools/utility/file-size-converter.html` |
| Timezone Converter | `/tools/utility/timezone-converter.html` |
| Date Calculator | `/tools/utility/date-calculator.html` |
| Binary Converter | `/tools/utility/binary-converter.html` |
| Roman Numeral Converter | `/tools/utility/roman-numeral-converter.html` |
| Screen Resolution Checker | `/tools/utility/screen-resolution-checker.html` |
| IP Address Lookup | `/tools/utility/ip-address-lookup.html` |
| Recipe Scaler | `/tools/utility/recipe-scaler.html` |
| Book Reading Tracker | `/tools/utility/book-reading-tracker.html` |
| Movie Watchlist | `/tools/utility/movie-watchlist.html` |
| Password Strength Tester | `/tools/utility/password-strength-tester-advanced.html` |
| Unit Price Comparator | `/tools/utility/unit-price-comparator.html` |
| Age in Different Units | `/tools/utility/age-in-different-units.html` |
| Random Quote Generator | `/tools/utility/random-quote-generator.html` |
| PAN Card Validator | `/tools/utility/pan-card-validator.html` |
| Indian Number Format | `/tools/utility/indian-number-format.html` |
| UPI QR Code Generator | `/tools/utility/upi-qr-generator.html` |
| Vehicle Number Validator | `/tools/utility/vehicle-number-validator.html` |
| Voice Recorder | `/tools/utility/voice-recorder.html` |
| Indian Holiday Calendar | `/tools/utility/indian-holiday-calendar.html` |
| Social Media Image Sizes | `/tools/utility/social-media-size-calculator.html` |
| Indian Pincode Search | `/tools/utility/pincode-search.html` |

### Fun & Games Tools (15)

| Tool | Path |
|------|------|
| Coin Flip Simulator | `/tools/fun/coin-flip.html` |
| Random Recipe Generator | `/tools/fun/random-recipe.html` |
| Would You Rather | `/tools/fun/would-you-rather.html` |
| Random Joke Generator | `/tools/fun/random-joke.html` |
| Random Color Generator | `/tools/fun/random-color-generator.html` |
| Dice Roller | `/tools/fun/dice-roller.html` |
| Yes or No Decider | `/tools/fun/yes-no-decider.html` |
| Password Game | `/tools/fun/password-game.html` |
| Birthday Fortune | `/tools/fun/birthday-fortune.html` |
| Rock Paper Scissors | `/tools/fun/rock-paper-scissors.html` |
| Trivia Quiz | `/tools/fun/trivia-quiz.html` |
| Daily Horoscope | `/tools/fun/horoscope-daily.html` |
| Meme Text Generator | `/tools/fun/meme-text-generator.html` |
| Bingo Card Generator | `/tools/fun/bingo-card-generator.html` |
| Would You Rather Advanced | `/tools/fun/would-you-rather-advanced.html` |

### Business Document Tools (19)

| Tool | Path |
|------|------|
| Invoice Generator | `/tools/business/invoice-generator.html` |
| Freelance Contract | `/tools/business/freelance-contract.html` |
| Salary Slip Generator | `/tools/business/salary-slip.html` |
| Business Proposal | `/tools/business/business-proposal.html` |
| Offer Letter Generator | `/tools/business/offer-letter.html` |
| NOC Generator | `/tools/business/noc-generator.html` |
| Experience Letter | `/tools/business/experience-letter.html` |
| Profit Calculator | `/tools/business/profit-calculator.html` |
| Receipt Generator | `/tools/business/receipt-generator.html` |
| Relieving Letter | `/tools/business/relieving-letter.html` |
| Payslip Generator Pro | `/tools/business/payslip-generator-pro.html` |
| Fee Receipt | `/tools/business/fee-receipt.html` |
| Quotation Generator | `/tools/business/quotation-generator.html` |
| Purchase Order | `/tools/business/purchase-order.html` |
| Delivery Challan | `/tools/business/delivery-challan.html` |
| Cash Voucher | `/tools/business/cash-voucher.html` |
| Proforma Invoice | `/tools/business/proforma-invoice.html` |
| NDA Generator | `/tools/business/nda-generator.html` |
| Experience Letter Pro | `/tools/business/experience-letter-pro.html` |

### Career & Resume Tools (7)

| Tool | Path |
|------|------|
| Resume Builder | `/tools/career/resume-builder.html` |
| Cover Letter Generator | `/tools/career/cover-letter.html` |
| Resignation Letter | `/tools/career/resignation-letter.html` |
| Thank You Letter | `/tools/career/thank-you-letter.html` |
| LinkedIn Headline Generator | `/tools/career/linkedin-generator.html` |
| Internship Application Letter | `/tools/career/internship-letter.html` |
| Job Application Tracker | `/tools/career/job-tracker.html` |

### Education Tools (22)

| Tool | Path |
|------|------|
| GPA Calculator | `/tools/education/gpa-calculator.html` |
| Final Grade Calculator | `/tools/education/final-grade-calculator.html` |
| Quiz Generator | `/tools/education/quiz-generator.html` |
| Essay Word Counter | `/tools/education/essay-word-counter.html` |
| Citation Generator | `/tools/education/citation-generator.html` |
| Study Timer | `/tools/education/study-timer.html` |
| Flashcard Generator | `/tools/education/flashcard-generator.html` |
| Bonafide Certificate | `/tools/education/bonafide-certificate.html` |
| Character Certificate | `/tools/education/character-certificate.html` |
| Gap Certificate | `/tools/education/gap-certificate.html` |
| Internship Certificate | `/tools/education/internship-certificate.html` |
| Marksheet Generator | `/tools/education/marksheet-generator.html` |
| Study Leave Letter | `/tools/education/study-leave-letter.html` |
| Sick Leave Application | `/tools/education/sick-leave-application.html` |
| Principal Application | `/tools/education/principal-application.html` |
| Scholarship Application | `/tools/education/scholarship-application.html` |
| Recommendation Letter | `/tools/education/recommendation-letter.html` |
| SOP Builder | `/tools/education/sop-builder.html` |
| Student Bio Data | `/tools/education/student-bio-data.html` |
| Project Certificate | `/tools/education/project-certificate.html` |
| Training Certificate | `/tools/education/training-certificate.html` |
| Academic Declaration | `/tools/education/academic-declaration.html` |

### Fitness Tools (6)

| Tool | Path |
|------|------|
| BMR & TDEE Calculator | `/tools/fitness/bmr-tdee-advanced.html` |
| One Rep Max Calculator | `/tools/fitness/one-rep-max-calculator.html` |
| Walking Calorie Burn | `/tools/fitness/walking-calorie-burn.html` |
| Body Measurement Tracker | `/tools/fitness/body-measurement-tracker.html` |
| Heart Rate Zone Calculator | `/tools/fitness/heart-rate-zone-calculator.html` |
| Exercise Calorie Burn | `/tools/fitness/exercise-calorie-burn.html` |

### Professional Tools (4)

| Tool | Path |
|------|------|
| Email Signature Generator | `/tools/professional/email-signature.html` |
| Business Card Maker | `/tools/professional/business-card.html` |
| Professional Bio Generator | `/tools/professional/bio-generator.html` |
| SOP Generator | `/tools/professional/sop-generator.html` |

### Design Tools (22)

| Tool | Path |
|------|------|
| Social Media Mockup | `/tools/design/social-media-mockup.html` |
| Button Generator | `/tools/design/button-generator.html` |
| Favicon Generator | `/tools/design/favicon-generator.html` |
| Avatar Generator | `/tools/design/avatar-generator.html` |
| CSS Border Generator | `/tools/design/css-border-generator.html` |
| Gradient Text Generator | `/tools/design/gradient-text-generator.html` |
| Indian Passport Photo | `/tools/design/indian-passport-photo.html` |
| US Passport Photo | `/tools/design/us-passport-photo.html` |
| UK Passport Photo | `/tools/design/uk-passport-photo.html` |
| Canada Passport Photo | `/tools/design/canada-passport-photo.html` |
| Visa Photo Generator | `/tools/design/visa-photo-generator.html` |
| ID Card Generator | `/tools/design/id-card-generator.html` |
| Employee ID Card | `/tools/design/employee-id-card.html` |
| Student ID Card | `/tools/design/student-id-card.html` |
| Signature Drawer | `/tools/design/signature-drawer.html` |
| Text Signature Generator | `/tools/design/text-signature-generator.html` |
| Scanner Simulator | `/tools/design/scanner-simulator.html` |
| Document Cropper | `/tools/design/document-cropper.html` |
| Image Stamp Tool | `/tools/design/image-stamp-tool.html` |
| Watermark Creator | `/tools/design/watermark-creator.html` |
| Certificate Generator | `/tools/design/certificate-generator.html` |
| OG Image Generator | `/tools/design/og-image-generator.html` |

### Home & DIY Tools (7)

| Tool | Path |
|------|------|
| Paint Calculator | `/tools/home/paint-calculator.html` |
| Wallpaper Calculator | `/tools/home/wallpaper-calculator.html` |
| Concrete Calculator | `/tools/home/concrete-calculator.html` |
| Shoe Size Converter | `/tools/home/shoe-size-converter.html` |
| Cooking Converter | `/tools/home/cooking-converter.html` |
| Tile Calculator | `/tools/home/tile-calculator.html` |
| Plant Watering Reminder | `/tools/home/plant-watering-reminder.html` |

### Productivity Tools (7)

| Tool | Path |
|------|------|
| Todo List Advanced | `/tools/productivity/todo-list-advanced.html` |
| Goal Tracker | `/tools/productivity/goal-tracker.html` |
| Meeting Notes Template | `/tools/productivity/meeting-notes-template.html` |
| Daily Planner | `/tools/productivity/daily-planner.html` |
| Brainstorm Idea Generator | `/tools/productivity/brainstorm-idea-generator.html` |
| Time Block Scheduler | `/tools/productivity/time-block-scheduler.html` |
| Priority Matrix | `/tools/productivity/priority-matrix.html` |

### Travel Tools (7)

| Tool | Path |
|------|------|
| Trip Cost Estimator | `/tools/travel/trip-cost-estimator.html` |
| Packing List Generator | `/tools/travel/packing-list-generator.html` |
| Itinerary Planner | `/tools/travel/itinerary-planner.html` |
| Flight Time Calculator | `/tools/travel/flight-time-calculator.html` |
| Visa Requirement Checker | `/tools/travel/visa-requirement-checker.html` |
| Currency Trip Converter | `/tools/travel/currency-trip-converter.html` |
| Hotel Cost Comparator | `/tools/travel/hotel-cost-comparator.html` |

### Parenting Tools (5)

| Tool | Path |
|------|------|
| Baby Name Generator | `/tools/parenting/baby-name-generator.html` |
| Feeding Schedule | `/tools/parenting/feeding-schedule.html` |
| Height Prediction | `/tools/parenting/height-prediction.html` |
| Milestone Tracker | `/tools/parenting/milestone-tracker.html` |
| Sleep Schedule Planner | `/tools/parenting/sleep-schedule-planner.html` |

### Root-Level Tools (11)

| Tool | Path |
|------|------|
| Image Compressor | `/compress-image.html` |
| Compress Image for Instagram | `/compress-image-for-instagram.html` |
| PDF Compressor | `/compress-pdf.html` |
| HEIC to JPG | `/heic-to-jpg.html` |
| Image Format Converter | `/image-format-converter.html` |
| Image to Text (OCR) | `/image-to-text-ocr.html` |
| JPG to PDF | `/jpg-to-pdf.html` |
| Passport Photo Resizer | `/passport-photo-resizer.html` |
| PDF to JPG | `/pdf-to-jpg.html` |
| QR Code Generator | `/qr-code-generator.html` |
| Background Remover | `/remove-background.html` |
| Signature Scanner | `/signature-scanner.html` |
| Free Invoice Generator | `/free-invoice-generator.html` |
| Free Resume Builder | `/free-resume-builder.html` |

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic, accessible) |
| Styling | CSS3 (custom properties + Tailwind CSS served locally as `tailwind.min.css`) |
| Logic | Vanilla JavaScript (no frameworks, no build step, no npm) |
| Image processing | Canvas API, OffscreenCanvas, createImageBitmap |
| PDF generation | jsPDF (loaded on-demand via CDN) |
| PDF manipulation | pdf-lib (loaded on-demand via CDN) |
| PDF rendering | PDF.js (loaded on-demand via CDN) |
| OCR | Tesseract.js (loaded on-demand via CDN, runs in Web Worker) |
| Background removal | @imgly/background-removal (loaded on-demand via CDN, runs in Web Worker) |
| HEIC conversion | heic2any (loaded on-demand via CDN) |
| Markdown | marked.js + DOMPurify (loaded on-demand via CDN) |
| Deployment | Vercel (static hosting) |

### Web Workers

Three tools use Web Workers to keep the UI responsive:

| Worker | File | Used By |
|--------|------|---------|
| `compress-worker.js` | Image compression | Image Compressor |
| `ocr-worker.js` | Tesseract.js OCR | Image to Text (OCR) |
| `background-worker.js` | AI background removal | Background Remover |

Workers are loaded **on-demand only when the user triggers the action** (not on page load). Each has a 30-second timeout and falls back to main-thread processing if Web Workers or OffscreenCanvas are unavailable.

**Progress reporting:** `compress-worker.js` sends `{progress: N}` messages (0-100) at each iteration of the compression loop.

### Shared JavaScript (`common.js`)

`common.js` is loaded on every page and provides:

1. **Header injection** — `NAV_HTML` string injected into `<header class="site-header">`
2. **Footer injection** — `FOOTER_HTML` string injected into `<footer class="site-footer">`
3. **Tool count** — `OPTI_TOOL_COUNT` derived from `allToolsData.length`, `OPTI_updateToolCounts()` replaces hardcoded strings site-wide
4. **Category color map** — `catColors` object mapping category slugs to icon wrapper classes
5. **Command palette** — Full-screen search overlay triggered by `/` or `Ctrl+K`
6. **Floating Action Button** — Mobile quick-access overlay
7. **Scroll-to-top button** — Appears after 400px scroll
8. **Scroll-aware header** — `.scrolled` class after 10px scroll
9. **Dark mode toggle** — Sun/moon button, localStorage persistence
10. **Favorites system** — Star button on tool pages, localStorage persistence
11. **Recently used tools** — Tracked via localStorage
12. **User hub dropdown** — Shows recently used + saved tools
13. **Clipboard paste detection** — Image/text paste → toast with tool link
14. **Drag-and-drop file routing** — Homepage file type detection → tool routing
15. **Bookmark prompt** — One-time toast after using a tool twice
16. **IndexedDB helper** — `OptiDB` for auto-save tools
17. **Toast notifications** — `showToast()` function for user feedback
18. **AdSense empty slot handler** — Hides unfilled ad containers after 3s/6s

### Tool-Specific JavaScript (`script.js`)

`script.js` is loaded only on pages that need it (image compressor, PDF tools, etc.) and provides:

- Image compression pipeline (Canvas API + Web Worker)
- Compare modal (before/after slider)
- Batch processing (multiple files)
- Format conversion
- PDF generation (via jsPDF)
- PDF manipulation (via pdf-lib)

---

## SEO Structure

### JSON-LD Schemas

| Page Type | Schemas |
|-----------|---------|
| Homepage | WebSite, SoftwareApplication |
| Tool pages | SoftwareApplication, BreadcrumbList, FAQPage |
| Blog posts | Article, BreadcrumbList |
| About page | Organization, WebPage, FAQPage |
| Contact page | WebPage |
| Privacy/Terms | WebPage |
| Reviews | (none — clean) |

### Meta Tags (every page)

- `<title>` — Unique per page, includes tool name + "OptiDrop"
- `<meta name="description">` — Unique per page, 150-160 chars
- `<meta property="og:*">` — Open Graph tags for social sharing
- `<meta name="twitter:*">` — Twitter Card tags
- `<link rel="canonical">` — Points to the page's own URL
- `<link rel="icon">` — SVG favicon + PNG fallbacks at 16, 32, 180, 192, 512px

### Sitemap

- **File:** `sitemap.xml`
- **URLs:** 383
- **Domain:** `https://optidrop.online`
- **Priority hierarchy:** Homepage (1.0) → tools.html (0.9) → category pages (0.8) → tool pages (0.7) → static pages (0.5)

### Internal Linking

- **Workflow next-step sections** on tool pages suggest related tools
- **Category pages** link to all tools in that category
- **Footer** links to top tools across categories
- **Blog posts** link to relevant tool pages
- **Mega-menu** links to all category pages

---

## Deployment & Performance

### Hosting

- **Platform:** Vercel (static hosting)
- **Domain:** `optidrop.online`
- **SSL:** Automatic via Vercel

### Caching Strategy (from `vercel.json`)

| Resource | Cache-Control |
|----------|---------------|
| CSS, favicon | `max-age=31536000, immutable` (1 year) |
| `common.js` | `max-age=86400` (1 day) |
| `manifest.json` | `max-age=86400` (1 day) |
| `sw.js` | `max-age=0, must-revalidate` |
| HTML pages | `max-age=3600, stale-while-revalidate=86400` |

### Security Headers

All HTML responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`

### Performance Optimizations

- **Lazy-loaded libraries:** Heavy CDN libraries (jsPDF, pdf-lib, JSZip, heic2any, Tesseract.js, PDF.js, @imgly/background-removal, marked.js, DOMPurify) load on-demand only when the user triggers the action
- **requestIdleCallback:** Non-critical features (command palette, FAB, share bar, bookmark prompt, recently-used tools, dark mode toggle) deferred until browser is idle
- **Web Workers:** Image compression, OCR, and background removal run off the main thread
- **Object URL cleanup:** All `URL.createObjectURL()` calls have matching `revokeObjectURL()`
- **DNS prefetch:** `<link rel="dns-prefetch">` for cdn.jsdelivr.net, cdnjs.cloudflare.com, fonts.googleapis.com
- **Resource preconnect:** `<link rel="preconnect">` for Google Fonts with crossorigin
- **Single-file CSS:** One `styles.css` with no unused frameworks
- **Tailwind served locally:** `tailwind.min.css` (2.8MB) served from same origin, not CDN
- **No build step:** Files served as-is, zero bundler overhead

### Core Web Vitals

- **LCP:** Optimized via CSS preload, local Tailwind, minimal render-blocking resources
- **CLS:** Fixed via `content-visibility: auto` with `contain-intrinsic-size` on card grids, explicit dimensions on images
- **INP:** Optimized via Web Workers for heavy processing, `requestIdleCallback` for non-critical features

---

## File Structure

```
/
├── index.html                          # Homepage
├── tools.html                          # Full tools directory with search & filters
├── about.html                          # About page with builder bio
├── contact.html                        # Contact page with compose modal + feedback form
├── review.html                         # Review page with sample reviews + submission form
├── privacy-policy.html                 # Privacy policy
├── terms.html                          # Terms of service
├── 404.html                            # Custom 404 page
├── reindex-checklist.html              # Internal SEO checklist (blocked from crawlers)
│
├── styles.css                          # All CSS (single file, 4000+ lines)
├── common.js                           # Shared JS (header, footer, features, tool registry)
├── script.js                           # Tool-specific JS (image compression, PDF, compare modal)
├── tailwind.min.css                    # Tailwind CSS (local, 2.8MB)
│
├── compress-worker.js                  # Web Worker: image compression
├── ocr-worker.js                       # Web Worker: Tesseract.js OCR
├── background-worker.js                # Web Worker: AI background removal
│
├── favicon.svg                         # SVG favicon (scalable drop mark)
├── favicon.png                         # PNG favicon (32x32)
├── favicon-16x16.png                   # PNG favicon (16x16)
├── favicon-32x32.png                   # PNG favicon (32x32)
├── apple-touch-icon.png                # Apple touch icon (180x180)
├── favicon-192x192.png                 # PWA icon (192x192)
├── favicon-512x512.png                 # PWA icon (512x512)
├── Generated_image-removebg-preview.png # Logo image
│
├── manifest.json                       # PWA manifest
├── sw.js                               # Service worker (offline caching)
├── sitemap.xml                         # XML sitemap (383 URLs)
├── robots.txt                          # Crawler rules
├── ads.txt                             # AdSense verification
├── vercel.json                         # Vercel deployment config
│
├── tools/                              # Tool pages (306 files in subdirectories)
│   ├── *.html                          # Root-level tools (11 files)
│   ├── calculators/                    # 48 calculator tools
│   ├── text/                           # 31 text tools
│   ├── developer/                      # 42 developer tools
│   ├── health/                         # 19 health tools
│   ├── utility/                        # 30 utility tools
│   ├── fun/                            # 15 fun & games tools
│   ├── business/                       # 19 business document tools
│   ├── career/                         # 7 career tools
│   ├── education/                      # 22 education tools
│   ├── productivity/                   # 7 productivity tools
│   ├── home/                           # 7 home & DIY tools
│   ├── travel/                         # 7 travel tools
│   ├── fitness/                        # 6 fitness tools
│   ├── design/                         # 22 design tools
│   ├── parenting/                      # 5 parenting tools
│   ├── professional/                   # 4 professional tools
│   └── pdf/                            # 15 PDF tools
│
├── category/                           # 18 category index pages
├── blog/                               # 21 blog posts + index
├── vs/                                 # Comparison pages (ilovepdf)
├── best/                               # Best-of pages (free PDF tools)
└── use-cases/                          # Use case pages (students, small business)
```

---

## Privacy & Data

### What OptiDrop Collects

**Nothing.** The site has no backend, no database, no user accounts. All processing happens in the browser.

### What Stays on the User's Device

- **localStorage:** Dark mode preference, recently used tools, favorites, tool-specific data (habit tracker, budget planner, body measurements, plant care, flashcards, quizzes, coin flip history), review submissions
- **sessionStorage:** Drag-and-drop file routing between pages (cleared on use)
- **IndexedDB:** Auto-save drafts for form tools (resume builder, invoice generator, etc.)
- **All keys prefixed with `optidrop_`**

### Third-Party Services

| Service | Purpose | Data Sent |
|---------|---------|-----------|
| Google Analytics (`G-2TXPNV88YM`) | Optional analytics | Page views, events (no personal data) |
| Google AdSense (`ca-pub-8226291768848348`) | Advertising | Ad impressions, clicks |
| Google Fonts | Typography | Font file requests |
| Formsubmit.co | Contact form | Name, email, message (only when user submits) |

---

## Ads & Monetization

### AdSense Integration

- **Publisher ID:** `ca-pub-8226291768848348`
- **ads.txt:** `google.com, pub-8226291768848348, DIRECT, f08c47fec0942fa0`
- **Ad slots per tool page:** 2 (leaderboard 728x90 after header, rectangle 336x280 after tool widget)
- **Mobile clamp:** All ad slots clamped to `max-height: 100px` on viewports ≤640px via CSS
- **Empty slot handler:** `common.js` hides unfilled ad containers after 3s and 6s

### Ad Slot HTML Pattern

```html
<div class="ad-slot ad-slot-leaderboard" style="max-width:728px;margin:1rem auto;">
    <ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px"
         data-ad-client="ca-pub-8226291768848348" data-ad-slot="SLOT_ID"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```

---

## Known Issues & Roadmap

### Known Issues

1. **aggregateRating in common.js:** The `common.js` file injects a fabricated `aggregateRating` (4.8 rating, 124 reviews) into tool pages that lack inline schemas. This is a Google penalty risk and should be removed.
2. **Sitemap lastmod dates:** All 383 URLs share the identical `lastmod: 2026-06-10`. Should have per-page dates.
3. **Thin content pages:** `pan-card-validator.html` (~120 words) and `todo-list-advanced.html` (~200 words) need more explanatory prose.
4. **Duplicate health tools:** `ideal-weight.html` and `ideal-weight-calculator.html` both exist (same for `water-intake.html` / `water-intake-calculator.html`).

### Completed Phases

- **Phase 1:** Mobile ad slot height clamp, contact email update, review page naturalization
- **Phase 2:** Single-brand cerise accent, drop logo mark, favicon overhaul
- **Phase 3:** Hero/trust section rewrite for honesty and restraint
- **Phase 4:** Card differentiation, section whitespace, category grid density reduction
- **Phase 5:** Sticky header polish, "All Tools" accent link, Web Worker progress events
- **Phase 6:** SEO/content audit, structured data review, thin content identification

---

## License

OptiDrop is free to use. All tools are browser-based and require no registration.
