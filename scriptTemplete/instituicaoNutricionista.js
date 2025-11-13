const tabela = document.getElementById("tabelaNutricionistas");
const form = document.getElementById("formNutricionista");
let editandoLinha = null;

// ---------- Persistência ----------
function salvarDados() {
  const dados = Array.from(tabela.rows).map(row => ({
    nome: row.cells[0].innerText,
    Idd: row.cells[1].innerText,
    sexo: row.cells[2].innerText,
    restrições: row.cells[3].innerText,


    
  }));
  localStorage.setItem("nutricionistas", JSON.stringify(dados));
}

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("nutricionistas")) || [];
  dados.forEach(d => adicionarLinha(d.nome, d.Idd, d.sexo, d.restrições));
}

// ---------- Função para adicionar linha ----------
function adicionarLinha(nome, Idd, sexo, restrições,) {
  const linha = tabela.insertRow();
  linha.innerHTML = `
    <td>${nome}</td>
    <td>${Idd}</td>
    <td>${sexo}</td>
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

  const nome = document.getElementById("nome").value;
  const Idd = document.getElementById("Idd").value;
  const sexo = document.getElementById("sexo").value;
  const restrições = document.getElementById("restrições").value;

  if (editandoLinha) {
    editandoLinha.cells[0].innerText = nome;
    editandoLinha.cells[1].innerText = Idd;
    editandoLinha.cells[2].innerText = sexo;
    editandoLinha.cells[3].innerText = restrições;
    editandoLinha = null;
  } else {
    adicionarLinha(nome, Idd, sexo, restrições);
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
    if (confirm("Deseja realmente remover esta pessoa?")) {
      linha.remove();
      salvarDados();
    }
  }

  if (btn.classList.contains("editar")) {
    editandoLinha = linha;
    document.getElementById("nome").value = linha.cells[0].innerText;
    document.getElementById("Idd").value = linha.cells[1].innerText;
    document.getElementById("sexo").value = linha.cells[2].innerText;
    document.getElementById("restrições").value = linha.cells[3].innerText;
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
  Array.from(tabela.rows).forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(termo) ? "" : "none";
  });
});

// ---------- Carregar dados ao iniciar ----------
window.addEventListener("DOMContentLoaded", carregarDados);
