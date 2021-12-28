const router = require('express').Router();
const { get } = require('../../../tools');
const general = require('../../../controllers/komikindo/general');

/* Checking Status */
router.get('/', async (req, res) => {
    try {
        const data = await get('/');
        res.send({ suceess: true, statusCode: data.status, statusMessage: data.statusText });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

/*Home*/
router.get('/home', async (req, res) => {
    try {
        const getManga = await general.home(req, res);
        res.send(getManga);
    } catch (error) {
        res.send(error);
    }
});

router.get('/daftar-komik/page/:number', async (req, res) => {
    try {
        const getKomik = await general.komiks(req, res);

        res.send(getKomik);
    } catch (error) {
        res.send(error);
    }
});

router.get('/komik-terbaru/page/:number', async (req, res) => {
    try {
        const getKomik = await general.newestManga(req, res);

        res.send(getKomik);
    } catch (error) {
        res.send(error);
    }
});

router.get('/komik/:type/page/:number', async (req, res) => {
    try {
        const getKomik = await general.komik(req, res);

        res.send(getKomik);
    } catch (error) {
        res.send(error);
    }
});


/* Komik Detail */
router.get('/komik/:endpoint', async (req, res) => {
    try {
        const getDetail = await general.getDetail(req, res);

        res.send(getDetail);
    } catch (error) {
        res.send(error);
    }
});

router.get('/cari/:query/page/:pagination', async (req, res) => {
    try {
        const getBySearch = await general.search(req, res);

        res.send(getBySearch);
    } catch (error) {
        res.send(error);
    }
})
module.exports = router;