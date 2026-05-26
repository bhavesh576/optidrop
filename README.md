# OptiDrop

**Free Online Document Tools — No Upload Required**

OptiDrop is a fully browser-based toolkit with **21 free tools** for images, PDFs, text, and calculations. Every tool runs 100% in your browser — no files are uploaded to any server, no sign-up required, no data leaves your device.

**Live at:** [https://optidrop.online](https://optidrop.online)

---

## Tools

### Image Tools (8)

| Tool | Description | URL |
|------|-------------|-----|
| Image Compressor | Compress images to exact KB limits (20KB, 50KB, 100KB) for passport photos, forms, and WhatsApp | [/compress-image.html](https://optidrop.online/compress-image.html) |
| HEIC to JPG Converter | Convert iPhone HEIC photos to universal JPG format | [/heic-to-jpg.html](https://optidrop.online/heic-to-jpg.html) |
| Image Format Converter | Convert between JPG, PNG, WebP, and BMP formats | [/image-format-converter.html](https://optidrop.online/image-format-converter.html) |
| Background Remover | Remove backgrounds from photos with AI-powered processing | [/remove-background.html](https://optidrop.online/remove-background.html) |
| Passport Photo Resizer | Resize photos to passport and visa dimensions at 300 DPI | [/passport-photo-resizer.html](https://optidrop.online/passport-photo-resizer.html) |
| Name & Date Stamper | Add name and date stamps to exam and ID photos | [/name-date-stamp.html](https://optidrop.online/name-date-stamp.html) |
| Signature Scanner | Scan and extract clean signatures from paper documents | [/signature-scanner.html](https://optidrop.online/signature-scanner.html) |
| Image to Text (OCR) | Extract text from images using browser-based OCR | [/image-to-text-ocr.html](https://optidrop.online/image-to-text-ocr.html) |

### PDF Tools (3)

| Tool | Description | URL |
|------|-------------|-----|
| PDF Compressor | Reduce PDF file size while keeping quality | [/compress-pdf.html](https://optidrop.online/compress-pdf.html) |
| JPG to PDF | Merge multiple images into a single PDF document | [/jpg-to-pdf.html](https://optidrop.online/jpg-to-pdf.html) |
| PDF to JPG | Extract pages from PDF as high-quality JPG images | [/pdf-to-jpg.html](https://optidrop.online/pdf-to-jpg.html) |

### Calculator Tools (4)

| Tool | Description | URL |
|------|-------------|-----|
| EMI Calculator | Calculate monthly EMI for home, car, and personal loans | [/tools/emi-calculator.html](https://optidrop.online/tools/emi-calculator.html) |
| GST Calculator | Calculate GST at 5%, 12%, 18%, or 28% with reverse calculation | [/tools/gst-calculator.html](https://optidrop.online/tools/gst-calculator.html) |
| Age Calculator | Exact age in years, months, and days from date of birth | [/tools/age-calculator.html](https://optidrop.online/tools/age-calculator.html) |
| Percentage Calculator | X% of Y, what percent, and percentage change calculator | [/tools/percentage-calculator.html](https://optidrop.online/tools/percentage-calculator.html) |

### Text Tools (3)

| Tool | Description | URL |
|------|-------------|-----|
| Word Counter | Count words, characters, sentences, paragraphs, and reading time | [/tools/word-counter.html](https://optidrop.online/tools/word-counter.html) |
| Text Case Converter | Convert to UPPERCASE, lowercase, Title Case, Sentence case | [/tools/text-case-converter.html](https://optidrop.online/tools/text-case-converter.html) |
| Password Generator | Generate strong random passwords with crypto.getRandomValues | [/tools/password-generator.html](https://optidrop.online/tools/password-generator.html) |

### Utility Tools (3)

| Tool | Description | URL |
|------|-------------|-----|
| QR Code Generator | Generate QR codes for URLs, text, email, and phone numbers | [/qr-code-generator.html](https://optidrop.online/qr-code-generator.html) |
| BMI Calculator | Calculate BMI with metric or imperial units | [/tools/bmi-calculator.html](https://optidrop.online/tools/bmi-calculator.html) |
| Unit Converter | Convert length, weight, temperature, and speed units | [/tools/unit-converter.html](https://optidrop.online/tools/unit-converter.html) |

---

## Category Pages

Browse tools by category:

- [Image Tools](https://optidrop.online/category/image-tools.html) — Compress, convert, resize, and edit images
- [PDF Tools](https://optidrop.online/category/pdf-tools.html) — Compress, convert, and extract PDF files
- [Calculators](https://optidrop.online/category/calculator-tools.html) — EMI, GST, Age, and Percentage
- [Text Tools](https://optidrop.online/category/text-tools.html) — Word counter, case converter, password generator

---

## How It Works

Every tool in OptiDrop runs entirely in your browser using JavaScript:

1. **Open any tool** — no login, no sign-up
2. **Use the tool** — upload images, enter text, fill in values
3. **Get results instantly** — download, copy, or view output
4. **Nothing leaves your device** — all processing is client-side

---

## Tech Stack

- **HTML5** — Semantic markup, accessible structure
- **CSS3** — Custom styles + Tailwind CSS via CDN
- **Vanilla JavaScript** — No frameworks, no build process
- **Canvas API** — Image processing, compression, resizing
- **Web APIs** — File API, Blob API, crypto.getRandomValues

### External Libraries (loaded via CDN)

| Library | Used For |
|---------|----------|
| Tailwind CSS | Utility-first styling |
| JSZip | Batch ZIP downloads |
| jsPDF | PDF generation (JPG to PDF) |
| heic2any | HEIC to JPG conversion |
| PDF.js | PDF page extraction |
| qrcode-generator | QR code generation |
| @imgly/background-removal | AI background removal |
| Tesseract.js | OCR text extraction |

---

## Project Structure

```
/
├── index.html                          # Homepage with all tools
├── compress-image.html                 # Image compressor
├── compress-pdf.html                   # PDF compressor
├── heic-to-jpg.html                    # HEIC converter
├── image-format-converter.html         # Format converter
├── image-to-text-ocr.html              # OCR text extractor
├── jpg-to-pdf.html                     # Image to PDF merger
├── name-date-stamp.html                # Name & date stamper
├── passport-photo-resizer.html         # Passport photo resizer
├── pdf-to-jpg.html                     # PDF to JPG extractor
├── qr-code-generator.html              # QR code generator
├── remove-background.html              # Background remover
├── signature-scanner.html              # Signature scanner
├── tools/
│   ├── emi-calculator.html             # EMI calculator
│   ├── gst-calculator.html             # GST calculator
│   ├── age-calculator.html             # Age calculator
│   ├── percentage-calculator.html      # Percentage calculator
│   ├── word-counter.html               # Word counter
│   ├── text-case-converter.html        # Text case converter
│   ├── password-generator.html         # Password generator
│   ├── bmi-calculator.html             # BMI calculator
│   └── unit-converter.html             # Unit converter
├── category/
│   ├── image-tools.html                # Image tools category
│   ├── pdf-tools.html                  # PDF tools category
│   ├── calculator-tools.html           # Calculators category
│   └── text-tools.html                 # Text tools category
├── blog/
│   ├── index.html                      # Blog index
│   ├── compress-image-for-visa-application.html
│   ├── how-to-convert-heic-to-jpg.html
│   ├── how-to-resize-passport-photo-online.html
│   └── passport-photo-size-guide-all-countries.html
├── styles.css                          # All CSS (merged)
├── common.js                           # Shared JavaScript utilities
├── script.js                           # Dashboard + tool implementations
├── favicon.png                         # Favicon
├── Generated_image-removebg-preview.png # Logo
├── sitemap.xml                         # XML sitemap
├── robots.txt                          # Robots file
└── ads.txt                             # Google AdSense
```

---

## SEO Features

- Semantic HTML with proper H1-H3 hierarchy
- Unique meta titles and descriptions per page
- Canonical tags on every page
- Open Graph and Twitter Card meta tags
- JSON-LD structured data:
  - WebSite schema (homepage)
  - SoftwareApplication schema (all tool pages)
  - BreadcrumbList schema (all pages)
  - FAQPage schema (all tool pages, 4-5 questions each)
- XML sitemap with all pages
- Internal linking: Related Tools sections, category pages, footer links
- Mobile-first responsive design

---

## Privacy

**100% Private. No Uploads. No Tracking.**

- All processing happens inside your browser
- No files are uploaded to any server
- No user data is collected or stored
- No cookies for tracking purposes
- Works offline after initial page load

---

## Running Locally

OptiDrop is a fully static website. No build step required.

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

---

## License

OptiDrop is free to use. All tools are browser-based and require no registration.
