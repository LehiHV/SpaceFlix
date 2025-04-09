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
            $id_usuario = $_GET['Id_Usuario'] ?? null;
            $usuario = $_GET['Usuario'] ?? null;
            $tipo = $_GET['Tipo'] ?? null;
            $problema = $_GET['Problema'] ?? null;
            $fecha_inicio = $_GET['Fecha_Inicio']??null;
            $Cerrado = $_GET['Cerrado']??null;
            $id_cuenta = $_GET['Id_Cuenta']??null;
            $id_ticket = $_GET['Id_Ticket']??null;
            $correo = $_GET['Correo'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $servicio = $_GET['Servicio'] ?? null;
            $perfiles = $_GET['Perfiles'] ?? null;
            $pin = $_GET['PIN'] ?? null;
            $fcompra = $_GET['Fecha_de_Compra'] ?? null;
            $fexpiracion = $_GET['Fecha_Expiracion'] ?? null;
            $dias = $_GET['Dias_Vigentes'] ?? null;
            $total = $_GET['Total']??null;
            if ($correo && $contrasena && $usuario && $problema && $fecha_inicio){
                $sql = "INSERT INTO Reportes 
                        (Id_Usuario, 
                         Usuario, 
                         Tipo,
                         Problema, 
                         Fecha_Inicio, 
                         Cerrado,
                         Id_Cuenta, 
                         Id_Ticket, 
                         Correo, 
                         Contrasena, 
                         Servicio,
                         Perfiles,
                         PIN,
                         Fecha_de_Compra,
                         Fecha_Expiracion,
                         Dias_Vigentes,
                         Total)
                         VALUES (
                         $id_usuario, 
                         '$usuario', 
                         $tipo, 
                         '$problema', 
                         '$fecha_inicio', 
                         $Cerrado, 
                         $id_cuenta, 
                         $id_ticket, 
                         '$correo', 
                         '$contrasena',
                         '$servicio',
                         '$perfiles',
                         $pin,
                         '$fcompra',
                         '$fexpiracion',
                         $dias,
                         $total
                         )";
                         
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Reporte agregado correctamente"));
                }
                else{
                    echo json_encode(array("message" => $conn->query($sql)));
                }
            }
            else {
                    echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "View":
            $id = (int) ($_GET['Id'] ?? 0);
        
            if ($id) {
                // Obtener información del usuario
                $sqlReporte = "SELECT R.*, T.Foto
                                FROM Reportes as R
                                Inner Join Ticket as T
                                On R.Id_Ticket = T.Id
                                WHERE R.Id_Usuario = $id";
            
                $resultReporte = $conn->query($sqlReporte);

                if ($resultReporte) {
                    $reportes = array(); // Inicializar un array para almacenar todos los usuarios
        
                    if ($resultReporte->num_rows > 0) {
                        // Recorrer todos los resultados y agregarlos al array
                        while ($reporte = $resultReporte->fetch_assoc()) {
                            $reportes[] = $reporte;
                        }
        
                        echo json_encode($reportes);
                    } else {
                        echo json_encode(array("message" => "No se encontró ningún usuario con el ID proporcionado"));
                    }
                } else {
                    echo json_encode(array("message" => "Error en la consulta: " . $conn->error));
                }
            } else {
                echo json_encode(array("message" => "ID no válido"));
            }
            break;
        case "ViewAdmin": // Reportes a 2 meses
            $sqlReporte = "SELECT R.*, T.Foto
                                FROM Reportes as R
                                INNER JOIN Ticket as T ON R.Id_Ticket = T.Id
                                WHERE R.Fecha_Inicio >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
                                ORDER BY R.Status ASC";
            $resultReporte = $conn->query($sqlReporte);
            
                if ($resultReporte) {
                    $reportes = array(); // Inicializar un array para almacenar todos los usuarios
                    
                    if ($resultReporte->num_rows > 0) {
                        // Recorrer todos los resultados y agregarlos al array
                        while ($reporte = $resultReporte->fetch_assoc()) {
                            $reportes[] = $reporte;
                        }
                        
                        echo json_encode($reportes);
                    } else {
                        echo json_encode(array("message" => "No se encontró ningún Reporte"));
                    }
                } else {
                    echo json_encode(array("message" => "Error en la consulta: " . $conn->error));
                }
            break;
            case "ViewAdminPagination":
                $id = $_GET['Id'] ?? null;
                $currentPage = $_GET['Page'] ?? 1; // Obtener el número de página actual
            
                // Calcular el índice inicial y la cantidad de registros por página
                $itemsPerPage = 50;
                $startIndex = ($currentPage - 1) * $itemsPerPage;
            
                // Consulta SQL para contar el total de reportes sin el intervalo de 2 meses
                $sqlCount = "SELECT COUNT(*) as Total 
                             FROM Reportes as R
                             INNER JOIN Ticket as T ON R.Id_Ticket = T.Id";
                
                // Consulta SQL para obtener los reportes con la paginación, incluyendo la foto y ordenados por Status
                $sqlReportes = "SELECT R.*, T.Foto
                                FROM Reportes as R
                                INNER JOIN Ticket as T ON R.Id_Ticket = T.Id
                                ORDER BY R.Status ASC
                                LIMIT $startIndex, $itemsPerPage";
            
                // Ejecutar las consultas
                $sqlCountResult = $conn->query($sqlCount);
                $sqlReportesResult = $conn->query($sqlReportes);
            
                if ($sqlCountResult->num_rows > 0) {
                    $row = $sqlCountResult->fetch_assoc();
                    $totalRows = $row['Total'];
            
                    // Calcular el número total de páginas
                    $totalPages = ceil($totalRows / $itemsPerPage);
            
                    // Devolver el número total de páginas como parte de la respuesta JSON
                    $response['total_pages'] = $totalPages;
            
                    // Construir un array para almacenar los reportes
                    $reportes = array();
            
                    if ($sqlReportesResult->num_rows > 0) {
                        while ($rowReporte = $sqlReportesResult->fetch_assoc()) {
                            $reporte = array(
                                "Id" => $rowReporte['Id'],
                                "Id_Usuario" => $rowReporte['Id_Usuario'],
                                "Usuario" => $rowReporte['Usuario'],
                                "Tipo" => $rowReporte['Tipo'],
                                "Problema" => $rowReporte['Problema'],
                                "Status" => $rowReporte['Status'],
                                "Fecha_Inicio" => $rowReporte['Fecha_Inicio'],
                                "Fecha_Cierre" => $rowReporte['Fecha_Cierre'],
                                "Id_Admin" => $rowReporte['Id_Admin'],
                                "Admin" => $rowReporte['Admin'],
                                "Respuesta" => $rowReporte['Respuesta'],
                                "Cerrado" => $rowReporte['Cerrado'] == 1 ? true : false, // Convertir a booleano
                                "Id_Cuenta" => $rowReporte['Id_Cuenta'],
                                "Id_Ticket" => $rowReporte['Id_Ticket'],
                                "Correo" => $rowReporte['Correo'],
                                "Contrasena" => $rowReporte['Contrasena'],
                                "Servicio" => $rowReporte['Servicio'],
                                "Perfiles" => $rowReporte['Perfiles'],
                                "PIN" => $rowReporte['PIN'],
                                "Fecha_de_Compra" => $rowReporte['Fecha_de_Compra'],
                                "Fecha_Expiracion" => $rowReporte['Fecha_Expiracion'],
                                "Dias_Vigentes" => $rowReporte['Dias_Vigentes'],
                                "Total" => $rowReporte['Total'],
                                "Foto" => $rowReporte['Foto'] // Añadir la foto al array de reporte
                            );
            
                            // Agregar el reporte al array de reportes
                            $reportes[] = $reporte;
                        }
                    }
            
                    // Devolver la respuesta JSON con los reportes y el número total de páginas
                    echo json_encode(array("reportes" => $reportes, "pages" => $response['total_pages']));
                } else {
                    // Si no se encontraron reportes
                    echo json_encode(array("message" => "No se encontraron reportes"));
                }
                break;            
            
            case "Update":
                $id = $_GET['Id'] ?? null;
                $id_admin = $_GET['Id_Admin'] ?? null;
                $admin = $_GET['Admin'] ?? null;
                $respuesta = $_GET['Respuesta'] ?? null;
                $fecha = $_GET['Fecha_Cierre'] ?? null ;
                $correo = $_GET['Correo'] ?? null ;
                $contrasena = $_GET['Contrasena'] ?? null ;
                $perfiles = $_GET['Perfiles'] ?? null ;
                $pin = $_GET['PIN'] ?? null ;
                $Id_Cuenta = $_GET['Id_Cuenta'] ?? null;
                $Id_Ticket = $_GET['Id_Ticket'] ?? null;
                $option = $_GET['Opcion'] ?? null;
                $admin2 = $_GET['admin']??null;
                if($admin2!=0){
                    if ($option === "accept") {
                    $sqlReporte = "UPDATE Reportes
                                   SET Status = 1, Fecha_Cierre = ?, Id_Admin = ?, Admin = ?, Respuesta  = ?,
                                   Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?
                                   WHERE Id  = ?";
                    $stmt = $conn->prepare($sqlReporte);
                    $stmt->bind_param("ssssssisi", $fecha,$id_admin, $admin, $respuesta, $correo, $contrasena, $pin, $perfiles, $id);
                    
                    if ($stmt->execute()) {
                        $sqlUpdTicket = "UPDATE Cuentas
                                         SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?
                                         WHERE Id = ?";
                        $stmt2 = $conn->prepare($sqlUpdTicket);
                        $stmt2->bind_param("ssisi", $correo, $contrasena, $pin, $perfiles, $Id_Cuenta);
                        
                        if ($stmt2->execute()) {
                            $sqlUpdateTicket = "UPDATE Ticket
                                                SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?
                                                WHERE Id = ?";
                            $stmt3 = $conn->prepare($sqlUpdateTicket);
                            $stmt3->bind_param("ssisi", $correo, $contrasena, $pin, $perfiles, $Id_Ticket);
                            if ($stmt3->execute()) {
                                echo json_encode(array("message" => "Reporte actualizado correctamente y datos de ticket actualizados"));
                            } else {
                                echo json_encode(array("error" => "Error al actualizar los datos del ticket"));
                            }
                        } else {
                            echo json_encode(array("error" => "Error al actualizar el reporte y los datos del ticket"));
                        }
                    } else {
                        echo json_encode(array("error" => "Error al actualizar el reporte"));
                    }
                } elseif ($option === "decline") {
                    $sqlReporte = "UPDATE Reportes
                                   SET Status = -1, Fecha_Cierre = CURDATE(), Id_Admin = ?, Admin = ?, Respuesta  = ?
                                   WHERE Id  = ?";
                    $stmt = $conn->prepare($sqlReporte);
                    $stmt->bind_param("sssi", $id_admin, $admin, $respuesta, $id);
                    
                    if ($stmt->execute()) {
                        echo json_encode(array("message" => "Reporte actualizado correctamente"));
                    } else {
                        echo json_encode(array("error" => "Error al actualizar el reporte"));
                    }
                } else {
                    echo json_encode(array("error" => "Comando no reconocido para actualizar"));
                }
                }else{
                    if ($option === "accept") {
                        $sqlReporte = "UPDATE Reportes
                        SET Status = 1, Fecha_Cierre = ?, Id_Admin = ?, Admin = ?, Respuesta  = ?,
                        Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?
                        WHERE Id  = ?";
                        $stmt = $conn->prepare($sqlReporte);
                        $stmt->bind_param("ssssssisi", $fecha,$id_admin, $admin, $respuesta, $correo, $contrasena, $pin, $perfiles, $id);
                    
                    if ($stmt->execute()) {
                        $sqlUpdTicket = "UPDATE Cuentas
                        SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?
                        WHERE Id = ?";
                        $stmt2 = $conn->prepare($sqlUpdTicket);
                        $stmt2->bind_param("ssisi", $correo, $contrasena, $pin, $perfiles, $Id_Cuenta);
                        
                        if ($stmt2->execute()) {
                            $sqlUpdateTicket = "UPDATE Ticket
                            SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?
                            WHERE Id = ?";
        $stmt3 = $conn->prepare($sqlUpdateTicket);
        $stmt3->bind_param("ssisi", $correo, $contrasena, $pin, $perfiles, $Id_Ticket);
                            if ($stmt3->execute()) {
                                 $sql_admin_r = "INSERT INTO 
                                        Sub_Admin_Acciones 
                                        (Id_sub_admin, Seccion, Accion) 
                                        VALUES ($id_admin,'Reportes','Sub admin con id:$id_admin contesto reporte con id:$id (usuario:$admin)')";
                        if($conn->query($sql_admin_r) === TRUE){
                                    echo json_encode(array("message" => "Reporte actualizado correctamente y datos de ticket actualizados"));
                                }else{
                                    echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                                }
                            } else {
                                echo json_encode(array("error" => "Error al actualizar los datos del ticket"));
                            }
                        } else {
                            echo json_encode(array("error" => "Error al actualizar el reporte y los datos del ticket"));
                        }
                    } else {
                        echo json_encode(array("error" => "Error al actualizar el reporte"));
                    }
                } elseif ($option === "decline") {
                    $sqlReporte = "UPDATE Reportes
                                   SET Status = -1, Fecha_Cierre = CURDATE(), Id_Admin = ?, Admin = ?, Respuesta  = ?
                                   WHERE Id  = ?";
                    $stmt = $conn->prepare($sqlReporte);
                    $stmt->bind_param("sssi", $id_admin, $admin, $respuesta, $id);
                    
                    if ($stmt->execute()) {
                        $sql_admin_r = "INSERT INTO 
                                        Sub_Admin_Acciones 
                                        (Id_sub_admin, Seccion, Accion) 
                                        VALUES ($id_admin,'Reportes','Sub admin con id:$id_admin contesto reporte con id:$id (usuario:$admin)')";
                        if($conn->query($sql_admin_r) === TRUE){
                                    echo json_encode(array("message" => "Reporte actualizado correctamente"));
                                }else{
                                    echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                                }
                    } else {
                        echo json_encode(array("error" => "Error al actualizar el reporte"));
                    }
                } else {
                    echo json_encode(array("error" => "Comando no reconocido para actualizar"));
                }
                }
                break;
                case "Update2":
                    $id = $_GET['Id'] ?? null;
                    $id_admin = $_GET['Id_Admin'] ?? null;
                    $admin = $_GET['Admin'] ?? null;
                    $respuesta = $_GET['Respuesta'] ?? null;
                    $fecha = $_GET['Fecha_Cierre'] ?? null ;
                    $correo = $_GET['Correo'] ?? null ;
                    $contrasena = $_GET['Contrasena'] ?? null ;
                    $perfiles = $_GET['Perfiles'] ?? null ;
                    $pin = $_GET['PIN'] ?? null ;
                    $Id_Cuenta = $_GET['Id_Cuenta'] ?? null;
                    $Id_Ticket = $_GET['Id_Ticket'] ?? null;
                    $fecha_Expiracion = $_GET['Fecha_Expiracion'] ?? null;
                    $option = $_GET['Opcion'] ?? null;
                    $admin2 = $_GET['admin'] ?? null;
                    
                    if($admin2 != 0){
                        if ($option === "accept") {
                            $sqlReporte = "UPDATE Reportes
                                           SET Status = 1, Fecha_Cierre = ?, Id_Admin = ?, Admin = ?, Respuesta  = ?,
                                           Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?, Fecha_Expiracion = ?
                                           WHERE Id  = ?";
                            $stmt = $conn->prepare($sqlReporte);
                            $stmt->bind_param("ssssssissi", $fecha, $id_admin, $admin, $respuesta, $correo, $contrasena, $pin, $perfiles, $fecha_Expiracion, $id);
                            
                            if ($stmt->execute()) {
                                $sqlUpdTicket = "UPDATE Cuentas
                                                 SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?
                                                 WHERE Id = ?";
                                $stmt2 = $conn->prepare($sqlUpdTicket);
                                $stmt2->bind_param("ssisi", $correo, $contrasena, $pin, $perfiles, $Id_Cuenta);
                                
                                if ($stmt2->execute()) {
                                    $sqlUpdateTicket = "UPDATE Ticket
                                                        SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?, Fecha_Expiracion = ?
                                                        WHERE Id = ?";
                                    $stmt3 = $conn->prepare($sqlUpdateTicket);
                                    $stmt3->bind_param("ssissi", $correo, $contrasena, $pin, $perfiles, $fecha_Expiracion, $Id_Ticket);
                                    if ($stmt3->execute()) {
                                        $sql_admin_r = "INSERT INTO 
                                                        Sub_Admin_Acciones 
                                                        (Id_sub_admin, Seccion, Accion) 
                                                        VALUES ($id_admin,'Reportes','Sub admin con id:$id_admin contesto reporte con id:$id (usuario:$admin)')";
                                        if ($conn->query($sql_admin_r) === TRUE) {
                                            echo json_encode(array("message" => "Reporte actualizado correctamente y datos de ticket actualizados"));
                                        } else {
                                            echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                                        }
                                    } else {
                                        echo json_encode(array("error" => "Error al actualizar los datos del ticket"));
                                    }
                                } else {
                                    echo json_encode(array("error" => "Error al actualizar el reporte y los datos del ticket"));
                                }
                            } else {
                                echo json_encode(array("error" => "Error al actualizar el reporte"));
                            }
                        } elseif ($option === "decline") {
                            $sqlReporte = "UPDATE Reportes
                                           SET Status = -1, Fecha_Cierre = CURDATE(), Id_Admin = ?, Admin = ?, Respuesta  = ?
                                           WHERE Id  = ?";
                            $stmt = $conn->prepare($sqlReporte);
                            $stmt->bind_param("sssi", $id_admin, $admin, $respuesta, $id);
                            
                            if ($stmt->execute()) {
                                $sql_admin_r = "INSERT INTO 
                                                Sub_Admin_Acciones 
                                                (Id_sub_admin, Seccion, Accion) 
                                                VALUES ($id_admin,'Reportes','Sub admin con id:$id_admin contesto reporte con id:$id (usuario:$admin)')";
                                if ($conn->query($sql_admin_r) === TRUE) {
                                    echo json_encode(array("message" => "Reporte actualizado correctamente"));
                                } else {
                                    echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                                }
                            } else {
                                echo json_encode(array("error" => "Error al actualizar el reporte"));
                            }
                        } else {
                            echo json_encode(array("error" => "Comando no reconocido para actualizar"));
                        }
                    } else {
                        if ($option === "accept") {
                            $sqlReporte = "UPDATE Reportes
                                           SET Status = 1, Fecha_Cierre = ?, Id_Admin = ?, Admin = ?, Respuesta  = ?,
                                           Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?, Fecha_Expiracion = ?
                                           WHERE Id  = ?";
                            $stmt = $conn->prepare($sqlReporte);
                            $stmt->bind_param("ssssssissi", $fecha, $id_admin, $admin, $respuesta, $correo, $contrasena, $pin, $perfiles, $fecha_Expiracion, $id);
                            
                            if ($stmt->execute()) {
                                $sqlUpdTicket = "UPDATE Cuentas
                                                 SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?
                                                 WHERE Id = ?";
                                $stmt2 = $conn->prepare($sqlUpdTicket);
                                $stmt2->bind_param("ssisi", $correo, $contrasena, $pin, $perfiles, $Id_Cuenta);
                                
                                if ($stmt2->execute()) {
                                    $sqlUpdateTicket = "UPDATE Ticket
                                                        SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?, Fecha_Expiracion = ?
                                                        WHERE Id = ?";
                                    $stmt3 = $conn->prepare($sqlUpdateTicket);
                                    $stmt3->bind_param("ssissi", $correo, $contrasena, $pin, $perfiles, $fecha_Expiracion, $Id_Ticket);
                                    if ($stmt3->execute()) {
                                        $sql_admin_r = "INSERT INTO 
                                                        Sub_Admin_Acciones 
                                                        (Id_sub_admin, Seccion, Accion) 
                                                        VALUES ($id_admin,'Reportes','Sub admin con id:$id_admin contesto reporte con id:$id (usuario:$admin)')";
                                        if ($conn->query($sql_admin_r) === TRUE) {
                                            echo json_encode(array("message" => "Reporte actualizado correctamente y datos de ticket actualizados"));
                                        } else {
                                            echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                                        }
                                    } else {
                                        echo json_encode(array("error" => "Error al actualizar los datos del ticket"));
                                    }
                                } else {
                                    echo json_encode(array("error" => "Error al actualizar el reporte y los datos del ticket"));
                                }
                            } else {
                                echo json_encode(array("error" => "Error al actualizar el reporte"));
                            }
                        } elseif ($option === "decline") {
                            $sqlReporte = "UPDATE Reportes
                                           SET Status = -1, Fecha_Cierre = CURDATE(), Id_Admin = ?, Admin = ?, Respuesta  = ?
                                           WHERE Id  = ?";
                            $stmt = $conn->prepare($sqlReporte);
                            $stmt->bind_param("sssi", $id_admin, $admin, $respuesta, $id);
                            
                            if ($stmt->execute()) {
                                $sql_admin_r = "INSERT INTO 
                                                Sub_Admin_Acciones 
                                                (Id_sub_admin, Seccion, Accion) 
                                                VALUES ($id_admin,'Reportes','Sub admin con id:$id_admin contesto reporte con id:$id (usuario:$admin)')";
                                if ($conn->query($sql_admin_r) === TRUE) {
                                    echo json_encode(array("message" => "Reporte actualizado correctamente"));
                                } else {
                                    echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                                }
                            } else {
                                echo json_encode(array("error" => "Error al actualizar el reporte"));
                            }
                        } else {
                            echo json_encode(array("error" => "Comando no reconocido para actualizar"));
                        }
                    }
                
                    // Actualizar Dias_Vigentes en la tabla Ticket
                    $sqlUpdateDiasVigentes = "UPDATE Ticket
                                              SET Dias_Vigentes = CASE 
                                                  WHEN Fecha_Expiracion >= CURDATE() THEN DATEDIFF(Fecha_Expiracion, CURDATE())
                                                  ELSE -DATEDIFF(CURDATE(), Fecha_Expiracion)
                                              END";
                    $conn->query($sqlUpdateDiasVigentes);
                    break;
            
            case "Reembolso":
                $usuario = $_GET['Usuario'] ?? null;
                $saldoEqui = $_GET['saldoEqui'] ?? null;
                $id = $_GET['Id'] ?? null;
                $id_admin = $_GET['Id_Admin'] ?? null;
                $admin = $_GET['Admin'] ?? null;
                $respuesta = $_GET['Respuesta'] ?? null;
                $fecha = $_GET['Fecha_Cierre'] ?? null;
                $correo = $_GET['Correo'] ?? null;
                $contrasena = $_GET['Contrasena'] ?? null;
                $Id_Cuenta = $_GET['Id_Cuenta'] ?? null;
                $Id_Ticket = $_GET['Id_Ticket'] ?? null;
                $pin = $_GET['PIN'] ?? null;
                $perfiles = $_GET['Perfiles'] ?? null;
                $Id_usuario = $_GET['Id_Usuario'] ?? null;
                $Fecha = $_GET['Fecha'] ?? null;
                $Fecha_Expiracion = $_GET['Fecha_Expiracion'] ?? null;
            
                // Actualizar la tabla Usuarios
                $sqlSaldo = "UPDATE Usuarios SET Creditos = Creditos + ? WHERE Usuario = ?";
                $stmtSaldo = $conn->prepare($sqlSaldo);
                $stmtSaldo->bind_param("ds", $saldoEqui, $usuario);
            
                // Actualizar la tabla Reportes
                $sqlReporte = "UPDATE Reportes SET Status = 1, Fecha_Cierre = ?, Id_Admin = ?, Admin = ?, Respuesta = ?, Correo = ?, Contrasena = ? WHERE Id = ?";
                $stmtReporte = $conn->prepare($sqlReporte);
                $stmtReporte->bind_param("ssssssi", $fecha, $id_admin, $admin, $respuesta, $correo, $contrasena, $id);
            
                // Actualizar la tabla Cuentas
                $sqlUpdTicket = "UPDATE Cuentas SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?, Fecha_Expiracion = CURDATE(), Dias_Restantes = null WHERE Id = ?";
                $stmtUpdTicket = $conn->prepare($sqlUpdTicket);
                $stmtUpdTicket->bind_param("ssssi", $correo, $contrasena, $pin, $perfiles, $Id_Cuenta);
            
                // Actualizar la tabla Ticket
                $sqlUpdateTicket = "UPDATE Ticket SET Correo = ?, Contrasena = ?, PIN = ?, Perfiles = ?, Fecha_Expiracion = ?, Dias_Vigentes = -1 WHERE Id = ?";
                $stmtUpdateTicket = $conn->prepare($sqlUpdateTicket);
                $stmtUpdateTicket->bind_param("sssssi", $correo, $contrasena, $pin, $perfiles, $Fecha_Expiracion, $Id_Ticket);

            
                // Preparar y ejecutar consulta para insertar registro en Recargas
                $sqlRecarga = "INSERT INTO Recargas (Cantidad, Id_Usuario, Fecha) VALUES (?, ?, ?)";
                $stmtRecarga = $conn->prepare($sqlRecarga);
                $stmtRecarga->bind_param("sis", $saldoEqui, $Id_usuario, $Fecha);
            
                // Ejecutar las consultas preparadas
                $saldoResult = $stmtSaldo->execute();
                $reporteResult = $stmtReporte->execute();
                $updTicketResult = $stmtUpdTicket->execute();
                $updateTicketResult = $stmtUpdateTicket->execute();
                $recargaResult = $stmtRecarga->execute();
            
                // Verificar si las consultas fueron exitosas
                if ($saldoResult && $reporteResult && $updTicketResult && $updateTicketResult && $recargaResult) {
                    $sql_admin_r = "INSERT INTO Sub_Admin_Acciones (Id_sub_admin, Seccion, Accion) VALUES (?, 'Reportes', ?)";
                    $accion = "Sub admin con id:$id_admin reembolsó a la cuenta con id:$Id_Cuenta (correo:$correo)";
                    $stmtAdminAccion = $conn->prepare($sql_admin_r);
                    $stmtAdminAccion->bind_param("is", $id_admin, $accion);
                    $adminAccionResult = $stmtAdminAccion->execute();
            
                    if ($adminAccionResult) {
                        echo json_encode(array("message" => "Reporte y saldo actualizados correctamente"));
                    } else {
                        error_log("Error al insertar en Sub_Admin_Acciones: " . $stmtAdminAccion->error);
                        echo json_encode(array("message" => "Por favor contacte al servicio técnico de SpaceFlix"));
                    }
                } else {
                    error_log("Error al ejecutar consultas: " . $stmtSaldo->error . " " . $stmtReporte->error . " " . $stmtUpdTicket->error . " " . $stmtUpdateTicket->error . " " . $stmtRecarga->error);
                    echo json_encode(array("message" => "Error al actualizar el reporte o datos de ticket"));
                }
            
                $sqlUpdateCuenta = "UPDATE Cuentas SET Valido = 4 WHERE Id = ?";
                $stmtUpdateCuenta = $conn->prepare($sqlUpdateCuenta);
                $stmtUpdateCuenta->bind_param("i", $Id_Cuenta);
                $stmtUpdateCuenta->execute();
            
                break;
        case "GetDiasVigenteCuenta":
         // Obtener el Id_Cuenta de la solicitud GET
        $Id_Cuenta = $_GET['Id_Cuenta'] ?? null;

        // Verificar si el Id_Cuenta fue proporcionado
        if ($Id_Cuenta) {
        // Preparar la consulta para obtener Dias_vigente
        $query = "SELECT Dias_vigente FROM Cuentas WHERE Id = ?";
        
        // Preparar la declaración
        if ($stmt = $conn->prepare($query)) {
            // Vincular el parámetro Id_Cuenta a la consulta
            $stmt->bind_param("i", $Id_Cuenta);

            // Ejecutar la consulta
            $stmt->execute();

            // Obtener el resultado
            $result = $stmt->get_result();

            // Verificar si se encontró una fila
            if ($row = $result->fetch_assoc()) {
                // Retornar el valor de Dias_vigente
                $Dias_vigente = $row['Dias_vigente'];
                echo json_encode(['Dias_vigente' => $Dias_vigente]);
            } else {
                // Si no se encuentra la cuenta, retornar un error
                echo json_encode(['error' => 'Cuenta no encontrada']);
            }

            // Cerrar la declaración
            $stmt->close();
        } else {
            // Si hubo un error al preparar la declaración
            echo json_encode(['error' => 'Error en la consulta a la base de datos']);
        }
    } else {
        // Si no se proporcionó el Id_Cuenta
        echo json_encode(['error' => 'Id_Cuenta no proporcionado']);
    }
    break;

        default:
                echo json_encode(array("error" => "Comando no reconocido"));
            break;
    }

    $conn->close();
}
?>