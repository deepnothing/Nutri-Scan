<?php
    $dir = 'Nutri-Scan';
    $files = scandir($dir, 0);
    $array = array();

    for($i = 2; $i < count($files); $i++){
       
        array_push($array,pathinfo($files[$i], PATHINFO_FILENAME));
    }
    echo json_encode($array);
?>