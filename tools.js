const PDFDocument = require('pdfkit');
const getStream = require('get-stream');
const cheerio = require('cheerio');
const axios = require('axios');
const got = require('got');

module.exports = {
    get: async (url, option = {}) => {
        const response = await axios.get(url, option);
        if (response.status !== 200) {
            const res = await axios.get(`https://bypass.kato-rest.us/url/${btoa(url)}`);

            return res;
        }

        return response;
    },

    generatePDF: async (images) => {
        try {
            const doc = new PDFDocument({ autoFirstPage: false });

            for (const image of images) {
                if (image.endsWith(".gif")) continue;
                const base64 = btoa(image);
                const buffer = await require('got')(`https://bypass.kato-rest.us/url/${base64}`).buffer();
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
            const response = await got(url);
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