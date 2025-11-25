const API_BASE = "http://localhost:8080/usuario";

let editMode = false;
let editCodigo = null;

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuarios();
    carregarNutricionistas();
});

// ------------------------- LISTAR USUÁRIOS -------------------------
async function carregarUsuarios() {
    const tbody = document.getElementById("tabelaUsuarios");
    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE}/buscarAll`);
        const lista = await res.json();

        tbody.innerHTML = "";
        lista.forEach(u => tbody.appendChild(linhaUsuario(u)));
    } catch (e) {
        console.error(e);
        tbody.innerHTML = `<tr><td colspan='8' class='text-danger text-center'>Erro ao carregar.</td></tr>`;
    }
}

function linhaUsuario(u) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${u.codigo}</td>
        <td>${u.nome}</td>
        <td>${u.cpf || '-'}</td>
        <td>${u.email || '-'}</td>
        <td>${u.dataCriacao ? new Date(u.dataCriacao).toLocaleString() : '-'}</td>
        <td>${u.tipoAcesso}</td>
        <td>${u.ativo ? '<span class="text-success">Ativo</span>' : '<span class="text-danger">Inativo</span>'}</td>
        <td>
            <div class='d-flex justify-content-center gap-2'>
                <button class='btn btn-sm btn-outline-primary' onclick='abrirEdicao(${u.codigo})'>
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class='btn btn-sm btn-outline-danger' onclick='deletarPessoa(${u.codigo})'>
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;
    return tr;
}

// ------------------------- ABRIR MODAL PARA EDITAR -------------------------
async function abrirEdicao(codigo) {
    editMode = true;
    editCodigo = codigo;

    try {
        const res = await fetch(`${API_BASE}/buscar/${codigo}`);
        const u = await res.json();

        document.getElementById("codigo_usuario").value = u.codigo;
        document.getElementById("nome").value = u.nome;
        document.getElementById("login").value = u.login;
        document.getElementById("senha").value = ""; // senha não retorna do backend
        document.getElementById("cpf").value = u.cpf || '';
        document.getElementById("email").value = u.email || '';
        document.getElementById("tipoAcesso").value = u.tipoAcesso || 'USUARIO';
        document.getElementById("ativo").value = u.ativo ? "true" : "false";

        const modal = new bootstrap.Modal(document.getElementById("modalForm"));
        modal.show();
    } catch (e) {
        console.error(e);
        alert("Erro ao abrir usuário para edição.");
    }
}

// ------------------------- SALVAR USUÁRIO (CRIAR OU EDITAR) -------------------------
async function salvarUsuario() {
    const tipoAcessoValue = document.getElementById("tipoAcesso").value || "USUARIO";

    const dto = {
        codigo: editMode ? editCodigo : null,
        nome: document.getElementById("nome").value,
        login: document.getElementById("login").value,
        senha: document.getElementById("senha").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        tipoAcesso: tipoAcessoValue,
        ativo: document.getElementById("ativo").value === "true",
        idInstituicao: 1
    };

    const url = editMode ? `${API_BASE}/atualizar` : `${API_BASE}/cadastro`;
    const method = editMode ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Erro: ${res.status} - ${text}`);
        }

        fecharModal();
        carregarUsuarios();
        carregarNutricionistas();
    } catch (e) {
        console.error(e);
        alert("Erro ao salvar usuário. Veja o console.");
    }
}

// ------------------------- DELETE FUSIONADO (Usuário/Nutricionista) -------------------------
async function deletarPessoa(codigo) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
        await fetch(`${API_BASE}/deletar/${codigo}`, { method: "DELETE" });

        // Atualiza as tabelas
        carregarUsuarios();
        carregarNutricionistas();
    } catch (e) {
        console.error(e);
        alert("Erro ao deletar.");
    }
}

// ------------------------- FECHAR MODAL -------------------------
function fecharModal() {
    document.getElementById("formUsuario").reset();
    editMode = false;
    editCodigo = null;

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalForm"));
    if (modal) modal.hide();
}

// ------------------------- NUTRICIONISTAS -------------------------
async function carregarNutricionistas() {
    const tbody = document.getElementById('tabelaNutricionistas');
    if (!tbody) return;

    try {
        const response = await fetch(`${API_BASE}/buscarAll`);
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

        const nutricionistas = await response.json();
        tbody.innerHTML = '';

        nutricionistas.forEach(nutri => {
            tbody.appendChild(criarLinhaNutricionista(nutri));
        });

    } catch (error) {
        console.error('Erro ao carregar nutricionistas:', error);
        tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Erro ao carregar dados. Verifique o console.</td></tr>`;
    }
}

function criarLinhaNutricionista(nutri) {
    const tr = document.createElement('tr');
    const statusTexto = nutri.ativo ? 'Ativo' : 'Inativo';
    const statusClass = nutri.ativo ? 'text-success bg-success-subtle border border-success' : 'text-danger bg-danger-subtle border border-danger';
    const badgeStatus = `<span class="badge ${statusClass} rounded-pill">${statusTexto}</span>`;

    tr.innerHTML = `
        <td class="fw-bold text-secondary">${nutri.nome || 'Sem nome'}</td>
        <td>${nutri.idInstituicao ? 'Inst. ID: ' + nutri.idInstituicao : 'N/A'}</td>
        <td>${nutri.email || 'Sem email'}</td>
        <td>${badgeStatus}</td>
        <td>-</td>
        <td>
            <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="abrirEdicao(${nutri.codigo})">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletarPessoa(${nutri.codigo})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;

    return tr;
}
