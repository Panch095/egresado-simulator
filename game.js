// --- VARIABLES DE ESTADO ---
let diaActual = 1;
let errores = 0;
let pedidosHoy = 0;
let pedidoActual = [];
let construccionJugador = [];
let pacienciaInterval;
let ticketTimeout;

const PEDIDOS_META = 4;
const historia = [
    "Día 1: Te graduaste con honores, pero 'Burger Boss' es quien llamó primero. Tienes 3 errores para toda la semana laboral.",
    "Día 2: El gerente dice que la fila crece. Si no memorizas rápido, el descuento viene de tu sueldo.",
    "Día 3: El ticket desaparece más rápido. ¡Optimiza tus procesos cerebrales, ingeniero!",
    "Día 4: Hora pico. El estrés aumenta y los pedidos son más grandes. Mantén la calma.",
    "Día 5: Viernes de quincena. No dejes que la barra de paciencia llegue a cero.",
    "Día 6: Casi termina la semana. Tu agilidad mental ha mejorado, pero un error puede ser fatal.",
    "Día 7: ÚLTIMO DÍA. Demuestra que tu formación sirve para algo más que hacer hamburguesas perfectas."
];

// --- NAVEGACIÓN ---
function cambiarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.add('oculto'));
    document.getElementById(id).classList.remove('oculto');
}

function iniciarIntroduccion() {
    cambiarPantalla('pantalla-cinematica');
    document.getElementById('texto-historia').textContent = historia[diaActual - 1];
}

function avanzarHistoria() {
    cambiarPantalla('pantalla-juego');
    pedidosHoy = 0;
    iniciarNuevoPedido();
}

// --- LÓGICA DEL JUEGO ---
function iniciarNuevoPedido() {
    if (pedidosHoy >= PEDIDOS_META) {
        finalizarDia();
        return;
    }
    
    // Reset de interfaz
    document.getElementById('dia-actual').textContent = diaActual;
    document.getElementById('contador-errores').textContent = errores;
    document.getElementById('hamburguesa-container').innerHTML = "";
    document.getElementById('ticket-visual').classList.add('oculto');
    construccionJugador = [];
    
    // Limpiar procesos previos
    clearTimeout(ticketTimeout);
    clearInterval(pacienciaInterval);

    // Pequeño delay para que el jugador se prepare
    setTimeout(() => {
        generarPedido();
        iniciarPaciencia();
    }, 300);
}

function generarPedido() {
    const listaUI = document.getElementById('lista-ingredientes');
    const ticket = document.getElementById('ticket-visual');
    listaUI.innerHTML = "";
    
    pedidoActual = ["Pan Inferior"];
    // Dificultad: escala ingredientes según día
    const complejidad = diaActual > 4 ? 4 : 2; 
    const cantidad = Math.floor(Math.random() * complejidad) + 2;
    const ingredientes = ["Carne", "Queso", "Lechuga"];
    
    for(let i=0; i<cantidad; i++) {
        pedidoActual.push(ingredientes[Math.floor(Math.random()*ingredientes.length)]);
    }
    pedidoActual.push("Pan Superior");

    pedidoActual.forEach(ing => {
        let li = document.createElement('li');
        li.textContent = ing;
        listaUI.appendChild(li);
    });

    ticket.classList.remove('oculto');
    
    // Tiempo de memoria disminuye (Día 1: 4.5s -> Día 7: 1.5s)
    const tiempoMemoria = Math.max(1500, 4500 - (diaActual * 450));
    
    ticketTimeout = setTimeout(() => {
        ticket.classList.add('oculto');
    }, tiempoMemoria);
}

function iniciarPaciencia() {
    let tiempo = Math.max(7, 20 - (diaActual * 1.8)); // Segundos
    let actual = tiempo;
    const barra = document.getElementById('paciencia-barra');

    pacienciaInterval = setInterval(() => {
        actual -= 0.1;
        let porcentaje = (actual / tiempo) * 100;
        barra.style.width = porcentaje + "%";

        // Cambio de color visual
        if (porcentaje < 30) barra.style.background = "#e74c3c";
        else if (porcentaje < 60) barra.style.background = "#f1c40f";
        else barra.style.background = "#2ecc71";

        if (actual <= 0) {
            clearInterval(pacienciaInterval);
            registrarError("¡El cliente perdió la paciencia!");
        }
    }, 100);
}

function agregarIngrediente(ing) {
    construccionJugador.push(ing);
    const div = document.createElement('div');
    const tipoClase = ing.split(' ')[0];
    div.className = `ingrediente-render color-${tipoClase}`;
    div.textContent = ing;
    document.getElementById('hamburguesa-container').appendChild(div);
}

function entregarPedido() {
    clearInterval(pacienciaInterval);
    clearTimeout(ticketTimeout);
    
    const esCorrecto = JSON.stringify(pedidoActual) === JSON.stringify(construccionJugador);
    
    if (esCorrecto) {
        pedidosHoy++;
        alert("¡PERFECTO! Orden entregada.");
        iniciarNuevoPedido();
    } else {
        registrarError("Esa hamburguesa está mal armada.");
    }
}

function registrarError(motivo) {
    errores++;
    document.getElementById('contador-errores').textContent = errores;
    document.getElementById('game-container').classList.add('flash-error');
    
    setTimeout(() => {
        document.getElementById('game-container').classList.remove('flash-error');
    }, 500);

    alert("GERENTE: " + motivo);

    if (errores >= 3) {
        // MENSAJE FINAL SOLICITADO
        alert("GAME OVER: El gerente te despidio. Tu titulo no te salvo hoy.");
        location.reload();
    } else {
        iniciarNuevoPedido();
    }
}

function finalizarDia() {
    if (diaActual < 7) {
        alert("¡Jornada terminada! Mañana será más difícil.");
        diaActual++;
        iniciarIntroduccion();
    } else {
        alert("¡CONTRATADO PERMANENTE! Has sobrevivido a la semana. Tu agilidad mental es superior.");
        location.reload();
    }
}
