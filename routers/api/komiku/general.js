const router = require('express').Router();
const { get } = require('../../../tools');
const general = require('../../../controllers/komiku/general');

router.get('/', async (req, res) => {
    try {
        const data = await get('https://komiku.id/');
        res.send({ suceess: true, statusCode: data.statusCode, statusMessage: data.statusMessage });
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.get('/home', async (req, res) => {
    try {
        const getManga = await general.home(req, res);

        res.send(getManga);
    } catch (error) {
        res.send(error);
    }
});

router.get('/detail/:endpoint', async (req, res) => {
    try {
        const getManga = await general.detail(req, res);

        res.send(getManga);
    } catch (error) {
        res.send(error);
    }
});

router.get('/search/:query', async (req, res) => {
    try {
        const getManga = await general.search(req, res);

        res.send(getManga);
    } catch (error) {
        res.send(error);
    }
});
module.exports = router;