<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Establecer la zona horaria a México (Central Standard Time)
date_default_timezone_set('America/Mexico_City');

// Verifica que se haya enviado una solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $servername = "localhost";
    $username = "u826891407_PHMSoft2024";
    $password = "PreciadoHernandezMoranSolis2024";
    $dbname = "u826891407_SpaceentApp";

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Obtiene los datos de la solicitud
    $Nombre = $_POST['Nombre'];
    $Descripcion = $_POST['Descripcion'];
    $Terminos = $_POST['Terminos'];
    $Costo = $_POST['Costo'];
    $Precio = $_POST['Precio'];
    $Precio_VIP = $_POST['Precio_VIP'];
    $id_admin = $_POST['Id_Admin'];
    $admin = $_POST['admin'];
    // Leer el archivo de imagen
    $file = $_FILES['Foto'];
    $filename = $file['name'];
    $filetype = $file['type'];
    $destination = $_SERVER['DOCUMENT_ROOT'] . "/SpaceentApp/Icons/" . $filename;
    $url = "https://$_SERVER[HTTP_HOST]/SpaceentApp/Icons/$filename"; // URL completa de la imagen

    $allowed_types = array("image/jpg", "image/jpeg", "image/png");

    if($admin != 0){
        if (in_array($filetype, $allowed_types)) {
            // Mueve el archivo al directorio de destino
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                // Inserta los datos en la base de datos
                $sql = "INSERT INTO Servicio_Producto (Nombre, Descripcion, Terminos, Costo, Precio, Precio_VIP, Foto) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sssddds", $Nombre, $Descripcion, $Terminos, $Costo, $Precio, $Precio_VIP, $url); // Usamos la URL en lugar del nombre de archivo
                if ($stmt->execute()) {
                    echo json_encode(array("message" => "Servicio agregado correctamente"));
                } else {
                    echo json_encode(array("message" => "Error al agregar el servicio a la base de datos"));
                }
                $stmt->close();
            } else {
                echo json_encode(array("message" => "Error al mover el archivo"));
            }
        } else {
            echo json_encode(array("message" => "Tipo de archivo no permitido"));
        }
    }else{
        if (in_array($filetype, $allowed_types)) {
            // Mueve el archivo al directorio de destino
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                // Inserta los datos en la base de datos
                $sql = "INSERT INTO Servicio_Producto (Nombre, Descripcion, Costo, Precio, Precio_VIP, Foto) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssddds", $Nombre, $Descripcion, $Costo, $Precio, $Precio_VIP, $url); // Usamos la URL en lugar del nombre de archivo
                if ($stmt->execute()) {
                    $sql_admin_r = "INSERT INTO
                                    Sub_Admin_Acciones
                                    (Id_sub_admin, Seccion, Accion)
                                    VALUES ($id_admin,'Servicios','Sub admin con id:$id_admin agrego el Servicio de: $Nombre')";
                    if($conn->query($sql_admin_r) === TRUE){
                        echo json_encode(array("message" => "Servicio agregado correctamente"));
                    }else{
                        echo json_encode(array("message" => "Porfavor ponerse en contacto con el servicio tecnico de SpaceFlix"));
                    }
                } else {
                    echo json_encode(array("message" => "Error al agregar el servicio a la base de datos"));
                }
                $stmt->close();
            } else {
                echo json_encode(array("message" => "Error al mover el archivo"));
            }
        } else {
            echo json_encode(array("message" => "Tipo de archivo no permitido"));
        }
    }

    $conn->close();
} else {
    echo json_encode(array("message" => "Método de solicitud no válido"));
}
?>
