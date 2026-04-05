const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('pageerror', e => console.log('ERR:', e.message));
  
  page.on('response', res => {
    if(res.request().resourceType() === 'script') {
       console.log('SCRIPT:', res.url());
    }
  });

  await page.goto('https://reformnow.github.io/maps/tribes/', {waitUntil: 'networkidle0'});
  await browser.close();
})();
