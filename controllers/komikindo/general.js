const cheerio = require('cheerio');
const { axios } = require('../../tools');
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'Referer': 'https://komikindo.id/'
}


const home = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await axios.get('/', { headers });
            const $ = cheerio.load(data.data);

            const obj = {};
            /* Menu */
            obj.menu = [];
            $('#menu-second-menu > li').each((i, e) => {
                obj.menu.push({
                    name: $(e).find('a').text(),
                    link: {
                        url: 'https://komikindo.id' + $(e).find('a').attr('href'),
                        endpoint: $(e).find('a').attr('href').replace('https://komikindo.id/', '')
                    }
                });
            });

            /* Body */
            obj.body = {};
            $('.postbody > .whites').each((i, e) => {
                if (e.attribs.id === 'informasi') return;

                /* Recent Popular*/
                const recentPopular = $(e).find('.post-show.mangapopuler');
                if (recentPopular.length > 0) {
                    obj.body.recent_popular = [];
                    $(recentPopular).find('.animepost').each((j, f) => {
                        obj.body.recent_popular.push({
                            name: $(f).find('*[itemprop="url"]').attr('title').replace('Komik', '').trim(),
                            thumb: $(f).find('img').attr('src').split('?')[0],
                            link: {
                                url: $(f).find('*[itemprop="url"]').attr('href'),
                                endpoint: $(f).find('*[itemprop="url"]').attr('href').replace('https://komikindo.id/', '')
                            },
                            last_upload: $(f).find('.datech').text(),
                            last_chapter: {
                                name: $(f).find('.lsch > a').text(),
                                url: $(f).find('.lsch > a').attr('href'),
                                endpoint: $(f).find('.lsch > a').attr('href').replace('https://komikindo.id/', '')
                            }
                        });
                    });
                };

                /*New Update*/
                const newUpdate = $(e).find('.post-show.chapterbaru');
                if (newUpdate.length > 0) {
                    obj.body.new_update = [];
                    $(newUpdate).find('.animepost').each((j, f) => {
                        obj.body.new_update.push({
                            name: $(f).find('*[itemprop="url"]').attr('title').replace('Komik', '').trim(),
                            thumb: $(f).find('img').attr('src').split('?')[0],
                            link: {
                                url: $(f).find('*[itemprop="url"]').attr('href'),
                                endpoint: $(f).find('*[itemprop="url"]').attr('href').replace('https://komikindo.id/', '')
                            }
                        });
                    });
                }

                /* Colored Komik */
                const coloredKomik = $(e).find('section:nth-of-type(5) div.listupd');
                if (coloredKomik.length > 0) {
                    obj.body.colored_komik = [];
                    $(coloredKomik).find('.animepost').each((j, f) => {
                        obj.body.colored_komik.push({
                            name: $(f).find('*[itemprop="url"]').attr('title').replace('Komik', '').trim(),
                            thumb: $(f).find('img').attr('src').split('?')[0],
                            link: {
                                url: $(f).find('*[itemprop="url"]').attr('href'),
                                endpoint: $(f).find('*[itemprop="url"]').attr('href').replace('https://komikindo.id/', '')
                            },
                            last_upload: $(f).find('.datech').text(),
                            last_chapter: {
                                name: $(f).find('.lsch > a').text(),
                                url: $(f).find('.lsch > a').attr('href'),
                                endpoint: $(f).find('.lsch > a').attr('href').replace('https://komikindo.id/', '')
                            }
                        });
                    });
                }
            });

            obj.sidebar = {};
            $('#sidebar').find('.widgets').each((i, e) => {
                const pop = $(e).find('h3').text() === 'Komik Terpopuler' ? $(e).find('h3').text() : null;
                if (pop) {
                    obj.sidebar.popular = [];
                    $(e).find('li').each((j, f) => {
                        obj.sidebar.popular.push({
                            name: $(f).find('a').attr('title').replace('Komik', '').trim(),
                            link: {
                                url: $(f).find('a').attr('href'),
                                endpoint: $(f).find('a').attr('href').replace('https://komikindo.id/', '')
                            },
                            thumb: $(f).find('img').attr('src').split('?')[0],
                            score: $(f).find('.loveviews').text().trim()
                        });
                    });
                }

                const newKomik = $(e).find('h3').text() === 'Koleksi Terbaru' ? $(e).find('h3').text() : null;
                if (newKomik) {
                    obj.sidebar.new_komik = [];
                    $(e).find('li').each((j, f) => {
                        obj.sidebar.new_komik.push({
                            name: $(f).find('a').attr('title').replace('Manga', '').trim(),
                            link: {
                                url: $(f).find('a').attr('href'),
                                endpoint: $(f).find('a').attr('href').replace('https://komikindo.id/', '')
                            },
                            thumb: $(f).find('img').attr('src').split('?')[0],
                            score: $(f).find('.loveviews').text().trim()
                        });
                    });
                }
            });

            obj.footer = [];
            $('#menu-footer > li').each((i, e) => {
                obj.footer.push({
                    name: $(e).find('a').text(),
                    url: $(e).find('a').attr('href'),
                })
            });

            resolve({ success: true, data: obj });
        } catch (error) {
            reject(error);
        }
    });
};

