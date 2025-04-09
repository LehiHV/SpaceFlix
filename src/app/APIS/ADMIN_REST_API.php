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
            case "Login":
            $usuario = $_GET['Usuario'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
        
            if ($usuario && $contrasena) {
                // Verificar si existe un registro con el usuario y contraseña proporcionados
                $sql = "SELECT * FROM Admin WHERE Usuario='$usuario' AND Contrasena='$contrasena'";
                $result = $conn->query($sql);
        
                if ($result->num_rows > 0) {
                    $usuarioEncontrado = $result->fetch_assoc();
                    echo json_encode($usuarioEncontrado);
                } else {
                    echo json_encode(array("message" => "Usuario no encontrado"));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
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
        case "View":
            $id = $_GET['Id'] ?? null;

            if ($id) {
                $sql = "SELECT * FROM Usuarios WHERE Id=$id";
                $result = $conn->query($sql);
                if($conn->query($sql) === TRUE){
                    echo json_encode($usuario);
                } else {
                    echo json_encode(array("message" => "No se encontró el usuario con el ID proporcionado"));
                }
            } else {
                // Si no se proporciona un ID, devolver todos los usuarios con clientes asociados
                $sql = "SELECT * FROM Usuarios";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    $usuarios = array();

                    while ($row = $result->fetch_assoc()) {
                        $usuarios[] = $row;
                    }

                    echo json_encode($usuarios);
                } else {
                    echo json_encode(array("message" => "No se encontraron usuarios"));
                }
            }
            break;
        case "View Sub Admins":
            $id = $_GET['Id'] ?? null;
        
            if ($id) {
                $sql = "SELECT * FROM Sub_Admins WHERE Id=$id";
                $result = $conn->query($sql);
        
                if ($result->num_rows > 0) {
                    $usuario = $result->fetch_assoc();
        
                    // Agregar campo 'admin' con valor 1
                    $usuario['admin'] = 1;
        
                    // Obtener las acciones del sub-administrador
                    $sql_acciones = "SELECT * FROM Sub_Admin_Acciones WHERE Id_sub_admin=$id";
                    $result_acciones = $conn->query($sql_acciones);
                    $acciones = array();
        
                    if ($result_acciones->num_rows > 0) {
                        while ($row_acciones = $result_acciones->fetch_assoc()) {
                            $acciones[] = $row_acciones;
                        }
                    }
        
                    $usuario['acciones'] = $acciones;
                    echo json_encode($usuario);
                } else {
                    echo json_encode(array("message" => "No se encontró el Sub Admin con el ID proporcionado"));
                }
            } else {
                // Si no se proporciona un ID, devolver todos los usuarios con clientes asociados
                $sql = "SELECT * FROM Sub_Admins";
                $result = $conn->query($sql);
        
                if ($result->num_rows > 0) {
                    $usuarios = array();
        
                    while ($row = $result->fetch_assoc()) {
                        $id_sub_admin = $row['Id'];
                        $row['admin'] = 0; // Agregar campo 'admin' con valor 1
                        $row['acciones'] = array();
        
                        // Obtener las acciones del sub-administrador
                        $sql_acciones = "SELECT * FROM Sub_Admin_Acciones WHERE Id_sub_admin=$id_sub_admin";
                        $result_acciones = $conn->query($sql_acciones);
        
                        if ($result_acciones->num_rows > 0) {
                            while ($row_acciones = $result_acciones->fetch_assoc()) {
                                $row['acciones'][] = $row_acciones;
                            }
                        }
        
                        $usuarios[] = $row;
                    }
        
                    echo json_encode($usuarios);
                } else {
                    echo json_encode(array("message" => "No se encontraron Sub Admins"));
                }
            }
            break;
        case "Delete Sub Admin":
            $id = $_GET['Id'] ?? null;

            if ($id) {
                $sql = "DELETE FROM Sub_Admins WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Sub Admin Eliminado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Update Sub Admin":
            $id = $_GET['Id'] ?? null;
            $usuario = $_GET['Usuario'] ?? null;
            $correo = $_GET['Correo'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $nombrecliente = $_GET['Nombre'] ?? null;
            $telefono = $_GET['Telefono'] ?? null;
            $recargas = $_GET['Recargas']??null;
            $usuarios = $_GET['Usuarios']??null;
            $servicios = $_GET['Servicios']??null;
            $otros = $_GET['Otros']??null;
            $ventas = $_GET['Ventas']??null;
            $reportes = $_GET['Reportes']??null;
            $cuentas = $_GET['Cuentas']??null;
            $ticket = $_GET['Ticket']??null; 
            if ($id && $usuario && $correo && $contrasena && $nombrecliente && $telefono) {
                $sql = "UPDATE Sub_Admins 
                        SET Usuario='$usuario', Correo = '$correo', Contrasena='$contrasena', Nombre='$nombrecliente', Telefono='$telefono', Recargas = $recargas, Usuarios = $usuarios, Servicios = $servicios, Otros = $otros, Ventas =$ventas, Reportes = $reportes, Cuentas = $cuentas, ticket = $ticket
                        WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Sub Admin actualizado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Disabled" :
            $id = $_GET['Id'] ?? null;
            $cambio = $_GET['cambio']??null;
            if($id){
                if($cambio){
                    $sql= "UPDATE Sub_Admins
                       SET Recargas = 0, Usuarios = 0, Servicios = 0, Otros = 0, Ventas = 0, Reportes = 0, Cuentas = 0, Desabilitada = 1
                       WHERE Id = $id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Sub Admin actualizado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
                }else{
                    $sql= "UPDATE Sub_Admins
                       SET Desabilitada = 0
                       WHERE Id = $id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Sub Admin actualizado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
                }
            }else {
                echo json_encode(array("error" => "Faltan parámetros"));
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
        case "Recharge":
            $usuario = $_GET['Usuario'] ?? null;
            $cot = $_GET['CoT'] ?? null;
            $saldo = $_GET['Saldo'] ?? null;
            $admin = $_GET['admin']??null;
            $id_admin=$_GET['Id_Admin']??null;
            $Fecha =$_GET['Fecha']??null;
            if($admin !=0){
                if($usuario && $cot && $saldo){
                // Consulta para obtener el Id del usuario
                $subquery = "
                    SELECT Id
                    FROM Usuarios
                    WHERE Usuario = '$usuario' AND 
                    (Telefono LIKE '%$cot%' OR Correo LIKE '%$cot%')
                ";
                $result = $conn->query($subquery);
                
                // Verificar si se encontró el usuario
                if ($result && $result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $userId = $row['Id'];
                    
                    // Sentencia SQL principal para actualizar el saldo
                    $Sql = "
                        UPDATE Usuarios
                        SET Creditos = Creditos + $saldo
                        WHERE Id = $userId
                    ";
                    
                    if($conn->query($Sql) === TRUE){
                        // Sentencia para insertar el registro de recarga
                        $sql_r = "INSERT INTO Recargas (`Cantidad`, `Id_Usuario`,`Fecha`)
                                  VALUES ($saldo, $userId, $Fecha)";
                        
                        if($conn->query($sql_r)){
                            echo json_encode(array("message" => "Saldo Actualizado Correctamente"));
                        } else {
                            echo json_encode(array("message" => "Error al insertar el registro de recarga"));
                        }
                    } else {
                        echo json_encode(array("message" => "Error al momento de Actualizar el Saldo"));
                    }
                } else {
                    echo json_encode(array("message" => "Usuario no encontrado"));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            }else{
                if($usuario && $cot && $saldo){
                // Consulta para obtener el Id del usuario
                $subquery = "
                    SELECT Id
                    FROM Usuarios
                    WHERE Usuario = '$usuario' AND 
                    (Telefono LIKE '%$cot%' OR Correo LIKE '%$cot%')
                ";
                $result = $conn->query($subquery);
                
                // Verificar si se encontró el usuario
                if ($result && $result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $userId = $row['Id'];
                    
                    // Sentencia SQL principal para actualizar el saldo
                    $Sql = "
                        UPDATE Usuarios
                        SET Creditos = Creditos + $saldo
                        WHERE Id = $userId
                    ";
                    
                    if($conn->query($Sql) === TRUE){
                        // Sentencia para insertar el registro de recarga
                        $sql_r = "INSERT INTO Recargas (`Cantidad`, `Id_Usuario`)
                                  VALUES ($saldo, $userId)";
                        
                        if($conn->query($sql_r)){
                            $sql_admin_r = "INSERT INTO 
                                            Sub_Admin_Acciones(Id_sub_admin, Seccion, Accion)
                                            VALUES ($id_admin,
                                                    'Recargas',
                                                    'Se recargo la cantidad de : $saldo al usuario: $usuario')";
                            if($conn->query($sql_admin_r)){
                                echo json_encode(array("message" => "Saldo Actualizado Correctamente"));
                            }else{
                                echo json_encode(array("message"=>"Contactar al servicio tecnico de SpaceFlix"));
                            }
                            
                        } else {
                            echo json_encode(array("message" => "Error al insertar el registro de recarga"));
                        }
                    } else {
                        echo json_encode(array("message" => "Error al momento de Actualizar el Saldo"));
                    }
                } else {
                    echo json_encode(array("message" => "Usuario no encontrado"));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            }
            break;
            case "Recharge2":
                $usuario = $_GET['Usuario'] ?? null;
                $cot = $_GET['CoT'] ?? null;
                $saldo = $_GET['Saldo'] ?? null;
                $admin = $_GET['admin'] ?? null;
                $id_admin = $_GET['Id_Admin'] ?? null;
                $fecha = $_GET['Fecha'] ?? null;
            
                if ($admin != 0) {
                    if ($usuario && $cot && $saldo) {
                        // Consulta para obtener el Id del usuario
                        $subquery = $conn->prepare("
                            SELECT Id
                            FROM Usuarios
                            WHERE Usuario = ? AND (Telefono LIKE ? OR Correo LIKE ?)
                        ");
                        $cotLike = '%' . $cot . '%';
                        $subquery->bind_param('sss', $usuario, $cotLike, $cotLike);
                        $subquery->execute();
                        $result = $subquery->get_result();
            
                        // Verificar si se encontró el usuario
                        if ($result && $result->num_rows > 0) {
                            $row = $result->fetch_assoc();
                            $userId = $row['Id'];
            
                            // Sentencia SQL principal para actualizar el saldo
                            $sql = $conn->prepare("
                                UPDATE Usuarios
                                SET Creditos = Creditos + ?
                                WHERE Id = ?
                            ");
                            $sql->bind_param('ii', $saldo, $userId);
            
                            if ($sql->execute()) {
                                // Sentencia para insertar el registro de recarga
                                $sql_r = $conn->prepare("
                                    INSERT INTO Recargas (Cantidad, Id_Usuario, Fecha)
                                    VALUES (?, ?, ?)
                                ");
                                $sql_r->bind_param('iis', $saldo, $userId, $fecha);
            
                                if ($sql_r->execute()) {
                                    echo json_encode(array("message" => "Saldo Actualizado Correctamente"));
                                } else {
                                    echo json_encode(array("message" => "Error al insertar el registro de recarga"));
                                }
                            } else {
                                echo json_encode(array("message" => "Error al momento de Actualizar el Saldo"));
                            }
                        } else {
                            echo json_encode(array("message" => "Usuario no encontrado"));
                        }
                    } else {
                        echo json_encode(array("error" => "Faltan parámetros"));
                    }
                } else {
                    if ($usuario && $cot && $saldo) {
                        // Consulta para obtener el Id del usuario
                        $subquery = $conn->prepare("
                            SELECT Id
                            FROM Usuarios
                            WHERE Usuario = ? AND (Telefono LIKE ? OR Correo LIKE ?)
                        ");
                        $cotLike = '%' . $cot . '%';
                        $subquery->bind_param('sss', $usuario, $cotLike, $cotLike);
                        $subquery->execute();
                        $result = $subquery->get_result();
            
                        // Verificar si se encontró el usuario
                        if ($result && $result->num_rows > 0) {
                            $row = $result->fetch_assoc();
                            $userId = $row['Id'];
            
                            // Sentencia SQL principal para actualizar el saldo
                            $sql = $conn->prepare("
                                UPDATE Usuarios
                                SET Creditos = Creditos + ?
                                WHERE Id = ?
                            ");
                            $sql->bind_param('ii', $saldo, $userId);
            
                            if ($sql->execute()) {
                                // Sentencia para insertar el registro de recarga
                                $sql_r = $conn->prepare("
                                    INSERT INTO Recargas (Cantidad, Id_Usuario, Fecha)
                                    VALUES (?, ?, ?)
                                ");
                                $sql_r->bind_param('iis', $saldo, $userId, $fecha);
            
                                if ($sql_r->execute()) {
                                    // Sentencia para insertar el registro de la acción del sub-admin
                                    $sql_admin_r = $conn->prepare("
                                        INSERT INTO Sub_Admin_Acciones (Id_sub_admin, Seccion, Accion)
                                        VALUES (?, 'Recargas', 'Se recargo la cantidad de : ? al usuario: ?')
                                    ");
                                    $accion = "Se recargo la cantidad de : $saldo al usuario: $usuario";
                                    $sql_admin_r->bind_param('iss', $id_admin, $accion);
            
                                    if ($sql_admin_r->execute()) {
                                        echo json_encode(array("message" => "Saldo Actualizado Correctamente"));
                                    } else {
                                        echo json_encode(array("message" => "Contactar al servicio tecnico de SpaceFlix"));
                                    }
                                } else {
                                    echo json_encode(array("message" => "Error al insertar el registro de recarga"));
                                }
                            } else {
                                echo json_encode(array("message" => "Error al momento de Actualizar el Saldo"));
                            }
                        } else {
                            echo json_encode(array("message" => "Usuario no encontrado"));
                        }
                    } else {
                        echo json_encode(array("error" => "Faltan parámetros"));
                    }
                }
                break;
                case "ViewFechaHoy": {
                    // Escribir la consulta para obtener el valor de Fecha_Hoy
                    $query = "SELECT Fecha_Hoy FROM Cashback";
                    $result = $conn->query($query);
                
                    $data = [];
                
                    // Verificar si la consulta fue exitosa y si hay resultados
                    if ($result && $result->num_rows > 0) {
                        // Recorrer los resultados y agregarlos al array
                        while ($row = $result->fetch_assoc()) {
                            $data[] = $row;
                        }
                        // Enviar los resultados como JSON
                        echo json_encode([
                            "status" => "success",
                            "data" => $data
                        ]);
                    } else {
                        // Si no se encuentran registros, devolver un mensaje en JSON
                        echo json_encode([
                            "status" => "error",
                            "message" => "No se encontro la fecha actual en tabla cashback."
                        ]);
                    }
                }
                break;
        default:
                echo json_encode(array("error" => "Comando no reconocido"));
            break;
    }

    $conn->close();
}
?>