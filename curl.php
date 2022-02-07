<?php 
    $query = $_GET['q'];
    if ($query == "") echo json_encode([
        "status" => "error",
        "message" => "No query specified"
    ]);

    $url = base64_decode($query);
    $ch = curl_init(); 

     curl_setopt($ch, CURLOPT_URL, $url);
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
     $output = curl_exec($ch); 
     curl_close($ch);      
 
     echo $output;