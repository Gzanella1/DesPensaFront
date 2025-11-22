let tabela = document.getElementById("tabelaCardapio");
let form = document.getElementById("formCardapio");

let listaAlimentos = [];
let linhaEditando = null;

// ===============================
// ADICIONAR ALIMENTO
// ===============================
document.getElementById("btnAddAlimento").addEventListener("click", () => {
    let alimento = document.getElementById("alimentoInput").value.trim();
    if (alimento === "") return;

    listaAlimentos.push(alimento);
    atualizarListaAlimentos();

    document.getElementById("alimentoInput").value = "";
});

function atualizarListaAlimentos() {
    let ul = document.getElementById("listaAlimentos");
    ul.innerHTML = "";

    listaAlimentos.forEach((alimento, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            ${alimento}
            <button class="btn btn-danger btn-sm" onclick="removerAlimento(${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;
        ul.appendChild(li);
    });
}

function removerAlimento(index) {
    listaAlimentos.splice(index, 1);
    atualizarListaAlimentos();
}

// ===============================
// SALVAR FORMULÁRIO
// ===============================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let numero = document.getElementById("numero_pessoas").value;
    let tipo = document.getElementById("tipo").value;
    let tipoRefeicao = document.getElementById("tipo_refeicao").value;

    if (linhaEditando) {
        editarLinha(numero, tipo, tipoRefeicao);
    } else {
        adicionarLinha(numero, tipo, tipoRefeicao);
    }

    form.reset();
    listaAlimentos = [];
    atualizarListaAlimentos();
    linhaEditando = null;

    bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
});

// ===============================
// ADICIONAR LINHA
// ===============================
function adicionarLinha(numero, tipo, tipoRefeicao) {
    let linha = tabela.insertRow();

    linha.innerHTML = `
        <td>${numero}</td>
        <td>${tipo}</td>
        <td>${tipoRefeicao || "-"}</td>
        <td>${listaAlimentos.length} alimento(s)</td>
        <td>
            <button class="btn btn-info btn-sm" onclick="verAlimentos(this)">View</button>
            <button class="btn btn-warning btn-sm" onclick="carregarEdicao(this)">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirLinha(this)">Excluir</button>
        </td>
    `;

    linha.dataset.alimentos = JSON.stringify([...listaAlimentos]);
}

// ===============================
// EXCLUIR
// ===============================
function excluirLinha(btn) {
    btn.parentNode.parentNode.remove();
}

// ===============================
// EDITAR
// ===============================
function carregarEdicao(btn) {
    linhaEditando = btn.parentNode.parentNode;

    let alimentos = JSON.parse(linhaEditando.dataset.alimentos);

    document.getElementById("numero_pessoas").value = linhaEditando.children[0].textContent;
    document.getElementById("tipo").value = linhaEditando.children[1].textContent;
    document.getElementById("tipo_refeicao").value =
        linhaEditando.children[2].textContent === "-" ? "" : linhaEditando.children[2].textContent;

    listaAlimentos = [...alimentos];
    atualizarListaAlimentos();

    document.getElementById("tituloModal").textContent = "Editar Cardápio";

    new bootstrap.Modal(document.getElementById("modalForm")).show();
}

function editarLinha(numero, tipo, tipoRefeicao) {
    linhaEditando.children[0].textContent = numero;
    linhaEditando.children[1].textContent = tipo;
    linhaEditando.children[2].textContent = tipoRefeicao || "-";
    linhaEditando.children[3].textContent = `${listaAlimentos.length} alimento(s)`;

    linhaEditando.dataset.alimentos = JSON.stringify([...listaAlimentos]);
}

// ===============================
// VIEW ALIMENTOS
// ===============================
function verAlimentos(btn) {
  let linha = btn.closest("tr");
  let alimentos = JSON.parse(linha.dataset.alimentos);

  let ul = document.getElementById("listaViewAlimentos");
  ul.innerHTML = "";

  if (alimentos.length === 0) {
    ul.innerHTML =
      '<li class="list-group-item text-muted">Ops… nenhum alimento adicionado.</li>';
  } else {
    alimentos.forEach((a) => {
      let li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = a;
      ul.appendChild(li);
    });
  }

  new bootstrap.Modal(
    document.getElementById("modalViewAlimentos")
  ).show();
}