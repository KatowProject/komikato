function getSearch(source) {
    if (source === 'komikindo') {
        const value = $('#search-input').val();
        const endpoint = `/${source}/cari/${value}/page/1/`;
        const url = `${endpoint}`;

        window.location.href = url;
    } else if (source === 'mangabat') {
        const value = $('#search-input').val();
        const endpoint = `/${source}/search/${value}/page/1/`

        window.location.href = endpoint;
    } else if (source === 'otakudesu') {
        const value = $('#search-input').val();
        const endpoint = `/${source}/search/${value}`;

        window.location.href = endpoint;
    } else if (source === 'komiku') {
        const value = $('#search-input').val();
        const endpoint = `/komiku/search/${value}`;

        window.location.href = endpoint;
    }
}


$('#mangas').on('click', '.see-detail', function () {
    $('.modal-title').text('');
    $('.modal-body').html(`
        <div class="text-center">
            <b>Please Wait!!!</b>
            <br>
            <img src="/assets/image/menhera.gif" class="rounded">
        </div>  
    `);

    const source = $(this).data('source');
    const domain = location.origin;
    switch (source) {
        case 'komikindo':
            // get domain name
            $.getJSON(domain + '/api/komikindo/' + $(this).data('endpoint'), function (result) {
                const data = result.data;

                $('.modal-title').text(`${data.title ? data.title : 'Invalid Name'}`);

                let isScroll = '';
                if (data.chapters.length > 7) isScroll = `style="overflow-y: scroll; height:400px;"`;
                $('.modal-body').html(`
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${data.thumb}" class="img-fluid" alt="...">
                        </div>
                        <div class="col-md-8">
                            <ul class="list-group">
                                <li class="list-group-item"><b>Alternatif:</b> ${data.alter.length > 1 ? data.alter.join(', ') : data.alter}</li>
                                <li class="list-group-item"><b>Status:</b> ${data.status}</li>
                                <li class="list-group-item"><b>Pengarang:</b> ${data.pengarang.map(a => `<a href="${a.link}">${a.name}</a>`).join(', ')}</li>
                                <li class="list-group-item"><b>Ilustrator:</b> ${data.illustrator.map(a => `<a href="${a.link}">${a.name}</a>`).join(', ')}</li>
                                <li class="list-group-item"><b>Genre:</b> ${data.genre.map(a => `<a href="${a.link}">${a.name}</a>`).join(', ')}</li>
                                <li class="list-group-item"><b>Score:</b> ⭐${data.score}</li>
                            </ul>
                        </div>
                    </div>
                    <hr>

                    <div class="row">
                        <div class="col-sm-12">
                            <p>${data.sinopsis}</p>
                        </div>
                    </div>
                    <hr>

                    <div class="row">
                        <div class="col-sm-12" ${isScroll}">
                            <table class="table table-striped table-bordered table-paginate" cellspacing="0">
                                <tbody>
                                    ${generateChapterList(data.chapters).join('\n')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                `);
            });
            break;

        case 'mangabat':
            $.getJSON(`${domain}/api/mangabat/comic/${$(this).data('endpoint')}`, function (result) {
                const data = result.data;

                $('.modal-title').text(`${data.title ? data.title : 'Invalid Name'}`);

                let isScroll = '';
                if (data.chapters.length > 7) isScroll = `style="overflow-y: scroll; height:400px;"`;
                $('.modal-body').html(`
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${data.thumb}" class="img-fluid" alt="...">
                            </div>
        
                            <div class="col-md-8">
                                <ul class="list-group">
                                    <li class="list-group-item"><b>Alternatif:</b> ${data.alter.length > 1 ? data.alter.join(', ') : data.alter}</li>
                                    <li class="list-group-item"><b>Status:</b> ${data.status}</li>
                                    <li class="list-group-item"><b>Author:</b> ${data.author.map(a => `<a href="${a.link}">${a.name}</a>`).join(', ')}</li>
                                    <li class="list-group-item"><b>Genre:</b> ${data.genre.map(a => `<a href="${a.url}">${a.name}</a>`).join(', ')}</li>
                                </ul>
                            </div>
                        </div>
                        
                        <hr>
        
                        <div class="row">
                            <div class="col-sm-12">
                                <p>${data.synopsis}</p>
                            </div>
                        </div>
        
                        <hr>
        
                        <div class="row">
                            <div class="col-sm-12" ${isScroll}">
                                <table class="table table-striped table-bordered table-paginate" cellspacing="0">
                                    <tbody>
                                        ${generateChapterList(data.chapters).join('\n')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
        
                    </div>
                    `);
            });
            break;

        case 'otakudesu':
            const otkdsEndpoint = $(this).data('endpoint');
            $.getJSON(`${domain}/api/otakudesu/anime/detail/${otkdsEndpoint.replace('/anime/', '')}`, async function (result) {
                const data = result.data;

                const filterEps = data.eps.filter(a => a.type == 'List')[0].data;
                $('.modal-title').text(`${data.title}`);
                $('.modal-body').html(`
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${data.thumb}" class="img-fluid" alt="...">
                        </div>
                        <div class="col-md-8">
                            <ul class="list-group">
                                <li class="list-group-item"><b>Japanese:</b> ${data.japanese}</li>
                                <li class="list-group-item"><b>Skor:</b> ⭐${data.skor}</li>
                                <li class="list-group-item"><b>Producer:</b> ${data.producer}</li>
                                <li class="list-group-item"><b>Type:</b> ${data.type}</li>
                                <li class="list-group-item"><b>Genre:</b> ${data.genre}</li>
                                <li class="list-group-item"><b>Status:</b> ${data.status}</li>
                                <li class="list-group-item"><b>Episodes:</b> ${data.episodes}</li>
                            </ul>
                        </div>
                    </div>
                <hr>
                    <div class="row">
                        <div class="col-sm-12">
                            <p>${data.sinopsis.join('\n')}</p>
                        </div>
                    </div>
                <hr>
                    <div class="row">
                        <div class="col-sm-12" style="overflow-y: scroll; height:400px;">
                            <table class="table table-striped table-bordered table-paginate" cellspacing="0">
                                <tbody>
                                    ${generateEpsList(filterEps).join('\n')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                `);
            });
            break;

        case 'komiku':
            const komikuEndpoint = $(this).data('endpoint');
            $.getJSON(domain + '/api/komiku/detail' + komikuEndpoint, async function (result) {
                const data = result.data;

                const map = data.chapter.map((a) => {
                    return `<tr>    
                    <td>${a.chapter_title}</td>
                    <td><a href="/komiku/ch/${a.chapter_endpoint}" target="_blank"><button type="button" class="btn btn-dark btn-sm btn-block">Baca Komik</button></a></td>
                </tr>
                `
                });
                $('.modal-title').text(`${data.title}`);
                $('.modal-body').html(`
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${data.thumb}" class="img-fluid" alt="...">
                        </div>

                        <div class="col-md-8">
                            <ul class="list-group">
                                <li class="list-group-item"><b>Tipe:</b> ${data.type}</li>
                                <li class="list-group-item"><b>Genre:</b> ${data.genre_list.map(a => a.genre_name).join(', ')}</li>
                                <li class="list-group-item"><b>Status:</b> ${data.status}</li>
                                <li class="list-group-item"><b>Author:</b> ${data.author}</li>
                            </ul>
                        </div>
                    </div>
                    <hr>

                    <div class="row">
                        <div class="col-sm-12">
                            <p>${data.synopsis}</p>
                        </div>
                    </div>
                    <hr>

                    <div class="row">
                        <div class="col-sm-12" style="overflow-y: scroll; height:400px;">
                            <table class="table table-striped table-bordered table-paginate" cellspacing="0">
                                <tbody>
                                    ${map.join('\n')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                `);
            });
    }
});


