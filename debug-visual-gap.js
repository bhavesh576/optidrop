const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // ── Test multiple pages ──
  const pages = [
    { name: 'homepage', url: 'http://localhost:3000/' },
    { name: 'blog', url: 'http://localhost:3000/blog/401k-calculator-guide.html' },
    { name: 'tool', url: 'http://localhost:3000/tools/aspect-ratio-calculator.html' },
    { name: 'about', url: 'http://localhost:3000/about.html' },
    { name: 'category', url: 'http://localhost:3000/category/calculator-tools.html' },
  ];

  for (const p of pages) {
    await page.goto(p.url, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('.site-header', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 500));

    // Take screenshot
    await page.screenshot({ path: `debug-${p.name}.png`, fullPage: false });

    // Measure gap
    const result = await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const headerRect = header.getBoundingClientRect();
      const body = document.body;
      const bodyStyle = window.getComputedStyle(body);

      // Get ALL visible elements above the header
      const allEls = document.querySelectorAll('*');
      const above = [];
      for (const el of allEls) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.top < headerRect.top && rect.height > 0 && style.display !== 'none'
            && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0
            && el.tagName !== 'HTML' && el.tagName !== 'BODY') {
          above.push({
            tag: el.tagName,
            cls: (el.className || '').toString().substring(0, 60),
            top: Math.round(rect.top * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
            display: style.display,
            position: style.position,
            overflow: style.overflow,
          });
        }
      }

      // Check skip-link specifically
      const skipLink = document.querySelector('.skip-link');
      const skipRect = skipLink ? skipLink.getBoundingClientRect() : null;

      // Get pixel color at (10, 0), (10, 5), (10, 10)
      // We can't do this directly but we can check what element is at those points
      const pointCheck = [];
      for (const y of [0, 2, 5, 10, 20, 30, 50]) {
        const el = document.elementFromPoint(10, y);
        pointCheck.push({
          y: y,
          tag: el ? el.tagName : 'null',
          cls: el ? (el.className || '').toString().substring(0, 40) : '',
        });
      }

      return {
        headerTop: Math.round(headerRect.top * 10) / 10,
        headerHeight: Math.round(headerRect.height * 10) / 10,
        bodyMarginTop: bodyStyle.marginTop,
        bodyPaddingTop: bodyStyle.paddingTop,
        htmlClass: document.documentElement.className,
        noscriptCount: document.querySelectorAll('noscript').length,
        aboveHeader: above,
        skipLinkTop: skipRect ? Math.round(skipRect.top * 10) / 10 : 'N/A',
        pointCheck: pointCheck,
      };
    });

    console.log(`\n=== ${p.name.toUpperCase()} ===`);
    console.log(`Header top: ${result.headerTop}, height: ${result.headerHeight}`);
    console.log(`Body margin-top: ${result.bodyMarginTop}, padding-top: ${result.bodyPaddingTop}`);
    console.log(`HTML class: ${result.htmlClass}`);
    console.log(`Noscript count: ${result.noscriptCount}`);
    console.log(`Skip-link top: ${result.skipLinkTop}`);
    console.log(`Elements above header: ${result.aboveHeader.length}`);
    result.aboveHeader.forEach(el => {
      console.log(`  ${el.tag}.${el.cls} | top:${el.top} h:${el.height} display:${el.display} pos:${el.position}`);
    });
    console.log(`Pixel check (what element is at each y):`);
    result.pointCheck.forEach(pc => {
      console.log(`  y=${pc.y}: ${pc.tag}.${pc.cls}`);
    });
  }

  await browser.close();
  console.log('\nDone. Check debug-*.png screenshots.');
})().catch(console.error);
