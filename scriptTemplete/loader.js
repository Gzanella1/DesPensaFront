// /scriptTemplete/loader.js (VERSÃO SIMPLIFICADA - FIM DO <BODY>)

// 'DOMContentLoaded' dispara quando o HTML foi lido.
document.addEventListener("DOMContentLoaded", () => {
    
    // O loader FOI GARANTIDO pelo 'injetarloader.js' no <head>
    const loader = document.getElementById("loader");
    
    if (loader) {
        // 1. Adiciona a classe 'hidden' do seu loader.css
        loader.classList.add("hidden");
        
        // 2. Espera a transição de 0.5s + 0.2s de margem
        setTimeout(() => {
            loader.style.display = "none";
        }, 700); 

    } else {
        // Este console não deve mais aparecer
        console.warn("Elemento #loader não foi encontrado para ocultar.");
    }
});