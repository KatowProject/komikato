const router = require('express').Router();
const general = require('../../controllers/otakudesu/general');
const anime = require('../../controllers/otakudesu/anime');

router.get('/', async (req, res) => {
    try {
        const getData = await general.home(req, res);

        res.render('pages/otakudesu/index', getData.data);
    } catch (err) {
        res.status(500).send({ success: false, message: err });
    }
});

router.get('/search/:query', async (req, res) => {
    try {
        const getAnime = await general.search(req, res);

        res.render('pages/otakudesu/search', getAnime);
    } catch (err) {
        res.status(500).send({ success: false, message: err });
    }
});

router.get('/eps/:endpoint', async (req, res) => {
    try {
        const getEpisode = await anime.episode(req, res);

        res.render('pages/otakudesu/episode', getEpisode.data);
    } catch (err) {
        res.status(500).send({ success: false, message: err });
    }
});

module.exports = router;