const router = require('express').Router();
const chapter = require('../../../controllers/komikindo/chapter');

router.get('/:query', async (req, res) => {
    const getChapter = await chapter(req, res);

    res.send(getChapter);
});
module.exports = router;