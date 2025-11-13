const tabela = document.getElementById("tabelaNutricionistas");
const form = document.getElementById("formNutricionista");
let editandoLinha = null;

function salvarDados() {
  const dados = Array.from(tabela.rows).map(row => ({
    instituicao: row.cells[0].innerText,
    numero_pessoas: row.cells[1].innerText,
    tipo: row.cells[2].innerText,
    Quantidade: row.cells[3].innerText,
    Validade: row.cells[4].innerText,
    restricoes: row.cells[5].innerText,
  }));
  localStorage.setItem("nutricionistas", JSON.stringify(dados));
}

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("nutricionistas")) || [];
  dados.forEach(d => adicionarLinha(d.instituicao, d.numero_pessoas, d.tipo, d.Quantidade.Validade, d.restricoes));
}

function adicionarLinha(instituicao, numero_pessoas, tipo, Quantidade, Validade, restricoes) {
  const linha = tabela.insertRow();
  linha.innerHTML = `
    <td>${instituicao}</td>
    <td>${numero_pessoas}</td>
    <td>${tipo}</td>
    <td>${Quantidade} unid - ${Validade}</td>
    <td>${restricoes}</td>
    <td>
      <button class="btn btn-success btn-sm editar"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger btn-sm remover"><i class="bi bi-x"></i></button>
    </td>
  `;
  salvarDados();
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const instituicao = document.getElementById("instituicao").value.trim();
  const numero_pessoas = document.getElementById("numero_pessoas").value.trim();
  const tipo = document.getElementById("tipo").value.trim();
  const Quantidade = document.getElementById("Quantidade").value.trim();
  const Validade = document.getElementById("Validade").value.trim();
  const restricoes = document.getElementById("restricoes").value.trim();

  if (numero_pessoas <= 0) {
    alert("O número de pessoas deve ser maior que zero.");
    return;
  }

  if (editandoLinha) {
    editandoLinha.cells[0].innerText = instituicao;
    editandoLinha.cells[1].innerText = numero_pessoas;
    editandoLinha.cells[2].innerText = tipo;
    editandoLinha.cells[3].innerText = Quantidade;
    editandoLinha.cells[4].innerText = Validade;
    editandoLinha.cells[5].innerText = restricoes;
    editandoLinha = null;
  } else {
    adicionarLinha(instituicao, numero_pessoas, tipo, Quantidade, Validade, restricoes);
  }

  salvarDados();
  document.getElementById("tituloModal").innerText = "Adicionar Nutricionista";
  form.reset();
  bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
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
    document.getElementById("instituicao").value = linha.cells[0].innerText;
    document.getElementById("numero_pessoas").value = linha.cells[1].innerText;
    document.getElementById("tipo").value = linha.cells[2].innerText;
    document.getElementById("Quantidade").value = linha.cells[3].innerText;
    document.getElementById("Validade").value = linha.cells[4].innerText;
    document.getElementById("restricoes").value = linha.cells[5].innerText;
    document.getElementById("tituloModal").innerText = "Editar Nutricionista";
    new bootstrap.Modal(document.getElementById("modalForm")).show();
  }
});

document.getElementById("buscar").addEventListener("keyup", () => {
  const termo = document.getElementById("buscar").value.toLowerCase();
  Array.from(tabela.rows).forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(termo) ? "" : "none";
  });
});

// --- AVISOS AUTOMÁTICOS ---
function atualizarAvisos() {
  const avisoVenc = document.getElementById("avisoVencimento");
  const avisoQtd = document.getElementById("avisoQuantidade");

  if (!avisoVenc || !avisoQtd) return;

  avisoVenc.innerHTML = "";
  avisoQtd.innerHTML = "";

  const hoje = new Date();
  let proximos = 0, vencidos = 0, baixos = 0;

  Array.from(tabela.rows).forEach(row => {
    const tipo = row.cells[0].innerText;
    const validade = row.cells[3].innerText;
    const quantidade = row.cells[1].innerText;

    // parse validade no formato dd/mm/yyyy ou similar
    const val = validade.split(" ")[0]; // pega apenas a primeira parte se houver múltiplas
    let dataValidade = null;

    if (/\d{2}\/\d{2}\/\d{4}/.test(val)) {
      const parts = val.split("/");
      dataValidade = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }

    // se não conseguiu parse, ignora vencimento desta linha
    if (dataValidade) {
      const diffDias = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));

      if (diffDias < 0) {
        avisoQtd.insertAdjacentHTML('beforeend', `<li class="text-red-600 font-semibold">${tipo} Validade (${val})</li>`);
        vencidos++;
      } else if (diffDias <= 7) {
        avisoVenc.insertAdjacentHTML('beforeend', `<li>${tipo} — ${val} (${diffDias} dias)</li>`);
        proximos++;
      }
    }

    if (Number(quantidade) <= 5) {
      avisoQtd.insertAdjacentHTML('beforeend', `<li>${tipo} - baixa quantidade (${Quantidade} unid.)</li>`);
      baixos++;
    }
  });

  if (proximos === 0) avisoVenc.innerHTML = `<li class="text-gray-500 italic">Nenhum produto próximo do vencimento.</li>`;
  if (vencidos === 0 && baixos === 0) avisoQtd.innerHTML = `<li class="text-gray-500 italic">Nenhum produto com baixa quantidade.</li>`;
}

window.addEventListener("DOMContentLoaded", carregarDados);
