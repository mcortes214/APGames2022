/*

el juego tiene pantallas, y niveles.

Primero uno empieza en la pantalla de título.
Después, en la pantalla de introducción.
Después, en la pantalla de juego.

Las pantallas tienen botones para navegar entre ellas.

    Dentro de la pantalla de juego, hay niveles:
    - Primer día
    - Segundo día
    - Tercer día
Si uno pierde en medio de un nivel, vuelve al principio



*/

//---- Módulo Pantallas

function cargarPantalla(idPantalla) {
    const claseActiva = 'pantalla--activa';
    const pantallas = document.querySelectorAll('.pantalla');
    const nuevaPantalla = document.querySelector(`.pantalla[data-pantalla="${idPantalla}"]`);

    pantallas.forEach((pantalla) => {
        pantalla.classList.remove(claseActiva);
    });
    nuevaPantalla.classList.add(claseActiva);
}




//---- Módulo Necesidades y medidores

const necesidades = {
    'estres': {
        nivel: 0,
        elemento: document.querySelector('#medidor-estres'),
        saturacion: 0,
    },
    'hambre': {
        nivel: 0,
        elemento: document.querySelector('#medidor-hambre'),
        saturacion: 0,
    },
    'vejiga': {
        nivel: 0,
        elemento: document.querySelector('#medidor-vejiga'),
        saturacion: 0,
    },
}

function resetearNecesidades() {
    for (let necesidad in necesidades) {
        establecerValorNecesidad(necesidad, 0);
    }
}

function establecerValorNecesidad(nombre, nivel) {
    necesidades[nombre].nivel = nivel;
    necesidades[nombre].elemento.value = nivel;
}

function incrementarNecesidad(nombre, cantidad) {
    establecerValorNecesidad(nombre, necesidades[nombre].nivel + cantidad);
}

function reducirNecesidad(nombre, cantidad) {
    establecerValorNecesidad(nombre, necesidades[nombre].nivel - cantidad);
}

function saturarNecesidad(opciones) {
    const {nombre, horas} = opciones;
    necesidades[nombre].saturacion = horas;
}

function acumularNecesidad(nombre, cantidad) {
    if (necesidades[nombre].saturacion <= 0){
        incrementarNecesidad(nombre, cantidad);
    }
}

function reducirSaturacionNecesidad(nombre, cantidad) {
    necesidades[nombre].saturacion -= cantidad;
    if (necesidades[nombre].saturacion < 0) {
        necesidades[nombre].saturacion = 0;
    }
}



//----- Módulo Animación

let animationPlaying = false;

const capas = {
    'personaje': document.querySelector('.capa-animacion-personaje'),
    'monitor': document.querySelector('.capa-animacion-monitor'),
    'ventana': document.querySelector('.capa-animacion-ventana'),
}

const animaciones = {
    //duración 0: no vuelve a "trabajando", queda hasta que la cambie
    //para simplificar: crear archivos de audio y de animación incl silencios
    'trabajando': {
        archivo: 'anim/animacion-trabajando.gif',
    },
    'quieto': {
        archivo: 'anim/animacion-quieto.gif',
    },
    'telefono': {
        archivo: 'anim/animacion-telefono.gif',
    },
    'ida': {
        archivo: 'anim/animacion-ida.gif',
    },
    'vuelta': {
        archivo: 'anim/animacion-vuelta.gif',
    },
    'comidaChatarra': {
        archivo: 'anim/animacion-comida-chatarra.gif',
    },
    'comidaSana': {
        archivo: 'anim/animacion-comida-sana.gif',
    },
    'barraLlenaEstres': {
        archivo: 'anim/barra-llena-estres.gif',
    },
    'barraLlenaHambre': {
        archivo: 'anim/barra-llena-hambre.gif',
    },
    'barraLlenaVejiga': {
        archivo: 'anim/barra-llena-vejiga.gif',
    },
    'youtube': {
        archivo: 'anim/youtube.gif',
    },
    'gaming': {
        archivo: 'anim/gaming.gif',
    },
    'coding': {
        archivo: 'anim/coding.gif',
    },
}

const colaDeAnimaciones = [];

function iniciarAnimacion(capa, nombre) {
    capas[capa].src = animaciones[nombre].archivo;
}




//----- Módulo Interfaz de juego y acciones

// Importar Necesidades
// Importar Animacion

const contenedorControles = '#interfaz-de-juego';
const claseMenuActivo = 'menu--activo';
const claseMenuPrincipal = 'menu-principal';
let realizandoAccion = false;

