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
           
            case "Login2":
                $usuario = $_GET['Usuario'] ?? null;
                $contrasena = $_GET['Contrasena'] ?? null;
                
                if ($usuario && $contrasena) {
                    // Verificar si existe un registro con el usuario y contraseña proporcionados en Admin
                    $adminSql = "SELECT Id, Usuario, Contrasena, Admin 
                                 FROM Admin
                                 WHERE BINARY Contrasena = ? AND BINARY Usuario = ?";
                    
                    $stmt = $conn->prepare($adminSql);
                    $stmt->bind_param("ss", $contrasena, $usuario);
                    $stmt->execute();
                    $result = $stmt->get_result();
                
                    if ($result->num_rows > 0) {
                        $usuarioEncontrado = $result->fetch_assoc();
                        if ($usuarioEncontrado['Admin'] == 1) {
                            // Si el campo Admin es 1, el usuario es un administrador
                            echo json_encode($usuarioEncontrado);
                        } else {
                            // Si el campo Admin no es 1, buscar el registro correspondiente en la tabla Sub_Admins
                            $subAdminSql = "SELECT * 
                                            FROM Sub_Admins
                                            WHERE BINARY Contrasena = ? AND BINARY Usuario = ?";
                            
                            $subStmt = $conn->prepare($subAdminSql);
                            $subStmt->bind_param("ss", $contrasena, $usuario);
                            $subStmt->execute();
                            $subResult = $subStmt->get_result();
                            
                            if ($subResult->num_rows > 0) {
                                $subAdminEncontrado = $subResult->fetch_assoc();
                                // Agregar el campo Sub_Admin con valor true al JSON devuelto
                                $subAdminEncontrado['Sub_Admin'] = true;
                                echo json_encode($subAdminEncontrado);
                            } else {
                                // Si no se encuentra en Sub_Admins, buscar en Usuarios
                                $userId = $usuarioEncontrado['Id'];
                                
                                $userSql = "SELECT * FROM Usuarios WHERE Id=?";
                                $userStmt = $conn->prepare($userSql);
                                $userStmt->bind_param("i", $userId);
                                $userStmt->execute();
                                $userResult = $userStmt->get_result();
                    
                                if ($userResult->num_rows > 0) {
                                    $userEncontrado = $userResult->fetch_assoc();
                                    echo json_encode($userEncontrado);
                                }
                                $userStmt->close();
                            }
                            $subStmt->close();
                        }
                    } else {
                        // Si no se encuentra en Admin, buscar en Sub_Admins
                        $subAdminSql = "SELECT * 
                                        FROM Sub_Admins
                                        WHERE BINARY Contrasena = ? AND BINARY Usuario = ? AND Desabilitada =0";
                        
                        $subStmt = $conn->prepare($subAdminSql);
                        $subStmt->bind_param("ss", $contrasena, $usuario);
                        $subStmt->execute();
                        $subResult = $subStmt->get_result();
                        
                        if ($subResult->num_rows > 0) {
                            $subAdminEncontrado = $subResult->fetch_assoc();
                            // Agregar el campo Sub_Admin con valor true al JSON devuelto
                            $subAdminEncontrado['Sub_Admin'] = true;
                            $subAdminEncontrado['admin'] = 0;
                            echo json_encode($subAdminEncontrado);
                        } else {
                            // Si no se encuentra en Sub_Admins, buscar en Usuarios
                            $userSql = "SELECT * FROM Usuarios WHERE BINARY Contrasena = ? AND BINARY Usuario = ?";
                            $userStmt = $conn->prepare($userSql);
                            $userStmt->bind_param("ss", $contrasena, $usuario);
                            $userStmt->execute();
                            $userResult = $userStmt->get_result();
                
                            if ($userResult->num_rows > 0) {
                                $userEncontrado = $userResult->fetch_assoc();
                                // Incluir el campo Tipo para identificar que es un usuario normal
                                $userEncontrado['Tipo'] = 'Usuario';
                                echo json_encode($userEncontrado);
                            } else {
                                echo json_encode(array("message" => "Usuario no encontrado"));
                            }
                            $userStmt->close();
                        }
                        $subStmt->close();
                    }
                
                    $stmt->close();
                } else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            break;
            case "CheckVersion":
                $version_app = $_GET['Version_App'] ?? null;
            
                if ($version_app) {
                    // Consulta para verificar si la versión de la app existe en la tabla Cashback
                    $versionSql = "SELECT Version_App FROM Cashback WHERE Version_App = ?";
                    $versionStmt = $conn->prepare($versionSql);
                    $versionStmt->bind_param("s", $version_app);
                    $versionStmt->execute();
                    $versionResult = $versionStmt->get_result();
            
                    if ($versionResult->num_rows > 0) {
                        // La versión de la app existe
                        $versionData = $versionResult->fetch_assoc();
                        echo json_encode(array("Version_App" => $versionData['Version_App']));
                    } else {
                        // La versión de la app no coincide
                        echo json_encode(array("error" => "La versión de la aplicación no coincide"));
                    }
                    $versionStmt->close();
                } else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
                break;
            
        case "Buy":
            //Datos Usuarios
            $id = $_GET['Id'] ?? null;
            $usuario = $_GET['Usuario']??null;
            $creditos = $_GET['Creditos'] ?? null;
            $pagar = $_GET['Pagar'] ?? null;
            //Datos Productos
            $id_producto = $_GET['Id_Producto'] ?? null;
            $nombre_producto = $_GET['Producto'] ?? null;
            $descripcion = $_GET['Descripcion']??null;
            $tipo_de_cuenta = $_GET['Tipo_de_Cuenta'] ?? null;
            $cantidad = $_GET['Cantidad']??null;
            $precio = $_GET['Precio']??null;
            $costo = $_GET['Costo']??null;
            $ref = $_GET['Ref']??null;
            $foto = $_GET['Foto']??null;
            //Datos Ticket
            $fecha = $_GET['Fecha']??null;
            $sqlCheck = "SELECT SP.Id,COUNT(*) as Cuentas_Validas
                        FROM Servicio_Producto as SP
                        INNER JOIN Cuentas as C
                        ON SP.Tipo_de_Cuenta = C.Tipo_de_Cuenta
                        WHERE C.Valido = 1 AND SP.Id = $id_producto
                        GROUP BY SP.Id";

            if($creditos >= $precio){
                $result = $conn->query($sqlCheck);
            if ($result) {
                $row = $result->fetch_assoc();
                
                // Verificar si Existen cuentas disponibles
                if ($row['Cuentas_Validas'] >= 1) {
                    //Verificar que tenga creditos suficientes
                    //Actualizar datos
                    if ($creditos >= $pagar) {
                        $sqlUpdate = "UPDATE Usuarios SET Creditos = $pagar, Total_Compras=Total_Compras+1 WHERE Id=$id";
                        if ($conn->query($sqlUpdate) === TRUE) {
                        $sqlCuenta = "SELECT *
                                      FROM Cuentas
                                      WHERE Valido=1 AND Tipo_de_Cuenta=$tipo_de_cuenta
                                      LIMIT 1";
                        $resultCuenta = $conn->query($sqlCuenta);
                        
                        if ($resultCuenta) {
                            if ($resultCuenta->num_rows > 0) {
                                //Obtener datos de la cuenta necesarios para rellenar el ticket
                                $cuenta_sell = $resultCuenta->fetch_assoc();
                                $id_cuenta=$cuenta_sell['Id'];
                                $correo_cuenta=$cuenta_sell['Correo'];
                                $contrasena_cuenta=$cuenta_sell['Contrasena'];
                                $descripcion_cuenta =$cuenta_sell['Descripcion'];
                                $PIN_cuenta = $cuenta_sell['PIN'];
                                $Perfiles_cuenta = $cuenta_sell['Perfiles'];
                                $dias_vigente = $cuenta_sell['Dias_Vigente'];
                                
                                //La fecha de Expiracion sera tomada desde el ticket
                                //$sqlupded = "UPDATE Cuentas 
                                //             SET Fecha_Expiracion = DATE_ADD(CURRENT_DATE, INTERVAL Dias_Vigente DAY)
                                //             WHERE Id= $id_cuenta";
                                //$upded = $conn->query($sqlupded);
                                //$sqlupddr = "UPDATE Cuentas 
                                //             SET Dias_Restantes = DATEDIFF(Fecha_Expiracion,CURRENT_DATE)
                                //             WHERE Id= $id_cuenta";
                                //$upddr = $conn->query($sqlupddr);
                                // Consultar los datos actualizados después de la actualización
                                
                                //Obtener Fecha_Expiracion:
                                $fecha_expiracion = date('Y-m-d', strtotime($fecha . ' + ' . $dias_vigente . ' days'));
                                
                                //Datos usuario
                                $sqlSelect = "SELECT * FROM Usuarios WHERE Id=$id";
                                $result = $conn->query($sqlSelect);
                                
                                 if($ref !=""){
                                     $sqlRef = "SELECT *
                                               FROM Usuarios
                                               WHERE Usuario = '$ref'
                                               LIMIT 1";
                                    
                                    $result2 = $conn->query($sqlRef);
                                    if ($result2->num_rows > 0) {
                                        // Si hay al menos un registro, almacenar el registro en una variable
                                        $row2 = $result2->fetch_assoc();
                                        // Otorgar cashback
                                        $sqlCashback = "UPDATE Usuarios 
                                                        SET Creditos = Creditos + ((SELECT Cashback FROM Cashback WHERE Id = 1)/100)*$precio
                                                        WHERE Id = " . $row2['Id'];
                                        if ($conn->query($sqlCashback) === TRUE) {
                                            $a= "Cashback otorgado con éxito.";
                                        } else {
                                            $a= "Error al otorgar cashback: " . $conn->error;
                                        }
                                        // Crear registro de Cashback
                                        $aux_id = $row2['Id'];
                                        $sqlRecarga = "INSERT INTO Recargas(Cantidad, Id_Usuario) 
                                                       VALUES (((SELECT Cashback FROM Cashback WHERE Id = 1)/100)*$precio, $aux_id )";
                                        if ($conn->query($sqlRecarga) === TRUE) {
                                            $a= "Registro de Cashback creado con éxito.";
                                        } else {
                                            $a= "Error al crear registro de Cashback: " . $conn->error;
                                        }
                                        
                                    }
                                 }
                                 
                                // Crear Ticket de la compra
                                $sqlTicket = "INSERT INTO Ticket
                                              (Id_Usuario,
                                               Usuario, 
                                               Id_Producto_Servicio, 
                                               Producto, 
                                               Id_Cuenta, 
                                               Descripcion, 
                                               Correo, 
                                               Contrasena, 
                                               PIN, 
                                               Perfiles, 
                                               Fecha_de_Compra, 
                                               Fecha_Expiracion, 
                                               Dias_Vigentes, 
                                               Tipo_de_Cuenta, 
                                               Foto, 
                                               Precio, 
                                               Precio_Original, 
                                               Total,
                                               Total_Original) 
                                              VALUES 
                                              ($id,
                                              '$usuario',
                                              $id_producto,
                                              '$nombre_producto',
                                              $id_cuenta,
                                              '$descripcion',
                                              '$correo_cuenta',
                                              '$contrasena_cuenta',
                                              $PIN_cuenta,
                                              '$Perfiles_cuenta',
                                              '$fecha',
                                              '$fecha_expiracion',
                                              $dias_vigente,
                                              $tipo_de_cuenta,
                                              '$foto',
                                              $costo,
                                              $costo,
                                              $precio,$precio)";
                                //Cambiar estado de la cuenta
                                $sqlCuentaValido = "UPDATE Cuentas
                                                    SET Valido = 0
                                                    WHERE Id = $id_cuenta";
                                $CuentaValido = $conn->query($sqlCuentaValido);
                                
                                                    
                                $sqlProductoCantidad = "UPDATE Servicio_Producto
                                                        SET Cantidad = Cantidad -1
                                                        WHERE Id = $id_producto";
                                $ProductoCantidad = $conn->query($sqlProductoCantidad);
                                
                                // Crear Registro de Ticket
                                 $ticket_new = $conn->query($sqlTicket);
                                 $ticket_number = $conn->insert_id;
                                 
                                    if ($result->num_rows > 0) {
                                        
                                
                                        $row = $result->fetch_assoc();
                                        $sqlTicketInfo = "SELECT * FROM Ticket WHERE Id=$ticket_number";
                                        $resultTicketInfo= $conn->query($sqlTicketInfo);
                                        
                                        if ($resultTicketInfo) {
                                            $ticketInfo = $resultTicketInfo->fetch_assoc();
                                            echo json_encode(array("message" => "Compra realizada Exitosamente", "user" => $row, "ticket"=>$ticketInfo,)); //"prueba"=>$sqlRecarga));
                                        }
                                    }
                                    else {
                                        echo json_encode(array("message" => "No se pudieron obtener los datos actualizados del usuario"));
                                    }
                            }
                            else{
                                echo json_encode(array ("message"=>"No hay cuentas disponibles de momento"));
                            }
                        }

                        }
                        else {
                            echo json_encode(array("message" => "Error al actualizar los datos del usuario"));
                        }
                    }
                    else {
                        echo json_encode(array("message" => "Saldo insuficiente"));
                    }
                } else {
                    echo json_encode(array("message" => "No hay stock disponible"));
                }
            }
            else {
                echo json_encode(array("message" => "Faltan parámetros"));
            }
            }else{
                echo json_encode(array("message"=>  "Saldo insuficiente"));
            }
            break;
        case "search":
            $usuario = $_GET['Objeto'] ?? null;
            $currentPage = $_GET['Page'] ?? 1; // Obtener el número de página actual
        
            // Calcular el índice inicial y la cantidad de registros por página
            $itemsPerPage = 50;
            $startIndex = ($currentPage - 1) * $itemsPerPage;
        
            $sqlCount = "SELECT COUNT(*) as Total FROM Usuarios WHERE Usuario Like  '%$usuario%'";
            $sqlUsuarios = "SELECT * FROM Usuarios WHERE Usuario Like '%$usuario%' LIMIT $startIndex, $itemsPerPage"; // Consulta paginada
        
            $sqlCountResult = $conn->query($sqlCount);
            $sqlUsuariosResult = $conn->query($sqlUsuarios);
        
            if ($sqlCountResult->num_rows > 0) {
                $row = $sqlCountResult->fetch_assoc();
                $totalRows = $row['Total'];
        
                // Calcular el número total de páginas
                $totalPages = ceil($totalRows / $itemsPerPage);
        
                // Devolver el número total de páginas como parte de la respuesta JSON
                $response['total_pages'] = $totalPages;
        
                // Construir un array para almacenar los usuarios
                $usuarios = array();
        
                if ($sqlUsuariosResult->num_rows > 0) {
                    while ($rowUsuario = $sqlUsuariosResult->fetch_assoc()) {
                        $usuarioId = $rowUsuario['Id'];
                        $usuarioConTickets = array(
                            "Id" => $usuarioId,
                            "Usuario" => $rowUsuario['Usuario'],
                            "Contrasena" => $rowUsuario['Contrasena'],
                            "Correo" => $rowUsuario['Correo'],
                            "Nombre_Cliente" => $rowUsuario['Nombre_Cliente'],
                            "Telefono" => $rowUsuario['Telefono'],
                            "Total_Compras" => $rowUsuario['Total_Compras'],
                            "Creditos" => $rowUsuario['Creditos'],
                            "Sub_Admin" => $rowUsuario['Sub_admin'] == 1 ? true : false,
                            "VIP" => $rowUsuario['VIP'] == 1 ? true : false, // Convertir a booleano
                        );
        
                        // Agregar el usuario al array de usuarios
                        $usuarios[] = $usuarioConTickets;
                    }
                }
        
                // Agregar el array de usuarios a la respuesta JSON
                //$response['usuarios'] = $usuarios;
        
                // Devolver la respuesta JSON
                echo json_encode(array("usuarios"=>$usuarios,"pages"=>$response['total_pages']));
            } else {
                // Si no se encontraron usuarios
                echo json_encode(array("message" => "No se encontraron usuarios"));
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
            $referido = $_GET['Ref'] ?? null;
        
            // Perform the SQL query to get the total count
            $sql_nombre = "SELECT COUNT(*) as Total
                           FROM Usuarios
                           WHERE Usuario = '$usuario'";
            $result = $conn->query($sql_nombre);
        
            if ($result && $result->num_rows > 0) {
                // Fetching row from the result set
                $row = $result->fetch_assoc();
                $total = $row["Total"];
        
                // Check if total count is 1 or more
                if ($total >= 1) {
                    // Store the total count in a variable
                    $total_count = $total;
                }
            }
        
            // If total count is not greater than or equal to 1, proceed with insertion
            if (!isset($total_count)) {
                if ($usuario && $correo && $contrasena && $nombrecliente && $telefono) {
                    $sql = "INSERT INTO Usuarios 
                            (Usuario, Correo, Contrasena, Nombre_Cliente, Telefono, Total_Compras, Creditos, Ref) 
                            VALUES 
                            ('$usuario', '$correo', '$contrasena', '$nombrecliente', '$telefono', $totalcompras, $creditos, '$referido')";
                    if ($conn->query($sql) === TRUE) {
                        echo json_encode(array("message" => "Usuario agregado correctamente"));
                    } else {
                        echo json_encode(array("error" => "Faltan parámetros"));
                    }
                }
            }else {
                echo json_encode(array("message" => "Ese nombre de usuario ya esta usado, porfavor utilizar de uno diferente"));
            }
        
            break;
        case "View":
            $id = $_GET['Id'] ?? null;
            $currentPage = $_GET['Page'] ?? 1; // Obtener el número de página actual
        
            // Calcular el índice inicial y la cantidad de registros por página
            $itemsPerPage = 50;
            $startIndex = ($currentPage - 1) * $itemsPerPage;
        
            $sqlCount = "SELECT COUNT(*) as Total FROM Usuarios";
            $sqlUsuarios = "SELECT * FROM Usuarios LIMIT $startIndex, $itemsPerPage"; // Consulta paginada
        
            $sqlCountResult = $conn->query($sqlCount);
            $sqlUsuariosResult = $conn->query($sqlUsuarios);
        
            if ($sqlCountResult->num_rows > 0) {
                $row = $sqlCountResult->fetch_assoc();
                $totalRows = $row['Total'];
        
                // Calcular el número total de páginas
                $totalPages = ceil($totalRows / $itemsPerPage);
        
                // Devolver el número total de páginas como parte de la respuesta JSON
                $response['total_pages'] = $totalPages;
        
                // Construir un array para almacenar los usuarios
                $usuarios = array();
        
                if ($sqlUsuariosResult->num_rows > 0) {
                    while ($rowUsuario = $sqlUsuariosResult->fetch_assoc()) {
                        $usuarioId = $rowUsuario['Id'];
                        $usuarioConTickets = array(
                            "Id" => $usuarioId,
                            "Usuario" => $rowUsuario['Usuario'],
                            "Contrasena" => $rowUsuario['Contrasena'],
                            "Correo" => $rowUsuario['Correo'],
                            "Nombre_Cliente" => $rowUsuario['Nombre_Cliente'],
                            "Telefono" => $rowUsuario['Telefono'],
                            "Total_Compras" => $rowUsuario['Total_Compras'],
                            "Creditos" => $rowUsuario['Creditos'],
                            "Sub_Admin" => $rowUsuario['Sub_admin'] == 1 ? true : false,
                            "VIP" => $rowUsuario['VIP'] == 1 ? true : false, // Convertir a booleano
                            "tickets" => array()
                        );
        
                        // Agregar el usuario al array de usuarios
                        $usuarios[] = $usuarioConTickets;
                    }
                }
        
                // Agregar el array de usuarios a la respuesta JSON
                //$response['usuarios'] = $usuarios;
        
                // Devolver la respuesta JSON
                echo json_encode(array("usuarios"=>$usuarios,"pages"=>$response['total_pages']));
            } else {
                // Si no se encontraron usuarios
                echo json_encode(array("message" => "No se encontraron usuarios"));
            }
            break;
        case "Add Sub Admin":
            $id = $_GET['Id'] ?? null;
            $usuario = $_GET['Usuario'] ?? null;
            $correo = $_GET['Correo'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $nombrecliente = $_GET['Nombre_Cliente'] ?? null;
            $telefono = $_GET['Telefono'] ?? null;
            
            // Verificar si el usuario o el nombre del cliente ya existen en Sub_Admins
            $checkQuery = "SELECT * FROM Sub_Admins WHERE Usuario='$usuario' OR Nombre='$nombrecliente'";
            $checkResult = $conn->query($checkQuery);
            
            if ($checkResult->num_rows > 0) {
                // Si el usuario o el nombre del cliente ya existen en Sub_Admins, mostrar un mensaje de error
                echo json_encode(array("error" => "El usuario o el nombre del cliente ya están registrados en Sub Admins"));
            } else {
                // Si el usuario y el nombre del cliente no existen en Sub_Admins, proceder con la inserción
                if ($id && $usuario && $correo && $contrasena && $nombrecliente && $telefono) {
                    $sql = "INSERT INTO Sub_Admins (Usuario, Contrasena, Nombre, Telefono, Correo) VALUES ('$usuario','$contrasena','$nombrecliente','$telefono','$correo')";
                    if ($conn->query($sql) === TRUE) {
                        if ($id) {
                            $sql = "DELETE FROM Usuarios WHERE Id=$id";
                            if ($conn->query($sql) === TRUE) {
                                echo json_encode(array("message" => "Usuario agregado correctamente a Sub Admins"));
                            }
                        }
                    } else {
                        echo json_encode(array("error" => "Faltan parámetros"));
                    }
                } else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }
            break;

        case "Update":
            $id = $_GET['Id'] ?? null;
            $usuario = $_GET['Usuario'] ?? null;
            $correo = $_GET['Correo'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $nombrecliente = $_GET['Nombre_Cliente'] ?? null;
            $telefono = $_GET['Telefono'] ?? null;
            $total_compras = $_GET['Total_Compras'] ?? null;
            $creditos = $_GET['Creditos'] ?? null;
            $vip = $_GET ['VIP']?? null;
            $admin = $_GET['admin']??null;
            $id_admin = $_GET['Id_Admin']??null;
            
            
            
            if($admin != 0){
                if ($id && $usuario && $correo && $contrasena && $nombrecliente && $telefono) {
                $sql = "UPDATE Usuarios SET Usuario='$usuario', Correo = '$correo', Contrasena='$contrasena', Nombre_Cliente='$nombrecliente', Telefono='$telefono', Total_Compras= $total_compras,Creditos=$creditos, VIP= $vip WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Usuario actualizado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            }else{
                if ($id && $usuario && $correo && $contrasena && $nombrecliente && $telefono) {
                    
                $sql = "UPDATE Usuarios SET Usuario='$usuario', Correo = '$correo', Contrasena='$contrasena', Nombre_Cliente='$nombrecliente', Telefono='$telefono', Total_Compras= $total_compras,Creditos=$creditos, VIP= $vip WHERE Id=$id";
                if ($conn->query($sql) === TRUE) {
                    $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES 
                                    ($id_admin,'Usuarios',
                                    'Sub admin con id:$id_admin actualizo al usuario con id:$id (usuario: $usuario')";
                    if($conn->query($sql_admin_r) === TRUE){
                        
                        echo json_encode(array("message" => "Usuario actualizado correctamente"));
                    }else{
                        echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                    }
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            }
            break;
        case "Delete":
            $id = $_GET['Id'] ?? null;
            $admin = $_GET['admin']??null;
            $id_admin = $_GET['Id_Admin']??null;
            if($admin != 0){
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
            }else{
                if ($id) {
                $sql = "DELETE FROM Usuarios WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Usuarios','Sub admin con id:$id_admin elimino usuario con id:$id')";
                    if($conn->query($sql_admin_r) === TRUE){
                        echo json_encode(array("message" => "Usuario Eliminado correctamente"));
                    }else{
                        echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                    }
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
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