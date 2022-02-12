<?php
$query = $_GET['q'];
if ($query == "") :
    echo json_encode([
        "status" => "error",
        "message" => "No query specified"
    ]);
    return;
endif;

$url = base64_decode($query);
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
$getHeader = curl_getinfo($ch);

if ($output === '') :
    $error = curl_error($ch);

    echo json_encode([
        "status" => "error",
        "message" => $error
    ]);
    return;
endif;
curl_close($ch);

header("Content-Type: " . $getHeader['content_type']);
echo $output;
