const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('PAGE LOG ERROR:', msg.text());
        }
    });

    page.on('pageerror', err => {
        console.log('PAGE ERROR:', err.message);
    });

    await page.goto('http://localhost:5173/reports', { waitUntil: 'networkidle0' });
    
    // click KPI Raporu tab
    try {
        await page.click('.ant-tabs-tab:nth-child(2)');
        await new Promise(r => setTimeout(r, 2000));
        await page.click('.ant-card-hoverable:nth-child(2)'); // KPI card
        await new Promise(r => setTimeout(r, 2000));
    } catch(e) {
        console.log("Could not click elements", e.message);
    }
    
    await browser.close();
})();
