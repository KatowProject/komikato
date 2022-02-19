const cheerio = require('cheerio');
const { get } = require('../../tools');
const baseURL = 'https://komiku.id';

const home = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await get(`${baseURL}/`);
            const $ = cheerio.load(response.data);

            const main = $('.home');
            const obj = {};

            obj.header = {};
            obj.header.top = [];
            $(main).find('.hd2').find('ul li').each((i, el) => {
                const title = $(el).find('a').text();
                const endpoint = $(el).find('a').attr('href');

                obj.header.top.push({
                    title,
                    link: {
                        url: baseURL + endpoint,
                        endpoint
                    }
                });
            });

            obj.header.bottom = [];
            $(main).find('[role="navigation"]').find('ul li').each((i, el) => {
                const title = $(el).find('a').text();
                const url = $(el).find('a').attr('href').replace('https://data.komiku.id', '');

                obj.header.bottom.push({
                    title,
                    link: {
                        url: baseURL + url,
                        endpoint: url
                    }
                });
            });

            obj.main = {};
            $(main).find('main').find('section').each((i, el) => {
                const id = $(el).attr('id');
                switch (id) {
                    case 'Trending':
                        obj.main.trending = [];
                        $(el).find('.perapih > div > div').each((j, ele) => {
                            const _ = $(ele).find('div:nth-of-type(1)');
                            const manga_link = {
                                url: baseURL + _.find('a').attr('href'),
                                endpoint: _.find('a').attr('href')
                            }
                            const thumb = _.find('img').attr('src').split('?')[0];;

                            const _1 = $(ele).find('div:nth-of-type(2)');
                            const title = _1.find('a > h4').text().split('Chapter')[0].trim();
                            const title_chapter = _1.find('a > h4').text().split('Chapter')[1].trim();
                            const link = {
                                url: baseURL + _1.find('a').attr('href'),
                                endpoint: _1.find('a').attr('href')
                            }
                            const read_count = _1.find('a > span:nth-of-type(2)').text();
                            const updated_on = _1.find('a > span:nth-of-type(3)').text();
                            obj.main.trending.push({
                                title,
                                manga_link,
                                chapter: 'Chapter ' + title_chapter,
                                link,
                                thumb,
                                read_count,
                                updated_on
                            });
                        });
                        break;

                    case 'Komik_Hot':
                        obj.main.popular = [];
                        const _popular = $(el).find('.perapih:nth-of-type(1)');
                        _popular.find('.ls2').each((j, ele) => {
                            const _1 = $(ele).find('.ls2v');
                            const manga_link = {
                                url: baseURL + _1.find('a').attr('href'),
                                endpoint: _1.find('a').attr('href')
                            }
                            const thumb = _1.find('img').attr('data-src').split('?')[0];

                            const _2 = $(ele).find('.ls2j');
                            const title_manga = _2.find('h4 > a').text().trim();
                            const chapter = $(_2).find('a.ls2l').text();
                            const link = {
                                url: baseURL + _2.find('a.ls2l').attr('href'),
                                endpoint: _2.find('a.ls2l').attr('href')
                            }
                            const updated_on = _2.find('span').text();
                            obj.main.popular.push({
                                title: title_manga,
                                manga_link,
                                chapter,
                                link,
                                thumb,
                                updated_on
                            });
                        });

                        obj.main.hot = [];
                        const _hot = $(el).find('.perapih:nth-of-type(2)');
                        _hot.find('.ls2').each((j, ele) => {
                            const _1 = $(ele).find('.ls2v');
                            const manga_link = {
                                url: baseURL + _1.find('a').attr('href'),
                                endpoint: _1.find('a').attr('href')
                            }
                            const thumb = _1.find('img').attr('data-src').split('?')[0];

                            const _2 = $(ele).find('.ls2j');
                            const title_manga = _2.find('h4 > a').text().trim();
                            const chapter = $(_2).find('a.ls2l').text();
                            const link = {
                                url: baseURL + _2.find('a.ls2l').attr('href'),
                                endpoint: _2.find('a.ls2l').attr('href')
                            }
                            const updated_on = _2.find('span').text();
                            obj.main.hot.push({
                                title: title_manga,
                                manga_link,
                                chapter,
                                link,
                                thumb,
                                updated_on
                            });
                        });
                        break;

                    case 'Terbaru':
                        obj.main.new = [];
                        const isNotThird = $(el).find('h2 > span').text();
                        if (isNotThird !== 'Terbaru') return;
                        $(el).find('.ls4').each((j, ele) => {
                            const _1 = $(ele).find('.ls4v');
                            const manga_link = {
                                url: baseURL + _1.find('a').attr('href'),
                                endpoint: _1.find('a').attr('href')
                            }
                            const thumb = _1.find('img').attr('data-src').split('?')[0];

                            const _2 = $(ele).find('.ls4j');
                            const title_manga = _2.find('h4 > a').text().trim();
                            const chapter = $(_2).find('a.ls24').text();
                            const link = {
                                url: baseURL + _2.find('a.ls24').attr('href'),
                                endpoint: _2.find('a.ls24').attr('href')
                            }
                            const updated_on = _2.find('span').text();
                            obj.main.new.push({
                                title: title_manga,
                                manga_link,
                                chapter,
                                link,
                                thumb,
                                updated_on
                            });
                        });
                        break;

                    case 'Genre':
                        obj.main.genre = [];
                        $(el).find('.ls3').each((j, ele) => {
                            const _ = $(ele).find('.ls3p');

                            obj.main.genre.push({
                                title: _.find('h4').text().trim(),
                                link: {
                                    url: baseURL + _.find('a').attr('href'),
                                    endpoint: _.find('a').attr('href')
                                }
                            })
                        });
                        break;
                }
            });

            resolve({ success: true, data: obj });
        } catch (err) {
            reject({ success: false, message: err.message });
        }
    });
}

