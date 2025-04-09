<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Establecer la zona horaria a México (Central Standard Time)
date_default_timezone_set('America/Mexico_City');

$servername = "localhost";
$username = "u826891407_PHMSoft2024";
$password = "PreciadoHernandezMoranSolis2024";
$dbname = "u826891407_SpaceentApp";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener los datos POST
$postData = $_POST['data'] ?? null;
$data = json_decode($postData, true) ?? null;
$id_admin = $_POST['Id_Admin'] ?? null;
$admin = $_POST['admin'] ?? null;

if ($admin != 0) {
    if ($data && is_array($data)) {
        $insertQuery = "INSERT INTO Pruebas (Email, Password) VALUES ";
        
        foreach ($data as $row) {
            if (count($row) >= 2) { // Verifica que haya al menos 2 elementos en cada fila
                // Escapar caracteres especiales para evitar inyección de SQL
                $email = $conn->real_escape_string($row[0]);
                $password = $conn->real_escape_string($row[1]);

                $insertQuery .= "('$email', '$password'),";
            } else {
                echo json_encode(array("error" => "Número incorrecto de elementos en la fila de datos"));
                exit; // Sale del script si hay un error en el número de elementos
            }
        }

        $insertQuery = rtrim($insertQuery, ','); // Eliminar la última coma
        $result = $conn->query($insertQuery);

        if ($result) {
            echo json_encode(array("success" => "Datos agregados correctamente"));
        } else {
            echo json_encode(array("error" => "Error al insertar datos en la base de datos"));
        }
    } else {
        echo json_encode(array("error" => "Datos no proporcionados o no válidos para agregar"));
    }
} else {
    if ($data && is_array($data)) {
        $insertQuery = "INSERT INTO Pruebas (Email, Password) VALUES ";
        
        foreach ($data as $row) {
            if (count($row) >= 2) { // Verifica que haya al menos 2 elementos en cada fila
                $email = $conn->real_escape_string($row[0]);
                $password = $conn->real_escape_string($row[1]);

                $insertQuery .= "('$email', '$password'),";
            } else {
                echo json_encode(array("error" => "Número incorrecto de elementos en la fila de datos"));
                exit;
            }
        }

        $insertQuery = rtrim($insertQuery, ','); // Eliminar la última coma
        $result = $conn->query($insertQuery);

        if ($result) {
            $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Pruebas','Sub admin con id:$id_admin agrego cuentas')";
            if($conn->query($sql_admin_r) === TRUE){
                echo json_encode(array("success" => "Datos agregados correctamente"));
            } else {
                echo json_encode(array("success" => "Por favor contactar con el servicio técnico de SpaceFlix"));
            }
        } else {
            echo json_encode(array("error" => "Error al insertar datos en la base de datos"));
        }
    } else {
        echo json_encode(array("error" => "Datos no proporcionados o no válidos para agregar"));
    }
}

$conn->close();
?>
