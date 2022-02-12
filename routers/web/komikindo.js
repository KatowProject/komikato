const router = require('express').Router();
const general = require('../../controllers/komikindo/general');
const chapter = require('../../controllers/komikindo/chapter');
const PDFDocument = require('pdfkit');
const { generatePDF } = require('../../tools');

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

router.get('/download/:endpoint/:type', async (req, res) => {
    try {
        const type = req.params.type;
        const images = await general.getImages(req, res);
        switch (type) {
            case 'pdf':
                const pdf = new PDFDocument({ autoFirstPage: false });
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename=${req.params.endpoint}.pdf`,
                });
                pdf.pipe(res);

                for (const image of images.data) {
                    const base64 = btoa(image);
                    const buffer = await require('got')(`https://bypass.kato-rest.us/url/${base64}`).buffer();
                    const img = pdf.openImage(buffer);
                    pdf.addPage({ size: [img.width, img.height] });
                    pdf.image(img, 0, 0);
                }

                pdf.end();
                break;

            case 'buffer':
                const buffer = await generatePDF(images.data);

                res.send(buffer);
                break;

            default:
                res.send(`Invalid type: ${type}`);
                break;
        }

    } catch (err) {
        res.send(err);
    }
});

module.exports = router;