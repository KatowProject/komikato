const { get } = require('../../tools');
const cheerio = require('cheerio');
const baseURL = 'https://otakudesu.watch';

const home = (req, res) => new Promise(async (resolve, reject) => {
    try {
        const response = await get(`${baseURL}/`);
        const $ = cheerio.load(response.data);
        const main = $('.rseries');

        const obj = {};
        obj.ongoing = [];
        $(main).find('.venz > ul > li').each((i, el) => {
            const isOngoing = $(el).find('.epztipe').text().trim();
            if (parseInt(isOngoing)) return;

            obj.ongoing.push({
                name: $(el).find('.jdlflm').text(),
                thumb: $(el).find('.thumbz > img').attr('src'),
                epsisode_name: $(el).find('.epz').text().trim(),
                hari: $(el).find('.epztipe').text().trim(),
                release_date: $(el).find('.newnime').text().trim(),
                url: $(el).find('.thumb > a').attr('href'),
                endpoint: $(el).find('.thumb > a').attr('href').split('/')[4],
            });
        });
        obj.complete = [];
        $(main).find('.rseries').find('.venz > ul > li').each((i, el) => {
            obj.complete.push({
                name: $(el).find('.jdlflm').text(),
                thumb: $(el).find('.thumbz > img').attr('src'),
                epsisode_name: $(el).find('.epz').text().trim(),
                skor: $(el).find('.epztipe').text().trim(),
                release_date: $(el).find('.newnime').text().trim(),
                url: $(el).find('.thumb > a').attr('href'),
                endpoint: $(el).find('.thumb > a').attr('href').split('/')[4],
            });
        });

        resolve({ success: true, data: obj });
    } catch (err) {
        reject({ success: false, message: err.message });
    }
});

const search = (req, res) => new Promise(async (resolve, reject) => {
    try {
        const endpoint = req.params.query;
        const query = endpoint.replace(/\s/g, '+');
        const response = await get(`${baseURL}/?s=${query}&post_type=anime`);
        const $ = cheerio.load(response.data);
        const main = $('#venkonten');

        const data = [];
        $(main).find('.chivsrc li').each((i, el) => {
            const genres = [];
            $(el).find('.set:nth-of-type(1) > a').each((b, ele) => {
                genres.push({
                    name: $(ele).text(),
                    url: $(ele).attr('href'),
                });
            })
            data.push({
                name: $(el).find('h2 > a').text(),
                thumb: $(el).find('img').attr('src'),
                genres,
                status: $(el).find('.set:nth-of-type(2)').text().split(':')[1]?.trim(),
                score: $(el).find('.set:nth-of-type(3)').text().split(':')[1]?.trim(),
                url: $(el).find('h2 > a').attr('href'),
                endpoint: $(el).find('h2 > a').attr('href').replace(baseURL, '')
            });
        });

        resolve({ success: true, data });
    } catch (err) {
        reject({ success: false, message: err.message });
    }
});
module.exports = { home, search };