// CONFIGURAÇÕES DA API
// IMPORTANTE: Ajuste para a URL correta do seu backend
const API_BASE_URL = "http://localhost:8080/api"; 
const ID_ESTOQUE = 1; 

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
    console.log("Dashboard carregado. Iniciando busca de dados...");
    carregarAlertas();
    carregarEstoque(); // <--- Agora vai carregar automático
    carregarHistorico(); 
});

/**
 * 1. Busca os itens do estoque (Card Central)
 */
async function carregarEstoque() {
    const listaInsumos = document.getElementById("listaInsumos");
    
    // Loading
    listaInsumos.innerHTML = `
        <div class="flex flex-col items-center justify-center py-8 text-gray-400 animate-pulse">
            <i class="bi bi-arrow-repeat text-4xl mb-2 animate-spin"></i>
            <p>Atualizando estoque...</p>
        </div>`;

    try {
        const response = await fetch(`${API_BASE_URL}/estoque/${ID_ESTOQUE}`);
        if (!response.ok) throw new Error("Erro ao buscar itens");

        const dados = await response.json();
        
        // Tenta achar onde está a lista de itens no JSON
        let itens = [];
        if (dados.itens) itens = dados.itens;
        else if (dados.insumos) itens = dados.insumos;
        else if (Array.isArray(dados)) itens = dados; 

        listaInsumos.innerHTML = ""; 

        if (!itens || itens.length === 0) {
            listaInsumos.innerHTML = `
                <div class="flex flex-col items-center justify-center py-8 text-gray-400">
                    <i class="bi bi-inbox text-4xl mb-2"></i>
                    <p>Estoque vazio.</p>
                </div>`;
            return;
        }

        const ul = document.createElement("ul");
        ul.className = "space-y-2";

        itens.forEach(item => {
            // Cores baseadas na quantidade
            let badgeColor = "bg-green-100 text-green-700";
            if(item.quantidade <= 2) badgeColor = "bg-red-100 text-red-700";
            else if(item.quantidade <= 5) badgeColor = "bg-yellow-100 text-yellow-700";

            const validade = item.dataValidade 
                ? new Date(item.dataValidade).toLocaleDateString('pt-BR') 
                : "N/A";

            const li = document.createElement("li");
            li.className = "flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 border border-gray-100 transition";
            li.innerHTML = `
                <div>
                    <span class="font-medium text-gray-800 block">${item.nome || "Item"}</span>
                    <span class="text-xs text-gray-500">Val: ${validade}</span>
                </div>
                <span class="px-2 py-1 rounded text-xs font-bold ${badgeColor}">
                    ${item.quantidade} un
                </span>
            `;
            ul.appendChild(li);
        });

        listaInsumos.appendChild(ul);

    } catch (error) {
        console.error("Erro ao carregar estoque:", error);
        listaInsumos.innerHTML = `
            <div class="text-center py-4 text-red-500 text-sm">
                <i class="bi bi-wifi-off block text-xl mb-1"></i>
                Erro de Conexão.
            </div>`;
    }
}

/**
 * 2. Busca os alertas
 */
