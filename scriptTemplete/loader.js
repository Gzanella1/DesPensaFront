// loader.js
document.addEventListener("DOMContentLoaded", () => {
  // Espera o loader ser injetado
  const checkLoader = setInterval(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hidden"); // adiciona fade
      setTimeout(() => loader.style.display = "none", 700);
      clearInterval(checkLoader);
    }
  }, 50); // checa a cada 50ms até o loader existir
});
