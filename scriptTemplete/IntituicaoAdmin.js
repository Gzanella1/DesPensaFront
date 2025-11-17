let map;
let marker;

const tabela = document.getElementById("tabelaInstituicoes");
const form = document.getElementById("formInstituicao");
let editandoLinha = null;

// ======================================================
//  MAPA
// ======================================================
function initMap() {
  map = L.map("map").setView([-14.235, -51.9253], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  marker = L.marker([-14.235, -51.9253]).addTo(map);
}

// Mostrar endereço no mapa
async function mostrarNoMapa(enderecoCompleto) {
  if (!map || !marker) return;

  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`
    );

    const data = await resp.json();

    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      map.setView([lat, lon], 15);
      marker.setLatLng([lat, lon]);
      marker.bindPopup(`<b>${display_name}</b>`).openPopup();
    } else {
      alert("Endereço não encontrado.");
    }
  } catch {
    alert("Erro ao buscar endereço no mapa.");
  }
}

// ======================================================
//  LOCALSTORAGE
// ======================================================
function salvarDados() {
  const dados = Array.from(tabela.rows).map((row) => ({
    Nome: row.cells[0].innerText,
    Tipo: row.cells[1].innerText,
    Endereco: row.cells[2].innerText,
  }));

  localStorage.setItem("instituicoes", JSON.stringify(dados));
}

function carregarDados() {
  const dados = JSON.parse(localStorage.getItem("instituicoes")) || [];
  dados.forEach((d) => adicionarLinha(d.Nome, d.Tipo, d.Endereco));
}

// ======================================================
//  TABELA
// ======================================================
function adicionarLinha(Nome, Tipo, Endereco) {
  const linha = tabela.insertRow();

  linha.innerHTML = `
    <td>${Nome}</td>
    <td>${Tipo}</td>
    <td>${Endereco}</td>
    <td>
      <button class="btn btn-success btn-sm editar"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger btn-sm remover"><i class="bi bi-x"></i></button>
      <button class="btn btn-info btn-sm verMapa"><i class="bi bi-geo-alt"></i></button>
    </td>
  `;

  salvarDados();
}

// ======================================================
//  FORMULÁRIO
// ======================================================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const Nome = document.getElementById("Nome").value.trim();
  const Tipo = document.getElementById("Tipo_da_instituicao").value.trim();
  const rua = document.getElementById("endereco").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.trim();
  const cep = document.getElementById("cep").value.trim();

  if (!Nome || !Tipo || !rua || !cidade || !estado) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  // Monta endereço dinâmico
  let EnderecoCompleto = rua;

  if (bairro !== "") EnderecoCompleto += `, ${bairro}`;
  EnderecoCompleto += `, ${cidade}, ${estado}`;
  if (cep !== "") EnderecoCompleto += `, ${cep}`;

  // Editar ou criar nova linha
  if (editandoLinha) {
    editandoLinha.cells[0].innerText = Nome;
    editandoLinha.cells[1].innerText = Tipo;
    editandoLinha.cells[2].innerText = EnderecoCompleto;
    editandoLinha = null;
  } else {
    adicionarLinha(Nome, Tipo, EnderecoCompleto);
  }

  mostrarNoMapa(EnderecoCompleto);
  salvarDados();
  form.reset();

  bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
  document.getElementById("tituloModal").innerText = "Adicionar Instituição";
});

// ======================================================
//  AÇÕES NA TABELA
// ======================================================
tabela.addEventListener("click", (e) => {
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
    document.getElementById("Tipo_da_instituicao").value = linha.cells[1].innerText;

    let partes = linha.cells[2].innerText.split(",").map(x => x.trim());

    document.getElementById("endereco").value = partes[0];
    document.getElementById("bairro").value = partes[1] || "";
    document.getElementById("cidade").value = partes[2] || "";
    document.getElementById("estado").value = partes[3] || "";
    document.getElementById("cep").value = partes[4] || "";

    document.getElementById("tituloModal").innerText = "Editar Instituição";
    new bootstrap.Modal(document.getElementById("modalForm")).show();
  }

  if (btn.classList.contains("verMapa")) {
    mostrarNoMapa(linha.cells[2].innerText);
  }
});

// ======================================================
//  BUSCA
// ======================================================
document.getElementById("buscar").addEventListener("keyup", () => {
  const termo = document.getElementById("buscar").value.toLowerCase();

  Array.from(tabela.rows).forEach((row) => {
    row.style.display = row.innerText.toLowerCase().includes(termo) ? "" : "none";
  });
});

// ======================================================
//  INICIAR SISTEMA
// ======================================================
window.addEventListener("DOMContentLoaded", () => {
  initMap();
  carregarDados();
});
