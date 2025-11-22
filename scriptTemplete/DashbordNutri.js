// --- VARIÁVEIS GLOBAIS ---
let insumos = []; // Armazena os insumos adicionados
 
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
  const inputs = document.querySelectorAll("#formInsumo input");
  const dados = {};
 
  inputs.forEach(input => {
    dados[input.placeholder] = input.value.trim();
  });
 
  if (Object.values(dados).some(v => v === "")) {
    alert("⚠️ Preencha todos os campos antes de confirmar!");
    return;
  }
 
  insumos.push(dados);
  alert("✅ Insumo adicionado com sucesso!");
  limparFormulario();
  fecharFormulario();
}
 
// --- FUNÇÃO PARA EXIBIR INSUMOS ---
function visualizarEstoque() {
  const containerId = "listaInsumos";
  let container = document.getElementById(containerId);
 
  if (!container) {
    container = document.createElement("section");
    container.id = containerId;
    container.className = "mt-8 bg-white border rounded-lg shadow-md p-6";
    document.querySelector(".dashboard-container").appendChild(container);
  }
 
  container.innerHTML = "";
 
  const titulo = document.createElement("h2");
  titulo.textContent = "📦 Estoque Atual";
  titulo.className = "text-xl font-semibold text-green-dark mb-4";
  container.appendChild(titulo);
 
  if (insumos.length === 0) {
    container.innerHTML = `<p class="text-gray-500">Nenhum insumo cadastrado ainda.</p>`;
    return;
  }
 
  const tabela = document.createElement("table");
  tabela.className = "min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm";
 
  const cabecalho = `
    <thead class="bg-green-dark text-white">
      <tr>
        <th class="px-2 py-2 text-left">Tipo</th>
        <th class="px-2 py-2 text-left">Endereço</th>
        <th class="px-1 py-2 text-left">Instituição</th>
        <th class="px-3py-1text-left">Quantidade - Validade</th>
        <th class="px-1 py-2 text-left">Restrições</th>
      </tr>
    </thead>
  `;

  let corpo = "<tbody class='divide-y divide-gray-200'>";
  insumos.forEach(item => {
    corpo += `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2">${item.tipo}</td>
        <td class="px-4 py-2">${item.endereco}</td>
        <td class="px-5 py-2">${item.instituicao}</td>
        <td class="px-2 py-2">${item.quantidade} - ${item.validade}</td>
        <td class="px-3 py-2">${item.checklist}</td>
      </tr>
    `;
  });
  corpo += "</tbody>";
 
  tabela.innerHTML = cabecalho + corpo;
  container.appendChild(tabela);
}
 
// --- BOTÃO VISUALIZAR ---
document.querySelector(".btn:nth-child(2)").addEventListener("click", visualizarEstoque);
 
// --- LOGOUT (caso tenha no sidebar) ---
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    if (confirm("Deseja realmente sair?")) {
      window.location.href = "login.html";
    }
  });
}
 