async function carregarAlertas() {
    const listaVencimento = document.getElementById("avisoVencimento");
    const listaQuantidade = document.getElementById("avisoQuantidade");

    listaVencimento.innerHTML = '<li class="text-gray-400 text-xs animate-pulse">Buscando...</li>';
    listaQuantidade.innerHTML = '<li class="text-gray-400 text-xs animate-pulse">Buscando...</li>';

    try {
        const url = `${API_BASE_URL}/estoque/${ID_ESTOQUE}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro HTTP");
        
        const dados = await response.json();
        let alertas = [];
        if (Array.isArray(dados)) alertas = dados;
        else if (dados.alertas) alertas = dados.alertas;

        listaVencimento.innerHTML = "";
        listaQuantidade.innerHTML = "";

        let contVencimento = 0;
        let contQuantidade = 0;

        alertas.forEach(alerta => {
            const itemLi = criarElementoAlerta(alerta);
            const tiposValidade = ["VALIDADE_PROXIMA", "ESTOQUE_VENCIDO"];
            
            if (tiposValidade.includes(alerta.tipoAlerta)) {
                listaVencimento.appendChild(itemLi);
                contVencimento++;
            } else {
                listaQuantidade.appendChild(itemLi);
                contQuantidade++;
            }
        });

        if (contVencimento === 0) listaVencimento.innerHTML = `<li class="text-green-600 italic text-xs"><i class="bi bi-check-circle-fill me-1"></i> Tudo em dia!</li>`;
        if (contQuantidade === 0) listaQuantidade.innerHTML = `<li class="text-green-600 italic text-xs"><i class="bi bi-check-circle-fill me-1"></i> Estoque seguro.</li>`;

    } catch (error) {
        console.error(error);
        const erroMsg = `<li class="text-red-400 text-xs">Erro ao buscar alertas.</li>`;
        listaVencimento.innerHTML = erroMsg;
        listaQuantidade.innerHTML = erroMsg;
    }
}

function criarElementoAlerta(alerta) {
    const li = document.createElement("li");
    let cor = "border-blue-500 text-blue-500";
    if (alerta.nivel === "CRITICA") cor = "border-red-600 text-red-600";
    else if (alerta.nivel === "ALTA") cor = "border-orange-500 text-orange-500";
    else if (alerta.nivel === "MEDIA") cor = "border-yellow-500 text-yellow-600";

    const dataF = new Date(alerta.data).toLocaleDateString('pt-BR');
    li.className = `text-sm border-l-4 ${cor.split(' ')[0]} pl-3 py-2 mb-2 bg-white shadow-sm rounded-r`;
    li.innerHTML = `
        <div class="font-bold text-gray-700 text-xs">${alerta.tipoAlerta}</div>
        <div class="text-gray-600 leading-tight">${alerta.mensagem}</div>
        <div class="text-[10px] text-gray-400 mt-1">${dataF} • ${alerta.nivel}</div>
    `;
    return li;
}

/**
 * 3. Busca Histórico
 */

/**
 * Busca o histórico de movimentações (entradas e saídas)
 */
async function carregarHistorico() {
    const listaHistorico = document.getElementById("historico");
    
    // 1. Feedback visual de carregamento
    listaHistorico.innerHTML = `
        <li class="text-gray-400 text-center text-xs animate-pulse py-4 flex flex-col items-center">
            <i class="bi bi-arrow-repeat animate-spin text-xl mb-2"></i>
            Buscando dados...
        </li>`;

    try {
        // AJUSTE AQUI SE SUA ROTA FOR DIFERENTE (Ex: /movimentacoes)
        const url = `${API_BASE_URL}/estoque/${ID_ESTOQUE}/historico`;
        console.log(`[DEBUG] Buscando histórico em: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const dados = await response.json();
        console.log("[DEBUG] Histórico recebido:", dados);

        // 2. Normaliza os dados (Aceita Array direto, Pageable do Spring ou objeto encapsulado)
        let movimentacoes = [];
        if (Array.isArray(dados)) {
            movimentacoes = dados;
        } else if (dados.content) { 
            movimentacoes = dados.content; // Se usar Page<Movimentacao> no Java
        } else if (dados.historico) {
            movimentacoes = dados.historico;
        }

        // 3. Verifica se está vazio
        listaHistorico.innerHTML = "";
        
        if (!movimentacoes || movimentacoes.length === 0) {
            listaHistorico.innerHTML = `
                <li class="text-gray-400 italic text-center py-4 text-xs">
                    <i class="bi bi-calendar-x mb-1 block text-lg"></i>
                    Nenhuma movimentação registrada.
                </li>`;
            return;
        }

        // 4. Renderiza cada item
        movimentacoes.forEach(mov => {
            // Tenta pegar o tipo. Se vier null, assume SAIDA por segurança visual
            // Verifique se no Java é "ENTRADA", "COMPRA", "SAIDA", "CONSUMO", etc.
            const tipoString = mov.tipoMovimentacao || mov.tipo || "SAIDA"; 
            const isEntrada = tipoString === "ENTRADA" || tipoString === "COMPRA";

            // Definição de Cores e Ícones
            const corTexto = isEntrada ? "text-green-700" : "text-red-700";
            const bgIcone = isEntrada ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
            const iconeClass = isEntrada ? "bi-arrow-down-short" : "bi-arrow-up-short";
            const sinal = isEntrada ? "+" : "-";

            // Formatação de Data
            // Tenta pegar 'dataMovimentacao' ou 'data'. Se falhar, usa data atual.
            const dataRaw = mov.dataMovimentacao || mov.data || new Date();
            const dataObj = new Date(dataRaw);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            // Nome do Item (ajuste conforme seu DTO: nomeItem, itemNome, produto, etc)
            const nomeItem = mov.nomeItem || mov.itemNome || "Item desconhecido";
            const motivo = mov.motivo || (isEntrada ? "Entrada" : "Saída");

            const li = document.createElement("li");
            li.className = "flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all";

            li.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full ${bgIcone} flex items-center justify-center shrink-0">
                        <i class="bi ${iconeClass} text-lg"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-semibold text-gray-700 leading-tight">${nomeItem}</span>
                        <span class="text-[10px] text-gray-400 mt-0.5">
                            ${dataFormatada} às ${horaFormatada} • ${motivo}
                        </span>
                    </div>
                </div>
                <div class="font-bold ${corTexto} text-sm whitespace-nowrap">
                    ${sinal}${mov.quantidade} un
                </div>
            `;
            
            listaHistorico.appendChild(li);
        });

    } catch (error) {
        console.error("Erro fatal ao carregar histórico:", error);
        listaHistorico.innerHTML = `
            <li class="text-red-500 text-xs text-center py-2 bg-red-50 rounded border border-red-100">
                <i class="bi bi-exclamation-circle me-1"></i> Erro ao carregar dados.
            </li>`;
    }
}

// --- FORMULÁRIO ---
function abrirFormulario() { document.getElementById("formInsumo").classList.remove("hidden"); }
function fecharFormulario() { document.getElementById("formInsumo").classList.add("hidden"); }
function limparFormulario() {
    ["tipo", "quantidade", "validade", "instituicao", "checklist", "endereco"]
        .forEach(id => document.getElementById(id).value = "");
}

async function confirmarFormulario() {
    const nome = document.getElementById("tipo").value;
    const qtd = document.getElementById("quantidade").value;
    const val = document.getElementById("validade").value;

    if (!nome || !qtd || !val) { alert("Preencha os campos obrigatórios!"); return; }

    const item = {
        nome: nome,
        quantidade: parseInt(qtd),
        dataValidade: val + "T00:00:00",
        estoqueId: ID_ESTOQUE
    };

    try {
        const resp = await fetch(`${API_BASE_URL}/insumos`, { // Ajuste a rota se necessário
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });
        if(resp.ok) {
            alert("Salvo!");
            limparFormulario();
            fecharFormulario();
            carregarEstoque(); // Atualiza a tela
            carregarAlertas();
            carregarHistorico();
        } else {
            alert("Erro ao salvar.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
    }
}