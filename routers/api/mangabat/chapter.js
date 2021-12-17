const router = require('express').Router();
const chapter = require('../../../controllers/mangabat/chapter');

router.get('/:endpoint', async (req, res) => {
    try {
        const getData = await chapter(req, res);

        res.send(getData);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
});

module.exports = router;

