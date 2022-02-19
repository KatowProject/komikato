const cheerio = require('cheerio');
const { get } = require('../../tools');
const baseURL = 'https://komiku.id';

module.exports = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const endpoint = req.params.endpoint;
            const response = await get(`${baseURL}/ch/${endpoint}`);
            const $ = cheerio.load(response.data);

            const content = $("#article");
            let chapter_image = [];
            const obj = {};
            obj.chapter_endpoint = endpoint + "/";
            obj.chapter_name = endpoint.split('-').join(' ').trim()

            obj.title = $('#Judul:nth-of-type(1) > h1').text().trim()
            /**
             * @Komiku
             */
            const getTitlePages = content.find(".dsk2")
            getTitlePages.filter(() => {
                obj.title = $(getTitlePages).find("h1").text().replace("Komik ", "");
            });

            /**
             * @Komiku
             */
            const getPages = $('#Baca_Komik > img')

            // const getPages = $('#chimg > img')
            obj.chapter_pages = getPages.length;
            getPages.each((i, el) => {
                chapter_image.push({
                    chapter_image_link: $(el).attr("src").replace('i0.wp.com/', ''),
                    image_number: i + 1,
                });
            });
            obj.chapter_image = chapter_image;
            obj.navigation = {};
            const nav = $('.nxpr > a');
            obj.navigation.prev = {
                url: nav.eq(0).attr('href') === undefined ? null : baseURL + nav.eq(0).attr('href'),
                endpoint: nav.eq(0).attr('href') === undefined ? null : nav.eq(0).attr('href')
            }
            obj.navigation.next = {
                url: nav.eq(1).attr('href') === undefined ? null : baseURL + nav.eq(1).attr('href'),
                endpoint: nav.eq(1).attr('href') === undefined ? null : nav.eq(1).attr('href')
            }

            resolve({ success: true, data: obj });
        } catch (error) {
            console.log(error);
            reject({ success: false, message: error.message ? error.message : error });
        }
    });
};