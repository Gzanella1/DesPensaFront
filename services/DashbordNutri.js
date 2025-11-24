const API_BASE_URL = "http://localhost:8080/api";
const ID_ESTOQUE_ATUAL = 1; // Simulação: Isso viria do login/sessão

document.addEventListener("DOMContentLoaded", () => {
    carregarEstoque();
    carregarHistorico();
    carregarAlertas();
    
    // Configura o botão de salvar do modal
    // Note: Removi o onclick do HTML para gerenciar aqui, ou mantenha e chame a função.
});

// --- 1. POST: Adicionar Novo Insumo ---
async function confirmarFormulario() {
    const btnConfirmar = document.querySelector('#formInsumo button.bg-green-dark');
    const textoOriginal = btnConfirmar.innerText;
    btnConfirmar.innerText = "Salvando...";
    btnConfirmar.disabled = true;

    // Mapeamento dos campos do HTML para o DTO do Java
    const payload = {
        nome: document.getElementById('tipo').value, // Usando campo 'tipo' como Nome do Produto
        quantidade: parseInt(document.getElementById('quantidade').value),
        validade: document.getElementById('validade').value,
        idEstoque: ID_ESTOQUE_ATUAL,
        preco: 0.0, // Campo obrigatório no DTO, mas não tem no form (valor padrão)
        
        // O campo 'endereco' (origem) não vai direto para a entidade Alimento, 
        // mas se você ajustou o DTO para aceitar 'origem' na criação, adicione aqui.
    };

    if (!payload.nome || !payload.quantidade || !payload.validade) {
        alert("Por favor, preencha Nome, Quantidade e Validade.");
        btnConfirmar.innerText = textoOriginal;
        btnConfirmar.disabled = false;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/alimentos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Insumo cadastrado com sucesso!");
            fecharFormulario();
            limparFormulario();
            // Recarrega as listas
            carregarEstoque();
            carregarHistorico(); 
        } else {
            const erro = await response.text();
            alert("Erro ao salvar: " + erro);
        }
    } catch (error) {
        console.error("Erro de rede:", error);
        alert("Erro de conexão com o servidor.");
    } finally {
        btnConfirmar.innerText = textoOriginal;
        btnConfirmar.disabled = false;
    }
}

// --- 2. GET: Visualizar Estoque (Lista de Alimentos) ---
async function carregarEstoque() {
    const container = document.getElementById('listaInsumos');
    container.innerHTML = '<p class="text-gray-500 animate-pulse">Carregando estoque...</p>';

    try {
        // Supondo que você tenha um endpoint GET /api/alimentos
        // Se tiver filtro por estoque: /api/alimentos/estoque/${ID_ESTOQUE_ATUAL}
        const response = await fetch(`${API_BASE_URL}/alimentos`); 
        
        if (!response.ok) throw new Error("Erro ao buscar alimentos");

        const alimentos = await response.json();

        if (alimentos.length === 0) {
            container.innerHTML = '<p class="text-gray-500">Nenhum insumo cadastrado.</p>';
            return;
        }

        let html = '<ul class="divide-y divide-gray-100">';
        alimentos.forEach(item => {
            // Filtra visualmente apenas os deste estoque (caso a API retorne tudo)
            if (item.estoque && item.estoque.idEstoque !== ID_ESTOQUE_ATUAL) return;

            const dataValidade = new Date(item.validade).toLocaleDateString('pt-BR');
            
            html += `
            <li class="py-3 flex justify-between items-center hover:bg-gray-50 transition p-2 rounded">
                <div>
                    <p class="font-bold text-gray-800">${item.nome}</p>
                    <p class="text-xs text-gray-500">Validade: ${dataValidade}</p>
                </div>
                <div class="text-right">
                    <span class="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold">
                        ${item.quantidade} un
                    </span>
                </div>
            </li>`;
        });
        html += '</ul>';
        container.innerHTML = html;
        
        // Aproveita os dados para verificar validade no front (se o endpoint de alertas não cobrir)
        verificarVencimentosFront(alimentos);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="text-red-500">Erro ao carregar dados.</p>';
    }
}

