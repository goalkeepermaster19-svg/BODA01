
document.addEventListener("DOMContentLoaded", () => {

    cargarDatos();
    configurarSobre();
    configurarMenu();
    configurarMusica();
    configurarGaleria();
    configurarVideo();
    configurarAlbum();
    configurarFormulario();
    configurarCargaFotosGLAM();
    iniciarCuentaRegresiva();
    generarQR();
    configurarAnimaciones();

    cargarInvitadoGLAM();

});


/* ==========================================
   INVITACIÓN PERSONALIZADA GLAM
========================================== */

window.glamInvitadoActual = null;

function cargarInvitadoGLAM() {

    const parametros = new URLSearchParams(window.location.search);
    const token = parametros.get("token");

    const mensaje = document.getElementById("mensajeRSVP");
    const formulario = document.getElementById("formularioRSVP");

    if (!token) {
        mensaje.textContent = "No se encontró el código de tu invitación.";
        formulario.style.display = "none";
        return;
    }

    if (!DATOS_BODA.rsvpEndpoint) {
        mensaje.textContent = "No se encuentra configurada la conexión GLAM.";
        formulario.style.display = "none";
        return;
    }

    window.glamInvitacionCallback = function(respuesta) {

        if (!respuesta || !respuesta.correcto) {
            mensaje.textContent =
                respuesta?.mensaje || "No se pudo identificar tu invitación.";
            formulario.style.display = "none";
            return;
        }

        window.glamInvitadoActual = respuesta;

        const invitado = respuesta.invitado;

        document.getElementById("nombreInvitado").textContent =
            invitado.nombre;

        const pases = Number(invitado.pasesAsignados || 0);

        document.getElementById("pasesAsignados").textContent = pases;

        const selector = document.getElementById("cantidadPases");

        selector.innerHTML = "";

        for (let i = 1; i <= pases; i++) {
            const opcion = document.createElement("option");
            opcion.value = i;
            opcion.textContent = i === 1 ? "1 persona" : i + " personas";
            selector.appendChild(opcion);
        }

        if (pases < 1) {
            mensaje.textContent = "Esta invitación no tiene pases disponibles.";
            formulario.style.display = "none";
            return;
        }

        if (invitado.estadoRSVP === "CONFIRMADO") {
            mensaje.textContent = "Tu asistencia ya fue registrada.";
        }

        document.getElementById("acompanantes").value =
            invitado.acompanantes || "";

        configurarCantidadAsistencia();

        // CARGAR GALERÍA DESPUÉS DE IDENTIFICAR AL INVITADO
        cargarGaleriaPublicaGLAM();

    };

    const script = document.createElement("script");

    const separador = DATOS_BODA.rsvpEndpoint.includes("?") ? "&" : "?";

    script.src =
        DATOS_BODA.rsvpEndpoint +
        separador +
        "token=" + encodeURIComponent(token) +
        "&callback=glamInvitacionCallback";

    script.onerror = function() {
        mensaje.textContent = "No pudimos conectar con GLAM.";
    };

    document.body.appendChild(script);

}


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
        fecha.toLocaleDateString("es-ES", opciones)
            .toUpperCase()
            .replace(" DE ", " · ")
            .replace(" DE ", " · ");

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

    elemento.href = enlace || "https://www.google.com/maps";

}


/* ITINERARIO */

function cargarItinerario() {

    const contenedor = document.getElementById("listaItinerario");

    contenedor.innerHTML = "";

    DATOS_BODA.itinerario.forEach(evento => {

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

        const diferencia = fechaObjetivo - Date.now();

        if (diferencia <= 0) {

            document.getElementById("contador").innerHTML =
                "<h3>¡Hoy es nuestro gran día!</h3>";

            return;

        }

        document.getElementById("dias").textContent =
            Math.floor(diferencia / 86400000).toString().padStart(2, "0");

        document.getElementById("horas").textContent =
            Math.floor((diferencia / 3600000) % 24).toString().padStart(2, "0");

        document.getElementById("minutos").textContent =
            Math.floor((diferencia / 60000) % 60).toString().padStart(2, "0");

        document.getElementById("segundos").textContent =
            Math.floor((diferencia / 1000) % 60).toString().padStart(2, "0");

    }

    actualizar();

    setInterval(actualizar, 1000);

}


/* GALERÍA ORIGINAL */

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

    seccion.classList.remove("oculto");

}


