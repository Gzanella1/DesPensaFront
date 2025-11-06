const tabela = document.getElementById("tabelaInstituicoes");
const form = document.getElementById("formNutricionista");
let editandoLinha = null;

function salvarDados() {
  const dados = Array.from(tabela.rows).map(row => ({
    Nome: row.cells[0].innerText,
    Tipo: row.cells[1].innerText,
    Endereco: row.cells[2].innerText
  }));
  localStorage.setItem("instituicoes", JSON.stringify(dados));
}

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("instituicoes")) || [];
  dados.forEach(d => adicionarLinha(d.Nome, d.Tipo, d.Endereco));
}

function adicionarLinha(Nome, Tipo, Endereco) {
  const linha = tabela.insertRow();
  linha.innerHTML = `
    <td>${Nome}</td>
    <td>${Tipo}</td>
    <td>${Endereco}</td>
    <td>
      <button class="btn btn-success btn-sm editar"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger btn-sm remover"><i class="bi bi-x"></i></button>
    </td>
  `;
  salvarDados();
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const Nome = document.getElementById("Nome").value.trim();
  const Tipo = document.getElementById("Tipo_da_instituição").value.trim();
  const Endereco = document.getElementById("Endereço").value.trim();

  if (!Nome || !Tipo || !Endereco) {
    alert("Preencha todos os campos!");
    return;
  }

  if (editandoLinha) {
    editandoLinha.cells[0].innerText = Nome;
    editandoLinha.cells[1].innerText = Tipo;
    editandoLinha.cells[2].innerText = Endereco;
    editandoLinha = null;
  } else {
    adicionarLinha(Nome, Tipo, Endereco);
  }

  salvarDados();
  form.reset();
  bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
  document.getElementById("tituloModal").innerText = "Adicionar Instituição";
});

tabela.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const linha = btn.closest("tr");

  if (btn.classList.contains("remover")) {
    linha.remove();
    salvarDados();
  }

  if (btn.classList.contains("editar")) {
    editandoLinha = linha;
    document.getElementById("Nome").value = linha.cells[0].innerText;
    document.getElementById("Tipo_da_instituição").value = linha.cells[1].innerText;
    document.getElementById("Endereço").value = linha.cells[2].innerText;
    document.getElementById("tituloModal").innerText = "Editar Instituição";
    new bootstrap.Modal(document.getElementById("modalForm")).show();
  }
});

document.getElementById("buscar").addEventListener("keyup", () => {
  const termo = document.getElementById("buscar").value.toLowerCase();
  Array.from(tabela.rows).forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(termo) ? "" : "none";
  });
});

window.addEventListener("DOMContentLoaded", carregarDados);
