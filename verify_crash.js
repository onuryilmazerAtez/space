import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Catch console logs
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER ERROR:', msg.text());
        }
    });
    // Catch uncaught exceptions
    page.on('pageerror', error => {
        console.log('UNCAUGHT EXCEPTION:', error.message);
    });

    try {
        console.log('Navigating to http://localhost:5173/reports');
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(2000);
        
        console.log('Clicking Raporlar in sidebar');
        await page.click('text="Raporlar"');
        await page.waitForTimeout(2000);

        console.log('Looking for KPI Raporu card (Hazır Raporlar)');
        await page.click('text="KPI Raporu"');
        
        console.log('Waiting to see if it crashes...');
        await page.waitForTimeout(1000);
        
        console.log('Done.');
    } catch (e) {
        console.error('Script Error:', e);
    } finally {
        await browser.close();
    }
})();
