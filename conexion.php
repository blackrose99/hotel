<?php

function conectarBD() {
    $host = '127.0.0.1';
    $port = '5432';
    $dbname = 'complejoturistico';
    $user = 'postgres';
    $password = 'postgres';

    try {
        // Crear la conexión PDO
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        $pdo = new PDO($dsn, $user, $password);

        // Configuraciones adicionales para manejar errores y excepciones
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $pdo;

    } catch (PDOException $e) {
        die("Error en la conexión a la base de datos: " . $e->getMessage());
    }
}

?>
