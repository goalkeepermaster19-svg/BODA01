document.addEventListener("DOMContentLoaded", () => {

    cargarDatos();
    configurarSobre();
    configurarMenu();
    configurarMusica();
    configurarGaleria();
    configurarVideo();
    configurarAlbum();
    configurarFormulario();
    iniciarCuentaRegresiva();
    generarQR();
    configurarAnimaciones();

    cargarInvitadoGLAM();

});


/* CARGAR INFORMACIÓN */

function cargarDatos() {

    const nombres = DATOS_BODA.nombres;

    const nombreCompleto = `${nombres.primero} & ${nombres.segundo}`;

    document.getElementById("nombrePortada1").textContent = nombres.primero;
    document.getElementById("nombrePortada2").textContent = nombres.segundo;

    document.getElementById("paseNombres").textContent = nombreCompleto;
    document.getElementById("nombresFinales").textContent = nombreCompleto;

    document.getElementById("textoHistoria").textContent = DATOS_BODA.historia;
    document.getElementById("firmaHistoria").textContent = nombreCompleto;

    const fecha = new Date(DATOS_BODA.fecha);

    const opciones = {
        day: "2-digit",
        month: "long",
        year: "numeric"
    };

    const fechaTexto = fecha.toLocaleDateString("es-ES", opciones);

    document.getElementById("fechaPortada").textContent =
        fecha.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).toUpperCase().replace(" DE ", " · ").replace(" DE ", " · ");

    document.getElementById("diaEvento").textContent =
        fecha.getDate().toString().padStart(2, "0");

    document.getElementById("mesEvento").textContent =
        fecha.toLocaleDateString("es-ES", { month: "long" }).toUpperCase();

    document.getElementById("anioEvento").textContent = fecha.getFullYear();

    document.getElementById("paseFecha").textContent = fechaTexto;

    document.getElementById("fechaFinal").textContent =
        `${fecha.getDate()} · ${fecha.getMonth() + 1} · ${fecha.getFullYear()}`;

    cargarUbicaciones();
    cargarItinerario();
    cargarVestimenta();
    cargarRegalos();

}


/* UBICACIONES */

function cargarUbicaciones() {

    const ceremonia = DATOS_BODA.ceremonia;
    const recepcion = DATOS_BODA.recepcion;

    document.getElementById("nombreCeremonia").textContent = ceremonia.nombre;
    document.getElementById("direccionCeremonia").textContent = ceremonia.direccion;

    document.getElementById("nombreRecepcion").textContent = recepcion.nombre;
    document.getElementById("direccionRecepcion").textContent = recepcion.direccion;

    configurarEnlaceMapa("mapaCeremonia", ceremonia.mapa);
    configurarEnlaceMapa("mapaRecepcion", recepcion.mapa);

}

function configurarEnlaceMapa(id, enlace) {

    const elemento = document.getElementById(id);

    if (enlace) {
        elemento.href = enlace;
    } else {
        elemento.href = "https://www.google.com/maps";
    }

}


/* ITINERARIO */

function cargarItinerario() {

    const contenedor = document.getElementById("listaItinerario");

    contenedor.innerHTML = "";

    DATOS_BODA.itinerario.forEach((evento, indice) => {

        const elemento = document.createElement("div");

        elemento.className = "evento-itinerario revelar";

        elemento.innerHTML = `
            <div class="evento-hora">${evento.hora}</div>
            <div class="evento-punto"></div>
            <div class="evento-descripcion">
                <h3>${evento.titulo}</h3>
                <p>${evento.descripcion}</p>
            </div>
        `;

        contenedor.appendChild(elemento);

    });

}


/* VESTIMENTA */

function cargarVestimenta() {

    document.getElementById("vestimentaTitulo").textContent =
        DATOS_BODA.vestimenta.titulo;

    document.getElementById("vestimentaTexto").textContent =
        DATOS_BODA.vestimenta.descripcion;

    const contenedor = document.getElementById("paletaColores");

    contenedor.innerHTML = "";

    DATOS_BODA.vestimenta.colores.forEach(color => {

        const muestra = document.createElement("span");

        muestra.className = "color-muestra";
        muestra.style.backgroundColor = color;

        contenedor.appendChild(muestra);

    });

}


