<?php 
require_once 'conexion.php'; // Cambia 'ruta_a_tu_archivo_de_conexion.php' por la ruta correcta
$pdo = conectarBD();

try {
    // Ejemplo de consulta
    $sql = 'SELECT * FROM estado';
    $stmt = $pdo->query($sql);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }

} catch (PDOException $e) {
    echo "Error en la consulta: " . $e->getMessage();
}

?>
