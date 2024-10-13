<?php 
require_once 'conexion.php';
$pdo = conectarBD();

CONST CARGAR_INFORMACION = 100;
CONST CARGAR_SERVICIOS = 101;
CONST REGISTRAR_PERSONA = 102;

$id_habitacion = isset($_POST['id_habitacion']) ? $_POST['id_habitacion'] : null;
$accion = isset($_POST['accion']) ? $_POST['accion'] : null;

switch ($accion) {
    case CARGAR_INFORMACION:
        $sql = 'SELECT * FROM habitacion where id_habitacion = ' . $id_habitacion;
        $stmt = $pdo->query($sql);
        $sqlImagen = 'SELECT * FROM imagen where id_habitacion = ' . $id_habitacion;
        $stmt_img = $pdo->query($sqlImagen);

        $imagenes = array();
        while ($row = $stmt_img->fetch(PDO::FETCH_ASSOC)) {
            $imagenes[] = $row;
        }
        $habitacion = $stmt->fetch(PDO::FETCH_ASSOC); 
        echo json_encode(['data' => $habitacion, 'imagenes'=> $imagenes]);
        break;
    case CARGAR_SERVICIOS:
        $sql = 'SELECT * FROM servicio';
        $stmt = $pdo->query($sql);

        $servicios = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $servicios[] = $row;
        }
        echo json_encode(['data' => $servicios]);
        break;

    case REGISTRAR_PERSONA:
     
        break;

    case 'listar':
        echo "Listando todos los registros.";
        break;

    default:
        echo "Acción no válida.";
        break;
}

?>