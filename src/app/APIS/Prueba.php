<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Conexión a la base de datos
    $servername = "localhost";
    $username = "u826891407_PHMSoft2024";
    $password = "PreciadoHernandezMoranSolis2024";
    $dbname = "u826891407_SpaceentApp";
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }
    $comando = $_GET['comando'] ?? null;

    switch($comando){
            case "FechaE":
                $fecha=$_GET['Fecha']??null;
                $dias_vigente=$_GET['Dias']??null;
                $fecha_expiracion = date('Y-m-d', strtotime($fecha . ' + ' . $dias_vigente . ' days'));
                echo $fecha_expiracion;
                break;
        case "Correos":
    $correo = $_GET['Correo'] ?? null;
    
    if ($correo) {
        $adminSql = "SELECT *
                     FROM Pruebas
                     WHERE Email = ?";
        
        $stmt = $conn->prepare($adminSql);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            $usuarioEncontrado = $result->fetch_assoc();
            
            // Asegurarse de que la contraseña se envía sin procesar
            $response = array(
                'Id' => $usuarioEncontrado['Id'],
                'User' => $usuarioEncontrado['User'],
                'Email' => $usuarioEncontrado['Email'],
                'Password' => $usuarioEncontrado['Password']
            );
            
            echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
        else {
            echo json_encode(array("message" => "Correo no encontrado"));
        }
    
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Faltan parámetros"));
    }
break;
        default:
                echo json_encode(array("error" => "Comando no reconocido"));
            break;
    }

    $conn->close();
}
?>