const detail = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const endpoint = req.params.endpoint;
            const response = await get(baseURL + '/manga/' + endpoint);
            const $ = cheerio.load(response.data);

            const element = $(".perapih");
            let genre_list = [];
            let chapter = [];
            const obj = {};

            /* Get Title, Type, Author, Status */
            const getMeta = element.find(".inftable > tbody").first();
            obj.title = $("#Judul > h1").text().trim();
            obj.type = $("tr:nth-child(2) > td:nth-child(2)").find("b").text();
            obj.author = $("#Informasi > table > tbody > tr:nth-child(4) > td:nth-child(2)")
                .text()
                .trim();
            obj.status = $(getMeta).children().eq(4).find("td:nth-child(2)").text();

            /* Set Manga Endpoint */
            obj.manga_endpoint = endpoint;

            /* Get Manga Thumbnail */
            obj.thumb = element.find(".ims > img").attr("src");

            element.find(".genre > li").each((idx, el) => {
                let genre_name = $(el).find("a").text();
                let link = $(el).find("a").attr("href");

                genre_list.push({
                    genre_name,
                    link
                });
            });

            obj.genre_list = genre_list || [];

            /* Get Synopsis */
            const getSinopsis = element.find("#Sinopsis").first();
            obj.synopsis = $(getSinopsis).find("p").text().trim();

            /* Get Chapter List */
            $("#Daftar_Chapter > tbody")
                .find("tr")
                .each((index, el) => {
                    let chapter_title = $(el).find("a").text().trim();
                    let chapter_endpoint = $(el).find("a").attr("href");
                    if (chapter_endpoint !== undefined) {
                        const rep = chapter_endpoint.replace("/ch/", "");
                        chapter.push({
                            chapter_title,
                            chapter_endpoint: rep,
                        });
                    }
                    obj.chapter = chapter;
                });

            resolve({ success: true, data: obj });
        } catch (err) {
            reject({ success: false, message: err.message });
        }
    });
}

const search = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = req.params.query;
            const response = await get(`https://data-komiku-id.translate.goog/cari/?post_type=manga&s=${query}`);
            const $ = cheerio.load(response.data);
            const main = $('.daftar');

            const ary = [];
            $(main).find('.bge').each((i, el) => {
                const obj = {};

                const _1 = $(el).find('.bgei');
                obj.thumb = _1.find('img').attr('data-src').split('?')[0];

                const _2 = $(el).find('.kan');
                obj.title = _2.find('a > h3').text().trim();
                obj.link = {
                    url: _2.find('a').attr('href'),
                    endpoint: _2.find('a').attr('href').replace(baseURL, "")
                };

                const ch = _2.find('.new1');
                obj.chapter = {
                    oldest: {
                        title: ch.eq(0).find('span').eq(1).text(),
                        link: {
                            url: ch.eq(0).find('a').attr('href'),
                            endpoint: ch.eq(0).find('a').attr('href').replace(baseURL, "")
                        }
                    },
                    newest: {
                        title: ch.eq(0).find('span').eq(1).text(),
                        link: {
                            url: ch.eq(1).find('a').attr('href'),
                            endpoint: ch.eq(1).find('a').attr('href').replace(baseURL, "")
                        }
                    }
                }

                ary.push(obj);
            });

            resolve({ success: true, data: ary });
        } catch (error) {
            reject(error);
        };
    });
}


module.exports = { home, detail, search };
