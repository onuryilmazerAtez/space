const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
      // Sıklıkla atılan gereksiz logları filtrele
      if (!msg.text().includes('vite') && !msg.text().includes('Download the React DevTools')) {
          console.log(`B-CONSOLE [${msg.type()}]:`, msg.text());
      }
  });

  page.on('pageerror', err => {
      console.log('B-PAGEERROR:', err.toString());
  });

  console.log("Navigating to dashboard...");
  await page.goto('http://localhost:5173/reports', { waitUntil: 'networkidle2' });
  
  // Click on the GTİP Karşılaştırma card
  console.log("Clicking the GTIP card...");
  // Finding the card by its title text
  const cardHandles = await page.$$('.ant-card-meta-title');
  for (let c of cardHandles) {
      const text = await page.evaluate(el => el.textContent, c);
      if (text.includes('GTİP Karşılaştırma')) {
          await c.click();
          console.log("Clicked GTIP!");
          break;
      }
  }

  // wait 2 seconds for potential crash
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
