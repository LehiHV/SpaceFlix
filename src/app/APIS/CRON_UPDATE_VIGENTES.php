<?php
header("Content-type: application/json; charset=utf-8");

$servername = "localhost";
$username = "u826891407_PHMSoft2024";
$password = "PreciadoHernandezMoranSolis2024";
$dbname = "u826891407_SpaceentApp";

// Establecer la zona horaria a México Centro
date_default_timezone_set('America/Mexico_City');

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

try {
    // Primera consulta: Actualizar Dias_Vigentes en la tabla Ticket
    $stmt = $conn->prepare("UPDATE Ticket
        SET Dias_Vigentes = CASE 
            WHEN Fecha_Expiracion >= CURRENT_DATE() 
            THEN DATEDIFF(Fecha_Expiracion, CURRENT_DATE())
            ELSE -DATEDIFF(CURRENT_DATE(), Fecha_Expiracion)
        END;
    ");

    // Ejecutar la primera consulta
    $stmt->execute();

    // Segunda consulta: Actualizar estado Valido en la tabla Cuentas
    $stmt2 = $conn->prepare("UPDATE Cuentas C
        SET Valido = 4
        WHERE C.Id IN (
            SELECT DISTINCT Id_Cuenta
            FROM Ticket T
            WHERE T.Dias_Vigentes <= -1
        )
        AND NOT EXISTS (
            SELECT 1
            FROM Ticket T2
            WHERE T2.Id_Cuenta = C.Id
            AND T2.Dias_Vigentes >= 0
        )
        AND C.Valido NOT IN (1);");

    // Ejecutar la segunda consulta
    $stmt2->execute();

    // Tercera consulta: Actualizar Fecha_Hoy en la tabla Cashback
    $fechaActual = date('Y-m-d'); // Obtener fecha actual en formato MySQL
    
    $stmt3 = $conn->prepare("UPDATE Cashback SET Fecha_Hoy = ?");
    $stmt3->bind_param("s", $fechaActual);

    // Ejecutar la tercera consulta
    if ($stmt3->execute()) {
        // Consulta para verificar la actualización
        $queryVerificar = "SELECT Fecha_Hoy FROM Cashback LIMIT 1";
        $resultado = $conn->query($queryVerificar);
        $fechaActualizada = $resultado->fetch_assoc();

        $response = [
            "status" => "success",
            "message" => "Todas las actualizaciones se realizaron correctamente",
            "fecha_actualizada" => $fechaActualizada['Fecha_Hoy'],
            "fecha_actual" => $fechaActual
        ];
    } else {
        $response = [
            "status" => "error",
            "message" => "Error al actualizar la fecha: " . $conn->error
        ];
    }

} catch (Exception $e) {
    $response = [
        "status" => "error",
        "message" => "Error en la ejecución: " . $e->getMessage()
    ];
}

// Enviar respuesta
echo json_encode($response);

// Cerrar la conexión
$conn->close();
?>