/* REGALOS */

function cargarRegalos() {

    const contenedor = document.getElementById("listaRegalos");

    contenedor.innerHTML = "";

    DATOS_BODA.regalos.forEach(regalo => {

        const elemento = document.createElement("article");

        elemento.className = "regalo-item";

        elemento.innerHTML = `
            <h3>${regalo.titulo}</h3>
            <p>${regalo.descripcion}</p>
            ${
                regalo.enlace
                    ? `<a href="${regalo.enlace}" target="_blank">Ver información ↗</a>`
                    : ""
            }
        `;

        contenedor.appendChild(elemento);

    });

}


/* SOBRE */

function configurarSobre() {

    const boton = document.getElementById("botonAbrir");
    const sobre = document.getElementById("sobreInicial");
    const invitacion = document.getElementById("invitacion");

    boton.addEventListener("click", () => {

        sobre.classList.add("cerrado");

        setTimeout(() => {

            sobre.style.display = "none";
            invitacion.classList.remove("oculto");

            document.body.style.overflow = "auto";

            configurarAnimaciones();

        }, 900);

    });

    document.body.style.overflow = "hidden";

}


/* MENÚ */

function configurarMenu() {

    const menu = document.getElementById("menuLateral");
    const fondo = document.getElementById("fondoMenu");

    document.getElementById("botonMenu").addEventListener("click", abrirMenu);
    document.getElementById("cerrarMenu").addEventListener("click", cerrarMenu);
    fondo.addEventListener("click", cerrarMenu);

    document.querySelectorAll(".menu-lateral a").forEach(enlace => {

        enlace.addEventListener("click", cerrarMenu);

    });

    function abrirMenu() {
        menu.classList.add("abierto");
        fondo.classList.add("visible");
    }

    function cerrarMenu() {
        menu.classList.remove("abierto");
        fondo.classList.remove("visible");
    }

}


/* MÚSICA */

function configurarMusica() {

    const musica = document.getElementById("musica");
    const boton = document.getElementById("botonMusica");

    let reproduciendo = false;

    boton.addEventListener("click", async () => {

        if (!reproduciendo) {

            try {

                await musica.play();

                reproduciendo = true;
                boton.textContent = "♫";
                boton.classList.add("activo");

            } catch (error) {

                alert("No se pudo reproducir la música. Comprueba que exista el archivo recursos/musica.mp3.");

            }

        } else {

            musica.pause();

            reproduciendo = false;
            boton.textContent = "♪";
            boton.classList.remove("activo");

        }

    });

}


/* CUENTA REGRESIVA */

