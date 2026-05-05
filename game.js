// --- VARIABLES DE ESTADO ---
let diaActual = 1;
let errores = 0;
let pedidosHoy = 0;
let pedidoActual = [];
let construccionJugador = [];
let pacienciaInterval;
let ticketTimeout; // Variable para controlar el bug del ticket

const PEDIDOS_META = 4;
const historia = [
    "Día 1: Te graduaste de ing. pero terminaste aquí. Tienes 3 errores para toda la semana.",
    "Día 2: Los clientes llegan más rápido. El gerente no perdona olvidos.",
    "Día 3: El ticket desaparecerá antes. ¡Entrena esa memoria a corto plazo!",
    "Día 4: Hora pico. Los pedidos son más grandes y complejos.",
    "Día 5: Casi es fin de semana. No dejes que la paciencia se agote.",
    "Día 6: La presión es máxima. El éxito depende de tu velocidad.",
    "Día 7: ÚLTIMO DÍA. Demuestra tu agilidad mental y sobrevive al sistema."
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
    
    // Limpiar interfaz
    document.getElementById('dia-actual').textContent = diaActual;
    document.getElementById('contador-errores').textContent = errores;
    document.getElementById('hamburguesa-container').innerHTML = "";
    document.getElementById('ticket-visual').classList.add('oculto');
    construccionJugador = [];
    
    // Limpiar cualquier temporizador previo (Fix del bug)
    clearTimeout(ticketTimeout);
    clearInterval(pacienciaInterval);

    // Pequeño retraso para resetear el estado visual
    setTimeout(() => {
        generarPedido();
        iniciarPaciencia();
    }, 200);
}

function generarPedido() {
    const listaUI = document.getElementById('lista-ingredientes');
    const ticket = document.getElementById('ticket-visual');
    listaUI.innerHTML = "";
    
    pedidoActual = ["Pan Inferior"];
    // Dificultad: escala de ingredientes según el día
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

    // Mostrar ticket
    ticket.classList.remove('oculto');
    
    // Tiempo de memoria disminuye cada día (Día 1: 4s -> Día 7: 1.5s)
    const tiempoMemoria = Math.max(1500, 4500 - (diaActual * 400));
    
    ticketTimeout = setTimeout(() => {
        ticket.classList.add('oculto');
    }, tiempoMemoria);
}

function iniciarPaciencia() {
    let tiempo = Math.max(8, 20 - (diaActual * 1.5));
    let actual = tiempo;
    const barra = document.getElementById('paciencia-barra');

    pacienciaInterval = setInterval(() => {
        actual -= 0.1;
        let porcentaje = (actual / tiempo) * 100;
        barra.style.width = porcentaje + "%";

        if (porcentaje < 30) barra.style.background = "#e74c3c";
        else if (porcentaje < 60) barra.style.background = "#f1c40f";
        else barra.style.background = "#2ecc71";

        if (actual <= 0) {
            clearInterval(pacienciaInterval);
            registrarError("¡El cliente se fue por tardanza!");
        }
    }, 100);
}

function agregarIngrediente(ing) {
    construccionJugador.push(ing);
    const div = document.createElement('div');
    div.className = `ingrediente-render color-${ing.split(' ')[0]}`;
    div.textContent = ing;
    document.getElementById('hamburguesa-container').appendChild(div);
}

function entregarPedido() {
    clearInterval(pacienciaInterval);
    clearTimeout(ticketTimeout); // Detener el ocultamiento del ticket si entrega rápido
    
    const esCorrecto = JSON.stringify(pedidoActual) === JSON.stringify(construccionJugador);
    
    if (esCorrecto) {
        pedidosHoy++;
        alert("¡Excelente! Orden correcta.");
        iniciarNuevoPedido();
    } else {
        registrarError("Esa no fue la orden correcta...");
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
        alert("GAME OVER: Has sido despedido por acumular 3 errores.");
        location.reload();
    } else {
        iniciarNuevoPedido();
    }
}

function finalizarDia() {
    if (diaActual < 7) {
        alert("¡Día completado con éxito!");
        diaActual++;
        iniciarIntroduccion();
    } else {
        alert("¡LO LOGRASTE! Sobreviviste a la semana laboral. Tu agilidad mental es impresionante.");
        location.reload();
    }
}