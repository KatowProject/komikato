const router = require('express').Router();
const general = require('../../controllers/komikindo/general');
const chapter = require('../../controllers/komikindo/chapter');
const PDFDocument = require('pdfkit');
const doc = require('pdfkit');

router.get('/', async (req, res) => {
    try {
        const getKomik = await general.home(req, res);

        res.render('pages/komikindo/index', getKomik.data);
    } catch (err) {
        res.send(err);
    }
});

router.get('/chapter/:query', async (req, res) => {
    try {
        const getChapter = await chapter(req, res);

        res.render('pages/komikindo/chapter', getChapter.data);
    } catch (err) {
        res.send(err);
    }
});

router.get('/cari/:query/page/:pagination/', async (req, res) => {
    try {
        const getBySearch = await general.search(req, res);

        res.render('pages/komikindo/search', getBySearch.data);
    } catch (err) {
        res.send(err);
    }
});

router.get('/komik/:type/page/:number', async (req, res) => {
    try {
        const getKomik = await general.komik(req, res);

        res.render('pages/komikindo/smut', getKomik.data);
    } catch (err) {
        res.send(err);
    }
});

router.get('/download/:endpoint', async (req, res) => {
    try {
        const images = await general.getImages(req, res);
        const pdf = new PDFDocument({ autoFirstPage: false });
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${req.params.endpoint}.pdf`,
        });
        pdf.pipe(res);

        for (const image of images.data) {
            const buffer = await require('got')(image).buffer();
            const img = pdf.openImage(buffer);
            pdf.addPage({ size: [img.width, img.height] });
            pdf.image(img, 0, 0);
        }

        pdf.end();
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;