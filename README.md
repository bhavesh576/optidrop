# OptiDrop

OptiDrop is a **100% browser-based image compression tool** that allows users to compress images to an exact file size (KB) without uploading anything to a server.

It is designed for strict file-size requirements such as:
- Passport photos
- Government forms
- Exam portals
- Visa applications

---

## 🚀 Features

- 🎯 Compress images to **exact target size (e.g., 50KB, 100KB)**
- 🔒 Fully **client-side processing (no uploads)**
- ⚡ Fast browser-based compression using HTML5 Canvas
- 📦 Batch image processing (up to 20 images)
- 🧠 Smart quality + dimension optimization algorithm
- 📁 Download individual files or ZIP all results
- 📱 Works on mobile and desktop
- 🌐 No login, no tracking, no limits

---

## 🧠 How It Works

1. Upload images (JPG, PNG, WebP)
2. Enter target size in KB (e.g., 50KB)
3. OptiDrop:
   - Reduces image quality (binary search)
   - Scales dimensions if needed
   - Iterates until target size is reached
4. Download optimized images instantly

---

## 🛠 Tech Stack

- HTML5 Canvas API
- JavaScript (Vanilla)
- Tailwind CSS
- JSZip (for batch downloads)

---

## 🔐 Privacy

All processing happens inside your browser.

- No server upload
- No data storage
- No tracking
- Fully offline-capable after load

---

## 📂 Project Structure
