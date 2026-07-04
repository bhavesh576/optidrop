/**
 * fix-favicons.js
 * Scans every .html file in the project and ensures favicon paths are absolute.
 *
 * Targets:
 *   <link rel="icon"          href="favicon.png...">
 *   <link rel="shortcut icon" href="favicon.png...">
 *   <link rel="apple-touch-icon" href="favicon.png...">
 *   <meta name="msapplication-TileImage" content="favicon.png...">
 *
 * Any relative path (no leading "/") gets "/" prepended.
 * Already-absolute paths are left untouched.
 *
 * Usage: node fix-favicons.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Recursively collect all .html files
function walk(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(walk(full));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

const files = walk(ROOT);
let totalFixed = 0;
let filesModified = 0;

for (const filePath of files) {
    let html = fs.readFileSync(filePath, 'utf8');
    let original = html;
    let fixCount = 0;

    // Pattern 1: <link rel="icon" ... href="favicon.png...">
    // Pattern 2: <link rel="shortcut icon" ... href="favicon.png...">
    // Pattern 3: <link rel="apple-touch-icon" ... href="favicon.png...">
    // Matches href="favicon.png or href="something/favicon.png where "something" doesn't start with /
    // We want to ensure the path starts with /
    html = html.replace(
        /(<link\s+[^>]*rel\s*=\s*["'](?:shortcut\s+icon|icon|apple-touch-icon)["'][^>]*href\s*=\s*["'])(?!\/)(favicon[^"']*["'])/gi,
        (match, prefix, filePathPart) => {
            fixCount++;
            return prefix + '/' + filePathPart;
        }
    );

    // Also catch href patterns where rel comes AFTER href
    html = html.replace(
        /(<link\s+[^>]*href\s*=\s*["'])(?!\/)(favicon[^"']*["'][^>]*rel\s*=\s*["'](?:shortcut\s+icon|icon|apple-touch-icon)["'])/gi,
        (match, prefix, rest) => {
            fixCount++;
            return prefix + '/' + rest;
        }
    );

    // Pattern 4: <meta name="msapplication-TileImage" content="favicon.png...">
    html = html.replace(
        /(<meta\s+[^>]*name\s*=\s*["']msapplication-TileImage["'][^>]*content\s*=\s*["'])(?!\/)(favicon[^"']*["'])/gi,
        (match, prefix, filePathPart) => {
            fixCount++;
            return prefix + '/' + filePathPart;
        }
    );

    // Also catch content before name for msapplication-TileImage
    html = html.replace(
        /(<meta\s+[^>]*content\s*=\s*["'])(?!\/)(favicon[^"']*["'][^>]*name\s*=\s*["']msapplication-TileImage["'])/gi,
        (match, prefix, rest) => {
            fixCount++;
            return prefix + '/' + rest;
        }
    );

    if (html !== original) {
        fs.writeFileSync(filePath, html, 'utf8');
        const relPath = path.relative(ROOT, filePath);
        console.log(`✅ Fixed ${fixCount} favicon path(s) in: ${relPath}`);
        totalFixed += fixCount;
        filesModified++;
    }
}

console.log(`\n───────────────────────────────────────`);
console.log(`Scanned ${files.length} HTML files.`);
console.log(`Modified ${filesModified} file(s), fixed ${totalFixed} favicon path(s).`);
if (filesModified === 0) {
    console.log(`\n🎉 All favicon paths are already absolute. No changes needed.`);
}
