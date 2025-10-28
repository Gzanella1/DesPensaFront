const modal = document.getElementById('modal');
const btnNovo = document.getElementById('btnNovo');
const btnFechar = document.getElementById('btnFechar');
const btnConfirmar = document.getElementById('btnConfirmar');
const tabela = document.getElementById('tabela');
const tituloModal = document.getElementById('tituloModal');

let editando = null;

// Abrir modal (novo cardápio)
btnNovo.addEventListener('click', () => {
  limparCampos();
  editando = null;
  tituloModal.textContent = "Criar cardápio";
  modal.style.display = 'flex';
});

// Fechar modal
btnFechar.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fechar clicando fora
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Confirmar criação/edição
btnConfirmar.addEventListener('click', () => {
  const nome = document.getElementById('nome').value.trim();
  const pessoas = document.getElementById('pessoas').value.trim();
  const tipo = document.getElementById('tipo').value;
  const priorizar = document.getElementById('Priorizar').value.trim();
  const restricoes = document.getElementById('restricoes').value.trim();

  if (!nome || !pessoas) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  if (editando) {
    // Editar linha existente
    editando.cells[0].textContent = nome;
    editando.cells[1].textContent = pessoas;
    editando.cells[2].textContent = tipo;
    editando.cells[3].textContent = priorizar;
    editando.cells[4].textContent = restricoes;
  } else {
    // Criar nova linha
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
      <td>${nome}</td>
      <td>${pessoas}</td>
      <td>${tipo}</td>
      <td>${priorizar}</td>
      <td>${restricoes}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-deletar">Deletar</button>
      </td>
    `;
    tabela.appendChild(novaLinha);
  }

  modal.style.display = 'none';
  limparCampos();
  adicionarEventos();
});

// Adiciona eventos a botões dinâmicos
function adicionarEventos() {
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.onclick = () => {
      editando = btn.closest('tr');
      tituloModal.textContent = "Editar cardápio";
      document.getElementById('nome').value = editando.cells[0].textContent;
      document.getElementById('pessoas').value = editando.cells[1].textContent;
      document.getElementById('tipo').value = editando.cells[2].textContent;
      document.getElementById('Priorizar').value = editando.cells[3].textContent;
      document.getElementById('restricoes').value = editando.cells[4].textContent;
      modal.style.display = 'flex';
    };
  });

  document.querySelectorAll('.btn-deletar').forEach(btn => {
    btn.onclick = () => {
      if (confirm('Deseja realmente excluir este cardápio?')) {
        btn.closest('tr').remove();
      }
    };
  });
}

function limparCampos() {
  document.getElementById('nome').value = '';
  document.getElementById('pessoas').value = '';
  document.getElementById('tipo').value = 'Diario';
  document.getElementById('Priorizar').value = '';
  document.getElementById('restricoes').value = '';
}