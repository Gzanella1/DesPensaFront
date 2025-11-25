document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ validalogin.js foi carregado!");
  
  const form = document.getElementById("loginForm");
  if (!form) {
    console.error("❌ Formulário não encontrado!");
    return;
  }

  console.log("✅ DOM carregado e listener ativo.");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("📩 Formulário enviado");

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const lembrar = document.getElementById("lembrar").checked;
    const btn = document.getElementById("btnConfirmar");

    if (!email || !senha) {
      showAlert("Todos os campos são obrigatórios.", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Formato de e-mail inválido.", "error");
      return;
    }

    btn.innerHTML = "Entrando...";
    btn.disabled = true;

    setTimeout(() => {
      const sucesso = email === "teste@teste.com" && senha === "123456";
      console.log("🔍 Credenciais válidas?", sucesso);

      if (sucesso) {
        if (lembrar) {
          localStorage.setItem("auth", JSON.stringify({ email }));
        } else {
          sessionStorage.setItem("auth", JSON.stringify({ email }));
        }

        showAlert("Login realizado com sucesso!", "success");
        console.log("🚀 Redirecionando...");

        setTimeout(() => {
          window.location.href = "../dashboard-perfil.html";
        }, 1500);
      } else {
        showAlert("Usuário ou senha incorretos.", "error");
        btn.innerHTML = "Confirmar";
        btn.disabled = false;
      }
    }, 1200);
  });
});