// Lista de acciones realizables a través de la interfaz
const acciones = {
    'comerComidaChatarra': {
        efecto: () => {
            saturarNecesidad({nombre: 'hambre', horas: 1});
            incrementarNecesidad('vejiga', 20);
            reducirNecesidad('hambre', 15);
        },
        proceso: () => {
            return new Promise((resolve)=>{
                iniciarAnimacion('personaje', 'ida');
                setTimeout(() => {
                    iniciarAnimacion('personaje', 'comidaChatarra');
                    //reproducirAudio('baño');
                }, 4000);
                setTimeout(() => {resolve()}, 8200);
            });
        }
    },
    'comerComidaSana': {
        efecto: () => {
            saturarNecesidad({nombre: 'hambre', horas: 6});
            incrementarNecesidad('vejiga', 20);
            reducirNecesidad('hambre', 30);
        },
        proceso: () => {
            return new Promise((resolve)=>{
                iniciarAnimacion('personaje', 'ida');
                setTimeout(() => {
                    iniciarAnimacion('personaje', 'comidaSana');
                    //reproducirAudio('baño');
                }, 4000);
                setTimeout(() => {resolve()}, 8200);
            });
        }
    },
    'irAlBaño': {
        efecto: () => {
            establecerValorNecesidad('vejiga', 0);
        },
        proceso: () => {
            return new Promise((resolve)=>{
                iniciarAnimacion('personaje', 'ida');
                setTimeout(() => {
                    iniciarAnimacion('personaje', 'vuelta');
                    //reproducirAudio('baño');
                }, 7000);
                setTimeout(() => {resolve()}, 11000);
            });
        }
    },
    'jugarVideojuego': {
        efecto: () => {
            incrementarNecesidad('hambre', 20);
            reducirNecesidad('estres', 30);
        },
        proceso: () => {
            return new Promise((resolve)=>{
                iniciarAnimacion('personaje', 'trabajando');
                iniciarAnimacion('monitor', 'gaming');
                setTimeout(() => {resolve()}, 10000);
            });
        }
    },
    'mirarYouTube': {
        efecto: () => {
            reducirNecesidad('estres', 45);
        },
        proceso: () => {
            return new Promise((resolve)=>{
                iniciarAnimacion('personaje', 'quieto');
                iniciarAnimacion('monitor', 'youtube');
                setTimeout(() => {resolve()}, 10000);
            });
        }
    },
    'hablarPorTelefono': {
        efecto: () => {
            reducirNecesidad('estres', 50);
        },
        proceso: (accion) => {
            return new Promise((resolve) => {
                iniciarAnimacion('personaje', 'telefono');
                setTimeout(() => {resolve()}, 18000);
            });
        },
    },
}

function abrirMenu(nombre) {
    cerrarMenusAbiertos();
    const menuActivo = document.querySelector(`.menu-${nombre}`);
    console.log(nombre);
    console.log(menuActivo);
    menuActivo.classList.add(claseMenuActivo);
}

function cerrarMenusAbiertos() {
    const menus = document.querySelectorAll(`.menu`);
    menus.forEach((menu) => {
        menu.classList.remove(claseMenuActivo);
    });
}

function menuPrincipalActivo() {
    const menuPrincipal = document.querySelector(`.${claseMenuPrincipal}`);
    return menuPrincipal.classList.contains(claseMenuActivo);
}

function deshabilitarBotones() {
    const botones = document.querySelectorAll(`${contenedorControles} button`);
    for (let boton of botones){
        boton.setAttribute('disabled', true);
    }
}

function habilitarBotones() {
    const botones = document.querySelectorAll(`${contenedorControles} button`);
    for (let boton of botones){
        boton.removeAttribute('disabled');
    }
}

function accionDeJuego(accion) {
    //Gestionar cola de acciones y animaciones desde acá
    if(! menuPrincipalActivo()) {
        cerrarMenusAbiertos();
        abrirMenu('principal');
    }
    deshabilitarBotones();
    realizandoAccion = true;
    acciones[accion].efecto();
    acciones[accion].proceso(accion).then(() => {
        realizandoAccion = false;
        habilitarBotones();
        iniciarAnimacion('personaje', 'trabajando');
        iniciarAnimacion('monitor', 'coding');
    });
}



//----- Módulo Timers

const duracionTickMs = 1000;

function iniciarTimerPrincipal(tick) {
    window.timerPrincipal = window.setInterval(tick, 1000);
}

function detenerTimerPrincipal() {
    window.clearInterval(window.timerPrincipal);
}

