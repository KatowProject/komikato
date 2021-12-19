const router = require('express').Router();
const { get } = require('../../../tools');
const general = require('../../../controllers/mangabat/general');

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
        const getData = await general.home(req, res);

        res.send(getData);
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.get('/search/:query/page/:pagination', async (req, res) => {
    try {
        const getBySearch = await general.search(req, res);

        res.send(getBySearch);
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.get('/comic/:endpoint', async (req, res) => {
    try {
        const getDetail = await general.getDetail(req, res);

        res.send(getDetail);
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});


module.exports = router;