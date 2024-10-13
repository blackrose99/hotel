let idHabitacion;
let fecha_entrada;
let fecha_salida;
let CARGAR_INFORMACION = 100;
let CARGAR_SERVICIOS = 101;
let REGISTRAR_PERSONA = 102;

$(document).ready(function () {
    $('.carousel').carousel()
    cargarServicios();
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.onload = function() {
    idHabitacion = getQueryParam('id');
    fecha_entrada = getQueryParam('fecha_entrada');
    fecha_salida = getQueryParam('fecha_salida');

    if (idHabitacion) {
        cargarHabitacion();
    } else {
        alert.error("No se encontró el ID de la habitación en la URL.")
        console.error("No se encontró el ID de la habitación en la URL.");
    }
};

function cargarServicios() {
    $.ajax({
        url: 'DetalleHabitacion.php',
        method: 'POST',
        dataType: 'html',
        data: {accion: CARGAR_SERVICIOS},
        success: function (data) {
            var data = JSON.parse(data).data;
            $(data).each(function(i, o) {
                var div = ' <div class="servicio-item"> ' +
                '<input type="checkbox" id="servicio1" class="servicio-checkbox">' +
                '<label for="servicio1">' +
                '<div class="servicio-info">'+
                '<p class="descripcion">'+o.descripcion+'</p>'+
                '<p class="valor">' + formatCurrency(o.valor) +'</p> </div></label></div>';
                $('#servicios').append(div);
            });
           
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
           alert('<p>Hubo un problema al cargar los servicios. Intente de nuevo más tarde.</p>');
        }
    });
}

function cargarHabitacion() {
    console.log(idHabitacion)
    $.ajax({
        url: 'DetalleHabitacion.php',
        method: 'POST',
        dataType: 'html',
        data: {accion: CARGAR_INFORMACION, id_habitacion:idHabitacion},
        success: function (data) {
            var data = JSON.parse(data);
            var valor = data.data.valor;
            var descripcion = data.data.descripcion;
            var nombre = data.data.nombre;
            var numero_banos = data.data.numero_baños;
            var numero_camas = data.data.numero_camas;
            var capacidad = data.data.capacidad;

            $('#imagenes').empty();
            var imagenes = data.imagenes;
            $(imagenes).each(function(i, o) {
                var isActive = (i === 0) ? ' active' : '';
                var imagenes = '<div class="carousel-item' + isActive + '"><img class="d-block w-100" src="' + o.nombre + '" alt="Slide ' + (i + 1) + '"></div>';
                $('#imagenes').append(imagenes);
            });

            var cardContent = `
            <p><b>  Descripción: </b>${descripcion}</p>
            <p><b>  Valor por noche:</b> ${formatCurrency(valor)}</p>
            <p><b>  Capacidad: </b>${capacidad} personas</p>
            <p><b>  Número de camas: </b> ${numero_camas}</p>
            <p><b>  Número de baños: </b> ${numero_banos}</p>`;
            $('#nombreInmueble').html(nombre);
            $('#informacion').html(cardContent);
         
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
           alert('<p>Hubo un problema al cargar los servicios. Intente de nuevo más tarde.</p>');
        }
    });

}

function formatCurrency(value) {
    value = value.replace(/\D/g, '');
    let number = parseInt(value, 10);
    if (isNaN(number)) return '';
    return '$ ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}