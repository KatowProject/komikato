const router = require('express').Router();
const { get } = require('../../../tools');
const general = require('../../../controllers/otakudesu/general');

router.get('/', async (req, res) => {
    try {
        const data = await get('https://m.mangabat.com/');
        res.send({ suceess: true, statusCode: data.status, statusMessage: data.statusText });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.get('/home', async (req, res) => {
    try {
        const getAnime = await general.home(req, res);

        res.send(getAnime);
    } catch (error) {
        res.status(500).send({ suceess: false, message: error.message });
    }
});

router.get('/search/:query', async (req, res) => {
    try {
        const getSearch = await general.search(req, res);

        res.send(getSearch);
    } catch (error) {
        res.status(500).send({ suceess: false, message: error.message });
    }
});

module.exports = router;