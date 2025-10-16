// Quando o DOM estiver carregado, adiciona o listener ao formulário de login
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('loginForm');
  if (!form) return;  // Se não encontrar o formulário, para a execução

  form.addEventListener('submit', function (e) {
    e.preventDefault();  // Impede o comportamento padrão do form (recarregar a página)

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const lembrar = document.getElementById('lembrar').checked;
    const erroMsg = document.getElementById('erroMsg');
    const btn = document.getElementById('btnConfirmar');

    // Esconde a mensagem de erro caso esteja visível
    erroMsg.classList.add('hidden');

    // Validação simples dos campos
    if (!email || !senha) {
      erroMsg.textContent = "Todos os campos são obrigatórios.";
      erroMsg.classList.remove('hidden');
      return;
    }

    // Validação do formato de email usando regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      erroMsg.textContent = "Formato de e-mail inválido.";
      erroMsg.classList.remove('hidden');
      return;
    }

    // Mostra animação de carregamento e desabilita o botão enquanto processa login
    btn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin mr-2"></i>Entrando...';
    btn.disabled = true;

    // Simula uma requisição de login com delay (substitua depois pelo fetch real)
    setTimeout(() => {
      const sucesso = (email === "teste@teste.com" && senha === "123456");

      if (sucesso) {
        // Salva sessão no localStorage ou sessionStorage
        if (lembrar) {
          localStorage.setItem("auth", JSON.stringify({ email }));
        } else {
          sessionStorage.setItem("auth", JSON.stringify({ email }));
        }

        // --------- AQUI ESTÁ O REDIRECIONAMENTO ---------
        // Modifique essa URL para o caminho correto da sua página de destino após login
        window.location.href = "index.html"; // Exemplo: 'home.html' dentro da pasta 'templete'
        // ------------------------------------------------

      } else {
        // Caso falhe o login, exibe mensagem e reativa botão
        erroMsg.textContent = "Usuário ou senha incorretos.";
        erroMsg.classList.remove('hidden');
        btn.innerHTML = "Confirmar";
        btn.disabled = false;
      }
    }, 1500);
  });
});
