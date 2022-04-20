const PDFDocument = require('pdfkit');
const getStream = require('get-stream');
const cheerio = require('cheerio');
const axios = require('axios');
const got = require('got');

module.exports = {
    get: async (url, option = {}) => {
        try {
            const response = await axios.get(url, option);
            return response;
        } catch (err) {
            //get code status
            const code = err.response.status;
            if (code !== 200) {
                const res = await axios.get(`https://bypass.kato-rest.us/url/${btoa(url)}`);

                return res;
            }
        }
    },

    post: async (url, data, option) => {
        const response = await axios.post(url, data, option);
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
            const response = await axios.get(url);
            const data = response.data;
            const $ = cheerio.load(data);

            let src = null;
            let src1 = $("source");
            let src2 = data.split("sources: [");
            let src3 = $("iframe");
            if (src1.length > 0)
                src = src1.attr("src");
            else if (src2.length > 1)
                src = src2[1].split("]")[0].split("'file':")[1].split("'")[1];
            else
                src = src3.attr("src");

            return src;
        } catch (error) {
            return "-";
        }
    }

};