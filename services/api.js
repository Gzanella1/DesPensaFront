    // Configuração da API
    const API_BASE_URL = "http://localhost:8080/api/cardapios";

    // Inicialização
    window.onload = () => {
      if (typeof carregarSidebar === 'function') carregarSidebar();
      buscarSugestoes();
    };

    // 1. Função para Buscar Receitas Iniciais
    async function buscarSugestoes() {
      const grid = document.getElementById('grid-receitas');
      const loading = document.getElementById('loading');
      const msgArea = document.getElementById('mensagem-area');

      // Reset
      grid.innerHTML = '';
      msgArea.classList.add('d-none');
      loading.classList.remove('d-none');

      try {
        // Chamada GET para sugestões
        const response = await fetch(`${API_BASE_URL}/sugestoes?estoqueId=1&intolerancias=`);

        if (!response.ok) throw new Error("Erro ao consultar API Java");

        const receitas = await response.json();

        if (receitas.length === 0) {
          msgArea.innerText = "Nenhuma receita encontrada para o estoque atual.";
          msgArea.classList.remove('d-none');
          return;
        }

        // Renderizar Cards
        receitas.forEach(receita => {
          const col = document.createElement('div');
          col.className = 'col';
          
          // IMPORTANTE: O onclick agora chama abrirModalDetalhes
          col.innerHTML = `
            <div class="card card-receita h-100" 
                 onclick="abrirModalDetalhes(${receita.idReceitaApi}, '${encodeURIComponent(receita.nomeReceita)}', '${encodeURIComponent(receita.urlImagem)}')">
              <img src="${receita.urlImagem}" class="card-img-top" alt="${receita.nomeReceita}">
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title fw-bold text-dark mb-3">${receita.nomeReceita}</h5>
                <button class="btn btn-outline-success w-100 fw-semibold">
                  Selecionar Prato
                </button>
              </div>
            </div>
          `;
          grid.appendChild(col);
        });

      } catch (error) {
        console.error(error);
        msgArea.innerText = "Erro de conexão com o servidor (Porta 8080).";
        msgArea.classList.remove('d-none');
        msgArea.classList.replace('alert-warning', 'alert-danger');
      } finally {
        loading.classList.add('d-none');
      }
    }
// 2. Função para Abrir o Modal e Carregar Ingredientes
    async function abrirModalDetalhes(id, nomeEncoded, imgEncoded) {
      const nome = decodeURIComponent(nomeEncoded);
      const img = decodeURIComponent(imgEncoded);

      // A. Preenche informações básicas do Modal
      document.getElementById('modalTitulo').innerText = nome;
      document.getElementById('modalImg').src = img;

      // B. Exibe o Modal
      const modalElement = document.getElementById('modalDetalhes');
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();

      // C. Prepara a área de ingredientes (Loading)
      const lista = document.getElementById('modalListaIngredientes');
      const loading = document.getElementById('modalLoading');
      lista.innerHTML = '';
      lista.classList.add('d-none');
      loading.classList.remove('d-none');

      // D. Busca detalhes no Java
      try {
        const res = await fetch(`${API_BASE_URL}/detalhes/${id}`);
        
        if (!res.ok) throw new Error("Endpoint de detalhes não encontrado ou erro no servidor");

        const detalhes = await res.json();

        // ==================================================================
        // A CORREÇÃO ESTÁ AQUI EMBAIXO 👇
        // Troque 'extendedIngredients' por 'ingredientesEstendidos'
        // ==================================================================
        
        if (detalhes.ingredientesEstendidos && detalhes.ingredientesEstendidos.length > 0) {
            
            detalhes.ingredientesEstendidos.forEach(ing => {
                const li = document.createElement('li');
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                
                // Nota: Verifique se o Java manda 'name' ou 'nome'. 
                // Geralmente DTO mantém 'name' se você não mudou no Java.
                li.innerHTML = `
                    <span class="text-capitalize">${ing.name || ing.nome}</span> 
                    <span class="badge bg-light text-dark border">${ing.amount} ${ing.unit}</span>
                `;
                lista.appendChild(li);
            });

        } else {
            lista.innerHTML = '<li class="list-group-item text-muted">Ingredientes não listados pela API.</li>';
        }

      } catch (error) {
        console.error("Erro detalhes:", error);
        lista.innerHTML = `<li class="list-group-item text-danger">Erro ao carregar ingredientes.<br><small>${error.message}</small></li>`;
      } finally {
        loading.classList.add('d-none');
        lista.classList.remove('d-none');
      }

      // F. Configura o botão Final de Confirmar
      document.getElementById('btnConfirmarFinal').onclick = () => {
          modalInstance.hide();
          window.location.href = `confirmacao.html?id=${id}&nome=${encodeURIComponent(nome)}&img=${encodeURIComponent(img)}`;
      };
    }