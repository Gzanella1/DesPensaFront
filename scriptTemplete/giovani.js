
// --- 1. Dados Iniciais (Mock) ---
let instituicoes = [
    { id: 1, codigo: 101, nome: "Escola Aprender", tipo: "escola", telefone: "(11) 98888-7777", endereco: { rua: "Rua das Flores", numero: "123", bairro: "Centro", cidade: "São Paulo", estado: "SP", cep: "01000-000" }, detalhes: { matriculas: 400, turno: "Manhã" }, lat: -23.55052, lng: -46.633308 },
    { id: 2, codigo: 202, nome: "Creche Cantinho Feliz", tipo: "creche", telefone: "(21) 99999-8888", endereco: { rua: "Av. do Sol", numero: "45", bairro: "Copacabana", cidade: "Rio de Janeiro", estado: "RJ", cep: "22000-000" }, detalhes: { idadeMax: 48, capacidade: 50 }, lat: -22.9068, lng: -43.1729 },
    { id: 3, codigo: 305, nome: "Hotel Descanso Real", tipo: "hotel", telefone: "(31) 3333-2222", endereco: { rua: "Rua da Serra", numero: "800", bairro: "Savassi", cidade: "Belo Horizonte", estado: "MG", cep: "30100-000" }, detalhes: { quartos: 120, estrelas: 4 }, lat: -19.9167, lng: -43.9345 }
];

let modalInstance;
let map;
let markers = [];

// --- 2. Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    modalInstance = new bootstrap.Modal(document.getElementById('modalForm'));
    renderizarTabela();
    initMap();
});

// --- 3. Renderização da Tabela ---
function renderizarTabela() {
    const tbody = document.getElementById('tabelaInstituicoes');
    tbody.innerHTML = '';

    if (instituicoes.length === 0) {
        document.getElementById('msgVazio').classList.remove('d-none');
        return;
    } else {
        document.getElementById('msgVazio').classList.add('d-none');
    }

    instituicoes.forEach(inst => {
        const tr = document.createElement('tr');

        // Formata o tipo para exibição (primeira letra maiúscula)
        const tipoFormatado = inst.tipo.charAt(0).toUpperCase() + inst.tipo.slice(1);

        tr.innerHTML = `
                    <td>${inst.codigo}</td>
                    <td class="fw-bold text-start">${inst.nome}</td>
                    <td><span class="badge bg-${getCorTipo(inst.tipo)}">${tipoFormatado}</span></td>
                    <td>${inst.telefone}</td>
                    <td>${inst.endereco.estado}</td>
                    <td>
                        <!-- Botão EDITAR (Lápis) -->
                        <button class="btn btn-sm btn-outline-primary btn-action" onclick="editarInstituicao(${inst.id})" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <!-- Botão EXCLUIR (Lixeira) -->
                        <button class="btn btn-sm btn-outline-danger btn-action" onclick="excluirInstituicao(${inst.id})" title="Excluir">
                            <i class="bi bi-trash"></i>
                        </button>
                        <!-- Botão VER NO MAPA -->
                        <button class="btn btn-sm btn-outline-secondary btn-action" onclick="focarNoMapa(${inst.lat}, ${inst.lng})" title="Ver no mapa">
                            <i class="bi bi-geo-alt"></i>
                        </button>
                    </td>
                `;
        tbody.appendChild(tr);
    });

    atualizarMarcadoresMapa();
}

// --- 4. Lógica de Formulário (Criar/Editar) ---

function abrirModalCriacao() {
    // Limpa o formulário
    document.getElementById('formInstituicao').reset();
    document.getElementById('editId').value = ''; // Limpa ID -> Modo Criação

    // UI
    document.getElementById('tituloModal').innerText = "Adicionar Instituição";
    toggleCamposEspecificos(); // Esconde campos específicos

    modalInstance.show();
}

function editarInstituicao(id) {
    const inst = instituicoes.find(i => i.id === id);
    if (!inst) return;

    // Preenche campos gerais
    document.getElementById('editId').value = inst.id; // Define ID -> Modo Edição
    document.getElementById('codigo').value = inst.codigo;
    document.getElementById('nome').value = inst.nome;
    document.getElementById('telefone').value = inst.telefone;
    document.getElementById('tipoSelect').value = inst.tipo;

    // Endereço
    document.getElementById('cep').value = inst.endereco.cep;
    document.getElementById('rua').value = inst.endereco.rua;
    document.getElementById('numero').value = inst.endereco.numero;
    document.getElementById('bairro').value = inst.endereco.bairro;
    document.getElementById('cidade').value = inst.endereco.cidade;
    document.getElementById('estado').value = inst.endereco.estado; // Preenche o novo campo Estado

    // Mostra os campos corretos
    toggleCamposEspecificos();

    // Preenche campos específicos baseados no tipo
    if (inst.tipo === 'creche') {
        document.getElementById('crecheIdade').value = inst.detalhes.idadeMax;
        document.getElementById('crecheCapacidade').value = inst.detalhes.capacidade;
    } else if (inst.tipo === 'escola') {
        document.getElementById('escolaMatriculas').value = inst.detalhes.matriculas;
        document.getElementById('escolaTurno').value = inst.detalhes.turno;
    } else if (inst.tipo === 'hotel') {
        document.getElementById('hotelQuartos').value = inst.detalhes.quartos;
        document.getElementById('hotelEstrelas').value = inst.detalhes.estrelas;
    }

    // UI
    document.getElementById('tituloModal').innerText = "Editar Instituição";
    modalInstance.show();
}

