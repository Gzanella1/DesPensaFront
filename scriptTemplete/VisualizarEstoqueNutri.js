const tabela = document.getElementById("tabelaNutricionistas");
const form = document.getElementById("formNutricionista");
let editandoLinha = null;

// ---------- Persistência ----------
function salvarDados() {
    const dados = Array.from(tabela.rows).map(row => ({
        codigo: row.cells[0].innerText,
        Nome_Do_Alimento: row.cells[1].innerText,
        Validade: row.cells[2].innerText,
        Quantidade: row.cells[3].innerText,
        Tipo: row.cells[4].innerText,



    }));
    localStorage.setItem("intituição nutricionista", JSON.stringify(dados));
}

function carregarDados() {
    const dados = JSON.parse(localStorage.getItem("intituição nutricionista")) || [];
    dados.forEach(d => adicionarLinha(d.codigo, d.Nome_Do_Alimento, d.Validade, d.Quantidade, d.Tipo,));
}

// ---------- Função para adicionar linha ----------
function adicionarLinha(codigo, Nome_Do_Alimento, Validade, Quantidade, Tipo,) {
    const linha = tabela.insertRow();
    linha.innerHTML = `
    <td>${codigo}</td>
    <td>${Nome_Do_Alimento}</td>
    <td>${Validade}</td>
    <td>${Quantidade}</td>
    <td>${Tipo}</td>
    
    
    <td>
      <button class="btn btn-success btn-sm me-1 editar" aria-label="Editar"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger btn-sm remover" aria-label="Remover"><i class="bi bi-x"></i></button>
    </td>
  `;
}

// ---------- Salvar (adicionar ou editar) ----------
form.addEventListener("submit", e => {
    e.preventDefault();

    const codigo = document.getElementById("codigo").value;
    const Nome_Do_Alimento = document.getElementById("Nome_Do_Alimento").value;
    const Validade = document.getElementById("Validade").value;
    const Quantidade = document.getElementById("Quantidade").value;
    const Tipo = document.getElementById("Tipo").value;



    if (editandoLinha) {
        editandoLinha.cells[0].innerText = codigo;
        editandoLinha.cells[1].innerText = Nome_Do_Alimento;
        editandoLinha.cells[2].innerText = Validade;
        editandoLinha.cells[3].innerText = Quantidade;
        editandoLinha.cells[4].innerText = Tipo;


        editandoLinha = null;
    } else {
        adicionarLinha(codigo, Nome_Do_Alimento, Validade, Quantidade, Tipo);
    }

    salvarDados();
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
});

// ---------- Editar / Remover ----------
tabela.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const linha = btn.closest("tr");

    if (btn.classList.contains("remover")) {
        if (confirm("Deseja realmente remover este intituição?")) {
            linha.remove();
            salvarDados();

        }
    }

    if (btn.classList.contains("editar")) {
        editandoLinha = linha;
        document.getElementById("codigo").value = linha.cells[0].innerText;
        document.getElementById("Nome_Do_Alimento").value = linha.cells[1].innerText;
        document.getElementById("Validade").value = linha.cells[2].innerText;
        document.getElementById("Quantidade").value = linha.cells[3].innerText;
        document.getElementById("Tipo").value = linha.cells[4].innerText;

        document.getElementById("modalLabel").innerText = "Editar intituição";
        new bootstrap.Modal(document.getElementById("modalForm")).show();
    }
});

// ---------- Reset modal ----------
document.getElementById("modalForm").addEventListener("hidden.bs.modal", () => {
    editandoLinha = null;
    document.getElementById("modalLabel").innerText = "Adicionar intituição ";
    form.reset();
});

// ---------- Busca ----------
document.getElementById("buscar").addEventListener("keyup", () => {
    const termo = document.getElementById("buscar").value.toLowerCase();
    Array.from(tabela.rows).forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(termo) ? "" : "none";
    });
});

// ---------- Carregar dados ao iniciar ----------
window.addEventListener("DOMContentLoaded", carregarDados);