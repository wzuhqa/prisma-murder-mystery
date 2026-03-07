import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        headless: 'new'
    });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('framenavigated', frame => console.log('NAVIGATED TO:', frame.url()));

    await page.evaluateOnNewDocument(() => {
        const originalReload = window.location.reload;
        window.location.reload = function () {
            console.log('RELOAD CALLED FROM:', new Error().stack);
            return originalReload.apply(this, arguments);
        };

        // Also patch location.href assignment
        let hrefValue = window.location.href;
        Object.defineProperty(window.location, 'href', {
            get: function () { return hrefValue; },
            set: function (v) {
                console.log('LOCATION.HREF SET TO:', v, 'FROM:', new Error().stack);
                hrefValue = v;
                window.location.assign(v);
            }
        });
    });

    console.log('Navigating to localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 60000 });

    await new Promise(r => setTimeout(r, 2000));
    console.log('Clicking the body...');
    await page.evaluate(() => {
        document.body.click();
    });

    await new Promise(r => setTimeout(r, 1000));
    console.log('Clicking window at 500x500...');
    await page.mouse.click(500, 500);

    // Wait a bit to catch logs
    await new Promise(r => setTimeout(r, 3000));

    await browser.close();
    console.log('Done.');
})();