// --- 3. GET: Histórico de Movimentação ---
async function carregarHistorico() {
    const container = document.getElementById('historico');
    
    try {
        const response = await fetch(`${API_BASE_URL}/movimentacoes/estoque/${ID_ESTOQUE_ATUAL}`);
        if (!response.ok) throw new Error("Erro API Movimentação");

        const movimentacoes = await response.json();

        if (movimentacoes.length === 0) {
            container.innerHTML = '<li class="text-gray-500 italic">Nenhuma movimentação.</li>';
            return;
        }

        let html = '';
        movimentacoes.forEach(mov => {
            const dataMov = new Date(mov.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'});
            const isEntrada = mov.tipo === 'ENTRADA';
            const corTexto = isEntrada ? 'text-green-600' : 'text-red-600';
            const icone = isEntrada ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle';

            html += `
            <li class="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                <div class="flex items-center gap-3">
                    <i class="bi ${icone} ${corTexto} text-xl"></i>
                    <div>
                        <p class="font-medium text-gray-700">
                            ${mov.alimento ? mov.alimento.nome : 'Item excluído'}
                        </p>
                        <p class="text-xs text-gray-400">${mov.origem || mov.observacao || 'Sem detalhes'}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold ${corTexto}">${isEntrada ? '+' : '-'}${mov.quantidade}</p>
                    <p class="text-xs text-gray-400">${dataMov}</p>
                </div>
            </li>`;
        });
        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = '<li class="text-red-500">Falha ao carregar histórico.</li>';
    }
}

// --- 4. GET: Alertas de Baixo Estoque ---
async function carregarAlertas() {
    const containerQtd = document.getElementById('avisoQuantidade');
    
    try {
        const response = await fetch(`${API_BASE_URL}/movimentacoes/alertas/${ID_ESTOQUE_ATUAL}`);
        
        if (response.status === 204) {
            containerQtd.innerHTML = '<li class="text-gray-500 italic">Estoque em níveis seguros.</li>';
            return;
        }

        const alertas = await response.json();
        
        let html = '';
        alertas.forEach(item => {
            html += `
            <li class="flex items-center justify-between text-red-600 py-1">
                <span><i class="bi bi-exclamation-circle-fill mr-2"></i> ${item.nome}</span>
                <span class="font-bold text-sm">${item.quantidade} un</span>
            </li>`;
        });
        containerQtd.innerHTML = html;

    } catch (error) {
        console.error("Erro alertas", error);
    }
}

// --- Helper: Verificar Vencimento (Frontend Logic) ---
function verificarVencimentosFront(alimentos) {
    const containerVenc = document.getElementById('avisoVencimento');
    const hoje = new Date();
    const diasAlerta = 7; // Alertar se vencer em 7 dias
    
    let listaVencendo = alimentos.filter(item => {
        const validade = new Date(item.validade);
        const diffTempo = validade - hoje;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24)); 
        return diffDias <= diasAlerta;
    });

    if (listaVencendo.length === 0) {
        containerVenc.innerHTML = '<li class="text-gray-500 italic">Nenhum produto próximo do vencimento.</li>';
        return;
    }

    let html = '';
    listaVencendo.forEach(item => {
        const validade = new Date(item.validade);
        // Se já venceu, mostra vermelho escuro, se vai vencer, amarelo escuro
        const jaVenceu = validade < hoje;
        const classeCor = jaVenceu ? 'text-red-800' : 'text-yellow-800';
        const textoData = validade.toLocaleDateString('pt-BR');

        html += `
        <li class="py-1 ${classeCor} flex justify-between">
            <span>${item.nome}</span>
            <span class="text-xs font-bold border border-current px-1 rounded">${jaVenceu ? 'VENCIDO' : textoData}</span>
        </li>`;
    });
    containerVenc.innerHTML = html;
}

// --- Funções de UI do Modal (Já existentes, mantendo compatibilidade) ---
function abrirFormulario() {
    document.getElementById("formInsumo").classList.remove("hidden");
}

function fecharFormulario() {
    document.getElementById("formInsumo").classList.add("hidden");
}

function limparFormulario() {
    document.querySelectorAll('#formInsumo input').forEach(input => input.value = '');
}
