const router = require('express').Router();
const general = require('../../controllers/komiku/general');
const chapter = require('../../controllers/komiku/chapter');

router.get('/', async (req, res) => {
    try {
        const data = await general.home(req, res);

        res.render('pages/komiku/index', data.data);
    } catch (err) {
        res.send(err);
    }
});

router.get('/search/:query', async (req, res) => {
    try {
        const data = await general.search(req, res);

        res.render('pages/komiku/search', data);
    } catch (err) {
        res.send(err);
    }
});

router.get('/ch/:endpoint', async (req, res) => {
    try {
        const data = await chapter(req, res);

        res.render('pages/komiku/chapter', data.data);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;