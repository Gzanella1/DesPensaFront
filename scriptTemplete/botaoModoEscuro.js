// ===================================
// Gerenciador de Tema (Script Único)
// ===================================

// --- PARTE 1: LÓGICA ANTI-FLASH ---
// Esta parte executa IMEDIATAMENTE ao carregar o script no <head>
// para evitar o "flash" (FLACHE) da tela clara.

(function() {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    // Se não houver 'theme' salvo, ele usará o padrão (claro),
    // ou a preferência do sistema se o Tailwind estiver configurado para isso.
  } catch (e) {
    // Ignora erros (ex: localStorage desabilitado no modo privado)
    console.warn('Não foi possível aplicar o tema salvo.', e);
  }
})();


// --- PARTE 2: LÓGICA DO TOGGLE (BOTÃO) ---
// Esta parte espera o DOM estar pronto (DOMContentLoaded)
// para encontrar o botão e adicionar o evento de clique.

document.addEventListener('DOMContentLoaded', () => {

  const toggle = document.getElementById('theme-toggle');

  // Se o botão não existir nesta página específica,
  // o script para por aqui para evitar erros.
  if (!toggle) {
    return;
  }

  // Função para SINCRONIZAR o checkbox com o tema atual
  // (que foi aplicado pela Parte 1)
  function sincronizarCheckbox() {
    if (document.documentElement.classList.contains('dark')) {
      toggle.checked = true;
    } else {
      toggle.checked = false;
    }
  }

  // Função para ATIVAR o clique do toggle
  function ativarToggle() {
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Executa as funções assim que o DOM estiver pronto
  sincronizarCheckbox();
  ativarToggle();
});