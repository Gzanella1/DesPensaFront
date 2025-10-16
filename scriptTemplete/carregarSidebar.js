// carregarSidebar.js
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("sidebar-container");
    
    fetch("sidebar.html")
      .then(response => response.text())
      .then(data => {
        container.innerHTML = data;
      })
      .catch(error => {
        console.error("Erro ao carregar a sidebar:", error);
      });
  });