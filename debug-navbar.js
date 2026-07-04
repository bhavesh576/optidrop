const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const pages = [
    { name: 'Homepage', url: 'http://localhost:3000/' },
    { name: 'Blog', url: 'http://localhost:3000/blog/401k-calculator-guide.html' },
    { name: 'Tool', url: 'http://localhost:3000/tools/aspect-ratio-calculator.html' }
  ];

  for (const p of pages) {
    console.log(`\n=== ${p.name} ===`);
    await page.goto(p.url, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('.site-header', { timeout: 5000 });

    // Take screenshot
    await page.screenshot({ path: `debug-${p.name.toLowerCase()}.png`, fullPage: false });

    // Measure everything
    const info = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      const header = document.querySelector('.site-header');
      const headerRect = header ? header.getBoundingClientRect() : null;
      const bodyStyle = window.getComputedStyle(body);
      const htmlStyle = window.getComputedStyle(html);

      // Get ALL direct children of body with their positions
      const bodyChildren = Array.from(body.children).map((el, i) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          index: i,
          tag: el.tagName,
          class: el.className ? el.className.substring(0, 60) : '',
          id: el.id || '',
          rectTop: Math.round(rect.top * 100) / 100,
          rectHeight: Math.round(rect.height * 100) / 100,
          display: style.display,
          position: style.position,
          marginTop: style.marginTop,
          paddingTop: style.paddingTop,
          visibility: style.visibility,
          opacity: style.opacity
        };
      });

      // Check for any elements ABOVE the header (rectTop < 0 or rectTop > 0 before header)
      const aboveHeader = bodyChildren.filter(el => {
        return el.rectTop < headerRect.top && el.display !== 'none' && el.visibility !== 'hidden';
      });

      // Check header computed styles
      const headerStyle = header ? window.getComputedStyle(header) : null;

      return {
        url: window.location.pathname,
        htmlClass: html.className,
        bodyClass: body.className,
        bodyDisplay: bodyStyle.display,
        bodyFlexDir: bodyStyle.flexDirection,
        bodyMarginTop: bodyStyle.marginTop,
        bodyPaddingTop: bodyStyle.paddingTop,
        htmlMarginTop: htmlStyle.marginTop,
        htmlPaddingTop: htmlStyle.paddingTop,
        headerFound: !!header,
        headerRectTop: headerRect ? Math.round(headerRect.top * 100) / 100 : null,
        headerRectHeight: headerRect ? Math.round(headerRect.height * 100) / 100 : null,
        headerPosition: headerStyle ? headerStyle.position : null,
        headerTop: headerStyle ? headerStyle.top : null,
        headerMarginTop: headerStyle ? headerStyle.marginTop : null,
        headerPaddingTop: headerStyle ? headerStyle.paddingTop : null,
        bodyChildCount: bodyChildren.length,
        bodyChildren: bodyChildren,
        aboveHeader: aboveHeader,
        noscriptCount: document.querySelectorAll('noscript').length,
        skipLinkExists: !!document.querySelector('.skip-link'),
        skipLinkRect: (() => {
          const sl = document.querySelector('.skip-link');
          if (!sl) return null;
          const r = sl.getBoundingClientRect();
          return { top: Math.round(r.top * 100) / 100, height: Math.round(r.height * 100) / 100 };
        })()
      };
    });

    console.log('Header rectTop:', info.headerRectTop);
    console.log('Header position:', info.headerPosition);
    console.log('Header top:', info.headerTop);
    console.log('Header marginTop:', info.headerMarginTop);
    console.log('Body display:', info.bodyDisplay, 'flexDir:', info.bodyFlexDir);
    console.log('Body marginTop:', info.bodyMarginTop, 'paddingTop:', info.bodyPaddingTop);
    console.log('noscript count:', info.noscriptCount);
    console.log('skip-link exists:', info.skipLinkExists);
    if (info.skipLinkRect) console.log('skip-link top:', info.skipLinkRect.top);
    console.log('\nElements above header:');
    info.aboveHeader.forEach(el => {
      console.log(`  [${el.index}] <${el.tag}> class="${el.class}" top=${el.rectTop} h=${el.rectHeight} display=${el.display} pos=${el.position}`);
    });
    console.log('\nAll body children:');
    info.bodyChildren.forEach(el => {
      console.log(`  [${el.index}] <${el.tag}> class="${el.class}" top=${el.rectTop} h=${el.rectHeight} display=${el.display} pos=${el.position} mt=${el.marginTop}`);
    });
  }

  await browser.close();
  console.log('\nDone. Screenshots saved as debug-*.png');
})();
