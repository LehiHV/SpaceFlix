<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Establecer la zona horaria a México (Central Standard Time)
date_default_timezone_set('America/Mexico_City');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Conexión a la base de datos
    $servername = "localhost";
    $username = "u826891407_PHMSoft2024";
    $password = "PreciadoHernandezMoranSolis2024";
    $dbname = "u826891407_SpaceentApp";
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    $id = $_POST['Id'] ?? null;
    $id_admin = $_POST['Id_Admin']??null;
    $admin = $_POST['admin']??null;
    // Verifica si se seleccionó un archivo y no hay errores
    if($admin != 0){
        if (isset($_FILES['Img']) && $_FILES['Img']['size'] > 0 && $_FILES['Img']['error'] === UPLOAD_ERR_OK) {
        // Leer el archivo de imagen
        $file = $_FILES['Img'];
        $filename = $file['name'];
        $filetype = $file['type'];
        $destination = $_SERVER['DOCUMENT_ROOT'] . "/SpaceentApp/Flyers/" . $filename;

        $allowed_types = array("image/jpg", "image/jpeg", "image/png");

        if (in_array($filetype, $allowed_types)) {
            // Mueve el archivo al directorio de destino
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                // URL completa de la imagen
                $url = "https://$_SERVER[HTTP_HOST]/SpaceentApp/Flyers/$filename";

                $sql = "UPDATE Flyers SET flyer = '$url' WHERE Id = $id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Flyer actualizado correctamente"));
                } else {
                    echo json_encode(array("message" => "Error al actualizar el Flyer: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Error al mover el archivo"));
            }
        } else {
            echo json_encode(array("error" => "Tipo de archivo no permitido"));
        }
    } else {
        // Si no se seleccionó ningún archivo, actualiza el flyer a NULL
        $sql = "UPDATE Flyers SET flyer = NULL WHERE Id = $id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Flyer actualizado correctamente"));
        } else {
            echo json_encode(array("message" => "Error al actualizar el Flyer: " . $conn->error));
        }
    }
    }else{
        if (isset($_FILES['Img']) && $_FILES['Img']['size'] > 0 && $_FILES['Img']['error'] === UPLOAD_ERR_OK) {
        // Leer el archivo de imagen
        $file = $_FILES['Img'];
        $filename = $file['name'];
        $filetype = $file['type'];
        $destination = $_SERVER['DOCUMENT_ROOT'] . "/SpaceentApp/Flyers/" . $filename;

        $allowed_types = array("image/jpg", "image/jpeg", "image/png");

        if (in_array($filetype, $allowed_types)) {
            // Mueve el archivo al directorio de destino
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                // URL completa de la imagen
                $url = "https://$_SERVER[HTTP_HOST]/SpaceentApp/Flyers/$filename";

                $sql = "UPDATE Flyers SET flyer = '$url' WHERE Id = $id";

                if ($conn->query($sql) === TRUE) {
                    $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Excel','Sub admin con id:$id_admin actualizo Flyer numero:$id')";
                    if($conn->query($sql_admin_r) === TRUE){
                        echo json_encode(array("message" => "Flyer actualizado correctamente"));
                    }else{
                        echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                    }
                } else {
                    echo json_encode(array("message" => "Error al actualizar el Flyer: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Error al mover el archivo"));
            }
        } else {
            echo json_encode(array("error" => "Tipo de archivo no permitido"));
        }
    } else {
        // Si no se seleccionó ningún archivo, actualiza el flyer a NULL
        $sql = "UPDATE Flyers SET flyer = NULL WHERE Id = $id";

        if($admin != 0){
            if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Flyer actualizado correctamente"));
        } else {
            echo json_encode(array("message" => "Error al actualizar el Flyer: " . $conn->error));
        }
        }else{
            if ($conn->query($sql) === TRUE) {
                    $sql_admin_r = "INSERT INTO 
                                    Sub_Admin_Acciones 
                                    (Id_sub_admin, Seccion, Accion) 
                                    VALUES ($id_admin,'Excel','Sub admin con id:$id_admin elimino Flyer numero:$id')";
                    if($conn->query($sql_admin_r) === TRUE){
                        echo json_encode(array("message" => "Flyer actualizado correctamente"));
                    }else{
                        echo json_encode(array("message" => "Porfavor contactar con el servicio tecnico de SpaceFlix"));
                    }
                }
            else {
                echo json_encode(array("message" => "Error al actualizar el Flyer: " . $conn->error));
            }
        }
    }
    }

    $conn->close();
} else {
    echo json_encode(array("message" => "Método de solicitud no válido"));
}
?>
