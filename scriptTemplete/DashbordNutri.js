// --- VARIÁVEIS GLOBAIS ---
let insumos = [];

// --- FUNÇÕES DO FORMULÁRIO ---
function abrirFormulario() {
  document.getElementById("formInsumo").classList.remove("hidden");
}

function fecharFormulario() {
  document.getElementById("formInsumo").classList.add("hidden");
}

function limparFormulario() {
  document.querySelectorAll("#formInsumo input").forEach(i => i.value = "");
}

function confirmarFormulario() {
  const tipo = document.getElementById("tipo").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const instituicao = document.getElementById("instituicao").value.trim();
  const quantidadeRaw = document.getElementById("quantidade").value.trim();
  const validadeRaw = document.getElementById("validade").value.trim();
  const checklist = document.getElementById("checklist").value.trim();

  if (!tipo || !endereco || !instituicao || !quantidadeRaw || !validadeRaw) {
    alert("⚠️ Preencha todos os campos obrigatórios (Tipo, Endereço, Instituição, Quantidade, Validade)!");
    return;
  }

  const quantidade = parseInt(quantidadeRaw, 10);
  if (isNaN(quantidade) || quantidade < 0) {
    alert("Quantidade inválida.");
    return;
  }

  // Normaliza validade para dd/mm/yyyy se vier como yyyy-mm-dd (input type=date)
  let validade = validadeRaw;
  if (/\d{4}-\d{2}-\d{2}/.test(validadeRaw)) {
    const parts = validadeRaw.split("-");
    validade = `${parts[2].padStart(2,"0")}/${parts[1].padStart(2,"0")}/${parts[0]}`;
  }

  const novoInsumo = { tipo, endereco, instituicao, quantidade, validade, checklist };
  insumos.push(novoInsumo);

  adicionarHistorico(`Entrada de ${tipo} — ${new Date().toLocaleDateString("pt-BR")}`);
  atualizarAvisos();
  visualizarEstoque();

  alert("✅ Insumo adicionado com sucesso!");
  limparFormulario();
  fecharFormulario();
}

// --- HISTÓRICO ---
function adicionarHistorico(texto) {
  const lista = document.getElementById("historico");
  const vazio = lista.querySelector(".text-gray-500");
  if (vazio) vazio.remove();

  const item = document.createElement("li");
  item.textContent = texto;
  lista.prepend(item);
}

// --- ESTOQUE ---
function visualizarEstoque() {
  const container = document.getElementById("listaInsumos");
  container.innerHTML = "";

  if (insumos.length === 0) {
    container.innerHTML = `<p class="text-gray-500">Nenhum insumo cadastrado ainda.</p>`;
    return;
  }

  const tabela = document.createElement("table");
  tabela.className = "min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm";

  const cabecalho = `
    <thead class="bg-green-dark text-white">
      <tr>
        <th class="px-4 py-2 text-left">Tipo</th>
        <th class="px-4 py-2 text-left">Endereço</th>
        <th class="px-4 py-2 text-left">Instituição</th>
        <th class="px-4 py-2 text-left">Quantidade</th>
        <th class="px-4 py-2 text-left">Validade</th>
        <th class="px-4 py-2 text-left">Restrições</th>
      </tr>
    </thead>
  `;

  let corpo = "<tbody class='divide-y divide-gray-200'>";
  insumos.forEach(item => {
    corpo += `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2">${item.tipo}</td>
        <td class="px-4 py-2">${item.endereco}</td>
        <td class="px-4 py-2">${item.instituicao}</td>
        <td class="px-4 py-2">${item.quantidade}</td>
        <td class="px-4 py-2">${item.validade}</td>
        <td class="px-4 py-2">${item.checklist}</td>
      </tr>
    `;
  });
  corpo += "</tbody>";

  tabela.innerHTML = cabecalho + corpo;
  container.appendChild(tabela);
}

// --- AVISOS AUTOMÁTICOS ---
function atualizarAvisos() {
  const avisoVenc = document.getElementById("avisoVencimento");
  const avisoQtd = document.getElementById("avisoQuantidade");

  if (!avisoVenc || !avisoQtd) return;

  avisoVenc.innerHTML = "";
  avisoQtd.innerHTML = "";

  const hoje = new Date();
  let proximos = 0, vencidos = 0, baixos = 0;

  insumos.forEach(i => {
    // parse validade no formato dd/mm/yyyy
    const val = i.validade;
    let dataValidade = null;

    if (/\d{2}\/\d{2}\/\d{4}/.test(val)) {
      const parts = val.split("/");
      dataValidade = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }

    // se não conseguiu parse, ignora vencimento desta linha
    if (dataValidade) {
      const diffDias = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));

      if (diffDias < 0) {
        avisoQtd.insertAdjacentHTML('beforeend', `<li class="text-red-600 font-semibold">${i.tipo} vencido (${i.validade})</li>`);
        vencidos++;
      } else if (diffDias <= 7) { // ajuste: 7 dias pra aviso próximo (você pode trocar)
        avisoVenc.insertAdjacentHTML('beforeend', `<li>${i.tipo} — ${i.validade} (${diffDias} dias)</li>`);
        proximos++;
      }
    }

    if (Number(i.quantidade) <= 5) {
      avisoQtd.insertAdjacentHTML('beforeend', `<li>${i.tipo} - baixa quantidade (${i.quantidade} unid.)</li>`);
      baixos++;
    }
  });

  if (proximos === 0) avisoVenc.innerHTML = `<li class="text-gray-500 italic">Nenhum produto próximo do vencimento.</li>`;
  if (vencidos === 0 && baixos === 0) avisoQtd.innerHTML = `<li class="text-gray-500 italic">Nenhum produto com baixa quantidade.</li>`;
}

// opção: expõe função global para console se quiser testar
window._insumos = insumos;