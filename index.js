/* Module */
const express = require('express');
const cors = require('cors');

/* ============ */
const PORT = process.env.PORT || 4873;

/*---*/
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

/** Web Path */
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.use('/komikindo', require('./routers/web/komikindo'));
app.use('/mangabat', require('./routers/web/mangabat'));
app.use('/otakudesu', require('./routers/web/otakudesu'));
app.use('/komiku', require('./routers/web/komiku'));

/* API Path */
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Komikato API'
    });
});
// app.use('/api/account', require('./routers/account'));

app.use('/api/komikindo/download', require('./routers/api/komikindo/download'));
app.use('/api/komikindo', require('./routers/api/komikindo/general'));
app.use('/api/komikindo/chapter', require('./routers/api/komikindo/chapter'));

app.use('/api/mangabat', require('./routers/api/mangabat/general'));
app.use('/api/mangabat/chapter', require('./routers/api/mangabat/chapter'));
// app.use('/mangabat/download', require('./routers/mangabat/download.js'));

app.use('/api/otakudesu', require('./routers/api/otakudesu/general'));
app.use('/api/otakudesu/anime', require('./routers/api/otakudesu/anime'));

app.use('/api/komiku', require('./routers/api/komiku/general'));
app.use('/api/komiku/ch', require('./routers/api/komiku/chapter'));

app.use('*', async (req, res) => {
    res.status(404).send({ status: false, message: 'api not found' });
});

/* Listener */
app.listen(PORT, async () => {
    console.log('Listening on PORT ' + PORT);
});

