<?php
$allowedOrigins = [
    '',
    'https://spaceflix.digital',
    'https://www.spaceflix.digital',
    'http://localhost:4200',
    'http://localhost:8100',
    'http://localhost:8101',
    'https://spaceflixweb.onrender.com',
    'https://www.spaceflixweb.onrender.com',
    'capacitor://localhost/',
    'ionic://localhost/',
    'https://localhost' // Este es el origen de la app Android
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

//header("Access-Control-Allow-Origin: $origin");

if (in_array($origin, $allowedOrigins)) {
    // This case bellow is for postman requests protection
    if ($origin == '') {
        $reqPassword = $_GET['pass'] ?? '';
        // This is the password to make requests to the API from POSTMAN
        if($reqPassword != 'POPO'){
            header("HTTP/1.1 403 Forbidden");
            echo "Wrong password";
            exit;
        }
    }
    header("Access-Control-Allow-Origin: $origin");   
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
} else {
    header("HTTP/1.1 403 Forbidden");
    echo "Origin not allowed";
    exit;
}
