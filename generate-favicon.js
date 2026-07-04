/**
 * generate-favicon.js
 * Creates a properly-sized favicon.ico (16x16 and 32x32)
 * from the existing favicon.png using pure Node.js.
 *
 * Requires: npm install sharp
 * Usage: node generate-favicon.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'favicon.png');
const OUT = path.join(ROOT, 'favicon.ico');

// Try to use sharp if available, otherwise create a minimal ICO
try {
    const sharp = require('sharp');

    async function generate() {
        // Generate 16x16 and 32x32 PNGs
        const png16 = await sharp(SRC)
            .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();

        const png32 = await sharp(SRC)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();

        // Build ICO file
        const header = Buffer.alloc(6);
        header.writeUInt16LE(0, 0);      // reserved
        header.writeUInt16LE(1, 2);      // type = icon
        header.writeUInt16LE(2, 4);      // count = 2 images

        // Directory entries
        const dir16 = Buffer.alloc(16);
        dir16.writeUInt8(16, 0);         // width
        dir16.writeUInt8(16, 1);         // height
        dir16.writeUInt8(0, 2);          // color palette
        dir16.writeUInt8(0, 3);          // reserved
        dir16.writeUInt16LE(1, 4);       // color planes
        dir16.writeUInt16LE(32, 6);      // bits per pixel
        dir16.writeUInt32LE(png16.length, 8);   // image size
        dir16.writeUInt32LE(6 + 16 * 2, 12);    // offset (header + 2 dir entries)

        const dir32 = Buffer.alloc(16);
        dir32.writeUInt8(32, 0);
        dir32.writeUInt8(32, 1);
        dir32.writeUInt8(0, 2);
        dir32.writeUInt8(0, 3);
        dir32.writeUInt16LE(1, 4);
        dir32.writeUInt16LE(32, 6);
        dir32.writeUInt32LE(png32.length, 8);
        dir32.writeUInt32LE(6 + 16 * 2 + png16.length, 12);

        const ico = Buffer.concat([header, dir16, dir32, png16, png32]);
        fs.writeFileSync(OUT, ico);
        console.log(`✅ favicon.ico generated: ${ico.length} bytes (16x16 + 32x32)`);
        console.log(`   Original favicon.png: ${fs.statSync(SRC).size} bytes`);
    }

    generate().catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });

} catch (e) {
    // sharp not available — just note it
    console.log('⚠️  sharp not installed. Run: npm install sharp');
    console.log('   Then run: node generate-favicon.js');
    console.log('   favicon.ico already exists as a copy of favicon.png (browser-compatible).');
}
