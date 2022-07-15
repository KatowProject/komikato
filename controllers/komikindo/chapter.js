const cheerio = require('cheerio');
const { get } = require('../../tools');
const mainUrl = 'https://komikindo.id';
const db = require('../../database');

module.exports = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cache = await db.get('komikindo', req.params.query);
            const response = await get(`${mainUrl}/${req.params.query}`);
            const $ = cheerio.load(response.data);
            const main = $('#chimg');

            const data = {};
            data.chapter_name = $('h1.entry-title').text().replace('Komik ', '').trim();
            data.chapter_url = `https://komikindo.id/${req.params.query}/`;
            data.chapter_endpoint = `${req.params.query}/`;

            data.chapter_images = [];
            if (cache) {
                data.chapter_images = cache;
            } else {
                const chapter_image_url = $(`link[rel="alternate"][type="application/json"]`).attr('href');
                const chapterimguri = chapter_image_url.replace('http://komikindo.id', mainUrl);
                const getImages = await get(chapterimguri);
                const images = getImages.data;
                const $imgs = cheerio.load(images.content.rendered);
                console.log($imgs);
                $imgs('img').each((i, el) => {
                    const src = $imgs(el).attr('src');
                    const url = src.replace('https://komikcdn.me', "https://komikcdn-me.translate.goog");
                    data.chapter_images.push(url);
                });
                console.log(data.chapter_images);
                db.set('komikindo', req.params.query, data.chapter_images);
            }
            const nav = $('.navig > .nextprev');
            data.chapter = {
                previous: $(nav).find('[rel=prev]').attr('href') ? $(nav).find('[rel=prev]').attr('href').replace(mainUrl, '') : null,
                next: $(nav).find('[rel=next]').attr('href') ? $(nav).find('[rel=next]').attr('href').replace(mainUrl, '') : null,
            }

            data.download_link = {
                pdf: `/komikindo/download/${req.params.query}`,
            };

            resolve({ success: true, data });
        } catch (error) {
            reject(error);
        }
    });
}