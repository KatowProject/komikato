const cheerio = require('cheerio');
const { get, getVideoSrc, post } = require('../../tools');
const mainUrl = 'https://otakudesu.watch';
const qs = require('querystring');

const detail = (req, res) => new Promise(async (resolve, reject) => {
    try {
        const endpoint = req.params.endpoint;
        const url = `${mainUrl}/anime/${endpoint}`;

        const response = await get(url);
        const $ = cheerio.load(response.data);
        const main = $('#venkonten');

        const obj = {};
        obj.main_title = $(main).find('.jdlrx > h1').text().trim();
        obj.thumb = $(main).find('.wp-post-image').attr('src');
        obj.title = $(main).find('.infozingle > p:nth-of-type(1)').text().split(':')[1].trim();
        obj.japanese = $(main).find('.infozingle > p:nth-of-type(2)').text().split(':')[1].trim();
        obj.skor = $(main).find('.infozingle > p:nth-of-type(3)').text().split(':')[1].trim();
        obj.producer = $(main).find('.infozingle > p:nth-of-type(4)').text().split(':')[1].trim();
        obj.type = $(main).find('.infozingle > p:nth-of-type(5)').text().split(':')[1].trim();
        obj.status = $(main).find('.infozingle > p:nth-of-type(6)').text().split(':')[1].trim();
        obj.episodes = $(main).find('.infozingle > p:nth-of-type(7)').text().split(':')[1].trim();
        obj.duration = $(main).find('.infozingle > p:nth-of-type(8)').text().split(':')[1].trim();
        obj.release_date = $(main).find('.infozingle > p:nth-of-type(9)').text().split(':')[1].trim();
        obj.studio = $(main).find('.infozingle > p:nth-of-type(10)').text().split(':')[1].trim();
        obj.genre = $(main).find('.infozingle > p:nth-of-type(11)').text().split(':')[1].trim();
        obj.sinopsis = [];
        $(main).find('.sinopc > p').each((i, el) => obj.sinopsis.push($(el).text().trim()));
        obj.eps = [];
        $(main).find('.episodelist').each((i, el) => {
            const type = $(el).find('.monktit').text();
            switch (true) {
                case type.includes('Lengkap'):
                    obj.eps.push({
                        type: 'Lengkap',
                        title: $(el).find('span > a').text(),
                        url: $(el).find('span > a').attr('href'),
                        endpoint: `${$(el).find('span > a').attr('href')}`.replace(mainUrl, ''),
                    });
                    break;

                case type.includes('Batch'):
                    const tit = $(el).find('span > a').text();
                    if (!tit.includes('[BATCH]')) return;
                    obj.eps.push({
                        type: 'Batch',
                        title: $(el).find('span > a').text(),
                        url: $(el).find('span > a').attr('href'),
                        endpoint: `${$(el).find('span > a').attr('href')}`.replace(mainUrl, ''),
                    });
                    break;

                case type.includes('List'):
                    const temp = [];
                    $(el).find('ul > li').each((b, j) => {
                        temp.push({
                            title: $(j).find('a').text(),
                            url: $(j).find('a').attr('href'),
                            endpoint: $(j).find('a').attr('href').replace(mainUrl + "/episode", ''),
                        });
                    });
                    obj.eps.push({
                        type: 'List',
                        data: temp,
                    });
                    break;
            }
        });


        resolve({ success: true, data: obj });
    } catch (err) {
        reject({ success: false, error: err.message });
    }
});

const batch = (req, res) => new Promise(async (resolve, reject) => {
    try {
        const endpoint = req.params.endpoint;
        const url = `${mainUrl}/batch/${endpoint}`;

        const response = await get(url);
        const $ = cheerio.load(response.data);
        const main = $('.download');

        const obj = {};
        obj.title = $(main).find('.batchlink > h4').text();
        obj.download_link = [];
        $(main).find('.batchlink ul li').each((i, a) => {
            const temp = [];
            $(a).find('a').each((j, b) => {
                temp.push({
                    name: $(b).text(),
                    url: $(b).attr('href'),
                });
            });
            obj.download_link.push({
                name: $(a).find(`strong`).text(),
                data: temp
            });
        });

        resolve({ success: true, data: obj });
    } catch (err) {
        reject({ success: false, error: err.message });
    }
});

