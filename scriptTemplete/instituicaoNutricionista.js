const tabela = document.getElementById("tabelaNutricionistas");
const form = document.getElementById("formNutricionista");
let editandoLinha = null;

// ---------- Persistência ----------
function salvarDados() {
  const dados = Array.from(tabela.rows).map(row => ({
    Codigo: row.cells[0].innerText,
    Tipo_da_instituição: row.cells[1].innerText,
    Endereço: row.cells[2].innerText,
   
  }));
  localStorage.setItem("intituição nutricionista", JSON.stringify(dados));
}

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("intituição nutricionista")) || [];
  dados.forEach(d => adicionarLinha(d.Codigo, d.Tipo_da_instituição, d.Endereço,));
}

// ---------- Função para adicionar linha ----------
function adicionarLinha(Codigo, Tipo_da_instituição, Endereço,) {
  const linha = tabela.insertRow();
  linha.innerHTML = `
    <td>${Codigo}</td>
    <td>${Tipo_da_instituição}</td>
    <td>${Endereço}</td>
    
    <td>
      <button class="btn btn-success btn-sm me-1 editar" aria-label="Editar"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger btn-sm remover" aria-label="Remover"><i class="bi bi-x"></i></button>
    </td>
  `;
}

// ---------- Salvar (adicionar ou editar) ----------
form.addEventListener("submit", e => {
  e.preventDefault();

  const Codigo = document.getElementById("Codigo").value;
  const Tipo_da_instituição = document.getElementById("Tipo_da_instituição").value;
  const Endereço = document.getElementById("Endereço").value;
  

  if (editandoLinha) {
    editandoLinha.cells[0].innerText = Codigo;
    editandoLinha.cells[1].innerText = Tipo_da_instituição;
    editandoLinha.cells[2].innerText = Endereço;
 
    editandoLinha = null;
  } else {
    adicionarLinha(Codigo, Tipo_da_instituição, Endereço);
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
    if (confirm("Deseja realmente remover este intituição?")) 
      {
      linha.remove();
      salvarDados();
      
    }
  }

  if (btn.classList.contains("editar")) {
    editandoLinha = linha;
    document.getElementById("Codigo").value = linha.cells[0].innerText;
    document.getElementById("Tipo_da_instituição").value = linha.cells[1].innerText;
    document.getElementById("Endereço").value = linha.cells[2].innerText;
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