function iniciarCuentaRegresiva() {

    const fechaObjetivo = new Date(DATOS_BODA.fecha).getTime();

    function actualizar() {

        const ahora = Date.now();
        const diferencia = fechaObjetivo - ahora;

        if (diferencia <= 0) {

            document.getElementById("contador").innerHTML =
                "<h3>¡Hoy es nuestro gran día!</h3>";

            return;

        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
        const segundos = Math.floor((diferencia / 1000) % 60);

        document.getElementById("dias").textContent = dias.toString().padStart(2, "0");
        document.getElementById("horas").textContent = horas.toString().padStart(2, "0");
        document.getElementById("minutos").textContent = minutos.toString().padStart(2, "0");
        document.getElementById("segundos").textContent = segundos.toString().padStart(2, "0");

    }

    actualizar();

    setInterval(actualizar, 1000);

}


/* GALERÍA */

function configurarGaleria() {

    const visor = document.getElementById("visorFotos");
    const imagenAmpliada = document.getElementById("imagenAmpliada");

    document.querySelectorAll(".foto-galeria").forEach(foto => {

        foto.addEventListener("click", () => {

            imagenAmpliada.src = foto.dataset.imagen;

            visor.classList.add("visible");

        });

    });

    document.getElementById("cerrarVisor").addEventListener("click", cerrarVisor);

    visor.addEventListener("click", evento => {

        if (evento.target === visor) {
            cerrarVisor();
        }

    });

    function cerrarVisor() {
        visor.classList.remove("visible");
    }

}


/* VIDEO */

function configurarVideo() {

    if (!DATOS_BODA.videoUrl) return;

    const contenedor = document.getElementById("videoContenedor");

    contenedor.innerHTML = `
        <iframe
            src="${DATOS_BODA.videoUrl}"
            title="Nuestro video"
            allowfullscreen>
        </iframe>
    `;

}


/* ÁLBUM */

function configurarAlbum() {

    const seccion = document.getElementById("albumSeccion");
    const enlace = document.getElementById("enlaceAlbum");

    if (!DATOS_BODA.albumUrl) {

        seccion.classList.add("oculto");

        return;

    }

    enlace.href = DATOS_BODA.albumUrl;

}


/* FORMULARIO RSVP */

function configurarFormulario() {

    const formulario = document.getElementById("formularioRSVP");

    formulario.addEventListener("submit", async evento => {

        evento.preventDefault();

        const boton = formulario.querySelector("button");
        const mensaje = document.getElementById("mensajeRSVP");

        const datos = {

            nombre: document.getElementById("nombreInvitado").value.trim(),

            asistencia: document.getElementById("asistencia").value,

            acompanantes: document.getElementById("cantidadAcompanantes").value,

            mensaje: document.getElementById("mensajeInvitado").value.trim(),

            codigo: DATOS_BODA.codigoInvitacion,

            fechaRegistro: new Date().toISOString()

        };

        if (!datos.nombre || !datos.asistencia) {

            mensaje.textContent = "Completa los campos obligatorios.";
            return;

        }

        boton.disabled = true;
        boton.textContent = "Enviando confirmación...";

        try {

            if (DATOS_BODA.rsvpEndpoint) {

                await fetch(DATOS_BODA.rsvpEndpoint, {

                    method: "POST",

                    mode: "no-cors",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(datos)

                });

                mensaje.textContent =
                    "¡Gracias! Tu respuesta ha sido enviada.";

            } else {

                const respuestas = JSON.parse(
                    localStorage.getItem("respuestasBoda") || "[]"
                );

                respuestas.push(datos);

                localStorage.setItem(
                    "respuestasBoda",
                    JSON.stringify(respuestas)
                );

                mensaje.textContent =
                    "¡Gracias! Tu respuesta quedó registrada en este dispositivo. La confirmación en línea aún no está conectada.";

            }

            formulario.reset();

        } catch (error) {

            mensaje.textContent =
                "No pudimos enviar tu respuesta. Inténtalo nuevamente.";

        }

        boton.disabled = false;
        boton.innerHTML = 'Confirmar asistencia <span>♥</span>';

    });

}


/* CÓDIGO QR */

function generarQR() {

    const contenedor = document.getElementById("codigoQR");

    if (typeof QRCode === "undefined") {

        contenedor.textContent = DATOS_BODA.codigoInvitacion;

        return;

    }

    new QRCode(contenedor, {

        text: DATOS_BODA.codigoInvitacion,

        width: 150,

        height: 150,

        colorDark: "#625144",

        colorLight: "#ffffff",

        correctLevel: QRCode.CorrectLevel.H

    });

}


/* ANIMACIONES DE APARICIÓN */

function configurarAnimaciones() {

    const elementos = document.querySelectorAll(
        ".seccion, .evento-itinerario, .ubicacion-tarjeta, .regalo-item"
    );

    elementos.forEach(elemento => {

        elemento.classList.add("revelar");

    });

    const observador = new IntersectionObserver((entradas, observer) => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visible");

                observer.unobserve(entrada.target);

            }

        });

    }, {
        threshold: 0.12
    });

    elementos.forEach(elemento => {

        observador.observe(elemento);

    });

}
