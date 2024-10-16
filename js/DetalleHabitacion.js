let idHabitacion;
let fecha_entrada;
let fecha_salida;
let CARGAR_INFORMACION = 100;
let CARGAR_SERVICIOS = 101;
let REGISTRAR = 102;
let CARGAR_PERSONA = 103;

function spinner(activar) {
    if (activar) {
        $('.spinner').fadeIn();
    } else {
        $('.spinner').fadeOut();
    }
}

$(document).ready(function () {
    $('.carousel').carousel();
    $("#btn-registrar").on("click", function () {
        $("#modalRegistrar").modal("show");
    });

    $('#nextStepBtn').on('click', function () {
        $("#formerStepBtn").removeClass("d-none");
        var $activeTab = $('.nav-pills .nav-link.active');
        var $nextTab = $activeTab.parent().next().find('a.nav-link');
        var activeTabIndex = $('.nav-pills .nav-link').index($activeTab);

        if ($nextTab.length) {
            $nextTab.tab('show');
        }

        if (activeTabIndex + 1 == 2) {
            $(this).addClass("d-none");
            $("#confirmarDatos").removeClass("d-none");
        }
    });

    $('#vencimiento').on('input', function () {
        var valor = $(this).val().replace(/\D/g, '');

        if (valor.length >= 2) {
            valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
        }
        $(this).val(valor);
    });

    $('#vencimiento').on('keydown', function (event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            var valor = $(this).val();
            if (valor.length > 0 && valor[valor.length - 1] === '/') {
                $(this).val(valor.slice(0, -1));
                event.preventDefault();
            }
        }
    });

    $('#formerStepBtn').on('click', function () {
        $("#nextStepBtn").removeClass("d-none");
        $("#confirmarDatos").addClass("d-none");
        var $activeTab = $('.nav-pills .nav-link.active');
        var $prevTab = $activeTab.parent().prev().find('a.nav-link');
        var activeTabIndex = $('.nav-pills .nav-link').index($activeTab);
        if ($prevTab.length) {
            $prevTab.tab('show');
        }
        if (activeTabIndex + 1 == 2) {
            $(this).addClass("d-none");
        }
    });

    $('#pills-step1-tab').on('click', function () {
        $("#formerStepBtn").addClass("d-none");
        $("#confirmarDatos").addClass("d-none");
        $("#nextStepBtn").removeClass("d-none");
    });

    $('#pills-step3-tab').on('click', function () {
        $("#confirmarDatos").removeClass("d-none");
        $("#formerStepBtn").removeClass("d-none");
        $("#nextStepBtn").addClass("d-none");
    });

    $('#pills-step2-tab').on('click', function () {
        $("#confirmarDatos").addClass("d-none");
        $("#nextStepBtn").removeClass("d-none");
        $("#formerStepBtn").removeClass("d-none");
    });

    $('#confirmarDatos').on('click', function () {
        var confirmar = confirm('¿Está seguro de realizar la reserva? Esta acción es irreversible.');
        if (confirmar) {
            registrarDatos();
        }
    });
});

function calcularFechaSalida(fechaEntrada, noches) {
    const [anio, mes, dia] = fechaEntrada.split('-').map(Number);
    const fechaObj = new Date(anio, mes - 1, dia);
    fechaObj.setDate(fechaObj.getDate() + parseInt(noches));
    const nuevoAnio = fechaObj.getFullYear();
    const nuevoMes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const nuevoDia = String(fechaObj.getDate()).padStart(2, '0');

    return `${nuevoAnio}-${nuevoMes}-${nuevoDia}`;
}

