const router = require('express').Router();
const general = require('../../controllers/komikindo/general');
const chapter = require('../../controllers/komikindo/chapter');

router.get('/', async (req, res) => {
    try {
        const getKomik = await general.home(req, res);

        res.render('pages/komikindo/index', getKomik.data);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.get('/chapter/:query', async (req, res) => {
    try {
        const getChapter = await chapter(req, res);

        res.render('pages/komikindo/chapter', getChapter.data);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.get('/cari/:query/page/:pagination/', async (req, res) => {
    try {
        const getBySearch = await general.search(req, res);

        res.render('pages/komikindo/search', getBySearch.data);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

module.exports = router;