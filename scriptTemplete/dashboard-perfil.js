// ===================================================
// ARQUIVO: /scriptTemplete/dashboard-perfil.js (AJUSTADO)
// Unimos os dois blocos 'DOMContentLoaded' e
// conectamos os gráficos à nossa API 'apiFetch'.
// ===================================================

// --- Variáveis Globais para os Gráficos ---
// (Declaramos fora para poder acessá-los de qualquer função)
let categoriasChart;
let organizacaoGauge;

// --- Evento Principal (Apenas UM 'DOMContentLoaded') ---
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Controles dos Spinners ---
    // (Pegamos os IDs que você acabou de adicionar ao HTML)
    const spinnerCategorias = document.getElementById('cardSpinnerCategorias');
    const spinnerOrganizacao = document.getElementById('cardSpinnerOrganizacao');

    // Funções para controlar AMBOS os spinners de uma vez
    const mostrarSpinners = () => {
        if (spinnerCategorias) spinnerCategorias.classList.remove('hidden');
        if (spinnerOrganizacao) spinnerOrganizacao.classList.remove('hidden');
    };
    const esconderSpinners = () => {
        if (spinnerCategorias) spinnerCategorias.classList.add('hidden');
        if (spinnerOrganizacao) spinnerOrganizacao.classList.add('hidden');
    };

    // --- 2. Inicializar Gráficos Vazios ---
    // (A função está definida mais abaixo)
    inicializarGraficos();

    // --- 3. Chamar a função de carregar os dados da API ---
    carregarDadosDashboard(mostrarSpinners, esconderSpinners);
});


/**
 * Função que busca os dados de TODA a dashboard.
 * Esta é a função que você chamou de 'carregarGrafico'.
 */
async function carregarDadosDashboard(ligarSpinners, desligarSpinners) {
    try {
        // 3. Chama o 'apiFetch' centralizado
        // (Note que mudei a URL para uma que (supostamente)
        // traz TODOS os dados da dashboard, não só de um gráfico)
        const dados = await apiFetch(
            '/api/dashboard-perfil-data', // URL de EXEMPLO (substitua pela sua)
            {}, // Opções (method 'GET' é o padrão)
            {
                // Passa as funções de UI para automação
                spinnerStart: ligarSpinners,
                spinnerStop: desligarSpinners,
                successToast: 'Dashboard carregada com sucesso!'
            }
        );

        // 4. Se chegou aqui, deu SUCESSO!
        // O spinner e o toast já foram tratados.
        // Agora, preenchemos a tela com os 'dados' da API.

        // (Exemplo de como os dados da API podem ser usados)
        atualizarCards(dados.estatisticas); // Atualiza "125", "12", etc.
        atualizarGraficoCategorias(dados.graficoCategorias); // Atualiza o gráfico de pizza
        atualizarGraficoOrganizacao(dados.nivelOrganizacao); // Atualiza o velocímetro

    } catch (error) {
        // 5. Se chegou aqui, deu ERRO!
        // O spinner e o toast de erro já foram tratados.
        // O 'catch' fica vazio e impede que o código de sucesso acima rode.
        console.warn("A exibição do dashboard foi interrompida devido a um erro.");
    }
}

/**
 * Atualiza os cards de estatísticas (Itens, Vencendo, etc.)
 * (Esta função é chamada pelo 'carregarDadosDashboard' em caso de sucesso)
 */
function atualizarCards(dadosCards) {
    if (!dadosCards) return; // Se a API não mandar essa parte
    document.getElementById('totalItens').textContent = dadosCards.totalItens || 0;
    document.getElementById('vencendoItens').textContent = dadosCards.vencendoItens || 0;
    document.getElementById('totalReceitas').textContent = dadosCards.totalReceitas || 0;
    document.getElementById('desperdicio').textContent = `${dadosCards.desperdicio || 0}%`;
}

/**
 * Atualiza os dados do gráfico de Categorias
 * (Esta função é chamada pelo 'carregarDadosDashboard' em caso de sucesso)
 */
function atualizarGraficoCategorias(dadosCategorias) {
    // (dadosCategorias deve ser algo como: { labels: ['Grãos', ...], data: [30, 15, ...] })
    if (!categoriasChart || !dadosCategorias) return;

    categoriasChart.data.labels = dadosCategorias.labels;
    categoriasChart.data.datasets[0].data = dadosCategorias.data;
    categoriasChart.update(); // Redesenha o gráfico com os novos dados
}

/**
 * Atualiza o valor do gráfico de Organização
 * (Esta função é chamada pelo 'carregarDadosDashboard' em caso de sucesso)
 */
function atualizarGraficoOrganizacao(valorOrganizacao) {
    // (valorOrganizacao deve ser um número, ex: 75)
    if (!organizacaoGauge || valorOrganizacao === undefined) return;

    organizacaoGauge.data.datasets[0].value = valorOrganizacao;
    organizacaoGauge.update(); // Redesenha o gráfico com o novo valor
}


/**
 * Desenha os gráficos na tela com dados VAZIOS.
 * Esta é a lógica que estava no seu segundo 'DOMContentLoaded'.
 */
function inicializarGraficos() {
    // --- 1. Inicializar Gráfico de Pizza (Categorias de Itens) ---
    const categoriasCtx = document.getElementById('categoriasChart').getContext('2d');
    categoriasChart = new Chart(categoriasCtx, { // (Atribui à var global)
        type: 'doughnut',
        data: {
            labels: [], // VAZIO (virá da API)
            datasets: [{
                data: [], // VAZIO (virá da API)
                backgroundColor: [
                    '#2B9569', '#42A92D', '#A5C96F',
                    '#36A2EB', '#FFCE56', '#FF6384'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 14 } } },
                title: { display: false }
            },
            animation: { animateRotate: true, animateScale: true }
        }
    });

    // --- 2. Inicializar Gráfico Velocímetro (Nível de Organização) ---
    const organizacaoCtx = document.getElementById('organizacaoGauge').getContext('2d');
    organizacaoGauge = new Chart(organizacaoCtx, { // (Atribui à var global)
        type: 'gauge',
        data: {
            datasets: [{
                value: 0, // VAZIO (virá da API)
                data: [33, 33, 34], // As "faixas" do velocímetro
                backgroundColor: ['#FF6384', '#FFCE56', '#2B9569'], // Ruim, Médio, Bom
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            needle: {
                radius: 50, width: 15, cutout: 5, color: '#464A4F'
            },
            valueLabel: {
                display: true,
                formatter: (value) => `${Math.round(value)}%`,
                color: '#333333',
                font: { size: 30, weight: 'bold' }
            },
            tooltips: { enabled: false },
            layout: { padding: { bottom: 20 } },
            plugins: { legend: { display: false }, title: { display: false } },
            animation: { animateRotate: true, animateScale: false }
        }
    });
}