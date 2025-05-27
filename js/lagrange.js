let x = [1, 2, 3];
let y = [5, 10.5, 15.2];
const historial = [];

function lagrange(x, y, xi) {
    let n = x.length;
    let L = 0;

    for (let k = 0; k < n; k++) {
        let term = y[k];
        for (let i = 0; i < n; i++) {
            if (i !== k) {
                term *= (xi - x[i]) / (x[k] - x[i]);
            }
        }
        L += term;
    }

    return L;
}

function estimar() {
    const nombre = document.getElementById("nombre").value.trim();
    const xi = parseFloat(document.getElementById("distancia").value);
    if (!nombre || isNaN(xi)) {
        alert("Por favor ingresa un nombre y una distancia válida.");
        return;
    }

    const tiempo = lagrange(x, y, xi);
    const ritmo = tiempo / xi;

    historial.push({ nombre, xi, tiempo, ritmo });

    document.getElementById("resultado").innerHTML = `
        <strong>Resultado para ${nombre}:</strong><br>
        Tiempo estimado: ${tiempo.toFixed(2)} min<br>
        Ritmo estimado: ${ritmo.toFixed(2)} min/km
    `;

    dibujarGrafica(x, y, xi, tiempo);
}

function dibujarGrafica(x, y, xi, yi) {
    const datos = {
        datasets: [
            {
                label: 'Datos originales',
                data: x.map((val, idx) => ({x: val, y: y[idx]})),
                borderColor: '#2980b9',
                backgroundColor: '#3498db',
                showLine: true,
                tension: 0.3,
                pointRadius: 6
            },
            {
                label: 'Estimación',
                data: [{x: xi, y: yi}],
                borderColor: '#e74c3c',
                backgroundColor: '#e74c3c',
                pointStyle: 'star',
                pointRadius: 10
            }
        ]
    };

    const config = {
        type: 'scatter',
        data: datos,
        options: {
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                x: { title: { display: true, text: 'Distancia (km)' } },
                y: { title: { display: true, text: 'Tiempo (min)' } }
            }
        }
    };

    const canvas = document.getElementById('grafica');
    if (window.miGrafica) window.miGrafica.destroy();
    window.miGrafica = new Chart(canvas, config);
}

function mostrarDatos() {
    alert(`Datos actuales:\nDistancias: ${x.join(', ')}\nTiempos: ${y.join(', ')}`);
}

function mostrarHistorial() {
    if (historial.length === 0) {
        alert("No hay historial disponible.");
        return;
    }
    let mensaje = "Historial de estimaciones:\n";
    historial.forEach((e, i) => {
        mensaje += `${i + 1}. ${e.nombre} - ${e.xi} km → ${e.tiempo.toFixed(2)} min (${e.ritmo.toFixed(2)} min/km)\n`;
    });
    alert(mensaje);
}

function eliminarUltimo() {
    if (x.length > 0) {
        const lastX = x.pop();
        const lastY = y.pop();
        alert(`Eliminado último dato: ${lastX} km - ${lastY} min`);
        resetear();
        dibujarGrafica(x, y, 0, 0); // Dibuja sin estimación
    } else {
        alert("No hay más datos que eliminar.");
    }
}

function resetear() {
    if (window.miGrafica) window.miGrafica.destroy();
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("distancia").value = 1.7;
    document.getElementById("nombre").value = "";
}