const cheerio = require('cheerio');
const { get } = require('../../tools');

const home = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await get('https://m.mangabat.com/m');
            const $ = cheerio.load(response.data);
            const main = $('.body-site');


            /** Latest Update */
            const latest = [];
            $(main).find('.panel-content-homepage > .content-homepage-item').each((i, e) => {
                const title = $(e).find('a').attr('title');
                const thumb = $(e).find('a > img').attr('src');
                const link = $(e).find('a').attr('href');
                const endpoint = link.split('/').pop();

                latest.push({
                    title,
                    thumb,
                    link: {
                        url: link,
                        endpoint
                    }
                });
            });


            resolve({ success: true, data: latest });
        } catch (err) {
            reject({ success: false, message: err.message });
        }
    });

}
const search = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = req.params.query;
            const pagination = req.params.pagination ? req.params.pagination : 1;

            const response = await get(`https://m.mangabat.com/search/manga/${query}?page=${pagination}`);
            const $ = cheerio.load(response.data);

            const mangas = [];
            $('.panel-list-story > .list-story-item').each((i, e) => {
                const info = $(e).find('.item-right');

                const data = {};
                data.title = $(info).find('h3').text().trim();
                data.author = $(info).find('.item-author').text();
                data.thumb = $(e).find('.img-loading').attr('src');
                data.link = {
                    url: $(info).find('h3 > a').attr('href'),
                    endpoint: `${$(info).find('h3 > a').attr('href')}`.split('/')[3]
                }

                mangas.push(data);
            });

            const navigation = [];
            $('.group-page > a').each((i, e) => {
                const endpoint = `${$(e).attr('href')}`;
                const uri = endpoint === "undefined" ? null : new URL(endpoint);
                const path = uri ? uri.pathname.split('/').pop() : null;

                navigation.push({
                    name: $(e).text().toLowerCase(),
                    endpoint: path ? path + '/page/' + uri.searchParams.get('page') : null
                });
            });

            resolve({ success: true, data: { mangas, navigation } });
        } catch (error) {
            reject({ success: false, message: error.message ? error.message : error });
        }
    });
}

const getDetail = (req, res) => {
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

            const info = $('.story-info-right');
            data.title = $(info).find('h1').text();
            data.alter = $(info).find('.variations-tableInfo').find('tbody > tr:nth-of-type(1) > .table-value').text().split(';');
            data.thumb = $('.info-image').find('img').attr('src');
            data.author = [];
            $(info).find('.variations-tableInfo').find('tbody > tr:nth-of-type(2) > .table-value > a').each((i, e) => {
                data.author.push({
                    name: $(e).text(),
                    url: $(e).attr('href')
                });
            });
            data.status = $(info).find('.variations-tableInfo').find('tbody > tr:nth-of-type(3) > .table-value').text();
            data.genre = [];
            $(info).find('.variations-tableInfo').find('tbody > tr:nth-of-type(4) > .table-value > a').each((i, e) => {
                data.genre.push({
                    name: $(e).text(),
                    url: $(e).attr('href')
                });
            });
            data.synopsis = $('.panel-story-info-description').text().trim();
            data.chapters = [];
            $('.row-content-chapter > li').each((i, e) => {
                data.chapters.push({
                    name: $(e).find('.chapter-name').text(),
                    link: {
                        url: $(e).find('a').attr('href'),
                        endpoint: `${$(e).find('a').attr('href')}`.split('/')[3]
                    }
                });
            });



            resolve({ success: true, data });
        } catch (error) {
            reject({ success: false, message: error.message ? error.message : error });
        }
    });
}

module.exports = { home, search, getDetail }