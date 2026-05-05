const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.type() === 'error') console.error('BROWSER ERROR:', msg.text());
    });
    page.on('pageerror', err => {
        console.error('PAGE ERROR:', err.toString());
    });

    try {
        await page.goto('http://localhost:5173/reports', { waitUntil: 'networkidle2' });
        
        // Wait for Hazır Rapor cards
        await page.waitForSelector('.ant-card-meta-title');
        const cards = await page.$$('.ant-card-meta-title');
        
        let targetCard;
        for (let c of cards) {
            const txt = await page.evaluate(el => el.textContent, c);
            if (txt.includes('GTİP')) {
                targetCard = c;
                break;
            }
        }
        
        if (targetCard) {
            console.log('Clicking GTIP card...');
            await targetCard.click();
            await new Promise(r => setTimeout(r, 2000));
        } else {
            console.log('Card not found');
        }
    } catch (e) {
        console.error('SCRIPT ERROR:', e.message);
    } finally {
        await browser.close();
    }
})();
