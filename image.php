<?php
    $query = $_GET['q'];
    if ($query == "") {
        echo json_encode(["status" => "error", "message" => "No query specified"]);
        
        return;
    }

    $mimes  = [
        IMAGETYPE_GIF => "image/gif",
        IMAGETYPE_JPEG => "image/jpg",
        IMAGETYPE_PNG => "image/png",
        IMAGETYPE_SWF => "image/swf",
        IMAGETYPE_PSD => "image/psd",
        IMAGETYPE_BMP => "image/bmp",
        IMAGETYPE_TIFF_II => "image/tiff",
        IMAGETYPE_TIFF_MM => "image/tiff",
        IMAGETYPE_JPC => "image/jpc",
        IMAGETYPE_JP2 => "image/jp2",
        IMAGETYPE_JPX => "image/jpx",
        IMAGETYPE_JB2 => "image/jb2",
        IMAGETYPE_SWC => "image/swc",
        IMAGETYPE_IFF => "image/iff",
        IMAGETYPE_WBMP => "image/wbmp",
        IMAGETYPE_XBM => "image/xbm",
        IMAGETYPE_ICO => "image/ico"
    ];

    $url = base64_decode($query);
    $check_mime = exif_imagetype($url);
    $mime = $mimes[$check_mime];
    if (!$mime) {
        echo json_encode(["status" => "error","message" => "Invalid Mime" ]);
        return;
    }

    $filename = basename($url);
    $filesize = get_headers($url, 1)["Content-Length"];

    header_remove("X-Powered-By");
    header("Content-Range: bytes 0-".$filesize."/".$filesize);
    header("Content-Length: " . $filesize);
    header("Content-type: $mime");
    header("Content-Disposition: inline; filename=$filename");


    return readfile($url);

