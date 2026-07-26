// Dados de tuberculose em Manaus (baseados em dados do SINAN/SIVEP)
const dadosTuberculose = {
    historico: [
        { ano: 2015, casos: 1890 },
        { ano: 2016, casos: 1960 },
        { ano: 2017, casos: 2050 },
        { ano: 2018, casos: 2140 },
        { ano: 2019, casos: 2080 },
        { ano: 2020, casos: 2350 },
        { ano: 2021, casos: 2510 },
        { ano: 2022, casos: 2680 },
        { ano: 2023, casos: 2820 },
        { ano: 2024, casos: 2950 }
    ],
    bairros: [
        { nome: "Centro", lat: -3.1190, lng: -60.0217, casos: 245, densidade: 8500, risco: "alto" },
        { nome: "Cidade Nova", lat: -3.0890, lng: -59.9810, casos: 312, densidade: 11000, risco: "alto" },
        { nome: "Compensa", lat: -3.1090, lng: -60.0500, casos: 198, densidade: 7200, risco: "médio" },
        { nome: "São José", lat: -3.0990, lng: -60.0300, casos: 167, densidade: 5500, risco: "médio" },
        { nome: "Adrianópolis", lat: -3.1090, lng: -60.0100, casos: 89, densidade: 3500, risco: "baixo" },
        { nome: "Redenção", lat: -3.0750, lng: -60.0050, casos: 203, densidade: 6800, risco: "alto" },
        { nome: "Alvorada", lat: -3.0850, lng: -59.9900, casos: 276, densidade: 9500, risco: "alto" },
        { nome: "Nova Esperança", lat: -3.0650, lng: -60.0400, casos: 156, densidade: 6200, risco: "médio" },
        { nome: "Japiim", lat: -3.1250, lng: -60.0150, casos: 134, densidade: 4800, risco: "médio" },
        { nome: "Coroado", lat: -3.0950, lng: -59.9650, casos: 290, densidade: 10500, risco: "alto" },
        { nome: "Jorge Teixeira", lat: -3.0550, lng: -59.9550, casos: 245, densidade: 8800, risco: "alto" },
        { nome: "Mauazinho", lat: -3.1150, lng: -59.9400, casos: 178, densidade: 6500, risco: "médio" },
        { nome: "Petrópolis", lat: -3.1120, lng: -60.0250, casos: 112, densidade: 4200, risco: "médio" },
        { nome: "Parque 10", lat: -3.1000, lng: -59.9900, casos: 198, densidade: 7300, risco: "alto" }
    ]
};

// Inicializar mapa
const map = L.map('map').setView([-3.095, -60.010], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map);

// Adicionar marcadores no mapa
const marcadores = [];
dadosTuberculose.bairros.forEach(bairro => {
    const cor = bairro.risco === 'alto' ? '#e74c3c' : bairro.risco === 'médio' ? '#f39c12' : '#27ae60';
    const marker = L.circleMarker([bairro.lat, bairro.lng], {
        radius: Math.sqrt(bairro.casos) * 0.4,
        fillColor: cor,
        color: '#fff',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.7
    }).addTo(map);

    marker.bindPopup(`
                <strong>${bairro.nome}</strong><br>
                Casos: ${bairro.casos}<br>
                Densidade: ${bairro.densidade} hab/km²<br>
                Risco: ${bairro.risco.toUpperCase()}
            `);

    marker.on('click', () => {
        document.getElementById('zonasCriticas').innerHTML = `
                    <div style="background:#f8f9fa; padding:10px; border-radius:6px; margin:5px 0;">
                        <strong>📍 ${bairro.nome}</strong><br>
                        <span>Casos ativos: ${bairro.casos}</span><br>
                        <span>Densidade: ${bairro.densidade} hab/km²</span><br>
                        <span style="color:${cor}; font-weight:bold;">Risco: ${bairro.risco.toUpperCase()}</span>
                    </div>
                `;
    });

    marcadores.push(marker);
});

// Gráfico de série histórica
const ctx = document.getElementById('historicoChart').getContext('2d');
const historicoChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dadosTuberculose.historico.map(d => d.ano),
        datasets: [{
            label: 'Casos Confirmados',
            data: dadosTuberculose.historico.map(d => d.casos),
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#e74c3c',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: { color: '#ecf0f1' }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});

// Atualizar estatísticas
function atualizarStats() {
    const total = dadosTuberculose.historico[dadosTuberculose.historico.length - 1].casos;
    const incidencia = ((total / 2200000) * 100000).toFixed(1);
    const zonasAltoRisco = dadosTuberculose.bairros.filter(b => b.risco === 'alto').length;

    document.getElementById('totalCasos').textContent = total.toLocaleString();
    document.getElementById('taxaIncidencia').textContent = incidencia;
    document.getElementById('zonasRisco').textContent = zonasAltoRisco;
}
atualizarStats();

// Atualizar valores dos sliders
document.getElementById('densidade').addEventListener('input', (e) => {
    document.getElementById('densidadeVal').textContent = e.target.value;
});
document.getElementById('cobertura').addEventListener('input', (e) => {
    document.getElementById('coberturaVal').textContent = e.target.value;
});
document.getElementById('saneamento').addEventListener('input', (e) => {
    document.getElementById('saneamentoVal').textContent = e.target.value;
});
document.getElementById('migracao').addEventListener('input', (e) => {
    document.getElementById('migracaoVal').textContent = e.target.value;
});

// Função de simulação
function executarSimulacao() {
    const densidade = parseFloat(document.getElementById('densidade').value);
    const cobertura = parseFloat(document.getElementById('cobertura').value);
    const saneamento = parseFloat(document.getElementById('saneamento').value);
    const migracao = parseFloat(document.getElementById('migracao').value);

    // Modelo simplificado de simulação
    const baseCases = 2500;
    const densidadeFactor = (densidade / 5000) * 1.2;
    const coberturaFactor = 1 - ((cobertura - 60) / 100);
    const saneamentoFactor = 1 - ((saneamento - 50) / 100) * 0.8;
    const migracaoFactor = 1 + (migracao / 10000);

    const casosEstimados = Math.round(
        baseCases *
        densidadeFactor *
        coberturaFactor *
        saneamentoFactor *
        migracaoFactor
    );

    const probSurto = Math.min(95, Math.round(
        ((densidade / 15000) * 40 +
            (1 - cobertura / 100) * 35 +
            (1 - saneamento / 100) * 25) * 100
    ));

    document.getElementById('resultadoSimulacao').style.display = 'block';
    document.getElementById('casosEstimados').textContent = casosEstimados.toLocaleString();
    document.getElementById('probSurto').textContent = probSurto + '%';

    // Animar resultado
    const resultadoDiv = document.getElementById('resultadoSimulacao');
    resultadoDiv.style.animation = 'none';
    resultadoDiv.offsetHeight;
    resultadoDiv.style.animation = 'pulse 0.5s ease';

    // Atualizar marcadores do mapa baseado na simulação
    marcadores.forEach((marker, index) => {
        const bairro = dadosTuberculose.bairros[index];
        const simulatedRisk = probSurto > 60 ? 'alto' : probSurto > 30 ? 'médio' : 'baixo';
        const newColor = simulatedRisk === 'alto' ? '#e74c3c' : simulatedRisk === 'médio' ? '#f39c12' : '#27ae60';
        marker.setStyle({ fillColor: newColor });
    });
}

// CSS para animação
const style = document.createElement('style');
style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
        `;
document.head.appendChild(style);

// Ajustar mapa ao carregar
setTimeout(() => {
    map.invalidateSize();
}, 100);