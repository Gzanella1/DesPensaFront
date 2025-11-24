/**
 * IntituicaoAdmin.js
 * Integração Frontend <-> Backend Java Spring Boot
 */

const API_URL = "http://localhost:8080/api/instituicoes";
let mapa;

// --- 1. Inicialização (Ao carregar a página) ---
document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema de Instituições Iniciado.");
    
    // Carrega a lista e o mapa
    carregarInstituicoes();
    inicializarMapa();
    
    // Configura o botão "Nova Instituição" (ID: btnNovaInstituicao)
    const btnNova = document.getElementById("btnNovaInstituicao");
    if (btnNova) {
        btnNova.addEventListener("click", abrirModalCadastro);
    }

    // Configura a troca de campos no Select (ID: tipoSelect)
    const selectTipo = document.getElementById("tipoSelect");
    if (selectTipo) {
        selectTipo.addEventListener("change", alternarCamposEspecificos);
    }

    // Configura o envio do formulário (ID: formInstituicao)
    const form = document.getElementById("formInstituicao");
    if (form) {
        form.addEventListener("submit", salvarInstituicao);
    }
});

// --- 2. Mapa (Leaflet) ---
function inicializarMapa() {
    // Verifica se o elemento mapa existe para evitar erro
    if (!document.getElementById('map')) return;

    try {
        // Coordenadas iniciais (Ex: Centro de SP)
        mapa = L.map('map').setView([-23.550520, -46.633308], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapa);
    } catch (e) {
        console.warn("Erro ao carregar mapa:", e);
    }
}

// --- 3. Controle da Interface (Modal e Campos) ---

function abrirModalCadastro() {
    const form = document.getElementById("formInstituicao");
    if(form) form.reset(); // Limpa os campos
    
    // Esconde todos os campos específicos inicialmente
    document.getElementById("camposCreche").style.display = "none";
    document.getElementById("camposEscola").style.display = "none";
    document.getElementById("camposHotel").style.display = "none";
    
    // Abre o Modal usando Bootstrap
    const modalEl = document.getElementById("modalForm");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function alternarCamposEspecificos() {
    // 1. Esconde todos
    document.getElementById("camposCreche").style.display = "none";
    document.getElementById("camposEscola").style.display = "none";
    document.getElementById("camposHotel").style.display = "none";

    // 2. Mostra apenas o selecionado
    const tipo = document.getElementById("tipoSelect").value;
    
    if (tipo === "creche") {
        document.getElementById("camposCreche").style.display = "block";
    } else if (tipo === "escola") {
        document.getElementById("camposEscola").style.display = "block";
    } else if (tipo === "hotel") {
        document.getElementById("camposHotel").style.display = "block";
    }
}

// --- 4. Integração com Backend (CRUD) ---

// === LISTAR (GET) ===
async function carregarInstituicoes() {
    const tabela = document.getElementById("tabelaInstituicoes");
    tabela.innerHTML = '<tr><td colspan="6"><div class="spinner-border text-success"></div> Carregando...</td></tr>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar dados da API.");
        
        const lista = await response.json();
        tabela.innerHTML = ""; // Limpa o loader

        if (lista.length === 0) {
            tabela.innerHTML = '<tr><td colspan="6" class="text-muted">Nenhuma instituição cadastrada.</td></tr>';
            return;
        }

        // Percorre a lista e cria as linhas da tabela
        lista.forEach(inst => {
            const linha = document.createElement("tr");
            
            // Lógica para descobrir o tipo baseado nos campos que vieram do Java
            let tipoLabel = '<span class="badge bg-secondary">Outro</span>';
            if (inst.idadeMaximaAtendidaMeses !== undefined && inst.idadeMaximaAtendidaMeses !== null) 
                tipoLabel = '<span class="badge bg-primary">Creche</span>';
            else if (inst.numeroMatriculas !== undefined && inst.numeroMatriculas !== null) 
                tipoLabel = '<span class="badge bg-warning text-dark">Escola</span>';
            else if (inst.numeroQuartos !== undefined && inst.numeroQuartos !== null) 
                tipoLabel = '<span class="badge bg-info text-dark">Hotel</span>';

            // Formata o endereço (evita crash se vier null)
            const end = inst.endereco || {};
            const enderecoTexto = end.rua ? `${end.rua}, ${end.numero} - ${end.bairro}` : "Sem endereço";

            linha.innerHTML = `
                <td>${inst.codigo}</td>
                <td class="fw-bold text-start">${inst.nome}</td>
                <td>${tipoLabel}</td>
                <td>${inst.telefone || '-'}</td>
                <td class="text-start"><small>${enderecoTexto}</small></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletarInstituicao(${inst.idInstituicao})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tabela.appendChild(linha);
        });

    } catch (error) {
        console.error(error);
        tabela.innerHTML = '<tr><td colspan="6" class="text-danger">Erro de conexão com o servidor Java.</td></tr>';
    }
}

// === SALVAR (POST) ===
async function salvarInstituicao(event) {
    event.preventDefault(); // Impede a página de recarregar

    const tipo = document.getElementById("tipoSelect").value;
    if (!tipo) return alert("Selecione o tipo de instituição!");

    // 1. Monta o Objeto Base (Payload)
    // ATENÇÃO: A estrutura "endereco" aninhada é OBRIGATÓRIA para o Java
    const payload = {
        codigo: parseInt(document.getElementById("codigo").value) || 0,
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        endereco: {
            cep: document.getElementById("cep").value,
            rua: document.getElementById("rua").value,
            numero: document.getElementById("numero").value,
            bairro: document.getElementById("bairro").value, // Campo obrigatório no seu banco
            cidade: document.getElementById("cidade").value
        }
    };

    let endpoint = "";

    // 2. Adiciona campos específicos baseado no tipo
    if (tipo === "creche") {
        endpoint = "/creche";
        payload.idadeMaximaAtendidaMeses = parseInt(document.getElementById("crecheIdade").value) || 0;
        payload.capacidade = parseInt(document.getElementById("crecheCapacidade").value) || 0;
    } else if (tipo === "escola") {
        endpoint = "/escola";
        payload.numeroMatriculas = parseInt(document.getElementById("escolaMatriculas").value) || 0;
        payload.turno = document.getElementById("escolaTurno").value;
    } else if (tipo === "hotel") {
        endpoint = "/hotel";
        payload.numeroQuartos = parseInt(document.getElementById("hotelQuartos").value) || 0;
        payload.classificacaoEstrelas = parseInt(document.getElementById("hotelEstrelas").value) || 0;
    }

    // 3. Envia para o Backend
    try {
        const response = await fetch(API_URL + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Instituição salva com sucesso!");
            
            // Fecha o Modal
            const modalEl = document.getElementById("modalForm");
            bootstrap.Modal.getInstance(modalEl).hide();
            
            // Atualiza a lista na tela
            carregarInstituicoes();
        } else {
            const erroTxt = await response.text();
            alert("Erro ao salvar: " + erroTxt);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão com o servidor.");
    }
}

// === DELETAR (DELETE) ===
// Exposta no objeto window para o HTML conseguir chamar via onclick="deletarInstituicao(...)"
window.deletarInstituicao = async function(id) {
    if (confirm("Tem certeza que deseja excluir esta instituição?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (response.ok || response.status === 204) {
                alert("Instituição excluída!");
                carregarInstituicoes(); // Recarrega a tabela
            } else {
                alert("Erro ao excluir.");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao tentar excluir.");
        }
    }
};