const komiks = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/daftar-komik/page/${req.params.number}`, { headers });
            const $ = cheerio.load(response.data);

            const manga = [];
            const main = $('.postbody');
            $(main).find('.film-list > .animepost').each((i, e) => {
                const m = $(e).find('.animposx');
                manga.push({
                    title: $(m).find('a').attr('title'),
                    thumb: $(m).find('.limit > img').attr('src')?.split('?')[0],
                    link: {
                        endpoint: $(m).find('a').attr('href').replace('https://komikindo.id/', ''),
                        url: $(m).find('a').attr('href')
                    }
                });
            });

            const footer = [];
            $('#menu-footer > li').each((i, e) => {
                footer.push({
                    name: $(e).find('a').text(),
                    url: $(e).find('a').attr('href'),
                })
            });

            const pagination = [];
            $(main).find('.pagination .page-numbers').each((i, a) => {
                const endpoint = `${$(a).attr('href')}`.replace('https://komikindo.id/', '');
                pagination.push({
                    name: $(a).text(),
                    url: $(a).attr('href') ? $(a).attr('href') : null,
                    endpoint: endpoint !== "undefined" ? endpoint : null,
                });
            });

            resolve({ success: true, data: { manga, footer, pagination } });
        } catch (error) {
            reject({ suceess: false, message: error.message });
        };
    })
};

const newestManga = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/komik-terbaru/page/${req.params.number}`);
            const $ = cheerio.load(response.data);

            const manga = [];
            const main = $('.postbody');
            $(main).find('.film-list > .animepost').each((i, e) => {
                const m = $(e).find('.animposx');
                manga.push({
                    title: $(m).find('a').attr('title'),
                    thumb: $(m).find('.limit > img').attr('src').split('?')[0],
                    link: {
                        endpoint: $(m).find('a').attr('href').replace('https://komikindo.id/', ''),
                        url: $(m).find('a').attr('href')
                    }
                });
            });

            resolve({ success: true, data: manga });
        } catch (error) {
            reject({ suceess: false, message: error.message });
        };
    });
};

const komik = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const type = req.params.type;
            const num = req.params.number;

            let response = null;
            switch (type) {
                case 'manga':
                    response = await axios.get(`/manga/page/${num}`, { headers });
                    break;

                case 'manhua':
                    response = await axios.get(`/manhua/page/${num}`, { headers });
                    break;

                case 'manhwa':
                    response = await axios.get(`/manhwa/page/${num}`, { headers });
                    break;
            }
            const $ = cheerio.load(response.data);

            const komik = [];
            const main = $('.postbody');
            $(main).find('.film-list > .animepost').each((i, e) => {
                const m = $(e).find('.animposx');
                komik.push({
                    title: $(m).find('a').attr('title'),
                    thumb: $(m).find('.limit > img').attr('src').split('?')[0],
                    link: {
                        endpoint: $(m).find('a').attr('href').replace('https://komikindo.id/', ''),
                        url: $(m).find('a').attr('href')
                    }
                });
            });

            resolve({ success: true, data: komik });
        } catch (error) {
            reject({ suceess: false, message: error.message });
        }
    });
};

