$(document).ready(function () {
    renderizarHeader();
    renderizarFooter();
    $('input[name="daterange"]').daterangepicker({
        opens: 'left'
    }, function (start, end, label) {
        start.format('YYYY-MM-DD');
        end.format('YYYY-MM-DD');
    });

    $("#rangoFechas, #numero_personas").on("change", function () {
        renderizarHabitaciones();
    });

    $('.precio').on('keypress blur', function (event) {
        if (event.type === 'keypress' && event.which === 13) {
            renderizarHabitaciones();
        } else if (event.type === 'blur') {
            renderizarHabitaciones();
        }
    });

    $('.precio').on('input', function () {
        let input = $(this).val();
        let formattedValue = formatCurrency(input);
        $(this).val(formattedValue);
    });
    renderizarHabitaciones();
});

function formatCurrency(value) {
    value = value.replace(/\D/g, '');
    let number = parseInt(value, 10);
    if (isNaN(number)) return '';
    return '$ ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function validarDatos() {
    var rengoFechas = $("#rangoFechas").val();
    var rengoFechasArray = rengoFechas.split(" - ");
    var fechaInicio = rengoFechasArray[0];
    var fechaFin = rengoFechasArray[1];
    var numero_personas = $("#numero_personas").val();
    var precio_desde = $("#precioDesde").val();
    var precio_hasta = $("#precioHasta").val();

    if (precio_desde != "") {
        let valueDesde = precio_desde.replace(/\D/g, '');
        precio_desde = parseInt(valueDesde, 10);
    }

    if (precio_hasta != "") {
        let valueHasta = precio_hasta.replace(/\D/g, '');
        precio_hasta = parseInt(valueHasta, 10);
    }

    if (precio_desde != "" && precio_hasta != "") {
        if (precio_hasta < precio_desde) {
            $("#precioHasta").val(precio_desde);
            precio_hasta = precio_desde;
        }
    }

    var datos = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        numero_personas: numero_personas,
        precio_desde: precio_desde,
        precio_hasta: precio_hasta
    }
    return datos;
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

function renderizarHabitaciones() {
    var datos = validarDatos();
    $.ajax({
        url: 'Habitaciones_Tarifas.php',
        method: 'POST',
        dataType: 'html',
        data: datos,
        success: function (data) {
            $("#habitaciones_rta").empty();
            var data = JSON.parse(data);
            if (data.data && data.data.length > 0) {
                data.data.forEach(function (habitacion) {
                    var contenido = '<div class="col-sm-6 wowload fadeInUp">' +
                        '<div class="rooms">' +
                        '<img src="' + habitacion.imagen + '" class="img-responsive" alt="Imagen de la habitación">' +
                        '<div class="info">' +
                        '<h3>' + habitacion.nombreh + ' </h3><b><span>Valor: ' + formatCurrency(habitacion.valor) + '</span></b>' +
                        '<p> Descripcion:' + habitacion.descripcion + '</p>' +
                        '<a class="btn btn-default detalles" id_habitacion ="' + habitacion.id_habitacion + '" >Ver habitacion</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $("#habitaciones_rta").append(contenido);
                });
            } else {
                $("#habitaciones_rta").append('<p>No hay habitaciones disponibles en este momento.</p>');
            }

            $('.detalles').off('click').on('click', function () {
                var idHabitacion = $(this).attr('id_habitacion'); // Obtener el ID de la habitación
                mostrarDetallesHabitacion(idHabitacion); // Llamar a la función con el ID
            });
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
            $("#habitaciones_rta").append('<p>Hubo un problema al cargar las habitaciones. Intente de nuevo más tarde.</p>');
        }
    });

}
function mostrarDetallesHabitacion(idHabitacion) {
    // Abre una nueva ventana con la URL y pasa el ID como parámetro
    window.open('detalleHabitacion.html?id=' + idHabitacion, 'Detalles de la Habitación', 'width=800,height=600');
}