function registrarDatos() {
    var nombre = $('#nombre').val();
    var email = $('#email').val();
    var celular = $('#celular').val();
    var numero_tarjeta = $('#tarjeta').val();
    var cvv = $('#cvv').val();
    var valor = $('#valor').val();
    var cantidadNoches = $('#numberInput').val();
    var fechaSalida = calcularFechaSalida(fecha_entrada, cantidadNoches);
    var errores = new Array();
    // Validación de nombre
    if (nombre.trim() == "") {
        errores.push("- Por favor ingrese su nombre.");
    }

    // Validación de email
    var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email.trim() == "") {
        errores.push("- Por favor ingrese su correo electrónico.");
    } else if (!emailRegex.test(email)) {
        errores.push("- El correo electrónico no tiene un formato válido.");
    }

    // Validación de celular
    var celularRegex = /^[0-9]{10}$/; // Acepta solo 10 dígitos
    if (celular.trim() == "") {
        errores.push("- Por favor ingrese su número de celular.");
    } else if (!celularRegex.test(celular)) {
        errores.push("- El número de celular debe tener 10 dígitos.");
    }

    // Validación de número de tarjeta (ejemplo básico)
    if (numero_tarjeta.trim() == "") {
        errores.push("- Por favor ingrese su número de tarjeta.");
    } else if (numero_tarjeta.length < 16 || numero_tarjeta.length > 19) {
        errores.push("- El número de tarjeta debe tener entre 16 y 19 dígitos.");
    }

    // Validación de CVV
    var cvvRegex = /^[0-9]{3,4}$/;
    if (cvv.trim() == "") {
        errores.push("- Por favor ingrese el CVV.");
    } else if (!cvvRegex.test(cvv)) {
        errores.push("- El CVV debe tener 3 o 4 dígitos.");
    }

    if (errores.length > 0) {
        alert("Se han encontrado los siguientes errores:\n\n" + errores.join("\n"));
        return;
    }

    let datos = {
        nombre: nombre,
        email: email,
        celular: celular,
        fecha_entrada: fecha_entrada,
        fechaSalida: fechaSalida,
        idHabitacion: idHabitacion,
//        valor : valor
    }

    spinner("cargando...");
    setTimeout(function () {
        $.ajax({
            url: 'DetalleHabitacion.php',
            method: 'POST',
            dataType: 'html',
            data: {accion: REGISTRAR, datos: JSON.stringify(datos)},
            success: function (data) {
                spinner(false);
                alert('Se ha registrado exxitosamente su reserva. Disfruta tus vacaciones');
            },
            error: function (xhr, status, error) {
                console.log('Error: ' + error);
                alert('Hubo un problema al cargar los servicios. Intente de nuevo más tarde.');
            }
        });
    }, 3000);
}

function calcularDiasYNochesMaximos() {
    const fecha1 = new Date(fecha_entrada);
    const fecha2 = new Date(fecha_salida);

    const diferenciaTiempo = fecha2 - fecha1;
    const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);
    const noches = diferenciaDias;
    return {
        dias: diferenciaDias + 1,
        noches: noches
    };
}
function formatFecha(fecha) {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaObj = new Date(anio, mes - 1, dia);

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const mesTexto = meses[fechaObj.getMonth()];
    const diaTexto = String(fechaObj.getDate()).padStart(2, '0');
    const anioTexto = fechaObj.getFullYear();
    return `${mesTexto} ${diaTexto} de ${anioTexto}`;
}


