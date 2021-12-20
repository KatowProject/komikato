const PDFDocument = require('pdfkit');
const getStream = require('get-stream');
const cheerio = require('cheerio');
const got = require('got-scraping').gotScraping;
require('chromedriver');
const chrome = require('selenium-webdriver/chrome');
const { Builder, until, By, Key, Capabilities } = require('selenium-webdriver');


module.exports = {
    get: (url, option = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await got.get(url, option);
                //get status code
                const statusCode = response.statusCode;
                if (statusCode === 503) {
                    const driver = new Builder().forBrowser('chrome').build();

                    await driver.get(url);
                    const title = await driver.getTitle();
                    if (url.includes('wp-json')) {
                        // find element pre
                        const pre = await driver.findElement(By.css('pre'));
                        const html = await pre.getAttribute('innerHTML');

                        resolve({ success: true, body: html });
                    } else if (url.includes('komikindo.id')) {
                        await driver.wait(until.titleContains('KomikIndo'), 5000);
                    } else {
                        await driver.wait(until.elementLocated(By.css('title')), 5000);
                    }

                    //get page source
                    const html = await driver.getPageSource();
                    await driver.quit();

                    return resolve({ body: html, statusCode: '200' });
                }
                return resolve(response);
            } catch (e) {
                reject(e);
            }
        });
    },

    generatePDF: async (images) => {
        try {
            const doc = new PDFDocument({ autoFirstPage: false });

            for (const image of images) {
                if (image.endsWith(".gif")) continue;
                const buffer = await require('got')(image).buffer();
                const img = doc.openImage(buffer);
                doc.addPage({ size: [img.width, img.height] });
                doc.image(img, 0, 0);
            };

            doc.end();

            const pdfStream = await getStream.buffer(doc);

            return pdfStream;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getVideoSrc: async (url) => {
        try {
            const response = await get(url);
            const $ = cheerio.load(response.body);
            let source1 = $.html().search('"file":');
            let source2 = $.html().search("'file':");
            let source3 = $('source').attr('src');
            let source4 = $('iframe').attr('src');

            if (source1 !== -1) {
                const end = $.html().indexOf('","');
                return $.html().substring(source1 + 8, end);
            } else if (source2 !== -1) {
                const end = $.html().indexOf("','");
                return $.html().substring(source2 + 8, end);
            } else if (source3) {
                return source3;
            }
            return "-";
        } catch (error) {
            return "-";
        }
    }

};