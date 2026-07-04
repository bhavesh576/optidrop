const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('=== BLOG PAGE ===');
    await page.goto('http://localhost:3000/blog/401k-calculator-guide.html', { waitUntil: 'networkidle0' });

    // Get all direct children of body and measure them
    const bodyChildren = await page.evaluate(() => {
        const results = [];
        const body = document.body;
        for (let i = 0; i < body.children.length; i++) {
            const el = body.children[i];
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            results.push({
                index: i,
                tag: el.tagName,
                class: el.className ? el.className.toString().substring(0, 60) : '',
                id: el.id || '',
                rectTop: rect.top,
                rectHeight: rect.height,
                display: style.display,
                position: style.position,
                marginTop: style.marginTop,
                marginBottom: style.marginBottom,
                paddingTop: style.paddingTop,
                paddingBottom: style.paddingBottom,
            });
        }
        return results;
    });

    console.log('Body children:');
    bodyChildren.forEach(c => {
        console.log(`  [${c.index}] <${c.tag}> class="${c.class}" id="${c.id}"`);
        console.log(`       top=${c.rectTop} height=${c.rectHeight} display=${c.display} position=${c.position}`);
        console.log(`       margin=${c.marginTop}/${c.marginBottom} padding=${c.paddingTop}/${c.paddingBottom}`);
    });

    // Measure header specifically
    const headerInfo = await page.evaluate(() => {
        const h = document.querySelector('.site-header');
        if (!h) return { found: false };
        const rect = h.getBoundingClientRect();
        const style = getComputedStyle(h);
        // Check what's above the header
        const prev = h.previousElementSibling;
        const prevInfo = prev ? {
            tag: prev.tagName,
            class: prev.className ? prev.className.toString().substring(0, 60) : '',
            rect: prev.getBoundingClientRect(),
            display: getComputedStyle(prev).display,
        } : null;
        return {
            found: true,
            rectTop: rect.top,
            rectHeight: rect.height,
            position: style.position,
            top: style.top,
            marginTop: style.marginTop,
            paddingTop: style.paddingTop,
            prevSibling: prevInfo,
            htmlClass: document.documentElement.className,
            bodyDisplay: getComputedStyle(document.body).display,
            bodyFlexDir: getComputedStyle(document.body).flexDirection,
            bodyMarginTop: getComputedStyle(document.body).marginTop,
            bodyPaddingTop: getComputedStyle(document.body).paddingTop,
            noscriptCount: document.querySelectorAll('noscript').length,
        };
    });

    console.log('\nHeader info:', JSON.stringify(headerInfo, null, 2));

    // Now check HOMEPAGE
    console.log('\n=== HOMEPAGE ===');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

    const homeHeader = await page.evaluate(() => {
        const h = document.querySelector('.site-header');
        if (!h) return { found: false };
        const rect = h.getBoundingClientRect();
        const style = getComputedStyle(h);
        const prev = h.previousElementSibling;
        const prevInfo = prev ? {
            tag: prev.tagName,
            class: prev.className ? prev.className.toString().substring(0, 60) : '',
            rectTop: prev.getBoundingClientRect().top,
            rectHeight: prev.getBoundingClientRect().height,
            display: getComputedStyle(prev).display,
        } : null;
        return {
            found: true,
            rectTop: rect.top,
            rectHeight: rect.height,
            position: style.position,
            top: style.top,
            marginTop: style.marginTop,
            prevSibling: prevInfo,
            noscriptCount: document.querySelectorAll('noscript').length,
        };
    });

    console.log('Homepage header:', JSON.stringify(homeHeader, null, 2));

    await browser.close();
})();
