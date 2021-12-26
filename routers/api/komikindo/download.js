const router = require('express').Router();
const { generatePDF } = require('../../../tools');
const chapter = require('../../../controllers/komikindo/chapter');

router.get('/:query', async function (req, res, next) {
    try {
        const getChapter = await chapter(req, res);
        const request = getChapter.data;

        const images = request.chapter_images;
        const pdfStream = await generatePDF(images);

        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfStream),
            'Content-Type': 'application/pdf',
            'Content-disposition': `attachment;filename=${req.params.query.replace('/', '')}.pdf`,
        })
            .end(pdfStream);
    } catch (error) {
        console.log(error);
        res.send(err);
    }
});

module.exports = router;