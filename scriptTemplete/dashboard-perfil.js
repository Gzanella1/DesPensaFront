// scriptTemplete/dashboard-perfil.js

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Inicializar Gráfico de Pizza (Categorias de Itens) ---
    const categoriasCtx = document.getElementById('categoriasChart').getContext('2d');
    const categoriasChart = new Chart(categoriasCtx, {
        type: 'doughnut', // Tipo de gráfico de pizza (doughnut para o centro vazio)
        data: {
            labels: ['Grãos', 'Laticínios', 'Carnes', 'Vegetais', 'Frutas', 'Outros'],
            datasets: [{
                data: [30, 15, 10, 20, 10, 15], // Valores de exemplo (total 100)
                backgroundColor: [
                    '#despensa-green-dark',    // Cor 1 (ex: Grãos)
                    '#despensa-green-medium',  // Cor 2 (ex: Laticínios)
                    '#A5C96F',                 // Cor 3 (um verde mais claro)
                    '#36A2EB',                 // Cor 4 (Azul padrão Chart.js)
                    '#FFCE56',                 // Cor 5 (Amarelo padrão Chart.js)
                    '#FF6384'                  // Cor 6 (Vermelho/Rosa padrão Chart.js)
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite que o chart-container controle o tamanho
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: false,
                    text: 'Itens por Categoria'
                }
            },
            animation: { // Animação suave ao carregar
                animateRotate: true,
                animateScale: true
            }
        }
    });

    // --- 2. Inicializar Gráfico Velocímetro (Nível de Organização) ---
    const organizacaoCtx = document.getElementById('organizacaoGauge').getContext('2d');
    const organizacaoGauge = new Chart(organizacaoCtx, {
        type: 'gauge', // Tipo gauge fornecido por 'chartjs-gauge'
        data: {
            datasets: [{
                value: 75, // Valor atual de exemplo (0-100)
                data: [33, 33, 34], // Divisões do velocímetro (ex: Ruim, Médio, Bom)
                backgroundColor: ['#FF6384', '#FFCE56', '#despensa-green-dark'], // Cores para as divisões
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            // Customizações específicas para gauge
            needle: {
                radius: 50, // Tamanho da agulha
                width: 15, // Largura da agulha na base
                cutout: 5, // Corte para a base da agulha
                color: '#464A4F' // Cor da agulha
            },
            valueLabel: {
                display: true,
                formatter: (value) => `${Math.round(value)}%`, // Formato do texto do valor central
                color: '#333333',
                font: {
                    size: 30,
                    weight: 'bold'
                }
            },
            tooltips: {
                enabled: false // Desabilita tooltips padrão, se quiser customizar
            },
            layout: {
                padding: {
                    bottom: 20
                }
            },
            plugins: {
                legend: {
                    display: false // Não exibir a legenda para este gráfico
                },
                title: {
                    display: false
                }
            },
            animation: { // Animação suave
                animateRotate: true,
                animateScale: false // Apenas rotaciona a agulha, não a escala do fundo
            }
        }
    });

    // --- 3. Atualizar Números (Opcional, se vier de uma API) ---
    // Você pode chamar uma API aqui para obter os dados reais e atualizar os elementos textuais
    // Exemplo:
    // fetch('/api/dashboard-data')
    //     .then(response => response.json())
    //     .then(data => {
    //         document.getElementById('totalItens').textContent = data.totalItens;
    //         document.getElementById('vencendoItens').textContent = data.vencendoItens;
    //         document.getElementById('totalReceitas').textContent = data.totalReceitas;
    //         document.getElementById('desperdicio').textContent = `${data.desperdicio}%`;
    //         // Atualizar dados dos gráficos também:
    //         // categoriasChart.data.datasets[0].data = data.categorias;
    //         // categoriasChart.update();
    //         // organizacaoGauge.data.datasets[0].value = data.organizacaoNivel;
    //         // organizacaoGauge.update();
    //     })
    //     .catch(error => console.error('Erro ao carregar dados do dashboard:', error));

});