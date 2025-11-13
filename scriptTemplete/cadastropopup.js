document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalCadastro");
  const abrir = document.getElementById("abrirCadastro");
  const fechar = document.getElementById("fecharCadastro");
  const form = document.getElementById("cadastroForm");

  // Abrir modal
  abrir.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Fechar modal
  fechar.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Fechar clicando fora da modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Cadastro
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("emailCadastro").value.trim();
    const senha = document.getElementById("senhaCadastro").value.trim();

    if (!nome || !email || !senha) {
      showAlert("Todos os campos são obrigatórios.", "warning");
      return;
    }

    showAlert("Cadastro realizado com sucesso!", "success");
    form.reset();
    modal.classList.add("hidden");
  });
});
