const router = require('express').Router();
const anime = require('../../../controllers/otakudesu/anime');

router.get('/detail/:endpoint', async (req, res) => {
    try {
        const getDetail = await anime.detail(req, res);

        res.send(getDetail);
    } catch (err) {
        res.status(500).send({ success: false, message: err });
    }
});

router.get('/batch/:endpoint', async (req, res) => {
    try {
        const getBatch = await anime.batch(req, res);

        res.send(getBatch);
    } catch (err) {
        res.status(500).send({ success: false, message: err });
    }
});

router.get('/eps/:endpoint', async (req, res) => {
    try {
        const getEpisode = await anime.episode(req, res);

        res.send(getEpisode);
    } catch (err) {
        res.status(500).send({ success: false, message: err });
    }
});

module.exports = router;