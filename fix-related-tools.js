/**
 * fix-related-tools.js
 *
 * Removes all hardcoded "Related Tools" sections from tool HTML files.
 * common.js already dynamically injects Related Tools in the correct DOM
 * position (immediately after the tool widget, before SEO docs).
 *
 * Usage: node fix-related-tools.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Collect all HTML files that have hardcoded related-tools sections
function findFiles(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Skip node_modules, .git, etc.
            if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
            findFiles(fullPath, results);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

// Remove <section class="related-tools" ...>...</section> blocks
// Also handles variations like class="related-tools" with inline styles
function removeRelatedToolsSection(html) {
    // Match: <section class="related-tools" ...> ... </section>
    // The section may have inline styles and arbitrary attributes
    // Use a robust regex that handles nested content
    const pattern = /<section\s+class="related-tools"[^>]*>[\s\S]*?<\/section>\s*/gi;
    const matches = html.match(pattern);

    if (matches && matches.length > 0) {
        const cleaned = html.replace(pattern, '');
        return { cleaned, count: matches.length };
    }
    return { cleaned: html, count: 0 };
}

// Main execution
const allFiles = findFiles(ROOT);
let totalFixed = 0;
let filesFixed = 0;

console.log(`Scanning ${allFiles.length} HTML files...\n`);

for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.indexOf('related-tools') === -1) continue;

    const { cleaned, count } = removeRelatedToolsSection(content);

    if (count > 0) {
        fs.writeFileSync(filePath, cleaned, 'utf8');
        const relPath = path.relative(ROOT, filePath);
        console.log(`  ✓ ${relPath} — removed ${count} section(s)`);
        totalFixed += count;
        filesFixed++;
    }
}

console.log(`\nDone! Removed ${totalFixed} Related Tools section(s) from ${filesFixed} files.`);
console.log('common.js will now inject Related Tools in the correct position on all pages.');
