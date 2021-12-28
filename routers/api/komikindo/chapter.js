const router = require('express').Router();
const chapter = require('../../../controllers/komikindo/chapter');

router.get('/:query', async (req, res) => {
    try {
        const getChapter = await chapter(req, res);

        res.send(getChapter);
    } catch (err) {
        res.send(err);
    }

});
module.exports = router;