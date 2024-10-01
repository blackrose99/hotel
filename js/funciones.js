$(document).ready(function () {
    console.log("paso");
    $('input[name="daterange"]').daterangepicker({
        opens: 'left'
    }, function (start, end, label) {
        var fechaInicio = start.format('YYYY-MM-DD');
        var fechaFin = end.format('YYYY-MM-DD');

    });
    renderizarHeader();
    renderizarFooter();
    conexion();


});

function conexion() {
    $.ajax({
        url: 'Habitaciones_Tarifas.php',
        method: 'GET',
        dataType: 'html',
        success: function (data) {
//            $('#header').html(data);
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
}

function renderizarHeader() {
    $.ajax({
        url: 'header.html',
        method: 'GET',
        dataType: 'html',
        success: function (data) {
            $('#header').html(data);
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
}

function renderizarFooter() {
    $.ajax({
        url: 'footer.html',
        method: 'GET',
        dataType: 'html',
        success: function (data) {
            $('#footer').html(data);
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
}
