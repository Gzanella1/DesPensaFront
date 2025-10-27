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
  const tipo = document.getElementById('tipo').value;
  const pessoas = document.getElementById('pessoas').value;
  const instituicao = document.getElementById('instituicao').value;
  const priorizar = document.getElementById('priorizar').value;
  const restricoes = document.getElementById('restricoes').value;

  if (!pessoas || !instituicao) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  if (editando) {
    // Editar linha existente
    editando.cells[0].textContent = instituicao;
    editando.cells[1].textContent = instituicao;
    editando.cells[2].textContent = new Date().toLocaleDateString('pt-BR');
    editando.cells[3].textContent = 'Atualizado';
    editando.cells[4].textContent = tipo;
  } else {
    // Criar nova linha
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
      <td>${instituicao}</td>
      <td>${instituicao}</td>
      <td>${new Date().toLocaleDateString('pt-BR')}</td>
      <td>Ativo</td>
      <td>${tipo}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-deletar">Deletar</button>
      </td>
    `;
    tabela.appendChild(novaLinha);
  }

  modal.style.display = 'none';
  adicionarEventos();
});

// Adiciona eventos a botões dinâmicos
function adicionarEventos() {
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.onclick = () => {
      editando = btn.closest('tr');
      tituloModal.textContent = "Editar cardápio";
      document.getElementById('instituicao').value = editando.cells[0].textContent;
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
  document.getElementById('tipo').value = 'Diário';
  document.getElementById('pessoas').value = '';
  document.getElementById('instituicao').value = '';
  document.getElementById('priorizar').value = 'Quantidade';
  document.getElementById('restricoes').value = '';
}