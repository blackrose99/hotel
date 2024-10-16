<?php

require_once 'conexion.php';

//$pdo = conectarBD();

CONST CARGAR_INFORMACION = 100;
CONST CARGAR_SERVICIOS = 101;
CONST REGISTRAR = 102;
CONST CARGAR_PERSONA = 103;

$id_habitacion = isset($_POST['id_habitacion']) ? $_POST['id_habitacion'] : null;
$accion = isset($_POST['accion']) ? $_POST['accion'] : null;
$datos = isset($_POST['datos']) ? $_POST['datos'] : null;
$numero_doc = isset($_POST['numero_doc']) ? $_POST['numero_doc'] : null;
$tipo_doc = isset($_POST['tipo_doc']) ? $_POST['tipo_doc'] : null;

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
        echo json_encode(['data' => $habitacion, 'imagenes' => $imagenes]);
        break;
    case CARGAR_PERSONA:
//        $sql = 'SELECT * FROM persona WHERE numero_documento = :numero_doc AND tipo_documento = :tipo_doc';
//        $stmt = $pdo->prepare($sql);
//
//        $stmt->bindParam(':numero_doc', $numero_doc, PDO::PARAM_STR);
//        $stmt->bindParam(':tipo_doc', $tipo_doc, PDO::PARAM_STR);
//        $stmt->execute();
        $persona = array();
//        $persona = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['data' => $persona]);
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

    case REGISTRAR:
        $datos = json_decode($datos);
        $nombres = $datos->nombre . " " . $datos->apellidos;
        $email = $datos->email;
        $celular = $datos->celular;
        $fecha_entrada = $datos->fecha_entrada;
        $fechaSalida = $datos->fechaSalida;
        $idHabitacion = $datos->idHabitacion;
//        $valor = $datos->valor;
//        insertar persona
        $sql = "SELECT MAX(id_persona) AS max_id_persona FROM persona";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $maxIdPersona = $stmt->fetch(PDO::FETCH_ASSOC)['max_id_persona'] + 1;

        // Insertar en la tabla persona
        $sqlPersona = "INSERT INTO persona (id_persona, nombre, email, celular) VALUES (:id_persona, :nombre, :email, :celular)";
        $stmtPersona = $pdo->prepare($sqlPersona);
        $stmtPersona->execute([
            ':id_persona' => $maxIdPersona,
            ':nombre' => $nombres,
            ':email' => $email,
            ':celular' => $celular
        ]);

        $sql = "SELECT MAX(id_pago) AS max_id_pago FROM pago";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $maxIdPago = $stmt->fetch(PDO::FETCH_ASSOC)['max_id_pago'] + 1;

        // Insertar en la tabla pago
        $sqlPago = "INSERT INTO pago (id_pago, valor, fecha_pago, estado_pago) VALUES (:id_pago, :valor, NOW(), 'verificado')";
        $stmtPago = $pdo->prepare($sqlPago);
        $stmtPago->execute([
            ':id_pago' => $maxIdPago,
//            ':valor' => $valor
        ]);

//        insertar en la tabla reserva
        $sql = "SELECT MAX(id_reserva) AS max_id_reserva FROM reservas";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $maxIdReserva = $stmt->fetch(PDO::FETCH_ASSOC)['max_id_reserva'] + 1;

        // Insertar en la tabla reservas
        $sqlReserva = "INSERT INTO reservas (id_reserva, id_persona, id_habitacion, id_pago, fecha_reserva, fecha_entrada, fecha_salida) 
                   VALUES (:id_reserva, :id_persona, :id_habitacion, :id_pago, NOW(), :fecha_entrada, :fecha_salida)";
        $stmtReserva = $pdo->prepare($sqlReserva);
        $stmtReserva->execute([
            ':id_reserva' => $maxIdReserva,
            ':id_persona' => $maxIdPersona,
            ':id_habitacion' => $idHabitacion,
            ':id_pago' => $maxIdPago,
            ':fecha_entrada' => $fecha_entrada,
            ':fecha_salida' => $fechaSalida
        ]);

        // Confirmar la transacción
        $pdo->commit();

        var_dump($nombre);
        break;

    case 'listar':
        echo "Listando todos los registros.";
        break;

    default:
        echo "Acción no válida.";
        break;
}
?>