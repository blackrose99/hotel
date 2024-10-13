<?php 
require_once 'conexion.php';
$pdo = conectarBD();
$condiciones = array();
$fechaInicio = isset($_POST['fechaInicio']) ? $_POST['fechaInicio'] : null;
$fechaFin = isset($_POST['fechaFin']) ? $_POST['fechaFin'] : null;
$numero_personas = isset($_POST['numero_personas']) ? $_POST['numero_personas'] : null;
$precio_desde = isset($_POST['precio_desde']) ? $_POST['precio_desde'] : null;
$precio_hasta = isset($_POST['precio_hasta']) ? $_POST['precio_hasta'] : null;
$condiciones = [];
$params = [];

if ($fechaInicio != "" && $fechaFin != "") {
    $condiciones[] = "h.id_habitacion NOT IN (
        SELECT id_habitacion 
        FROM reserva 
        WHERE fecha_entrada < :fechaFin AND fecha_salida > :fechaInicio
    )";
    $params[':fechaInicio'] = $fechaInicio;
    $params[':fechaFin'] = $fechaFin;
}

if ($numero_personas != "") {
    $condiciones[] = "capacidad = :numero_personas";
    $params[':numero_personas'] = $numero_personas;
}

if ($precio_desde != "") {
    $condiciones[] = "valor >= :precio_desde";
    $params[':precio_desde'] = $precio_desde;
}

if ($precio_hasta != "") {
    $condiciones[] = "valor <= :precio_hasta";
    $params[':precio_hasta'] = $precio_hasta;
}

$where = count($condiciones) > 0 ? " WHERE " . implode(" AND ", $condiciones) : "";

try {
    $sql = 'SELECT h.id_habitacion, h.descripcion, h.valor, (select nombre from imagen where id_habitacion = h.id_habitacion limit 1) AS imagen, h.capacidad, h.nombre as nombreh
            FROM habitacion h
            LEFT JOIN reserva USING(id_habitacion) ' . $where;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $habitaciones = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $habitaciones[] = $row;
    }

} catch (PDOException $e) {
    echo json_encode(['error' => "Error en la consulta: " . $e->getMessage()]);
    exit;
}
echo json_encode(['data' => $habitaciones]);
?>