const episode = (req, res) => new Promise(async (resolve, reject) => {
    try {
        const obj = {};

        const endpoint = req.params.endpoint;
        const getID = req.query.id;

        const response = await get(mainUrl + "/episode/" + endpoint);
        const $ = cheerio.load(response.data);
        const main = $('#venkonten');
        const script = $("body").find("script:contains('nonce:a')").html();

        obj.title = $(main).find('.venutama > .posttl').text().trim();
        obj.eps_list = [];
        $(main).find('#selectcog > option').each((i, a) => {
            const url = $(a).attr('value');
            obj.eps_list.push({
                title: $(a).text(),
                url: url,
                endpoint: url.replace(mainUrl + "/episode", ''),
            });
        });
        obj.all_eps = {
            name: $(main).find('.flir > a:nth-of-type(1)').text(),
            url: $(main).find('.flir > a:nth-of-type(1)').attr('href'),
            endpoint: $(main).find('.flir > a:nth-of-type(1)').attr('href')?.replace(mainUrl, ''),
        }
        obj.next_eps = {
            name: $(main).find('.flir > a:nth-of-type(2)').text(),
            url: $(main).find('.flir > a:nth-of-type(2)').attr('href'),
            endpoint: $(main).find('.flir > a:nth-of-type(2)').attr('href')?.replace(mainUrl, ''),
        }
        const stream_link = $(main).find('#lightsVideo').find('iframe').attr('src');
        if (!stream_link)
            obj.stream_link = '-';
        else if (stream_link.includes("desustream"))
            obj.stream_link = await getVideoSrc(stream_link)
        else
            obj.stream_link = stream_link;

        if (getID) {
            const encodeID = JSON.parse(Buffer.from(getID, 'base64').toString('ascii'));
            const src = script.split(";")[2];

            const action = src.split('action:"');
            const f_action = action[1].split('"')[0];
            const s_action = action[2].split('"')[0];
            const t_action = action[3].split('"')[0];

            let response = await post("https://otakudesu.tube/wp-admin/admin-ajax.php", `action=${s_action}`, {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
            });
            encodeID.nonce = response.data.data;
            encodeID.action = t_action;

            response = await post("https://otakudesu.tube/wp-admin/admin-ajax.php", qs.stringify(encodeID), {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
            });

            const dataVideo = response.data.data;
            const decodeEmbed = Buffer.from(dataVideo, 'base64').toString('ascii');
            const $ = cheerio.load(decodeEmbed);

            const url = $("iframe").attr("src");
            obj.stream_link = url;
        }

        obj.mirror_stream_link = [];
        $(main).find('.mirrorstream > ul').each((i, a) => {
            const temp = [];
            const iClass = $(a).attr('class');

            switch (true) {
                case iClass.includes('480'):
                    $(a).find('li').each((j, b) => {
                        temp.push({
                            title: $(b).find('a').text().trim(),
                            url: $(b).find('a').attr('data-content'),
                        });
                    });

                    obj.mirror_stream_link.push({
                        name: '480p',
                        data: temp,
                    });
                    break;

                case iClass.includes('720'):
                    $(a).find('li').each((j, b) => {
                        temp.push({
                            title: $(b).find('a').text(),
                            url: $(b).find('a').attr('data-content'),
                        });
                    });

                    obj.mirror_stream_link.push({
                        name: '720p',
                        data: temp,
                    });
                    break;
            }
        });
        obj.download_link = [];
        $(main).find('.download > ul > li').each((i, a) => {
            const temp = [];
            $(a).find('a').each((j, b) => {
                temp.push({
                    title: $(b).text(),
                    url: $(b).attr('href'),
                });
            });
            obj.download_link.push({
                name: $(a).find('strong').text(),
                data: temp,
                i: `link-${i + 1}`
            });
        });

        resolve({ success: true, data: obj });
    } catch (err) {
        console.log(err);
        reject(err.message);
    }
});

module.exports = { detail, batch, episode };