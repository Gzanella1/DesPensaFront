const tabela = document.getElementById("tabelaNutricionistas");
const form = document.getElementById("formNutricionista");
let editandoLinha = null;

// ---------- Persistência ----------
function salvarDados() {
  const dados = Array.from(tabela.rows).map(row => ({
    instituição: row.cells[0].innerText,
    Número_de_pessoas: row.cells[1].innerText,
    tipo: row.cells[2].innerText,
    Priorizar: row.cells[3].innerText,
    restrições: row.cells[4].innerText,


    
  }));
  localStorage.setItem("nutricionistas", JSON.stringify(dados));
}

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("nutricionistas")) || [];
  dados.forEach(d => adicionarLinha(d.instituição, d.Número_de_pessoas, d.tipo, d.Priorizar, d.restrições));
}

// ---------- Função para adicionar linha ----------
function adicionarLinha(instituição, Número_de_pessoas, tipo, Priorizar, restrições) {
  const linha = tabela.insertRow();
  linha.innerHTML = `
    <td>${instituição}</td>
    <td>${Número_de_pessoas}</td>
    <td>${tipo}</td>
    <td>${Priorizar}</td>
    <td>${restrições}</td>
   
    <td>
      <button class="btn btn-success btn-sm me-1 editar" aria-label="Editar"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger btn-sm remover" aria-label="Remover"><i class="bi bi-x"></i></button>
    </td>
  `;
}

// ---------- Salvar (adicionar ou editar) ----------
form.addEventListener("submit", e => {
  e.preventDefault();

  const instituição = document.getElementById("instituição").value;
  const Número_de_pessoas = document.getElementById("Número_de_pessoas").value;
  const tipo = document.getElementById("tipo").value;
  const Priorizar = document.getElementById("Priorizar").value;
  const restrições = document.getElementById("restrições").value;

  if (editandoLinha) {
    editandoLinha.cells[0].innerText = instituição;
    editandoLinha.cells[1].innerText = Número_de_pessoas;
    editandoLinha.cells[2].innerText = tipo;
    editandoLinha.cells[3].innerText = Priorizar;
    editandoLinha.cells[4].innerText = restrições;
    editandoLinha = null;
  } else {
    adicionarLinha(instituição, Número_de_pessoas, tipo, Priorizar, restrições);
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
    if (confirm("Deseja realmente remover esta cardápio?")) {
      linha.remove();
      salvarDados();
    }
  }

  if (btn.classList.contains("editar")) {
    editandoLinha = linha;
    document.getElementById("instituição").value = linha.cells[0].innerText;
    document.getElementById("Número_de_pessoas").value = linha.cells[1].innerText;
    document.getElementById("tipo").value = linha.cells[2].innerText;
    document.getElementById("Priorizar").value = linha.cells[3].innerText;
    document.getElementById("restrições").value = linha.cells[4].innerText;
    document.getElementById("modalLabel").innerText = "Editar Nutricionista";
    new bootstrap.Modal(document.getElementById("modalForm")).show();
  }
});

// ---------- Reset modal ----------
document.getElementById("modalForm").addEventListener("hidden.bs.modal", () => {
  editandoLinha = null;
  document.getElementById("modalLabel").innerText = "Adicionar cardápio";
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
