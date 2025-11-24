// =========================================================
// CONFIGURAÇÕES GLOBAIS
// =========================================================
const API_URL = "http://localhost:8080/api/alimentos";
const ESTOQUE_ID = 1; // ID fixo para teste

// =========================================================
// INICIALIZAÇÃO (Igual ao seu código de sugestões)
// =========================================================
window.onload = () => {
    // 1. Carrega Sidebar
    if (typeof carregarSidebar === 'function') carregarSidebar();

    // 2. Configura o Modal do Bootstrap
    const modalEl = document.getElementById('modalForm');
    if (modalEl) {
        window.modalInstance = new bootstrap.Modal(modalEl);
    }

    // 3. Configura o Formulário (Evita o erro de null se não achar)
    configurarFormulario();

    // 4. CHAMA A LISTAGEM
    listarAlimentos();
};

// =========================================================
// 1. FUNÇÃO PARA LISTAR (Baseada em buscarSugestoes)
// =========================================================
async function listarAlimentos() {
    const tabela = document.getElementById('tabelaAlimentos');
    const loading = document.getElementById('loading');

    // Reset visual
    tabela.innerHTML = '';
    if(loading) loading.classList.remove('d-none');

    try {
        // Chamada GET para o estoque
        const response = await fetch(`${API_URL}/estoque/${ESTOQUE_ID}`);

        if (!response.ok) throw new Error("Erro ao consultar API Java");

        const lista = await response.json();

        // Verifica se veio vazio
        if (lista.length === 0) {
            tabela.innerHTML = `<tr><td colspan="7" class="text-muted">Nenhum alimento encontrado no estoque.</td></tr>`;
            return;
        }

        // Renderiza as linhas (Igual ao seu forEach de receitas)
        lista.forEach(item => {
            const tr = document.createElement('tr');
            
            // Tratamento de nulos
            const nome = item.nome || "Sem Nome";
            const codigo = item.codigo || "-";
            const validade = formatarData(item.dataValidade);
            const qtd = item.quantidade || 0;
            const uni = item.unidadeMedida || "";
            const cat = item.categoria || "OUTROS";
            const cal = item.valorCalorico || "-";
            const id = item.idAlimento || item.id; // Garante pegar o ID certo

            tr.innerHTML = `
                <td>${codigo}</td>
                <td class="fw-bold text-start ps-4">${nome}</td>
                <td>${validade}</td>
                <td>${qtd} <small class="text-muted">${uni}</small></td>
                <td><span class="badge bg-light text-dark border">${cat}</span></td>
                <td>${cal}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="alert('Funcionalidade de Editar em breve!')">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletarAlimento(${id})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            
            tabela.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro ao listar:", error);
        tabela.innerHTML = `<tr><td colspan="7" class="text-danger">Erro de conexão com o servidor (Porta 8080).</td></tr>`;
    } finally {
        if(loading) loading.classList.add('d-none');
    }
}

// =========================================================
// 2. FUNÇÃO PARA DELETAR
// =========================================================
async function deletarAlimento(id) {
    if(!confirm("Tem certeza que deseja remover este item?")) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if(res.ok) {
            listarAlimentos(); // Recarrega a lista
        } else {
            alert("Erro ao excluir.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}

// =========================================================
// 3. CONFIGURAR FORMULÁRIO (SALVAR)
// =========================================================
function configurarFormulario() {
    // Tenta achar o formulário por qualquer um dos IDs prováveis
    const form = document.getElementById('formNutricionista') || document.getElementById('formAlimento');

    if (!form) {
        console.warn("Formulário não encontrado no HTML. O botão 'Confirmar' não vai funcionar.");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Não recarrega a página

        const dados = {
            nome: document.getElementById('nome').value,
            codigo: document.getElementById('codigo').value,
            categoria: document.getElementById('categoria').value,
            quantidade: document.getElementById('quantidade').value,
            unidadeMedida: document.getElementById('unidadeMedida').value,
            dataValidade: document.getElementById('dataValidade').value,
            valorCalorico: document.getElementById('valorCalorico').value,
            estoqueId: ESTOQUE_ID
        };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            if (res.ok) {
                alert("Salvo com sucesso!");
                if(window.modalInstance) window.modalInstance.hide();
                form.reset();
                listarAlimentos(); // Atualiza a tabela na hora
            } else {
                alert("Erro ao salvar no banco.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        }
    });
}

// =========================================================
// 4. FUNÇÕES AUXILIARES
// =========================================================
function formatarData(dataISO) {
    if (!dataISO) return "-";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

function filtrarTabela() {
    const termo = document.getElementById("buscar").value.toLowerCase();
    const linhas = document.getElementById("tabelaAlimentos").getElementsByTagName("tr");

    for (let linha of linhas) {
        const texto = linha.innerText.toLowerCase();
        linha.style.display = texto.includes(termo) ? "" : "none";
    }
}

// Função chamada pelo botão "Novo Insumo" no HTML
function abrirModalNovo() {
    const form = document.getElementById('formNutricionista') || document.getElementById('formAlimento');
    if(form) form.reset();
    
    if(window.modalInstance) {
        window.modalInstance.show();
    } else {
        // Fallback caso o modalInstance não tenha iniciado
        const modalEl = document.getElementById('modalForm');
        new bootstrap.Modal(modalEl).show();
    }
}