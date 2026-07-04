const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const ROOT = 'c:/Users/dell/Desktop/optidrop-main (1)/optidrop-main11';

    // Screenshot blog page
    console.log('Loading blog page...');
    await page.goto('http://localhost:3000/blog/401k-calculator-guide.html', { waitUntil: 'networkidle2', timeout: 15000 });
    await page.screenshot({ path: path.join(ROOT, 'screen-blog.png'), fullPage: false });
    console.log('Blog screenshot saved');

    // Screenshot homepage
    console.log('Loading homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 15000 });
    await page.screenshot({ path: path.join(ROOT, 'screen-home.png'), fullPage: false });
    console.log('Homepage screenshot saved');

    // Now check: is there ANY visible element with rect.top > 0 before the header?
    console.log('\nChecking for elements above header on blog...');
    await page.goto('http://localhost:3000/blog/401k-calculator-guide.html', { waitUntil: 'networkidle2', timeout: 15000 });

    const gapInfo = await page.evaluate(() => {
        const header = document.querySelector('.site-header');
        if (!header) return { error: 'No header found' };
        const headerRect = header.getBoundingClientRect();

        // Check ALL elements in body for anything visible above the header
        const aboveHeader = [];
        const body = document.body;
        for (let i = 0; i < body.children.length; i++) {
            const el = body.children[i];
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            if (rect.top < headerRect.top && rect.height > 0 && style.display !== 'none') {
                aboveHeader.push({
                    tag: el.tagName,
                    class: el.className ? el.className.toString().substring(0, 40) : '',
                    top: rect.top,
                    height: rect.height,
                    display: style.display,
                    position: style.position,
                });
            }
        }

        // Also check if there's any scroll offset
        return {
            headerTop: headerRect.top,
            headerHeight: headerRect.height,
            scrollY: window.scrollY,
            aboveHeader: aboveHeader,
            bodyChildCount: body.children.length,
        };
    });

    console.log('Gap analysis:', JSON.stringify(gapInfo, null, 2));

    await browser.close();
    console.log('\nDone.');
})().catch(e => { console.error(e.message); process.exit(1); });
