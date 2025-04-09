<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Establecer la zona horaria a México (Central Standard Time)
date_default_timezone_set('America/Mexico_City');

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
        case "Add":
            $usuario = $_GET['Usuario'] ?? null;
            $correo = $_GET['Correo'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $nombrecliente = $_GET['Nombre_Cliente'] ?? null;
            $telefono = $_GET['Telefono'] ?? null;
            $totalcompras = $_GET['Total_Compras'] ?? null;
            $creditos = $_GET['Creditos'] ?? null;
            
            
            if ($usuario && $correo && $contrasena && $nombrecliente && $telefono){
                $sql = "INSERT INTO Usuarios (Usuario, Correo, Contrasena, Nombre_Cliente, Telefono, Total_Compras, Creditos) VALUES ('$usuario', '$correo', '$contrasena', '$nombrecliente', '$telefono', $totalcompras, $creditos)";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Usuario agregado correctamente"));
                }
                else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }
            break;
        case "ViewRenew":
            $id = $_GET['Id'] ?? null;
        
            // Consulta para obtener los tickets con días vigentes mayores a 0
            $sql = "SELECT *
                    FROM Ticket as T
                    WHERE Id_Usuario = $id AND T.Dias_Vigentes >= 0";
            $result = $conn->query($sql);
        
            if ($result->num_rows > 0) {
                $tickets = array();
                while ($row = $result->fetch_assoc()) {
                    $tickets[] = $row;
                }
        
                // Realizar las actualizaciones de Dias_Vigentes en la tabla Ticket
                foreach ($tickets as $ticket) {
                    $ticketId = $ticket['Id'];
                    $fechaExpiracion = $ticket['Fecha_Expiracion'];
                    $sqlUpdateDiasVigentes = "UPDATE Ticket 
                                              SET Dias_Vigentes = GREATEST(DATEDIFF('$fechaExpiracion', CURRENT_DATE), 0)
                                              WHERE Id = $ticketId";
                    $conn->query($sqlUpdateDiasVigentes);
                }
        
                // Devolver los registros de los tickets en formato JSON
                echo json_encode($tickets);
            } else {
                echo json_encode(array("message" => "No se encontraron cuentas asociadas con algún ticket"));
            }
            break;
        case "View":
            $id = $_GET['Id'] ?? null;
            $sql = "SELECT *
                    FROM Ticket
                    WHERE Id_Usuario = $id";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $tickets = array();
                while ($row = $result->fetch_assoc()) {
                    $tickets[] = $row;
                }
                echo json_encode($tickets);
            } else {
                echo json_encode(array("message" => "No se encontraron usuarios"));
            }
            break;
        case "Update":
            $id = $_GET['Id'] ?? null;
            $usuario = $_GET['Usuario'] ?? null;
            $correo = $_GET['Correo'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $nombrecliente = $_GET['Nombre_Cliente'] ?? null;
            $telefono = $_GET['Telefono'] ?? null;
            
            if ($id && $usuario && $correo && $contrasena && $nombrecliente && $telefono) {
                $sql = "UPDATE Usuarios SET Usuario='$usuario', Correo = '$correo', Contrasena='$contrasena', Nombre_Cliente='$nombrecliente', Telefono='$telefono' WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Usuario actualizado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Delete":
            $id = $_GET['Id'] ?? null;

            if ($id) {
                $sql = "DELETE FROM Usuarios WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Usuario Eliminado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Profits":
            $fechaActual = $_GET['FechaActual'] ?? null;
            $fechaMaxima = $_GET['FechaMaxima'] ?? null;
        
            if ($fechaActual && $fechaMaxima) {
                $sql = "SELECT 
                            (SELECT COUNT(*) FROM Usuarios) AS usuarios,
                            IFNULL((
                                SELECT SUM(T.Total - T.Precio) 
                                FROM Ticket as T
                                INNER JOIN Servicio_Producto as SP
                                ON T.Id_Producto_Servicio=SP.Id
                                WHERE SP.Descripcion LIKE '%Renovable%' 
                                AND Fecha_de_Compra BETWEEN '$fechaMaxima' AND '$fechaActual'
                            ), 0) AS Suma_Cuenta_Individual,
                            
                            IFNULL((
                                SELECT SUM(T.Total - T.Precio) 
                                FROM Ticket as T
                                INNER JOIN Servicio_Producto as SP
                                ON T.Id_Producto_Servicio=SP.Id
                                WHERE SP.Descripcion LIKE '%Generic%'
                                AND Fecha_de_Compra BETWEEN '$fechaMaxima' AND '$fechaActual'
                            ), 0) AS Suma_Cuenta_Completa,
                            
                            IFNULL((
                                SELECT SUM(T.Total - T.Precio) 
                                FROM Ticket as T
                                INNER JOIN Servicio_Producto as SP
                                ON T.Id_Producto_Servicio=SP.Id
                                WHERE SP.Descripcion LIKE '%Generic%' Or Descripcion LIKE '%Renovable%' 
                                AND Fecha_de_Compra BETWEEN '$fechaMaxima' AND '$fechaActual'
                            ), 0) AS Suma_Total";
                            
                $result = $conn->query($sql);
                
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $tickets = $row;
                    }
                    echo json_encode($tickets);
                } else {
                    echo json_encode(array("message" => "No se encontraron datos"));
                }
            } else {
                echo json_encode(array("message"=> "Error Falta Fecha"));    
            }
            break;

        default:
                echo json_encode(array("error" => "Comando no reconocido"));
            break;
    }

    $conn->close();
}
?>