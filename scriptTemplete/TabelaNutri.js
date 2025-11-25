const tabela = document.getElementById("tabelaNutricionistas");
const form = document.getElementById("formNutricionista");
let editandoLinha = null;

// ---------- Persistência ----------
function salvarDados() {
  const dados = Array.from(tabela.rows).map((row) => ({
    nome: row.cells[0].innerText,
    instituicao: row.cells[1].innerText,
    contato: row.cells[2].innerText,
    status: row.cells[3].innerText,
    frequencia: row.cells[4].innerText,
  }));
  localStorage.setItem("nutricionistas", JSON.stringify(dados));
}

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("nutricionistas")) || [];
  dados.forEach((d) =>
    adicionarLinha(d.nome, d.instituicao, d.contato, d.status, d.frequencia)
  );
}

// ---------- Função para adicionar linha ----------
function adicionarLinha(nome, instituicao, contato, status, frequencia) {
  const linha = tabela.insertRow();
  linha.innerHTML = `
    <td>${nome}</td>
    <td>${instituicao}</td>
    <td>${contato}</td>
    <td>${status}</td>
    <td>${frequencia}</td>
    <td>
      <button class="btn btn-success btn-sm me-1 editar" aria-label="Editar"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger btn-sm remover" aria-label="Remover"><i class="bi bi-x"></i></button>
    </td>
  `;
}

// ---------- Salvar (adicionar ou editar) ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const instituicao = document.getElementById("instituicao").value.trim();
  const contato = document.getElementById("contato").value.trim();
  const status = document.getElementById("status").value;
  const frequencia = document.getElementById("frequencia").value;

  if (editandoLinha) {
    editandoLinha.cells[0].innerText = nome;
    editandoLinha.cells[1].innerText = instituicao;
    editandoLinha.cells[2].innerText = contato;
    editandoLinha.cells[3].innerText = status;
    editandoLinha.cells[4].innerText = frequencia;
    editandoLinha = null;
  } else {
    adicionarLinha(nome, instituicao, contato, status, frequencia);
  }

  salvarDados();
  form.reset();
  bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
});

// ---------- Editar / Remover ----------
tabela.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const linha = btn.closest("tr");

  if (btn.classList.contains("remover")) {
    if (confirm("Deseja realmente remover este nutricionista?")) {
      linha.remove();
      salvarDados();
    }
  }

  if (btn.classList.contains("editar")) {
    editandoLinha = linha;
    document.getElementById("nome").value = linha.cells[0].innerText;
    document.getElementById("instituicao").value = linha.cells[1].innerText;
    document.getElementById("contato").value = linha.cells[2].innerText;
    document.getElementById("status").value = linha.cells[3].innerText;
    document.getElementById("frequencia").value = linha.cells[4].innerText;
    document.getElementById("modalLabel").innerText = "Editar Nutricionista";
    new bootstrap.Modal(document.getElementById("modalForm")).show();
  }
});

// ---------- Reset modal ----------
document.getElementById("modalForm").addEventListener("hidden.bs.modal", () => {
  editandoLinha = null;
  document.getElementById("modalLabel").innerText = "Adicionar Nutricionista";
  form.reset();
});

// ---------- Busca ----------
document.getElementById("buscar").addEventListener("keyup", () => {
  const termo = document.getElementById("buscar").value.toLowerCase();
  Array.from(tabela.rows).forEach((row) => {
    row.style.display = row.innerText.toLowerCase().includes(termo) ? "" : "none";
  });
});

// ---------- Carregar dados ao iniciar ----------
window.addEventListener("DOMContentLoaded", carregarDados);
