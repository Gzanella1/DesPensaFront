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

// ===================================================
// ---  FUNÇÃO DE TOAST  ---
// ===================================================

/**
 * Exibe uma notificação (toast) na tela.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - O tipo de toast ('error' ou 'success').
 */
function showToast(message, type = 'error') {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.error('Container de toast não encontrado.');
    return;
  }

  // 1. Define o estilo com base no tipo
  const isError = type === 'error';
  const title = isError ? 'Ocorreu um Erro!' : 'Sucesso!';
  const bgColor = isError ? 'bg-red-500' : 'bg-green-500';
  const iconClass = isError ? 'bi-x-circle-fill' : 'bi-check-circle-fill';

  // 2. Cria o elemento HTML do toast
  const toastElement = document.createElement('div');
  toastElement.className = `toast-animate-in w-full max-w-sm overflow-hidden rounded-lg shadow-lg ${bgColor} text-white flex items-center`;

  toastElement.innerHTML = `
    <div class="p-4 text-2xl">
      <i class="bi ${iconClass}"></i>
    </div>

    <div class="flex-1 p-4 py-3">
      <strong class="font-semibold">${title}</strong>
      <p class="text-sm">${message}</p>
    </div>

    <button class="p-4 text-xl hover:opacity-75" onclick="this.parentElement.remove()">
      <i class="bi bi-x-lg"></i>
    </button>
  `;

  // 3. Adiciona o toast ao container
  container.appendChild(toastElement);

  // 4. Define o tempo para o toast desaparecer (5 segundos)
  const DURATION = 5000; // 5 segundos

  setTimeout(() => {
    toastElement.classList.remove('toast-animate-in');
    toastElement.classList.add('toast-animate-out');

    setTimeout(() => {
      toastElement.remove();
    }, 400); // 400ms = 0.4s (duração da animação toast-fadeOut)

  }, DURATION);
}

/* =================================================== */
/* FUNÇÃO GLOBAL 'apiFetch' (Wrapper de API)         */
/* (Cole abaixo da função 'showToast')               */
/* =================================================== */

/**
 * Faz uma chamada de API centralizada, lidando com erros
 * e spinners automaticamente.
 *
 * @param {string} url - A URL da API.
 * @param {object} options - As opções do fetch (method, body, headers).
 * @param {object} [handlers] - (Opcional) Funções para controlar UI.
 * @param {function} [handlers.spinnerStart] - Função para LIGAR o spinner.
 * @param {function} [handlers.spinnerStop] - Função para DESLIGAR o spinner.
 * @param {string} [handlers.successToast] - Mensagem para toast de SUCESSO.
 * @returns {Promise<any>} - Os dados da resposta (em JSON).
 */
async function apiFetch(url, options = {}, handlers = {}) {
    
    // 1. LIGA O SPINNER (se a função foi fornecida)
    if (handlers.spinnerStart) {
        handlers.spinnerStart();
    }

    try {
        const response = await fetch(url, options);

        // 2. SE A RESPOSTA DER ERRO (ex: 404, 500, 401)
        if (!response.ok) {
            let errorMsg = `Erro ${response.status}: ${response.statusText}`;
            
            // Tenta pegar uma mensagem de erro mais detalhada do JSON da API
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorData.error || errorMsg;
            } catch (e) {
                // Ignora se o corpo do erro não for JSON
            }
            
            throw new Error(errorMsg); // Joga o erro para o 'catch'
        }

        // 3. SE DER SUCESSO

        // Mostra o toast de sucesso (se a mensagem foi fornecida)
        if (handlers.successToast) {
            showToast(handlers.successToast, 'success');
        }

        // Retorna os dados em JSON (ou nulo se for um 204 No Content)
        if (response.status === 204) {
            return null;
        }
        return await response.json();

    } catch (error) {
        
        // ===============================================
        // A AUTOMAÇÃO ACONTECE AQUI!
        // ===============================================
        // Qualquer erro de 'fetch' ou 'throw' cai aqui
        // e AUTOMATICAMENTE dispara o toast de erro.
        console.error('Falha na chamada da API:', error);
        showToast(error.message || 'Falha na conexão de rede.');
        
        // Re-joga o erro para que a função que chamou (na página)
        // possa parar sua execução (ex: não tentar desenhar um gráfico)
        throw error;

    } finally {
        
        // 5. DESLIGA O SPINNER (se a função foi fornecida)
        // O 'finally' garante que isso rode mesmo se der erro.
        if (handlers.spinnerStop) {
            handlers.spinnerStop();
        }
    }
}