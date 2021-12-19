const cheerio = require('cheerio');
const { axios } = require('../../tools');
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'Referer': 'https://komikindo.id/'
}

module.exports = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${req.params.query}`, { headers });
            const $ = cheerio.load(response.data);
            const main = $('#chimg');

            const data = {};
            data.chapter_name = $('h1.entry-title').text().replace('Komik ', '').trim();
            data.chapter_url = `https://komikindo.id/${req.params.query}/`;
            data.chapter_endpoint = `${req.params.query}/`;

            data.chapter_images = [];
            const chapter_image_url = $(`link[rel="alternate"][type="application/json"]`).attr('href');
            const getImages = await axios.get(chapter_image_url);
            const $imgs = cheerio.load(getImages.data.content.rendered);
            $imgs('img').each((i, el) => {
                const src = $imgs(el).attr('src');
                const url = src.replace('https://', "https://cdn.statically.io/img/")
                data.chapter_images.push(url);
            });
            data.chapter_length = data.chapter_images.length;

            const nav = $('.navig > .nextprev');
            data.chapter = {
                previous: $(nav).find('[rel=prev]').attr('href') ? $(nav).find('[rel=prev]').attr('href').replace('https://komikindo.id/', '') : null,
                next: $(nav).find('[rel=next]').attr('href') ? $(nav).find('[rel=next]').attr('href').replace('https://komikindo.id/', '') : null,
            }

            data.download_link = {
                pdf: `http://205.185.113.50/komik/download/${req.params.query}`,
            };

            resolve({ success: true, data });
        } catch (error) {
            reject({ success: false, error: error.message });
        }
    });
}