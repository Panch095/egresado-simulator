// --- VARIABLES DE ESTADO ---
let diaActual = 1;
let errores = 0;
let pedidosHoy = 0;
let pedidoActual = [];
let construccionJugador = [];
let pacienciaInterval;
let ticketTimeout;

const PEDIDOS_META = 4;

// NARRATIVA SATÍRICA ACTUALIZADA
const historia = [
    "Día 1: Tu título en Ingeniería tiene un marco muy bonito, pero aquí solo importa que el pan no se queme. Tienes 3 errores antes de volver a enviar CVs.",
    "Día 2: El gerente dice que 'somos una familia', por eso espera que trabajes al doble de velocidad por el mismo sueldo. No olvides los ingredientes.",
    "Día 3: ¿Cinco años de universidad para esto? El ticket ahora desaparece más rápido porque 'el tiempo es dinero' (para el dueño, no para ti).",
    "Día 4: Hora pico. Los clientes gritan y el calor de la cocina te hace dudar de tus elecciones de vida. Mantén la agilidad mental.",
    "Día 5: Viernes de frustración. Un cliente pide una hamburguesa triple sin carne. No preguntes, solo memoriza y sobrevive.",
    "Día 6: Estás tan cansado que ves integrales en las rebanadas de queso. Un error más y el sistema te escupirá como a un tornillo viejo.",
    "Día 7: ÚLTIMO DÍA. Si logras salir vivo, felicidades: habrás demostrado que tu cerebro de ingeniero es excelente... para servir comida rápida."
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
    
    document.getElementById('dia-actual').textContent = diaActual;
    document.getElementById('contador-errores').textContent = errores;
    document.getElementById('hamburguesa-container').innerHTML = "";
    document.getElementById('ticket-visual').classList.add('oculto');
    construccionJugador = [];
    
    clearTimeout(ticketTimeout);
    clearInterval(pacienciaInterval);

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
    const tiempoMemoria = Math.max(1500, 4500 - (diaActual * 450));
    
    ticketTimeout = setTimeout(() => {
        ticket.classList.add('oculto');
    }, tiempoMemoria);
}

function iniciarPaciencia() {
    let tiempo = Math.max(7, 20 - (diaActual * 1.8)); 
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
            registrarError("¡Al cliente se le acabó la paciencia (y a ti la dignidad)!");
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
        alert("¡ORDEN CORRECTA! Un pequeño paso para la burguer, un gran desperdicio de tu talento.");
        iniciarNuevoPedido();
    } else {
        registrarError("Esa hamburguesa está mal. Tu lógica de programación no sirve aquí.");
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
        alert("GAME OVER: El gerente te despidio. Tu titulo no te salvo hoy.");
        location.reload();
    } else {
        iniciarNuevoPedido();
    }
}

function finalizarDia() {
    if (diaActual < 7) {
        alert("Día superado. El cansancio aumenta, el sueldo no.");
        diaActual++;
        iniciarIntroduccion();
    } else {
        alert("¡FIN DE LA SEMANA! Has demostrado que puedes seguir instrucciones simples bajo presión. El sueño americano ha sido alcanzado.");
        location.reload();
    }
}