function salvarInstituicao(event) {
    event.preventDefault();

    const editId = document.getElementById('editId').value;
    const tipo = document.getElementById('tipoSelect').value;

    // Coleta dados comuns
    const dadosComuns = {
        codigo: document.getElementById('codigo').value,
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        tipo: tipo,
        endereco: {
            cep: document.getElementById('cep').value,
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value // Salva o estado
        },
        // Mock de coordenadas aleatórias perto de SP para exemplo
        lat: editId ? instituicoes.find(i => i.id == editId).lat : -23.55 + (Math.random() * 0.1),
        lng: editId ? instituicoes.find(i => i.id == editId).lng : -46.63 + (Math.random() * 0.1)
    };

    // Coleta detalhes específicos
    let detalhes = {};
    if (tipo === 'creche') {
        detalhes = {
            idadeMax: document.getElementById('crecheIdade').value,
            capacidade: document.getElementById('crecheCapacidade').value
        };
    } else if (tipo === 'escola') {
        detalhes = {
            matriculas: document.getElementById('escolaMatriculas').value,
            turno: document.getElementById('escolaTurno').value
        };
    } else if (tipo === 'hotel') {
        detalhes = {
            quartos: document.getElementById('hotelQuartos').value,
            estrelas: document.getElementById('hotelEstrelas').value
        };
    }
    dadosComuns.detalhes = detalhes;

    if (editId) {
        // ATUALIZAR
        const index = instituicoes.findIndex(i => i.id == editId);
        if (index !== -1) {
            instituicoes[index] = { ...instituicoes[index], ...dadosComuns };
            alert("Instituição atualizada com sucesso!");
        }
    } else {
        // CRIAR NOVA
        const novoId = instituicoes.length > 0 ? Math.max(...instituicoes.map(i => i.id)) + 1 : 1;
        instituicoes.push({ id: novoId, ...dadosComuns });
        alert("Instituição criada com sucesso!");
    }

    modalInstance.hide();
    renderizarTabela();
}

function excluirInstituicao(id) {
    if (confirm("Tem certeza que deseja excluir esta instituição?")) {
        instituicoes = instituicoes.filter(i => i.id !== id);
        renderizarTabela();
    }
}

// --- 5. Lógica de UI Auxiliar ---

function toggleCamposEspecificos() {
    const tipo = document.getElementById('tipoSelect').value;

    // Esconde todos
    document.getElementById('camposCreche').style.display = 'none';
    document.getElementById('camposEscola').style.display = 'none';
    document.getElementById('camposHotel').style.display = 'none';

    // Mostra o selecionado
    if (tipo === 'creche') document.getElementById('camposCreche').style.display = 'block';
    if (tipo === 'escola') document.getElementById('camposEscola').style.display = 'block';
    if (tipo === 'hotel') document.getElementById('camposHotel').style.display = 'block';
}

function getCorTipo(tipo) {
    switch (tipo) {
        case 'creche': return 'info';
        case 'escola': return 'success';
        case 'hotel': return 'warning text-dark';
        default: return 'secondary';
    }
}

function filtrarTabela() {
    const termo = document.getElementById('buscar').value.toLowerCase();
    const linhas = document.querySelectorAll('#tabelaInstituicoes tr');

    linhas.forEach(linha => {
        const texto = linha.innerText.toLowerCase();
        linha.style.display = texto.includes(termo) ? '' : 'none';
    });
}

// --- 6. Lógica do Mapa (Leaflet) ---
function initMap() {
    map = L.map('map').setView([-15.793889, -47.882778], 4); // Centro do Brasil

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    atualizarMarcadoresMapa();
}

function atualizarMarcadoresMapa() {
    if (!map) return;

    // Remove marcadores antigos
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    instituicoes.forEach(inst => {
        const marker = L.marker([inst.lat, inst.lng])
            .addTo(map)
            .bindPopup(`<b>${inst.nome}</b><br>${inst.tipo.toUpperCase()}`);
        markers.push(marker);
    });
}

function focarNoMapa(lat, lng) {
    map.flyTo([lat, lng], 15);
}
