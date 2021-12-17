const router = require('express').Router();
const general = require('../../controllers/mangabat/general');
const chapter = require('../../controllers/mangabat/chapter');

router.get('/', async (req, res) => {
    try {
        const getData = await general.home(req, res);

        res.render('pages/mangabat/index', getData);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.get('/chapter/:endpoint', async (req, res) => {
    try {
        const getData = await chapter(req, res);

        res.render('pages/mangabat/chapter', getData.data);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

router.get('/search/:query/page/:pagination', async (req, res) => {
    try {
        req.params.query = req.params.query.split(' ').join('_');
        const getBySearch = await general.search(req, res);

        res.render('pages/mangabat/search', getBySearch.data);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});
module.exports = router;