function verificarDatos() {
    let diasReservados = calcularDiasYNochesMaximos();
    let dias = diasReservados.dias;
    let noches = diasReservados.noches;
    $('#verificar-dias').html(dias + " dias / " + noches + " noches");
    $('#verificar-fecha').html(formatFecha(fecha_entrada));
    $('#numberInput').val(noches);

    $('#increase').click(function () {
        $("#decrease").prop('disabled', false);
        let currentValue = parseInt($('#numberInput').val());
        if (currentValue <= noches) {
            $('#numberInput').val(currentValue + 1);
        }

        if ($('#numberInput').val() == noches) {
            $(this).prop('disabled', true);
        }

        let nochesR = parseInt($('#numberInput').val());
        let diasIncrease = nochesR + 1;
        $('#verificar-dias').html(diasIncrease + " dias / " + nochesR + " noches");
    });

    $('#decrease').click(function () {
        $("#increase").prop('disabled', false);
        let currentValue = parseInt($('#numberInput').val());
        if (currentValue > 1) {
            $('#numberInput').val(currentValue - 1);
        }
        if ($('#numberInput').val() == 1) {
            $(this).prop('disabled', true);
        }

        let nochesR = parseInt($('#numberInput').val());
        let diasIncrease = nochesR + 1;
        $('#verificar-dias').html(diasIncrease + " dias / " + nochesR + " noches");
    });

    $('#nombre').on('blur', function () {
        var valor = $(this).val();
        if (valor.trim() !== '') {
            $('#verificar-nombre').text(valor);
        }
    });

    $('#tipoDocumento').on('change', function () {
        var valor = $(this).val();
        var documento = $("#documento").val();
        if (valor.trim() !== '' && documento != "") {
            var textoSeleccionado = $("#tipoDocumento option:selected").attr("desc");
            $('#verificar-documento').html(textoSeleccionado + " " + documento);
            consultarPersona(valor, documento);
        }
    });

    $('#documento').on('blur', function () {
        var valor = $(this).val();
        var valor_documento = $("#tipoDocumento").val();
        if (valor.trim() !== '' && valor_documento != "") {
            var textoSeleccionado = $("#tipoDocumento option:selected").attr("desc");
            $('#verificar-documento').html(textoSeleccionado + " " + valor);
            consultarPersona(valor_documento, valor);
        }
    });

    $('#email').on('blur', function () {
        var valor = $(this).val();
        if (valor.trim() !== '') {
            $('#verificar-email').text(valor);
        }
    });
    $('#celular').on('blur', function () {
        var valor = $(this).val();
        if (valor.trim() !== '') {
            $('#verificar-telefono').text(valor);
        }
    });
    $('#tarjeta').on('blur', function () {
        var valor = $(this).val();
        if (valor.trim() !== '') {
            $('#verificar-tarjeta').text(valor);
        }
    });
    $('#vencimiento').on('blur', function () {
        var valor = $(this).val();
        if (valor.trim() !== '') {
            $('#verificar-vencimiento').text(valor);
        }
    });
    $('#cvv').on('blur', function () {
        var valor = $(this).val();
        if (valor.trim() !== '') {
            $('#verificar-cvv').text(valor);
        }
    });
}

function consultarPersona(tipo_doc, numero_doc) {
    $.ajax({
        url: 'DetalleHabitacion.php',
        method: 'POST',
        dataType: 'html',
        data: {accion: CARGAR_PERSONA, tipo_doc: tipo_doc, numero_doc: numero_doc},
        success: function (data) {
            var data = JSON.parse(data).data;
            console.log(data);
            console.log(data.length);
            if (data.length > 0) {
//                var valor = "hola";
                $('#documento, #nombre, #email, #celular, #tipoDocumento').attr('disabled', true);
                $('#nombre').val(valor);
                $('#email').val(valor);
                $('#celular').val(valor);
                $('#verificar-nombre').text(valor);
                $('#verificar-telefono').text(valor);
                $('#verificar-email').text(valor);
            }
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.onload = function () {
//    idHabitacion = getQueryParam('id');
//    fecha_entrada = getQueryParam('fecha_entrada');
//    fecha_salida = getQueryParam('fecha_salida');
    idHabitacion = 1;
    fecha_entrada = '2024-02-27';
    fecha_salida = '2024-03-05';
    verificarDatos();
    if (idHabitacion) {
//    cargarServicios();
//        cargarHabitacion();
    } else {
        alert("No se encontró el ID de la habitación en la URL.")
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
            $(data).each(function (i, o) {
                var div = ' <div class="col-sm-6 wowload fadeInUp mb-3"> <div class="servicio-item"> ' +
                        '<input type="checkbox" id="servicio1" class="servicio-checkbox">' +
                        '<label for="servicio1">' +
                        '<div class="servicio-info">' +
                        '<p class="descripcion">' + o.descripcion + '</p>' +
                        '<p class="valor">' + formatCurrency(o.valor) + '</p> </div></label></div></div>';
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
    $.ajax({
        url: 'DetalleHabitacion.php',
        method: 'POST',
        dataType: 'html',
        data: {accion: CARGAR_INFORMACION, id_habitacion: idHabitacion},
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
            $(imagenes).each(function (i, o) {
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
    if (isNaN(number))
        return '';
    return '$ ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}