function generateChapterList(array) {
    const temp = [];

    const firstPath = window.location.pathname.split('/')[1];
    array.forEach(function (a, i) {
        temp.push(`
            <tr>    
                <td>${a.name ? a.name : a.title}</td>
                <td><a href="/${firstPath}/chapter/${a.link.endpoint ? a.link.endpoint : a.endpoint}" target="_blank"><button type="button" class="btn btn-dark btn-sm btn-block">Baca Komik</button></a></td>
                <td><a href="/${firstPath}/download/${a.link.endpoint ? a.link.endpoint : a.endpoint}pdf"><button type="button" class="btn btn-dark btn-sm btn-block"><i class="fa fa-download"></i></button></a></td>
            </tr>
        `);
    });

    return temp;
};

function generateEpsList(array) {
    const temp = [];
    array.forEach(function (a, i) {
        temp.push(`
            <tr>
                <td>${a.title}</td>
                <td><a href="/otakudesu/eps${a.endpoint}" target="_blank"><button type="button" class="btn btn-dark btn-sm btn-block">Nonton Anime</button></a></td>
            </tr>
        `);
    });

    return temp;
}

/* Add Favorite */
$('.favorite').on('click', async function () {
    const cookie = document.cookie.split(';');
    const btn = $(this);

    const username = cookie[2].split('=')[1];
    const endpoint = $(this).data('endpoint');

    const data = await $.get(`/komikindo/api/${endpoint}`);
    if (!data.success) return;

    const json = {
        username: username,
        type: 'add',
        favorites: data.data
    };

    $.ajax({
        url: `/api/account/favorit`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json)
    }).done(function (result) {
        if (result.success) {
            btn.removeClass('btn-dark').addClass('btn-danger');
            btn.removeClass('favorite').addClass('unfavorite');
            alert('Telah berhasil ditambahkan ke daftar favorit!');
        } else {
            alert(result.message);
        }
    })
});