function iniciarTimerFinalDeDia(finDeDia) {
    window.timerDia = window.setTimeout(finDeDia, 120000);
}

function detenerTimerDia() {
    window.clearTimeout(window.timerPrincipal);
}


//----- Overlays

function mostrarOverlay(dataOverlay) {
    const overlay = document.querySelector(`.overlay-clickeable[data-overlay="${dataOverlay}"]`);
    overlay.classList.add('overlay-clickeable--activo');
}

function ocultarOverlay(dataOverlay) {
    const overlay = document.querySelector(`.overlay-clickeable[data-overlay="${dataOverlay}"]`);
    overlay.classList.remove('overlay-clickeable--activo');
}

function ocultarOverlays() {
    const overlays = document.querySelectorAll(`.overlay-clickeable`);
    for (let overlay of overlays) {
        overlay.classList.remove('overlay-clickeable--activo');
    }
}


//Audio

const audios = {
    'intro': document.querySelector('.audio-intro'),
    'game': document.querySelector('.audio-game'),
    'end': document.querySelector('.audio-end'),
}

function reproducirAudio(id) {
    for (let audio in audios) {
        audios[audio].pause();
        audios[audio].currentTime = 0;
    }
    audios[id].play();
}

//----- Index

// importar Timers
// importar Necesidades
//Importar Animación


let niveles = {
    0: {
        evento: () => {}
    },
    1: {
        evento: () => {
            incrementarNecesidad('estres', 20);
            mostrarOverlay('evento-dia2');
        }
    },
    2: {
        evento: () => {
            incrementarNecesidad('estres', 50);
            mostrarOverlay('evento-dia3');
        }
    },
    3: {
        evento: () => {
            mostrarOverlay('victoria');
        }
    }
}

let nivelActual = 0;
let estados = {
    'equilibrio': {
        animacion: 'trabajando',
    },
    'estres': {
        animacion: 'barraLlenaEstres',
    },
    'hambre': {
        animacion: 'barraLlenaHambre',
    },
    'vejiga': {
        animacion: 'barraLlenaVejiga',
    },
};
let estadoActual = 'equilibrio';

function evaluarEstado() {
    const medidores = document.querySelectorAll('.medidor > meter');
    for (let medidor of medidores) {
        if (medidor.value > 99) {
            return {
                estado: 'muerte',
                causa: medidor.id.split('-')[1]
            }
        }
        if (medidor.value > 85) {
            return {
                estado: 'alerta',
                causa: medidor.id.split('-')[1]
            };
        }
    }
    return {estado: 'equilibrio'};
}

function adoptarEstado(estado) {
    iniciarAnimacion('personaje', estados[estado].animacion);
    //filtro de color
}

function eventoDelDia(idNivel) {
    niveles[idNivel].evento();
}

function iniciarNivel(idNivel) {
    nivelActual = idNivel;
    resetearNecesidades();
    eventoDelDia(idNivel);
    iniciarTimerPrincipal(tick);
    iniciarTimerFinalDeDia(ganarNivel);
    iniciarAnimacion('personaje', 'trabajando');
    iniciarAnimacion('monitor', 'coding');
}

function tick() {
    for (let necesidad in necesidades) {
        acumularNecesidad(necesidad, 1 + nivelActual * 0.35);
        reducirSaturacionNecesidad(necesidad, 0.5);
    }
    let estado = evaluarEstado().estado;

    if (estado === 'muerte') {
        return perderNivel(evaluarEstado().causa);
    }

    if (realizandoAccion) { return; }

    if (estado === 'alerta' && estado !== estadoActual) {
        adoptarEstado(evaluarEstado().causa);
    }
}

function ganarNivel() {
    detenerTimerPrincipal();
    detenerTimerDia();
    nivelActual++;
    iniciarNivel(nivelActual);
}

function perderNivel(causa) {
    // alert('perdiste! causa:', causa);
    mostrarOverlay(`gameover-${causa}`);
    detenerTimerPrincipal();
    detenerTimerDia();
    reproducirAudio('end');
}

function volverAMenu() {
    iniciarNivel(0);
    detenerTimerPrincipal();
    detenerTimerDia();
    cargarPantalla(0);
    ocultarOverlays();
}

function iniciarJuegoNuevo() {
    reproducirAudio('game');
    cargarPantalla(2);
    iniciarNivel(0);
    ocultarOverlays();
}

function irAInfo(){
    cargarPantalla(1);
    reproducirAudio('intro');
}

//-- Ejecutar al inicio

cargarPantalla(0);
abrirMenu('principal');