const getDetail = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/manga/${req.params.endpoint}`, { headers });
            const $ = cheerio.load(response.data);

            const main = $('.infoanime');
            const info = $(main).find('.spe');
            const manga = {};

            manga.title = $(main).find('.entry-title').text();
            manga.thumb = $(main).find('.thumb > img').attr('src').split('?')[0];
            manga.alter = $(info).find('span:nth-of-type(1)').text().replace('Judul Alternatif: ', '').split(', ');
            manga.status = $(info).find('span:nth-of-type(2)').text().split(':')[1].trim();
            manga.pengarang = [];
            $(info).find('span:nth-of-type(3) > a').each((i, e) => {
                const authors = manga.pengarang;
                authors.push({
                    name: $(e).text(),
                    link: $(e).attr('href'),
                    endpoint: $(e).attr('href').replace('https://komikindo.id/', '')
                });
            });
            manga.illustrator = [];
            $(info).find('span:nth-of-type(4) > a').each((i, e) => {
                const illus = manga.illustrator;
                illus.push({
                    name: $(e).text(),
                    link: $(e).attr('href'),
                    endpoint: $(e).attr('href').replace('https://komikindo.id/', '')
                });
            });
            manga.grafis = {
                name: $(info).find('span:nth-of-type(5)').text().split(':')[1].trim(),
                link: $(info).find('span:nth-of-type(5) > a').attr('href'),
                endpoint: $(info).find('span:nth-of-type(5) > a').attr('href').replace('https://komikindo.id/', '')
            };
            manga.tema = [];
            $(info).find('span:nth-of-type(6) > a').each((i, e) => {
                const themes = manga.tema;
                themes.push({
                    name: $(e).text(),
                    link: $(e).attr('href'),
                    endpoint: $(e).attr('href').replace('https://komikindo.id/', '')
                });
            });
            const tipe = $(info).find('span:nth-of-type(7)').text();
            manga.tipe = tipe.length > 0 ? tipe.split(':')[1].trim() : null;
            manga.genre = [];
            $('.infox').find('.genre-info > a').each((i, e) => {
                const genres = manga.genre;
                genres.push({
                    name: $(e).text(),
                    link: `https://komikindo.id` + $(e).attr('href'),
                    endpoint: $(e).attr('href').replace('https://komikindo.id/', '')
                });
            });
            manga.sinopsis = $('*[itemprop="description"]').text().trim();
            manga.score = $('*[itemprop="ratingValue"]').text();
            manga.chapters = [];
            $('#chapter_list ul > li').each((i, e) => {
                const chapters = manga.chapters;

                const obj = {}
                obj.title = $(e).find('.lchx').text();
                obj.link = $(e).find('.lchx > a').attr('href');
                obj.endpoint = $(e).find('.lchx > a').attr('href').replace('https://komikindo.id/', '');
                obj.download = {
                    pdf: `http://205.185.113.50/komik/download/${obj.endpoint}`
                };

                chapters.push(obj);
            });
            manga.link = {
                url: `https://komikindo.id/komik/${req.params.endpoint}`,
                endpoint: req.params.endpoint
            };

            resolve({ success: true, data: manga });
        } catch (error) {
            reject({ suceess: false, message: error.message });
        }
    });
}

const search = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pagination = req.params.pagination ? req.params.pagination : 1
            const response = await axios.get(`page/${pagination}/?s=${req.params.query}`, { headers });
            const $ = cheerio.load(response.data);

            const data = {};

            data.manga = [];
            const main = $('.postbody');
            $(main).find('.film-list > .animepost').each((i, e) => {
                const m = $(e).find('.animposx');

                const thumb = $(m).find('.limit > img').attr('src').split('?')[0];
                data.manga.push({
                    title: $(m).find('a').attr('title').replace('Komik ', ''),
                    thumb,
                    link: {
                        endpoint: $(m).find('a').attr('href').replace('https://komikindo.id/', ''),
                        url: $(m).find('a').attr('href')
                    }
                });
            });

            data.pagination = [];
            $(main).find('.pagination .page-numbers').each((i, a) => {
                const endpoint = `${$(a).attr('href')}`;
                const uri = endpoint !== 'undefined' ? new URL(endpoint) : null;
                data.pagination.push({
                    name: $(a).text(),
                    url: $(a).attr('href') ? $(a).attr('href') : null,
                    endpoint: uri ? uri.searchParams.get('s') + uri.pathname : null
                });
            });

            resolve({ success: true, data });
        } catch (error) {
            reject({ success: false, message: error });
        }
    });
}

module.exports = { home, komiks, newestManga, komik, getDetail, search };