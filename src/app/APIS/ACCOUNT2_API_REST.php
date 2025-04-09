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
$admin = $_POST['admin']??null;
if($admin != 0){
    if ($data && is_array($data)) {
    // Insertar los datos en la base de datos
    // Suponiendo que tienes una tabla llamada 'tu_tabla' con las columnas apropiadas
    $insertQuery = "INSERT INTO Cuentas (Correo, Contrasena, Fecha_Registro, Servicio, Tipo_de_Cuenta, Valido, Dias_Vigente, Perfiles, PIN) VALUES ";
    
    foreach ($data as $row) {
        if (count($row) == 9) { // Verifica que haya 9 elementos en cada fila
            // Ajusta la fecha y convierte el valor "true" a 1
            $row[2] = substr($row[2], 0, 10); // Tomar solo los primeros 10 dígitos de la fecha
            $row[5] = $row[5] === "true" ? 1 : 0; // Convierte "true" a 1, cualquier otro valor a 0
            
            // Escapar caracteres especiales para evitar inyección de SQL
            $row = array_map(function($value) use ($conn) {
                return $conn->real_escape_string($value);
            }, $row);
            
            $values = "'" . implode("','", $row) . "'";
            $insertQuery .= "($values),";
        } else {
            echo json_encode(array("error" => "Número incorrecto de elementos en la fila de datos"));
            exit; // Sale del script si hay un error en el número de elementos
        }
    }
    
    $insertQuery = rtrim($insertQuery, ','); // Eliminar la última coma
    $result = $conn->query($insertQuery);
    
    if ($result) {
        // Obtener los registros recientemente agregados
        $selectQuery = "SELECT * FROM Cuentas WHERE Id IN (SELECT LAST_INSERT_ID())";
        $selectResult = $conn->query($selectQuery);
        
        if ($selectResult) {
            $rows = $selectResult->fetch_all(MYSQLI_ASSOC);
            echo json_encode(array("success" => "Datos agregados correctamente"));
        } else {
            echo json_encode(array("error" => "Error al consultar los registros de la base de datos"));
        }
    } else {
        echo json_encode(array("error" => "Error al insertar datos en la base de datos"));
    }
} else {
    echo json_encode(array("error" => "Datos no proporcionados o no válidos para agregar"));
}
}else{
    if ($data && is_array($data)) {
    // Insertar los datos en la base de datos
    // Suponiendo que tienes una tabla llamada 'tu_tabla' con las columnas apropiadas
    $insertQuery = "INSERT INTO Cuentas (Correo, Contrasena, Fecha_Registro, Servicio, Tipo_de_Cuenta, Valido, Dias_Vigente, Perfiles, PIN) VALUES ";
    
    foreach ($data as $row) {
        if (count($row) == 9) { // Verifica que haya 9 elementos en cada fila
            // Ajusta la fecha y convierte el valor "true" a 1
            $row[2] = substr($row[2], 0, 10); // Tomar solo los primeros 10 dígitos de la fecha
            $row[5] = $row[5] === "true" ? 1 : 0; // Convierte "true" a 1, cualquier otro valor a 0
            
            // Escapar caracteres especiales para evitar inyección de SQL
            $row = array_map(function($value) use ($conn) {
                return $conn->real_escape_string($value);
            }, $row);
            
            $values = "'" . implode("','", $row) . "'";
            $insertQuery .= "($values),";
        } else {
            echo json_encode(array("error" => "Número incorrecto de elementos en la fila de datos"));
            exit; // Sale del script si hay un error en el número de elementos
        }
    }
    
    $insertQuery = rtrim($insertQuery, ','); // Eliminar la última coma
    $result = $conn->query($insertQuery);
    
    if ($result) {
        // Obtener los registros recientemente agregados
        $selectQuery = "SELECT * FROM Cuentas WHERE Id IN (SELECT LAST_INSERT_ID())";
        $selectResult = $conn->query($selectQuery);
        
        if ($selectResult) {
            $rows = $selectResult->fetch_all(MYSQLI_ASSOC);
            $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Cuentas','Sub admin con id:$id_admin agrego cuentas')";
                    if($conn->query($sql_admin_r) === TRUE){
                        echo json_encode(array("success" => "Datos agregados correctamente"));
                    }else{
                        echo json_encode(array("success" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                    }
        } else {
            echo json_encode(array("error" => "Error al consultar los registros de la base de datos"));
        }
    } else {
        echo json_encode(array("error" => "Error al insertar datos en la base de datos"));
    }
} else {
    echo json_encode(array("error" => "Datos no proporcionados o no válidos para agregar"));
}
}
?>
