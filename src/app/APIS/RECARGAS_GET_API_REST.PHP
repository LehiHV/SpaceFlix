<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

date_default_timezone_set('America/Mexico_City');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $servername = "localhost";
    $username = "u826891407_PHMSoft2024";
    $password = "PreciadoHernandezMoranSolis2024";
    $dbname = "u826891407_SpaceentApp";
    
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        echo json_encode(["error" => "Conexión fallida: " . $conn->connect_error]);
        exit;
    }

    $comando = isset($_GET['comando']) ? $_GET['comando'] : '';

    switch ($comando) {
        case "GetRecargasUser":
            if (isset($_GET['Id_Usuario']) && isset($_GET['fecha_inicio']) && isset($_GET['fecha_fin'])) {
                $id = $_GET['Id_Usuario'];
                $fecha_inicio = $_GET['fecha_inicio'];
                $fecha_fin = $_GET['fecha_fin'];
                
                $sql = "SELECT * FROM Shop_Tickets 
                        WHERE Id_Usuario = $id 
                        AND Fecha_Solicitud_Compra BETWEEN '$fecha_inicio' AND '$fecha_fin'
                        ORDER BY Fecha_Solicitud_Compra DESC"; 
                
                $result = $conn->query($sql);
                $recargas = [];
                
                if ($result && $result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $recargas[] = $row;
                    }
                }
                
                echo json_encode([
                    "status" => "success",
                    "data" => $recargas
                ]);
            } else {
                echo json_encode(["error" => "Faltan parámetros requeridos (Id_Usuario, fecha_inicio, fecha_fin)"]);
            }
            break;
case "GetRecargasAdmin":
    if (isset($_GET['fecha_inicio']) && isset($_GET['fecha_fin'])) {
        $fecha_inicio = $_GET['fecha_inicio'];
        $fecha_fin = $_GET['fecha_fin'];
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $offset = ($page - 1) * $limit;
        
        // Obtener total de registros de recargas aprobadas
        $countSql = "SELECT COUNT(*) as total FROM Shop_Tickets 
                     WHERE Fecha_Aprobacion_Compra BETWEEN '$fecha_inicio' AND '$fecha_fin'
                     AND Fecha_Aprobacion_Compra IS NOT NULL";
        $countResult = $conn->query($countSql);
        $totalRecords = $countResult->fetch_assoc()['total'];
        
        // Obtener registros paginados con información del usuario
        $sql = "SELECT st.*, u.Nombre_Cliente as NombreUsuario 
                FROM Shop_Tickets st 
                LEFT JOIN Usuarios u ON st.Id_Usuario = u.Id 
                WHERE st.Fecha_Solicitud_Compra BETWEEN '$fecha_inicio' AND '$fecha_fin'
                AND st.Fecha_Aprobacion_Compra IS NOT NULL
                ORDER BY st.Fecha_Solicitud_Compra DESC 
                LIMIT $offset, $limit";
        
        $result = $conn->query($sql);
        $recargas = [];
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $recargas[] = $row;
            }
        }
        
        // Calcular estadísticas solo de recargas aprobadas
        $statsSql = "SELECT 
                     COUNT(*) as total_recargas,
                     SUM(Total_Compra) as monto_total,
                     AVG(Total_Compra) as promedio
                     FROM Shop_Tickets
                     WHERE Fecha_Solicitud_Compra BETWEEN '$fecha_inicio' AND '$fecha_fin'
                     AND Fecha_Aprobacion_Compra IS NOT NULL";
        
        $statsResult = $conn->query($statsSql);
        $stats = $statsResult->fetch_assoc();
        
        echo json_encode([
            "status" => "success",
            "data" => [
                "recargas" => $recargas,
                "stats" => $stats,
                "pagination" => [
                    "total" => $totalRecords,
                    "current_page" => $page,
                    "per_page" => $limit,
                    "total_pages" => ceil($totalRecords / $limit)
                ]
            ]
        ]);
    } else {
        echo json_encode(["error" => "Faltan parámetros requeridos (fecha_inicio, fecha_fin)"]);
    }
    break;
        default:
            echo json_encode(["error" => "Comando no válido"]);
            break;
    }
    
    $conn->close();
} else {
    echo json_encode(["error" => "Método no permitido"]);
}