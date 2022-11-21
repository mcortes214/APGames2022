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






//----- Módulo Interfaz de juego y acciones

const contenedorControles = '#interfaz-de-juego';
const claseMenuActivo = 'menu--activo';
const claseMenuPrincipal = 'menu-principal';

// Lista de acciones realizables a través de la interfaz
const acciones = {
    'comerComidaChatarra': {
        efecto: () => {
            saturarNecesidad({nombre: 'hambre', horas: 1});
            incrementarNecesidad('vejiga', 20);
            reducirNecesidad('hambre', 10);
        }
    },
    'comerComidaSana': {
        efecto: () => {
            saturarNecesidad({nombre: 'hambre', horas: 6});
            incrementarNecesidad('vejiga', 20);
            reducirNecesidad('hambre', 10);
        }
    },
    'irAlBaño': {
        efecto: () => {
            establecerValorNecesidad('vejiga', 0);
        }
    },
    'jugarVideojuego': {
        efecto: () => {
            incrementarNecesidad('hambre', 20);
            reducirNecesidad('estres', 30);
        }
    },
    'mirarYouTube': {
        efecto: () => {
            reducirNecesidad('estres', 45);
        }
    },
    'hablarPorTelefono': {
        efecto: () => {
            reducirNecesidad('estres', 50);
        }
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

function accionDeJuego(accion) {
    acciones[accion].efecto();
    if(! menuPrincipalActivo()) {
        cerrarMenusAbiertos();
        abrirMenu('principal');
    }
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
    window.timerDia = window.setTimeout(finDeDia, 60000);
}

function detenerTimerDia() {
    window.clearTimeout(window.timerPrincipal);
}



//----- Index

// importar Timers
// importar Necesidades

let nivelActual = 0;

function iniciarNivel(idNivel) {
    nivelActual = idNivel;
    resetearNecesidades();
    iniciarTimerPrincipal(tick);
    iniciarTimerFinalDeDia(ganarNivel);
}

function tick() {
    for (let necesidad in necesidades) {
        acumularNecesidad(necesidad, 2);
        reducirSaturacionNecesidad(necesidad, 0.5);
    }
}

function ganarNivel() {
    alert('final del día');
    detenerTimerPrincipal();
    detenerTimerDia();
    nivelActual++;
    iniciarNivel(nivelActual);
}

function perderNivel(causa) {
    alert('perdiste! causa:', causa);
    detenerTimerPrincipal();
    detenerTimerDia();
    iniciarNivel(0);
}


function iniciarJuegoNuevo() {
    cargarPantalla(2);
    iniciarNivel(0);
}

//-- Ejecutar al inicio

cargarPantalla(0);
abrirMenu('principal');