$('.unfavorite').on('click', async function () {
    const cookie = document.cookie.split(';');
    const btn = $(this);

    const username = cookie[2].split('=')[1];
    const endpoint = $(this).data('endpoint');

    const data = await $.get(`/komikindo/api/${endpoint}`);
    if (!data.success) return;

    const json = {
        username: username,
        type: 'remove',
        favorites: data.data
    };

    $.ajax({
        url: `/api/account/favorit`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json)
    }).done(function (result) {
        if (result.success) {
            btn.removeClass('btn-danger').addClass('btn-dark');
            btn.removeClass('unfavorite').addClass('favorite');
            alert('Telah berhasil dihapus dari daftar favorit!');
        } else {
            alert(result.message);
        }
    });

});

/* Dynamic Pagination */
$('#pagination').on('click', 'a', function () {
    const source = $(this).data('source');
    const endpoint = $(this).data('endpoint');

    switch (source) {
        case 'komikindo':
            $.getJSON(`/komikindo/api/${endpoint}`, function (result) {
                $('#manga-list').html('');
                $('#pagination').html('');

                const datas = result.data;
                datas.manga.forEach(function (a, i) {
                    $('#manga-list').append(`
                    <div class="col-md-3">
                        <div class="card mb-3" style="width: auto;">
                            <img src=${a.thumb} class="card-img-top" alt="">
                            <div class="card-body">
                                <h5 class="card-title text-center">${a.title}</h5>
                                <a class="btn btn-dark btn-sm btn-block see-detail" href="#" data-toggle="modal" data-source="komikindo" data-endpoint=${a.link.endpoint} data-target="#exampleModal">Detail</a>
                            </div>
                        </div>
                    </div>
                    `);
                });

                datas.pagination.forEach(function (a, i) {
                    if (!a.url && !a.endpoint) {
                        $('#pagination').append(`<li class='page-item active'><a class='page-link bg-dark text-white'>${a.name}</a></li>`);
                    } else if (a.endpoint.includes('page')) {
                        $('#pagination').append(`<li class='page-item'><a class='page-link text-dark' data-source='komikindo' data-endpoint=${a.endpoint} href='#'>${a.name}</a></li>`);
                    } else {
                        $('#pagination').append(`<li class='page-item'><a class='page-link text-dark' data-source='komikindo' data-endpoint=${a.endpoint}/page/1 href='#'>${a.name}</a></li>`);
                    }
                });
            });
    }
});

/* Anime */
$('#btn-eps-selected').on('click', function () {
    const val = $('#eps-selected').val();
    if (val === '0') return;
    window.location.href = `/otakudesu/eps${val}`;
});

/*Mirror Eps*/
$('.dropdown-item').on('click', function () {
    const endpoint = window.location.href.split('/')[5];
    const mirror = $(this).data('query');
    const domain = location.origin;

    $.getJSON(`${domain}/api/otakudesu/anime/eps/${endpoint}/?id=${mirror}`, function (result) {
        const stream_link = result.data.stream_link;

        $('#my-video').length === 0 ? true : videojs('my-video').dispose();

        switch (true) {
            case stream_link.includes('.html'):
                $('#video-player').html('');

                $('#video-player').append(`
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" src="${stream_link}" allowfullscreen></iframe>
                    </div>
                `);

                break;
            case stream_link.includes('mp4upload'):
                $('#video-player').html('');

                $('#video-player').append(`
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" src="${stream_link}" allowfullscreen></iframe>
                    </div>
                `);
                break;

            case stream_link.includes('gdriveplayer'):
                $('#video-player').html('');

                $('#video-player').append(`
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" src="${stream_link}" allowfullscreen></iframe>
                    </div>
                `);
                break;

            case stream_link.includes('yourupload'):
                $('#video-player').html('');

                $('#video-player').append(`
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" src="${stream_link}" allowfullscreen></iframe>
                    </div>
                `);
                break;

            case stream_link.includes('mega'):
                $('#video-player').html('');

                $('#video-player').append(`
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" src="${stream_link}" allowfullscreen></iframe>
                    </div>
                `);
                break;
            default:
                $('#video-player').html('');

                $('#video-player').append(`
                    <video id="my-video" class="video-js mx-auto" controls preload="auto" width="800" height="400" poster="https://cdn.discordapp.com/emojis/746208811848695849.png">
                        <source src="${stream_link}" type="video/mp4" />
                    </video>
                `);

                videojs('my-video');
                break;
        }
    });
});