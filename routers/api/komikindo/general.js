const router = require('express').Router();
const cheerio = require('cheerio');
const { axios } = require('../../../tools');
const general = require('../../../controllers/komikindo/general');

/* Checking Status */
router.get('/', async (req, res) => {
    try {
        const data = await axios.get('/');
        res.send({ suceess: true, statusCode: data.status, statusMessage: data.statusText });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

/*Home*/
router.get('/home', async (req, res) => {
    const getManga = await general.home(req, res);
    res.send(getManga);
});

router.get('/daftar-komik/page/:number', async (req, res) => {
    const getKomik = await general.komiks(req, res);

    res.send(getKomik);
});

router.get('/komik-terbaru/page/:number', async (req, res) => {
    const getKomik = await general.newestManga(req, res);

    res.send(getKomik);
});

router.get('/komik/:type/page/:number', async (req, res) => {
    const getKomik = await general.komik(req, res);

    res.send(getKomik);
});


/* Komik Detail */
router.get('/komik/:endpoint', async (req, res) => {
    const getDetail = await general.getDetail(req, res);

    res.send(getDetail);
});

router.get('/cari/:query/page/:pagination', async (req, res) => {
    const getBySearch = await general.search(req, res);

    res.send(getBySearch);
})
module.exports = router;