const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(getAllHtmlFiles(fullPath));
        } else if (item.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

const root = __dirname;
const files = getAllHtmlFiles(root);
let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    if (content.includes('140+ tools for images, PDFs, resumes, invoices, calculators, developers, health, and more.')) {
        content = content.split('140+ tools for images, PDFs, resumes, invoices, calculators, developers, health, and more.').join('200+ tools for images, PDFs, resumes, invoices, calculators, developers, health, productivity, travel, and more.');
        modified = true;
    }

    if (content.includes('80+ tools for images, PDFs, resumes, invoices, calculators, developers, health, and more.')) {
        content = content.split('80+ tools for images, PDFs, resumes, invoices, calculators, developers, health, and more.').join('200+ tools for images, PDFs, resumes, invoices, calculators, developers, health, productivity, travel, and more.');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log('Updated: ' + path.relative(root, file));
    }
}

console.log('\nTotal files updated: ' + count);
