const cheerio = require('cheerio');
const { get } = require('../../tools');
const mainUrl = 'https://komikindo-id.translate.goog';
const query = "?_x_tr_sl=ja&_x_tr_tl=en&_x_tr_hl=en-US&_x_tr_pto=wapp";

module.exports = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await get(`${mainUrl}/${req.params.query}${query}`);
            const $ = cheerio.load(response.data);
            const main = $('#chimg');

            const data = {};
            data.chapter_name = $('h1.entry-title').text().replace('Komik ', '').trim();
            data.chapter_url = `https://komikindo.id/${req.params.query}/`;
            data.chapter_endpoint = `${req.params.query}/`;

            data.chapter_images = [];
            const chapter_image_url = $(`link[rel="alternate"][type="application/json"]`).attr('href');
            const chapterimguri = chapter_image_url.replace('http://komikindo.id', mainUrl);
            const getImages = await get(chapterimguri);
            const images = JSON.parse(getImages.body);
            const $imgs = cheerio.load(images.content.rendered);
            $imgs('img').each((i, el) => {
                const src = $imgs(el).attr('src');
                const url = src.replace('https://komikcdn.me', "https://komikcdn-me.translate.goog");
                data.chapter_images.push(url);
            });
            data.chapter_length = data.chapter_images.length;

            const nav = $('.navig > .nextprev');
            data.chapter = {
                previous: $(nav).find('[rel=prev]').attr('href') ? $(nav).find('[rel=prev]').attr('href').replace(mainUrl, '').replace(query, '') : null,
                next: $(nav).find('[rel=next]').attr('href') ? $(nav).find('[rel=next]').attr('href').replace(mainUrl, '').replace(query, '') : null,
            }

            data.download_link = {
                pdf: `http://205.185.113.50/komik/download/${req.params.query}`,
            };

            resolve({ success: true, data });
        } catch (error) {
            reject(error);
        }
    });
}