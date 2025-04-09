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

    switch ($comando) {
        case "ViewFlyers":
            $sqlSelect = "SELECT * 
                          FROM Flyers";
            $resultSelect = $conn->query($sqlSelect);
            if ($resultSelect->num_rows > 0) {
                $flyers = array();
                while ($row = $resultSelect->fetch_assoc()) {

                    $flyers[] = $row;
                }
                echo json_encode($flyers);
            }
            else {
                echo json_encode(array("message" => "No se encontraron flyers"));
            }
            break;
        case "View":
            // Verificar si el usuario es VIP
            $userIsVIP = ($_GET['User'] == 1); // Suponiendo que 1 representa un usuario VIP

            // Realizar la consulta para obtener las cantidades válidas por Id
            $sqlCantidadValidas = "SELECT SP.Id, COUNT(*) as Cuentas_Validas
                                    FROM Servicio_Producto as SP
                                    INNER JOIN Cuentas as C
                                    ON SP.Tipo_de_Cuenta = C.Tipo_de_Cuenta
                                    WHERE C.Valido = true
                                    GROUP BY SP.Id";
            $resultCantidadValidas = $conn->query($sqlCantidadValidas);

            $cantidadValidas = array();
            if ($resultCantidadValidas->num_rows > 0) {
                while ($row = $resultCantidadValidas->fetch_assoc()) {
                    $cantidadValidas[$row['Id']] = $row['Cuentas_Validas']; // Almacenar cantidades válidas por Id
                }
            }

            // Realizar la consulta para obtener todos los registros de Servicio_Producto
            $sqlSelect = "SELECT 
                            SP.*
                          FROM Servicio_Producto_View SP";
            $resultSelect = $conn->query($sqlSelect);

            if ($resultSelect->num_rows > 0) {
                $productos = array();
                while ($row = $resultSelect->fetch_assoc()) {
                    // Verificar si existe la cantidad válida para ese Id
                    $row['Cantidad'] = isset($cantidadValidas[$row['Id']]) ? $cantidadValidas[$row['Id']] : 0;

                    // Si el usuario es VIP, ajustar el precio
                    if ($userIsVIP && $row['Precio_VIP'] !== null) {
                        $row['Precio'] = $row['Precio_VIP'];
                    }

                    $productos[] = $row; // Agregar cada producto a la lista de productos
                }
                echo json_encode($productos);

                // Actualizar Cantidad con UPDATE
                foreach ($productos as $producto) {
                    $sqlUpdate = "UPDATE Servicio_Producto 
                                  SET Cantidad = " . $producto['Cantidad'] . " WHERE Id = " . $producto['Id'];
                    $conn->query($sqlUpdate);
                }
            } else {
                echo json_encode(array("message" => "No se encontraron productos"));
            }
            break;
        case "ViewOnlyProducts":
            // Obtener el ID del usuario desde el parámetro GET
            $userId = isset($_GET['Id']) ? (int)$_GET['Id'] : 0;

            // Verificar si el usuario es VIP
            $sqlCheckVIP = "SELECT VIP FROM Usuarios WHERE Id = ?";
            $stmt = $conn->prepare($sqlCheckVIP);
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $resultCheckVIP = $stmt->get_result();
            $userIsVIP = false;

            if ($resultCheckVIP->num_rows > 0) {
                $rowVIP = $resultCheckVIP->fetch_assoc();
                $userIsVIP = $rowVIP['VIP'] == 1;
            }

            // Realizar la consulta para obtener todos los registros de Servicio_Producto
            $sqlSelect = "SELECT SP.Id, SP.Nombre, SP.Descripcion, SP.Costo, SP.Precio, SP.Cantidad, SP.Tipo, SP.Tipo_de_Cuenta, SP.Precio_VIP, SP.Foto
                              FROM Servicio_Producto SP";
            $resultSelect = $conn->query($sqlSelect);

            if ($resultSelect->num_rows > 0) {
                $productos = array();
                while ($row = $resultSelect->fetch_assoc()) {
                    // Si el usuario es VIP, ajustar el precio
                    if ($userIsVIP && $row['Precio_VIP'] !== null) {
                        $row['Precio'] = $row['Precio_VIP'];
                    }

                    // Agregar el producto a la lista de productos
                    $productos[] = $row;
                }
                echo json_encode($productos);
            } else {
                echo json_encode(array("message" => "No se encontraron productos"));
            }
            break;
        case "Update":
            $id = $_GET['Id'] ?? null;
            $nombre = $_GET['Nombre'] ?? null;
            $descripcion = $_GET['Descripcion'] ?? null;
            $preciocosto = $_GET['Costo'] ?? null;
            $precioventa = $_GET['Precio'] ?? null;
            $preciovip = $_GET['Precio_VIP'] ?? null;
            $tipo = $_GET['Tipo'] ?? null;
            $tipocuenta = $_GET['Tipo_de_Cuenta'] ?? null;
            $Foto_BLOB = file_get_contents($_FILES['Foto']['tmp_name']);
            $Foto_BLOB = mysqli_real_escape_string($conn, $Foto_BLOB);
            $admin = $_GET['admin']??null;
            $id_admin = $_GET['Id_Admin']??null;
            if($admin !=0){
                if ($nombre && $descripcion && $cantidad && $preciocosto && $precioventa) {
                    $sql = "UPDATE Servicio_Producto SET 
                        Nombre='$nombre', Descripcion='$descripcion', Costo=$preciocosto, Venta=$precioventa,
                        Precio_VIP=$preciovip, Tipo='$tipo',Tipo_de_Cuenta=$tipocuenta, Foto = '$Foto_BLOB'
                        WHERE Id=$id";

                    if ($conn->query($sql) === TRUE) {
                        echo json_encode(array("message" => "Producto actualizado correctamente"));
                    } else {
                        echo json_encode(array("error" => "Error al actualizar producto: " . $conn->error));
                    }
                } else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }else{
                if ($nombre && $descripcion && $cantidad && $preciocosto && $precioventa) {
                    $sql = "UPDATE Servicio_Producto SET 
                        Nombre='$nombre', Descripcion='$descripcion', Costo=$preciocosto, Venta=$precioventa,
                        Precio_VIP=$preciovip, Tipo='$tipo',Tipo_de_Cuenta=$tipocuenta, Foto = '$Foto_BLOB'
                        WHERE Id=$id";

                    if ($conn->query($sql) === TRUE) {
                        $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Servicios','Servicio: $nombre Actualizado con: \n 
                                    Nombre: $nombre \n
                                    Descripcion: $descripcion \n
                                    Costo: $preciocosto \n
                                    Venta: $precioventa \n
                                    Precio_VIP: $preciovip \n
                                    Tipo: $tipo \n
                                    Tipo_de_Cuenta: $tipocuenta \n'
                                    Foto: $Foto_BLOB \n)'";
                        if($conn->query($sql_admin_r) === TRUE){
                            echo json_encode(array("message" => "Producto actualizado correctamente"));
                        }else{
                            echo json_encode(array("message"=>"Porfavor contactar con el servicio tecnico de SpaceFlix"));
                        }
                    } else {
                        echo json_encode(array("error" => "Error al actualizar producto: " . $conn->error));
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
            if($admin!=0){
                if ($id) {
                    $sql = "DELETE FROM Servicio_Producto WHERE Id=$id";

                    if ($conn->query($sql) === TRUE) {
                        echo json_encode(array("message" => "Producto Eliminado correctamente"));
                    } else {
                        echo json_encode(array("error" => "Error al eliminar producto: " . $conn->error));
                    }
                } else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }else{
                if ($id) {
                    $sql = "DELETE FROM Servicio_Producto WHERE Id=$id";

                    if ($conn->query($sql) === TRUE) {
                        $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Servicios','Servicio eliminado con id:$id por Sub Admin con Id: $id_admin')";
                        if($conn->query($sql_admin_r) === TRUE){
                            echo json_encode(array("message" => "Producto Eliminado correctamente"));
                        }else{
                            echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                        }
                    } else {
                        echo json_encode(array("error" => "Error al eliminar producto: " . $conn->error));
                    }
                } else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }
            break;
        case "Cashback":
            $sql  = "SELECT Cashback
                     FROM Cashback
                     WHERE Id = 1";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                echo json_encode($row['Cashback']);
            }
            break;
        case "LoadCashback":
            $NC = $_GET['NC'] ?? null;
            $id_admin = $_GET['Id_Admin']??null;
            $admin = $_GET['admin']??null;
            if($admin!=0){
                if ($NC) {
                    $sql = "UPDATE Cashback 
                    SET Cashback = $NC
                    WHERE Id = 1";

                    if ($conn->query($sql) === TRUE) {
                        echo json_encode(array("message" => "Cashback actualizada correctamente"));
                    } else {
                        echo json_encode(array("error" => "Error al actualizar el cashback: " . $conn->error));
                    }
                } else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }else{
                if ($NC) {
                    $sql = "UPDATE Cashback 
                    SET Cashback = $NC
                    WHERE Id = 1";

                    if ($conn->query($sql) === TRUE) {
                        $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Excel','Sub admin con id:$id_admin actualizo el Cashback a:$NC')";
                        if($conn->query($sql_admin_r) === TRUE){
                            echo json_encode(array("message" => "Cashback actualizada correctamente"));
                        }else{
                            echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                        }
                    } else {
                        echo json_encode(array("error" => "Error al actualizar el cashback: " . $conn->error));
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
