document.addEventListener("DOMContentLoaded", () => {
    carregarNutricionistas();
});

const API_URL = 'http://localhost:8080/usuario/buscarAll'; // Verifique se a porta é 8080

async function carregarNutricionistas() {
    const tbody = document.getElementById('tabelaNutricionistas');
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const nutricionistas = await response.json();

        // Limpa a tabela antes de preencher
        tbody.innerHTML = '';

        nutricionistas.forEach(nutri => {
            const linha = criarLinhaTabela(nutri);
            tbody.appendChild(linha);
        });

    } catch (error) {
        console.error('Erro ao carregar nutricionistas:', error);
        tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Erro ao carregar dados. Verifique o console.</td></tr>`;
    }
}

function criarLinhaTabela(nutri) {
    const tr = document.createElement('tr');

    // Lógica para definir Status (Ativo/Inativo) baseado no Boolean do Java
    const statusTexto = nutri.ativo ? 'Ativo' : 'Inativo';
    const statusClass = nutri.ativo ? 'text-success bg-success-subtle border border-success' : 'text-danger bg-danger-subtle border border-danger';
    const badgeStatus = `<span class="badge ${statusClass} rounded-pill">${statusTexto}</span>`;

    // Campos mapeados do DTO:
    // Nome -> nutri.nome
    // Instituição -> nutri.idInstituicao (DTO retorna ID, ideal seria Nome)
    // Contato -> nutri.email
    // Status -> nutri.ativo
    // Frequência -> Não existe no DTO ainda (colocado "-")
    
    tr.innerHTML = `
        <td class="fw-bold text-secondary">${nutri.nome || 'Sem nome'}</td>
        <td>${nutri.idInstituicao ? 'Inst. ID: ' + nutri.idInstituicao : 'N/A'}</td>
        <td>${nutri.email || 'Sem email'}</td>
        <td>${badgeStatus}</td>
        <td>-</td> 
        <td>
            <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="editarNutricionista(${nutri.codigo})">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletarNutricionista(${nutri.codigo})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;

    return tr;
}

// Funções placeholders para os botões de ação
function editarNutricionista(id) {
    console.log(`Editar usuário ID: ${id}`);
    // Aqui você implementaria a lógica de abrir o modal e preencher os dados
}

function deletarNutricionista(id) {
    if(confirm('Tem certeza que deseja excluir este nutricionista?')) {
        console.log(`Deletar usuário ID: ${id}`);
        // Aqui você chamaria o fetch com method: 'DELETE'
    }
}