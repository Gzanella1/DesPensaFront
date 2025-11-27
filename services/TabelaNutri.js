// --- Configuração das APIs ---
const API_URL_BASE = 'http://localhost:8080/usuario';
const API_INSTITUICOES = 'http://localhost:8080/api/instituicoes'; // Ajuste se necessário

// Instância do Modal do Bootstrap
let modalForm;

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa o modal
    const modalElement = document.getElementById('modalForm');
    modalForm = new bootstrap.Modal(modalElement, { backdrop: 'static' });

    // Carrega dados iniciais
    carregarInstituicoes();
    carregarNutricionistas();

    // Evento de Submit do Formulário
    document.getElementById('formNutricionista').addEventListener('submit', salvarNutricionista);
    
    // Evento para limpar formulário ao abrir o modal pelo botão "Adicionar"
    const btnAdicionar = document.querySelector('[data-bs-target="#modalForm"]');
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => prepararModalParaCriacao());
    }
});

// =========================================================================
// 1. READ (Listar e Carregar Selects)
// =========================================================================

async function carregarInstituicoes() {
    const select = document.getElementById('instituicaoSelect');
    try {
        const response = await fetch(API_INSTITUICOES);
        if (response.ok) {
            const instituicoes = await response.json();
            select.innerHTML = '<option value="" selected disabled>Selecione uma instituição...</option>';
            instituicoes.forEach(inst => {
                const option = document.createElement('option');
                option.value = inst.id; // Supondo que o ID da instituição seja 'id'
                option.textContent = `${inst.nome}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar instituições:", error);
        select.innerHTML = '<option disabled>Erro ao carregar</option>';
    }
}

async function carregarNutricionistas() {
    const tbody = document.getElementById('tabelaNutricionistas');
    tbody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';

    try {
        const response = await fetch(`${API_URL_BASE}/buscarAll`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const nutricionistas = await response.json();
        tbody.innerHTML = ''; // Limpa tabela

        if (nutricionistas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhum nutricionista cadastrado.</td></tr>';
            return;
        }

        nutricionistas.forEach(nutri => {
            const linha = criarLinhaTabela(nutri);
            tbody.appendChild(linha);
        });

    } catch (error) {
        console.error('Erro ao carregar nutricionistas:', error);
        tbody.innerHTML = `<tr><td colspan="6" class="text-danger">Erro ao carregar dados.</td></tr>`;
    }
}

function criarLinhaTabela(nutri) {
    const tr = document.createElement('tr');

    // Status Badge
    const statusTexto = nutri.ativo ? 'Ativo' : 'Inativo';
    const statusClass = nutri.ativo ? 'text-success bg-success-subtle border border-success' : 'text-danger bg-danger-subtle border border-danger';
    const badgeStatus = `<span class="badge ${statusClass} rounded-pill">${statusTexto}</span>`;

    tr.innerHTML = `
        <td class="fw-bold text-secondary text-start ps-4">${nutri.nome || 'Sem nome'}</td>
        <td>${nutri.idInstituicao ? 'ID Inst: ' + nutri.idInstituicao : '-'}</td>
        <td>${nutri.email || '-'}</td>
        <td>${badgeStatus}</td>
        <td>${nutri.tipoAcesso || 'NUTRICIONISTA'}</td>
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

// =========================================================================
// 2. CREATE & UPDATE (Salvar)
// =========================================================================

async function salvarNutricionista(event) {
    event.preventDefault(); // Impede o refresh da página

    // Coleta os dados do formulário
    const codigo = document.getElementById('codigo').value; // Se tiver valor, é Edição
    
    const usuarioData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        login: document.getElementById('login').value,
        senha: document.getElementById('senha').value,
        fotoPerfil: document.getElementById('fotoPerfil').value,
        dataCriacao: document.getElementById('dataCriacao').value, // Formato YYYY-MM-DD do input date
        ativo: document.getElementById('ativo').value === 'true', // Converte string para boolean
        tipoAcesso: document.getElementById('tipoAcesso').value,
        idInstituicao: parseInt(document.getElementById('instituicaoSelect').value)
    };

    // Validação básica
    if (!usuarioData.idInstituicao) {
        alert("Por favor, selecione uma instituição.");
        return;
    }

    try {
        let url;
        let method;
        let mensagemSucesso;

        if (codigo) {
            // --- UPDATE (PUT) ---
            url = `${API_URL_BASE}/atualizar/${codigo}`;
            method = 'PUT';
            usuarioData.codigo = parseInt(codigo); // Adiciona o ID no corpo se necessário, ou usa só na URL
            mensagemSucesso = 'Nutricionista atualizado com sucesso!';
        } else {
            // --- CREATE (POST) ---
            url = `${API_URL_BASE}/cadastro`;
            method = 'POST';
            mensagemSucesso = 'Nutricionista cadastrado com sucesso!';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioData)
        });

        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

        alert(mensagemSucesso);
        modalForm.hide(); // Fecha o modal
        carregarNutricionistas(); // Recarrega a tabela

    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar os dados. Verifique o console.');
    }
}

// =========================================================================
// 3. PREPARAR MODAL (Create vs Edit)
// =========================================================================

function prepararModalParaCriacao() {
    limparFormulario();
    document.getElementById('modalLabel').textContent = "Adicionar Nutricionista";
    document.getElementById('codigo').value = ""; // Garante que está vazio para o IF do salvar
    document.getElementById('codigo').readOnly = false; // Opcional: permitir digitar ID na criação ou deixar Auto
}

// Função chamada pelo botão de lápis na tabela
async function editarNutricionista(id) {
    try {
        // 1. Busca os dados atuais do usuário pelo ID
        const response = await fetch(`${API_URL_BASE}/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar dados do usuário');
        
        const usuario = await response.json();

        // 2. Preenche o formulário
        document.getElementById('codigo').value = usuario.codigo;
        // document.getElementById('codigo').readOnly = true; // Bloqueia edição do ID no update
        
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('cpf').value = usuario.cpf;
        document.getElementById('email').value = usuario.email;
        document.getElementById('login').value = usuario.login;
        document.getElementById('senha').value = usuario.senha; // Cuidado com segurança aqui
        document.getElementById('fotoPerfil').value = usuario.fotoPerfil;
        document.getElementById('tipoAcesso').value = usuario.tipoAcesso;
        document.getElementById('ativo').value = usuario.ativo.toString(); // converte boolean para string do select
        document.getElementById('instituicaoSelect').value = usuario.idInstituicao;

        // Formata data para o input date (YYYY-MM-DD) se vier completa
        if(usuario.dataCriacao) {
            document.getElementById('dataCriacao').value = usuario.dataCriacao.split('T')[0];
        }

        // 3. Ajusta título e abre modal
        document.getElementById('modalLabel').textContent = "Editar Nutricionista";
        modalForm.show();

    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar os dados para edição.");
    }
}

function limparFormulario() {
    document.getElementById('formNutricionista').reset();
    document.getElementById('codigo').value = "";
}

// =========================================================================
// 4. DELETE
// =========================================================================

async function deletarNutricionista(id) {
    if (confirm(`Tem certeza que deseja excluir o nutricionista de código ${id}?`)) {
        try {
            const response = await fetch(`${API_URL_BASE}/Deletar/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Nutricionista excluído com sucesso!');
                carregarNutricionistas();
            } else {
                alert('Erro ao excluir. O servidor retornou: ' + response.status);
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro de conexão ao tentar deletar.');
        }
    }
}