/* FORMULARIO RSVP */

function configurarFormulario() {

    const formulario = document.getElementById("formularioRSVP");

    formulario.addEventListener("submit", async evento => {

        evento.preventDefault();

        const boton = formulario.querySelector("button");
        const mensaje = document.getElementById("mensajeRSVP");

        const invitado = window.glamInvitadoActual;

        const token = new URLSearchParams(
            window.location.search
        ).get("token");

        if (!invitado || !token) {
            mensaje.textContent = "No se pudo identificar tu invitación.";
            return;
        }

        const asistencia = document.getElementById("asistencia").value;

        if (!asistencia) {
            mensaje.textContent = "Selecciona si podrás acompañarnos.";
            return;
        }

        const cantidadPases = asistencia === "SI"
            ? Number(document.getElementById("cantidadPases").value)
            : 0;

        const acompanantes = asistencia === "SI"
            ? document.getElementById("acompanantes").value.trim()
            : "";

        if (
            asistencia === "SI" &&
            (!cantidadPases ||
            cantidadPases > Number(invitado.invitado.pasesAsignados))
        ) {
            mensaje.textContent =
                "La cantidad de personas supera los pases asignados.";
            return;
        }

        const datos = {
            token: token,
            asistencia: asistencia,
            cantidadPases: cantidadPases,
            acompanantes: acompanantes
        };

        boton.disabled = true;
        boton.textContent = "Enviando confirmación...";

        try {

            await fetch(DATOS_BODA.rsvpEndpoint, {

                method: "POST",
                mode: "no-cors",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify(datos)

            });

            mensaje.textContent =
                "¡Gracias! Tu respuesta fue enviada correctamente.";

            invitado.invitado.estadoRSVP =
                asistencia === "SI" ? "CONFIRMADO" : "NO ASISTIRÁ";

            invitado.invitado.pasesConfirmados = cantidadPases;
            invitado.invitado.acompanantes = acompanantes;

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


/* ANIMACIONES */

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


/* ==========================================
   GLAM - ÁLBUM COLABORATIVO
========================================== */

function configurarCargaFotosGLAM() {

    const selector = document.getElementById("seleccionarFotos");
    const boton = document.getElementById("botonEnviarFotos");
    const vistaPrevia = document.getElementById("vistaPreviaFotos");
    const mensaje = document.getElementById("mensajeFotos");

    if (!selector || !boton || !vistaPrevia || !mensaje) return;

    const token = new URLSearchParams(
        window.location.search
    ).get("token");

    const endpoint = DATOS_BODA.rsvpEndpoint;

    let fotografias = [];

    if (!token || !endpoint) {
        mensaje.textContent = "No se pudo identificar tu invitación.";
        selector.disabled = true;
        return;
    }

    selector.addEventListener("change", () => {

        fotografias = Array.from(selector.files || []);

        vistaPrevia.innerHTML = "";

        if (fotografias.length > 5) {

            mensaje.textContent =
                "Puedes seleccionar hasta 5 fotografías por envío.";

            fotografias = [];
            selector.value = "";
            boton.disabled = true;

            return;
        }

        fotografias.forEach(foto => {

            const imagen = document.createElement("img");

            imagen.src = URL.createObjectURL(foto);
            imagen.style.width = "90px";
            imagen.style.height = "90px";
            imagen.style.objectFit = "cover";
            imagen.style.borderRadius = "10px";
            imagen.style.margin = "5px";

            vistaPrevia.appendChild(imagen);

        });

        boton.disabled = fotografias.length === 0;

        mensaje.textContent =
            fotografias.length + " fotografía(s) seleccionada(s).";

    });

    boton.addEventListener("click", async () => {

        if (!fotografias.length) return;

        boton.disabled = true;
        selector.disabled = true;

        mensaje.textContent = "Preparando fotografías...";

        try {

            for (let i = 0; i < fotografias.length; i++) {

                mensaje.textContent =
                    "Enviando fotografía " +
                    (i + 1) +
                    " de " +
                    fotografias.length +
                    "...";

                const foto = fotografias[i];

                const imagenReducida = await reducirFotoGLAM(foto);

                const base64 = imagenReducida.split(",")[1];

                const datos = {
                    tipo: "subir_foto",
                    token: token,
                    nombreArchivo: foto.name,
                    tipoMime: "image/jpeg",
                    base64: base64
                };

                await fetch(endpoint, {

                    method: "POST",
                    mode: "no-cors",

                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify(datos)

                });

            }

            mensaje.textContent =
                "¡Gracias por compartir tus recuerdos! Hemos enviado tus fotografías.";

            fotografias = [];
            selector.value = "";
            vistaPrevia.innerHTML = "";

        } catch (error) {

            console.error(error);

            mensaje.textContent =
                "No se pudieron enviar las fotografías. Inténtalo nuevamente.";

        }

        selector.disabled = false;
        boton.disabled = true;

    });

}


/* REDUCIR TAMAÑO DE LAS FOTOGRAFÍAS */

function reducirFotoGLAM(archivo) {

    return new Promise((resolve, reject) => {

        const imagen = new Image();
        const lector = new FileReader();

        lector.onload = evento => {

            imagen.onload = () => {

                const maximo = 1600;

                let ancho = imagen.width;
                let alto = imagen.height;

                if (ancho > alto && ancho > maximo) {
                    alto = Math.round(alto * maximo / ancho);
                    ancho = maximo;
                } else if (alto > maximo) {
                    ancho = Math.round(ancho * maximo / alto);
                    alto = maximo;
                }

                const lienzo = document.createElement("canvas");

                lienzo.width = ancho;
                lienzo.height = alto;

                const contexto = lienzo.getContext("2d");

                contexto.drawImage(imagen, 0, 0, ancho, alto);

                resolve(
                    lienzo.toDataURL("image/jpeg", 0.75)
                );

            };

            imagen.onerror = reject;
            imagen.src = evento.target.result;

        };

        lector.onerror = reject;
        lector.readAsDataURL(archivo);

    });

}


/* ==========================================
   GLAM - GALERÍA PÚBLICA DE FOTOGRAFÍAS
========================================== */

function cargarGaleriaPublicaGLAM() {


    console.log("GLAM: iniciando carga de galería");

const contenedor = document.getElementById("galeriaPublicaGLAM");
console.log("GLAM: contenedor encontrado:", !!contenedor);
console.log("GLAM: token:", new URLSearchParams(window.location.search).get("token"));
    const token = new URLSearchParams(
        window.location.search
    ).get("token");

    const endpoint = DATOS_BODA.rsvpEndpoint;

    const contenedor = document.getElementById("galeriaPublicaGLAM");

    if (!token || !endpoint || !contenedor) return;

    contenedor.innerHTML = "<p>Cargando recuerdos...</p>";

    const callback = "glamGaleriaCallback";

    window[callback] = function(respuesta) {

        delete window[callback];

        if (!respuesta || !respuesta.correcto) {

            contenedor.innerHTML =
                "<p>No se pudieron cargar los recuerdos.</p>";

            return;
        }

        const fotografias = respuesta.fotografias || [];

        if (!fotografias.length) {

            contenedor.innerHTML =
                "<p>Pronto aparecerán aquí los recuerdos compartidos.</p>";

            return;
        }

        contenedor.innerHTML = "";

        fotografias.forEach(foto => {

            const imagen = document.createElement("img");

            imagen.src =
                "data:" + foto.tipoMime + ";base64," + foto.base64;

            imagen.alt = foto.nombre || "Recuerdo compartido";
            imagen.className = "foto-publica-glam";

            imagen.addEventListener("click", () => {

                const visor = document.getElementById("visorFotos");
                const ampliada = document.getElementById("imagenAmpliada");

                ampliada.src = imagen.src;
                visor.classList.add("visible");

            });

            contenedor.appendChild(imagen);

        });

    };

    const script = document.createElement("script");

    const separador = endpoint.includes("?") ? "&" : "?";

    script.src =
        endpoint +
        separador +
        "galeria=1" +
        "&token=" + encodeURIComponent(token) +
        "&callback=" + callback;

    script.onerror = function() {

        contenedor.innerHTML =
            "<p>No se pudo conectar con el álbum.</p>";

        delete window[callback];

    };

    document.body.appendChild(script);

}
