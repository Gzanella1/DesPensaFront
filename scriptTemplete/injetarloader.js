// /scriptTemplete/injetarloader.js (NOVA VERSÃO - PARA O <HEAD>)
(function() {
    // 1. Criar um pedido 'XMLHttpRequest' (XHR)
    const xhr = new XMLHttpRequest();

    // 2. Abrir o pedido para o /loader.html
    // O 'false' no final é o mais importante:
    // ele torna o pedido SÍNCRONO.
    // Isso bloqueia o carregamento da página até que o arquivo seja baixado.
    // É geralmente uma má prática, mas para um loader local
    // (que é minúsculo) é a solução mais confiável.
    xhr.open('GET', '/loader.html', false);

    try {
        // 3. Enviar o pedido
        xhr.send(null);

        // 4. Checar se funcionou
        if (xhr.status === 200) {
            // 5. Escrever o HTML do loader DIRETAMENTE no DOM
            // Como isso está no <head>, o HTML será inserido
            // antes do <body> começar a ser processado.
            document.write(xhr.responseText);
        } else {
            console.error('Falha ao carregar loader.html (síncrono):', xhr.status);
        }
    } catch (e) {
        console.error('Erro ao injetar loader:', e);
    }
})();