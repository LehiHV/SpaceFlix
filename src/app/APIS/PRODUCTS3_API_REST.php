<?php
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization, X-Requested-With');
header('Content-Type: application/json');
require_once "CORS.php";

require_once "MODEL.php";
require_once "RESPONSE.php";
require_once "REQUEST_BODY.php";



class ServicioProductoController {
    private $controllerModel;
    /**
     * @var array|string[]
     */
    private $allowedTypes;

    function __construct() {
        $this->controllerModel = new Model('Servicio_Producto');
        $this->allowedTypes = array("image/jpg", "image/jpeg", "image/png");
    }

    function update() {
        $body = getBody(["Id", "Id_Admin", "admin"]);
        $file = $_FILES['Foto']?? null;
        $filename = $file['name']?? null;
        $filetype = $file['type']?? null;
        $destination = $_SERVER['DOCUMENT_ROOT'] . "/SpaceentApp/Icons/" . $filename;
        $newSP = null;

        if (isset($_FILES['Foto']) && $_FILES['Foto']['size'] > 0) {
            if(in_array($filetype, $this->allowedTypes)) {
                if(move_uploaded_file($file['tmp_name'], $destination)){
                    $body["Foto"] = "https://$_SERVER[HTTP_HOST]/SpaceentApp/Icons/$filename";
                }
            }
        }

        $id_admin = $body["Id_Admin"];
        $is_admin = $body["admin"];
        $id = $body['Id'];
        unset($body["Id_Admin"]);
        unset($body["admin"]);
        unset($body["Id"]);

        $order = $body['Categoria_Orden']?? null;
        if($order){
            $categoriaId = $body["Categoria_Servicio_Id"];
            $needReorder = $this->controllerModel
                ->select(["id"])
                ->where("Categoria_Servicio_Id=$categoriaId AND Categoria_Orden=$order")
                ->run();
            if($needReorder){
                $orderQuery = "UPDATE Servicio_Producto SET Categoria_Orden = Categoria_Orden + 1 WHERE Categoria_Servicio_Id = $categoriaId AND Categoria_Orden >= $order";
                $this->controllerModel->sql($orderQuery)->run();
            }
        }
        $this->controllerModel->update($body)->where("id=$id")->run();

        if(!$is_admin){
            $sql_admin_r = "INSERT INTO Sub_Admin_Acciones (Id_sub_admin, Seccion, Accion) VALUES ($id_admin,'Servicios', 'Sub admin con id: $id_admin, actualizo Producto con id: $id')";
            $this->controllerModel->sql($sql_admin_r)->run();
        }

        response(200, ["message" => "Servicio actualizado correctamente"]);
    }

}


// This section secures the needed params

$controller = new ServicioProductoController();
$controller->update();
