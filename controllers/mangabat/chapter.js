const cheerio = require('cheerio');
const { get } = require('../../tools');

module.exports = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const manga = req.params.endpoint;
            let response = await get(`https://read.mangabat.com/${manga}`);
            let $ = cheerio.load(response.data);

            if ($('.panel-not-found p:nth-of-type(1)').text() === '404 - PAGE NOT FOUND') {
                response = await get(`https://m.mangabat.com/${manga}`);
                $ = cheerio.load(response.data);
            }

            const data = {};
            data.chapter_title = $('.panel-chapter-info-top > h1').text();
            data.chapter_images = [];
            $('.container-chapter-reader > img').each((i, e) => {
                const url = new URL($(e).attr('src'));
                data.chapter_images.push({
                    name: $(e).attr('title'),
                    url: "http://cdn-mangakakalot.snowfagz.workers.dev" + url.pathname
                });
            });
            data.chapter_length = data.chapter_images.length;
            data.navigation = {};
            $('.navi-change-chapter-btn:nth-of-type(1) > a').each((i, e) => {
                if ($(e).text() === 'PREV CHAPTER') {
                    data.navigation.prev = `${$(e).attr('href')}`.split('/').pop();
                } else if ($(e).text() === 'NEXT CHAPTER') {
                    data.navigation.next = `${$(e).attr('href')}`.split('/').pop();
                }
            });

            resolve({ success: true, data });
        } catch (error) {
            reject({ success: false, message: error.message ? error.message : error });
        }
    });
}