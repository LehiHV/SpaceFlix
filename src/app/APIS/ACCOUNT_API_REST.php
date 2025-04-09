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
        case "Add":
            $data = json_decode($_GET['data'], true) ?? null;

            if ($data && is_array($data)) {
                // Insertar los datos en la base de datos
                // Suponiendo que tienes una tabla llamada 'tu_tabla' con las columnas apropiadas
                $insertQuery = "INSERT INTO Cuentas (Correo, Contrasena, Fecha_Registro, Servicio, Tipo_de_Cuenta, Valido, Dias_Vigente, Perfiles, PIN) VALUES ";

                foreach ($data as $row) {
                    if (count($row) == 9) { // Verifica que haya 9 elementos en cada fila
                        // Ajusta la fecha y convierte el valor "true" a 1
                        $row[2] = substr($row[2], 0, 10); // Tomar solo los primeros 10 dígitos de la fecha
                        $row[5] = $row[5] === "true" ? 1 : 0; // Convierte "true" a 1, cualquier otro valor a 0

                        $values = implode("','", $row);
                        $insertQuery .= "('" . $values . "'),";
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
            break;
        case "ViewOnlyAccounts":
            $sqlUpdateDiasRestantes = "UPDATE Cuentas 
                               SET Dias_Restantes = GREATEST(DATEDIFF(Fecha_Expiracion, CURRENT_DATE), 0)";
            $conn->query($sqlUpdateDiasRestantes);

            // Obtener el número de página actual
            $currentPage = $_GET['Page'] ?? 1;
            $Option = $_GET['Option'] ?? null;
            // Calcular el índice inicial y la cantidad de registros por página
            $itemsPerPage = 50;
            $startIndex = ($currentPage - 1) * $itemsPerPage;

            switch ($Option) {
                case 0:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                case 1:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Valido = 1
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Valido = 1";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                case 2:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Valido = 0
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Valido = 0";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                case 3:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Valido = 3
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Valido = 3";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                case 4:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Valido = 4
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Valido=4";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
            }

            break;

            // Consulta para obtener las cuentas

        case "View":
            $id = $_GET['Id'] ?? null;

            // Consulta para obtener todos los registros de la tabla Recargas asociados al usuario con el ID proporcionado
            $sqlRecargas = "SELECT * FROM Recargas WHERE Id_Usuario = $id ORDER BY Fecha DESC";
            $resultRecargas = $conn->query($sqlRecargas);

            // Consulta para obtener todas las cuentas asociadas al usuario con el ID proporcionado
            $sqlCuentas = "SELECT T.*, C.Valido, CURRENT_DATE
                           FROM Ticket as T 
                           INNER JOIN Cuentas as C
                           ON T.Id_Cuenta = C.Id
                           WHERE T.Id_Usuario = $id AND T.Dias_Vigentes >= 0
                           ORDER BY T.Fecha_de_Compra DESC";
            $resultCuentas = $conn->query($sqlCuentas);

            if ($resultCuentas->num_rows > 0 || $resultRecargas->num_rows > 0) {
                // Crear un arreglo para almacenar todos los registros (cuentas y recargas)
                $registros = array();

                while ($row = $resultCuentas->fetch_assoc()) {
                    // Verificar si hay otros tickets válidos para la misma cuenta
                    $sqlOtrosTicketsValidos = "SELECT COUNT(*) as validCount 
                                               FROM Ticket 
                                               WHERE Id_Cuenta = " . $row['Id_Cuenta'] . " 
                                               AND Id != " . $row['Id'] . " 
                                               AND Dias_Vigentes >= 0";
                    $resultOtrosTicketsValidos = $conn->query($sqlOtrosTicketsValidos);
                    $otrosTicketsValidos = $resultOtrosTicketsValidos->fetch_assoc();

                    // Agregar la cuenta al arreglo de registros si Dias_Vigentes es mayor que 0
                    if ($row['Dias_Vigentes'] >= 0) {
                        $registros[] = $row;
                    }
                }

                // Verificar si se encontraron registros en la tabla Recargas
                if ($resultRecargas->num_rows > 0) {
                    while ($rowRecarga = $resultRecargas->fetch_assoc()) {
                        // Agregar la recarga al arreglo de registros
                        $registros[] = $rowRecarga;
                    }
                }

                // Ordenar los registros por Fecha y Fecha_de_Compra de manera descendente
                usort($registros, function ($a, $b) {
                    $fechaA = new DateTime($a['Fecha'] ?? $a['Fecha_de_Compra'] ?? '1970-01-01');
                    $fechaB = new DateTime($b['Fecha'] ?? $b['Fecha_de_Compra'] ?? '1970-01-01');

                    if ($fechaA == $fechaB) {
                        return 0;
                    }
                    return ($fechaA < $fechaB) ? 1 : -1;
                });

                // Devolver el arreglo de registros como JSON
                echo json_encode($registros);
            } else {
                echo json_encode(array("message" => "No se encontraron cuentas asociadas con algún ticket"));
            }
            break;


        case "search":
            $nombre = $_GET['Objeto'] ?? null;
            $currentPage = $_GET['Page'] ?? 1; // Obtener el número de página actual
            $option = $_GET['Option'] ?? null;
            // Calcular el índice inicial y la cantidad de registros por página
            $itemsPerPage = 50;
            $startIndex = ($currentPage - 1) * $itemsPerPage;

            switch ($option) {
                case 0:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Correo LIKE '%$nombre%'
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Correo LIKE '%$nombre%'";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                case 1:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Correo LIKE '%$nombre%' && C.Valido = 1
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Correo LIKE '%$nombre%' && Valido = 1 ";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                case 2:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Correo LIKE '%$nombre%' && C.Valido = 0
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Correo LIKE '%$nombre%' && Valido = 0 ";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                case 3:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Correo LIKE '%$nombre%' AND C.Valido =3
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Correo LIKE '%$nombre%' AND Valido =3 ";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                case 4:
                    // Consulta SQL para seleccionar todos los registros de la tabla "Cuentas" con paginación
                    $sql = "SELECT C.*, SP.Foto, SP.Nombre as Servicio, SP.Descripcion as Descripcion
                            FROM Cuentas as C
                            INNER JOIN Servicio_Producto as SP
                            ON C.Tipo_de_Cuenta = SP.Tipo_de_Cuenta
                            WHERE C.Correo LIKE '%$nombre%' AND C.Valido =4
                            ORDER BY Fecha_Registro DESC
                            LIMIT $startIndex, $itemsPerPage"; // Consulta paginada

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        // Crear un array para almacenar los resultados
                        $cuentas = array();

                        // Iterar sobre los resultados y almacenarlos en el array
                        while ($row = $result->fetch_assoc()) {
                            // Modificar el campo "Valido" en cada registro
                            $row['Valido'] = ($row['Valido'] == 1);

                            $cuentas[] = $row;
                        }

                        // Calcular el número total de cuentas
                        $sqlCount = "SELECT COUNT(*) as Total FROM Cuentas WHERE Correo LIKE '%$nombre%' AND Valido =4";
                        $sqlCountResult = $conn->query($sqlCount);
                        $row = $sqlCountResult->fetch_assoc();
                        $totalRows = $row['Total'];

                        // Calcular el número total de páginas
                        $totalPages = ceil($totalRows / $itemsPerPage);

                        // Devolver los registros en formato JSON junto con el número total de páginas como parte de la respuesta
                        echo json_encode(array("cuentas" => $cuentas, "pages" => $totalPages));
                    } else {
                        // Si no se encontraron cuentas
                        echo json_encode(array("message" => "No se encontraron cuentas"));
                    }
                    break;
                default:

                    break;
            }
            break;

        case "Renew":
            $id = $_GET['Id'] ?? null;
            $idusuario = $_GET['Id_Usuario'] ?? null;
            $idservicio = $_GET['Id_Producto_Servicio'] ?? null;
            $idcuenta = $_GET['Id_Cuenta'] ?? null;

            // Suponiendo que $id esté definido anteriormente en tu código

            // Construir la consulta SQL
            $sql = "SELECT * FROM Usuarios WHERE Id = $idusuario";
            $resultado = mysqli_query($conn, $sql);

            if ($resultado) {
                $registro = mysqli_fetch_assoc($resultado);
                if ($registro['VIP'] == 1) {
                    // El usuario es VIP, obtener el precio VIP del servicio/producto
                    $sql_precio_vip = "SELECT Precio_VIP FROM Servicio_Producto WHERE Id = $idservicio";
                } else {
                    // El usuario no es VIP, obtener el precio estándar del servicio/producto
                    $sql_precio_vip = "SELECT Precio FROM Servicio_Producto WHERE Id = $idservicio";
                }
                $resultado_precio_vip = mysqli_query($conn, $sql_precio_vip);

                if ($resultado_precio_vip) {
                    // Obtener el precio del resultado de la consulta
                    $registro_precio_vip = mysqli_fetch_assoc($resultado_precio_vip);
                    if ($registro['VIP'] == 1) {
                        $precio_vip = $registro_precio_vip['Precio_VIP'];
                    } else {
                        $precio_vip = $registro_precio_vip['Precio'];
                    }
                    // Actualizar los créditos del usuario y el total del ticket
                    $sql_cobrar = "UPDATE Usuarios
                                   SET Creditos = Creditos - $precio_vip, Total_Compras = Total_Compras + 1
                                   WHERE Id = $idusuario";
                    $resultado_cobrar = $conn->query($sql_cobrar);
                    if ($resultado_cobrar) {

                        $sql_sumar_total = "UPDATE Ticket AS T
                                            INNER JOIN Servicio_Producto AS SP 
                                            ON T.Id_Producto_Servicio = SP.Id
                                            SET T.Precio = T.Precio + SP.Costo, T.Total = T.Total + $precio_vip
                                            WHERE T.Id = $id";
                        $resultado_sumar_total = $conn->query($sql_sumar_total);
                        if ($resultado_sumar_total) {

                            // Actualizar el ticket
                            // Obtener el valor de Dias_Vigentes de la tabla Cuentas
                            $sql_obtener_dias_vigentes = "SELECT Dias_Vigente FROM Cuentas WHERE Id = $idcuenta";

                            $resultado_dias_vigentes = mysqli_query($conn, $sql_obtener_dias_vigentes);

                            if ($resultado_dias_vigentes) {

                                $fila_dias_vigentes = mysqli_fetch_assoc($resultado_dias_vigentes);
                                $dias_vigentes = $fila_dias_vigentes['Dias_Vigente'];

                                // Verificar si se obtuvo un valor válido para Dias_Vigentes
                                if ($dias_vigentes !== null) {

                                    // Actualizar la tabla Ticket usando el valor obtenido de Dias_Vigentes
                                    $sql_ticket = "UPDATE Ticket
                                                   SET Dias_Vigentes = Dias_Vigentes + $dias_vigentes,
                                                       Fecha_Expiracion = DATE_ADD(Fecha_Expiracion, INTERVAL $dias_vigentes DAY)
                                                   WHERE Id = $id";
                                    $resultado_ticket = mysqli_query($conn, $sql_ticket);

                                    $sql_cuenta = "UPDATE Cuentas
                                                   SET Renovaciones = Renovaciones + 1,
                                                   Valido = 3
                                                   WHERE Id = $idcuenta";
                                    $resultado_cuenta = mysqli_query($conn, $sql_cuenta);
                                    $sql = "SELECT * FROM Usuarios WHERE Id = $idusuario";
                                    $resultado = mysqli_query($conn, $sql);
                                    $registro = mysqli_fetch_assoc($resultado);
                                    if ($resultado_ticket) {
                                        echo json_encode(array("message" => "Cuenta actualizada correctamente", "user" => $registro));
                                    } else {
                                        echo json_encode(array("message" => "Error al actualizar la cuenta"));
                                    }
                                } else {
                                    echo json_encode(array("message" => "No se encontró Dias_Vigentes para la cuenta con Id: $idcuenta"));
                                    exit;
                                }
                            } else {
                                echo json_encode(array("message" => "Error al obtener Dias_Vigentes para la cuenta con Id: $id_cuenta"));
                                exit;
                            }
                        } else {
                            echo json_encode(array("message" => "Error al actualizar el total del ticket"));
                        }
                    } else {
                        echo json_encode(array("message" => "Error al actualizar los créditos del usuario"));
                    }
                } else {
                    echo json_encode(array("message" => "No se pudo obtener el precio del servicio"));
                }
            } else {
                echo json_encode(array("message" => "No se pudo renovar la cuenta, contacta con servicio al cliente"));
            }
            break;
        case "Update":
            $id = $_GET['Id'] ?? null;
            $correo = $_GET['Correo'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $perfiles = $_GET['Perfiles'] ?? null;
            $pin = $_GET['PIN'] ?? null;
            $fechaR = $_GET['Fecha_Registro'] ?? null;
            $fechaE = $_GET['Fecha_Expiracion'] ?? null;
            $diasv = $_GET['Dias_Vigente'] ?? null;
            $diasr = $_GET['Dias_Restantes'] ?? null;
            $renovaciones = $_GET['Renovaciones'] ?? null;
            $tipo = $_GET['Tipo_de_Cuenta'] ?? null;
            $valido = $_GET['Valido'] ?? null;
            $id_admin = $_GET['Id_Admin'] ?? null;
            $admin = $_GET['admin'] ?? null;
            if ($admin != 0) {
                if ($id && $perfiles && $correo && $contrasena  && $tipo) {
                    $sql = "UPDATE Cuentas 
                        SET Correo = '$correo', Contrasena='$contrasena', Perfiles='$perfiles',  PIN=$pin, Dias_Restantes = $diasr, Tipo_de_Cuenta = $tipo,
                            Fecha_Registro=$fechaR, Fecha_Expiracion= $fechaE,Dias_Vigente=$diasv, Renovaciones=$renovaciones, Valido= $valido
                        WHERE Id=$id";

                    if ($conn->query($sql) === TRUE) {
                        echo json_encode(array("message" => "Cuenta actualizada correctamente"));
                    } else {
                        echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                    }
                } else {
                    echo json_encode(array("error" => "Este mensaje no debe aparecer, en caso de aparecer, contactar con soporte tecnico"));
                }
            } else {
                if ($id && $perfiles && $correo && $contrasena  && $tipo) {
                    $sql = "UPDATE Cuentas 
                        SET Correo = '$correo', Contrasena='$contrasena', Perfiles='$perfiles',  PIN=$pin, Dias_Restantes = $diasr, Tipo_de_Cuenta = $tipo,
                            Fecha_Registro=$fechaR, Fecha_Expiracion= $fechaE,Dias_Vigente=$diasv, Renovaciones=$renovaciones, Valido= $valido
                        WHERE Id=$id";

                    if ($conn->query($sql) === TRUE) {
                        $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Cuentas','Sub admin con id:$id_admin actualizo cuenta con id:$id')";
                        if ($conn->query($sql_admin_r) === TRUE) {
                            echo json_encode(array("message" => "Cuenta actualizada correctamente"));
                        } else {
                            echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                        }
                    } else {
                        echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                    }
                } else {
                    echo json_encode(array("error" => "Este mensaje no debe aparecer, en caso de aparecer, contactar con soporte tecnico"));
                }
            }
            break;
        case "Delete":
            $id = $_GET['Id'] ?? null;
            $id_admin = $_GET['Id_Admin'] ?? null;
            $admin = $_GET['admin'] ?? null;

            if ($admin = !0) {
                if ($id) {
                    $sql = "DELETE FROM Cuentas WHERE Id=$id";

                    if ($conn->query($sql) === TRUE) {
                        echo json_encode(array("message" => "Cuenta actualizada correctamente"));
                    } else {
                        echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                    }
                } else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            } else {
                if ($id) {
                    $sql = "DELETE FROM Cuentas WHERE Id=$id";

                    if ($conn->query($sql) === TRUE) {
                        $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Cuentas','Sub admin con id:$id_admin elimino cuenta con id:$id')";
                        if ($conn->query($sql_admin_r) === TRUE) {
                            echo json_encode(array("message" => "Cuenta actualizada correctamente"));
                        } else {
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
