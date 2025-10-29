document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM carregado e script ativo.");
  const form = document.getElementById('loginForm');
  if (!form) {
    console.error("Formulário não encontrado!");
    return;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log("Formulário enviado");

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const lembrar = document.getElementById('lembrar').checked;
    const erroMsg = document.getElementById('erroMsg');
    const btn = document.getElementById('btnConfirmar');

    erroMsg.classList.add('hidden');
    erroMsg.textContent = '';

    if (!email || !senha) {
      console.warn("Campos obrigatórios faltando");
      erroMsg.textContent = "Todos os campos são obrigatórios.";
      erroMsg.classList.remove('hidden');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn("Formato de email inválido");
      erroMsg.textContent = "Formato de e-mail inválido.";
      erroMsg.classList.remove('hidden');
      return;
    }

    btn.innerHTML = 'Entrando...';
    btn.disabled = true;

    setTimeout(() => {
      const sucesso = (email === "teste@teste.com" && senha === "123456");
      console.log("Checando credenciais, sucesso?", sucesso);

      if (sucesso) {
        if (lembrar) {
          localStorage.setItem("auth", JSON.stringify({ email }));
        } else {
          sessionStorage.setItem("auth", JSON.stringify({ email }));
        }
        console.log("Redirecionando para index.html");
        window.location.href = "index.html";
      } else {
        console.warn("Credenciais inválidas");
        erroMsg.textContent = "Usuário ou senha incorretos.";
        erroMsg.classList.remove('hidden');
        btn.innerHTML = "Confirmar";
        btn.disabled = false;
      }
    }, 1500);
  });
});
