const tabela = document.getElementById("tabelaNutricionistas");
const form = document.getElementById("formNutricionista");
let editandoLinha = null;

// === SALVAR E CARREGAR DADOS ===
function salvarDados() {
  const dados = Array.from(tabela.rows).map(row => ({
    instituicao: row.cells[0].innerText,
    numero_pessoas: row.cells[1].innerText,
    tipo: row.cells[2].innerText,
    quantidade: row.cells[3].innerText.split(" - ")[0].trim(),
    validade: row.cells[3].innerText.split(" - ")[1]?.trim() || "",
    restricoes: row.cells[4].innerText,
  }));
  localStorage.setItem("cardapios", JSON.stringify(dados));
}

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("cardapios")) || [];
  dados.forEach(d =>
    adicionarLinha(d.instituicao, d.numero_pessoas, d.tipo, d.quantidade, d.validade, d.restricoes)
  );
  atualizarAvisos();
}

// === ADICIONAR LINHA ===
function adicionarLinha(instituicao, numero_pessoas, tipo, quantidade, validade, restricoes) {
  const linha = tabela.insertRow();
  linha.innerHTML = `
    <td>${instituicao}</td>
    <td>${numero_pessoas}</td>
    <td>${tipo}</td>
    <td>${quantidade} unid - ${validade}</td>
    <td>${restricoes}</td>
    <td>
      <button class="btn btn-success btn-sm editar"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger btn-sm remover"><i class="bi bi-x"></i></button>
    </td>
  `;
  salvarDados();
  atualizarAvisos();
}

// === FORMULÁRIO ===
form.addEventListener("submit", e => {
  e.preventDefault();

  const instituicao = document.getElementById("instituicao").value.trim();
  const numero_pessoas = document.getElementById("numero_pessoas").value.trim();
  const tipo = document.getElementById("tipo").value.trim();
  const quantidade = document.getElementById("Quantidade").value.trim();
  const validade = document.getElementById("Validade").value.trim();
  const restricoes = document.getElementById("restricoes").value.trim();

  if (numero_pessoas <= 0) {
    alert("O número de pessoas deve ser maior que zero.");
    return;
  }

  if (editandoLinha) {
    editandoLinha.cells[0].innerText = instituicao;
    editandoLinha.cells[1].innerText = numero_pessoas;
    editandoLinha.cells[2].innerText = tipo;
    editandoLinha.cells[3].innerText = `${quantidade} unid - ${validade}`;
    editandoLinha.cells[4].innerText = restricoes;
    editandoLinha = null;
  } else {
    adicionarLinha(instituicao, numero_pessoas, tipo, quantidade, validade, restricoes);
  }

  salvarDados();
  atualizarAvisos();
  document.getElementById("tituloModal").innerText = "Adicionar Cardápio";
  form.reset();
  bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
});

// === EDITAR / REMOVER ===
tabela.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const linha = btn.closest("tr");

  if (btn.classList.contains("remover")) {
    linha.remove();
    salvarDados();
    atualizarAvisos();
  }

  if (btn.classList.contains("editar")) {
    editandoLinha = linha;
    const [quantidade, validade] = linha.cells[3].innerText.split(" - ");

    document.getElementById("instituicao").value = linha.cells[0].innerText;
    document.getElementById("numero_pessoas").value = linha.cells[1].innerText;
    document.getElementById("tipo").value = linha.cells[2].innerText;
    document.getElementById("Quantidade").value = quantidade.replace("unid", "").trim();
    document.getElementById("Validade").value = validade?.trim() || "";
    document.getElementById("restricoes").value = linha.cells[4].innerText;

    document.getElementById("tituloModal").innerText = "Editar Cardápio";
    new bootstrap.Modal(document.getElementById("modalForm")).show();
  }
});

// === BUSCA ===
document.getElementById("buscar").addEventListener("keyup", () => {
  const termo = document.getElementById("buscar").value.toLowerCase();
  Array.from(tabela.rows).forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(termo) ? "" : "none";
  });
});

// === AVISOS AUTOMÁTICOS ===
function atualizarAvisos() {
  const avisoVenc = document.getElementById("avisoVencimento");
  const avisoQtd = document.getElementById("avisoQuantidade");

  if (!avisoVenc || !avisoQtd) return;

  avisoVenc.innerHTML = "";
  avisoQtd.innerHTML = "";

  const hoje = new Date();
  let proximos = 0, vencidos = 0, baixos = 0;

  Array.from(tabela.rows).forEach(row => {
    const instituicao = row.cells[0].innerText;
    const qtdVal = row.cells[3].innerText.split(" - ");
    const quantidade = parseInt(qtdVal[0]) || 0;
    const validadeStr = qtdVal[1]?.trim();

    // --- validade ---
    if (validadeStr && /\d{2}\/\d{2}\/\d{4}/.test(validadeStr)) {
      const [dia, mes, ano] = validadeStr.split("/").map(Number);
      const dataValidade = new Date(ano, mes - 1, dia);
      const diffDias = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));

      if (diffDias < 0) {
        avisoQtd.insertAdjacentHTML('beforeend',
          `<li class="text-red-600 font-semibold">${instituicao} — vencido (${validadeStr})</li>`);
        vencidos++;
      } else if (diffDias <= 7) {
        avisoVenc.insertAdjacentHTML('beforeend',
          `<li>${instituicao} — ${validadeStr} (${diffDias} dias)</li>`);
        proximos++;
      }
    }

    // --- quantidade baixa ---
    if (quantidade <= 5) {
      avisoQtd.insertAdjacentHTML('beforeend',
        `<li>${instituicao} — baixa quantidade (${quantidade} unid.)</li>`);
      baixos++;
    }
  });

  if (proximos === 0)
    avisoVenc.innerHTML = `<li class="text-gray-500 italic">Nenhum produto próximo do vencimento.</li>`;
  if (vencidos === 0 && baixos === 0)
    avisoQtd.innerHTML = `<li class="text-gray-500 italic">Nenhum produto com baixa quantidade.</li>`;
}

window.addEventListener("DOMContentLoaded", carregarDados);
