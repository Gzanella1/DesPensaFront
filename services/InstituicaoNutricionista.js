
    const API_URL = "http://localhost:8080/api/pessoas";
    const API_INSTITUICOES = "http://localhost:8080/api/instituicoes";
    
    let pessoasCache = [];
    let instituicoesCache = [];
    let modalInstance;

    document.addEventListener('DOMContentLoaded', () => {
        const modalEl = document.getElementById('modalForm');
        // Impede que o modal feche se clicar fora, para evitar perda de dados acidental
        modalInstance = new bootstrap.Modal(modalEl, { backdrop: 'static' });
        
        carregarInstituicoes();
        carregarPessoas();
    });

    // --- 1. Carregar Instituições ---
    async function carregarInstituicoes() {
        const select = document.getElementById('instituicaoSelect');
        try {
            const response = await fetch(API_INSTITUICOES);
            if(response.ok) {
                instituicoesCache = await response.json();
                select.innerHTML = '<option value="" selected disabled>Selecione uma instituição...</option>';
                instituicoesCache.forEach(inst => {
                    // Ajuste aqui se o ID da instituicao for 'id' ou 'idInstituicao'
                    const idInst = inst.id || inst.idInstituicao;
                    const option = document.createElement('option');
                    option.value = idInst; 
                    option.text = `${inst.nome} (Cód: ${inst.codigo})`;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Erro ao carregar instituições:", error);
            select.innerHTML = '<option disabled>Erro ao conectar API</option>';
        }
    }

    // --- 2. Carregar Pessoas ---
    async function carregarPessoas() {
        const tbody = document.getElementById('tabelaPessoas');
        const spinner = document.getElementById('loadingSpinner');
        const msgVazio = document.getElementById('msgVazio');

        tbody.innerHTML = '';
        spinner.classList.remove('d-none');
        msgVazio.classList.add('d-none');

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Falha na requisição");
            
            const data = await response.json();
            pessoasCache = data;
            
            spinner.classList.add('d-none');
            renderizarTabela(pessoasCache);

        } catch (error) {
            console.error(error);
            spinner.classList.add('d-none');
            tbody.innerHTML = `<tr><td colspan="6" class="text-danger fw-bold">Erro ao carregar dados do servidor. Verifique se o Backend está rodando.</td></tr>`;
        }
    }

    // --- 3. Renderizar Tabela ---
    function renderizarTabela(lista) {
        const tbody = document.getElementById('tabelaPessoas');
        tbody.innerHTML = '';

        if (!lista || lista.length === 0) {
            document.getElementById('msgVazio').classList.remove('d-none');
            return;
        } else {
            document.getElementById('msgVazio').classList.add('d-none');
        }

        lista.forEach(p => {
            // Normalização de IDs (caso o backend retorne nomes diferentes)
            const pId = p.idPessoa || p.id;
            
            const badges = p.restricaoAlimentar && p.restricaoAlimentar.length > 0
                ? p.restricaoAlimentar.map(r => `<span class="badge bg-warning text-dark me-1">${r}</span>`).join('') 
                : '<span class="text-muted small">Nenhuma</span>';

            // Busca nome da instituição
            const instObj = instituicoesCache.find(i => (i.id || i.idInstituicao) === p.idInstituicao);
            const instNome = instObj ? instObj.nome : `Inst. ID: ${p.idInstituicao}`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pId}</td>
                <td class="fw-bold text-start">${p.nome}</td>
                <td>${p.idade} anos</td>
                <td class="text-primary">${instNome}</td>
                <td>${badges}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary mx-1" onclick="editarPessoa(${pId})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger mx-1" onclick="excluirPessoa(${pId})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- 4. Salvar (POST/PUT) - CORRIGIDO ---
    async function salvarPessoa(event) {
        event.preventDefault(); // Impede o reload da página

        // Captura e validação dos dados
        const idCampo = document.getElementById('editId').value;
        const nome = document.getElementById('nome').value;
        const idadeStr = document.getElementById('idade').value;
        const instituicaoStr = document.getElementById('instituicaoSelect').value;
        const restricoesInput = document.getElementById('restricoes').value;

        // VALIDAÇÃO PRÉVIA: Garante que idade e instituição são números válidos
        if (!instituicaoStr) {
            alert("Por favor, selecione uma Instituição.");
            return;
        }

        const idade = parseInt(idadeStr);
        const idInstituicao = parseInt(instituicaoStr);

        // Processa restrições
        const restricoesArray = restricoesInput
            .split(',')
            .map(item => item.trim().toUpperCase())
            .filter(item => item !== "");

        // Monta o objeto (Payload)
        const payload = {
            nome: nome,
            idade: idade,
            idInstituicao: idInstituicao,
            restricaoAlimentar: restricoesArray
        };

        let url = API_URL;
        let method = "POST";

        // Se tiver ID, é edição
        if (idCampo) {
            method = "PUT";
            url = `${API_URL}/${idCampo}`;
            // IMPORTANTE: Adiciona o ID no corpo do JSON também, pois muitos backends exigem
            payload.id = parseInt(idCampo); 
            payload.idPessoa = parseInt(idCampo); // Envia os dois para garantir compatibilidade
        }

        console.log(`Enviando [${method}]:`, payload);

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Sucesso
                modalInstance.hide();
                carregarPessoas(); // Recarrega a tabela
                alert("Operação realizada com sucesso!");
            } else {
                // Erro do Backend (Ex: 400 ou 500)
                const errorText = await response.text();
                console.error("Erro Backend:", errorText);
                alert(`Erro ao salvar: ${response.status}\n${errorText}`);
            }
        } catch (e) {
            console.error("Erro de rede:", e);
            alert("Erro de conexão com o servidor.");
        }
    }

    // --- 5. Funções Auxiliares ---

    function abrirModalCriacao() {
        // Reseta o formulário HTML
        document.getElementById('formPessoa').reset();
        
        // Garante que o campo Hidden ID esteja vazio
        document.getElementById('editId').value = "";
        
        // Garante que o select volte ao padrão
        document.getElementById('instituicaoSelect').value = "";
        
        document.getElementById('tituloModal').innerText = "Adicionar Pessoa";
        modalInstance.show();
    }

    function editarPessoa(id) {
        // Encontra a pessoa no cache local
        const p = pessoasCache.find(x => (x.idPessoa || x.id) === id);
        if (!p) {
            alert("Erro: Pessoa não encontrada na memória.");
            return;
        }

        // Preenche o formulário
        document.getElementById('editId').value = p.idPessoa || p.id;
        document.getElementById('nome').value = p.nome;
        document.getElementById('idade').value = p.idade;
        document.getElementById('instituicaoSelect').value = p.idInstituicao;

        // Converte array para string visual
        if(p.restricaoAlimentar && Array.isArray(p.restricaoAlimentar)) {
            document.getElementById('restricoes').value = p.restricaoAlimentar.join(', ');
        } else {
            document.getElementById('restricoes').value = '';
        }

        document.getElementById('tituloModal').innerText = "Editar Pessoa";
        modalInstance.show();
    }

    async function excluirPessoa(id) {
        if (confirm("Tem certeza que deseja excluir este registro?")) {
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                if (res.ok || res.status === 204) {
                    carregarPessoas();
                } else {
                    alert("Não foi possível excluir. Verifique se existem dependências.");
                }
            } catch (e) {
                alert("Erro de conexão.");
            }
        }
    }

    function filtrarTabela() {
        const termo = document.getElementById('buscar').value.toLowerCase();
        const linhas = document.querySelectorAll('#tabelaPessoas tr');
        linhas.forEach(tr => {
            const txt = tr.innerText.toLowerCase();
            tr.style.display = txt.includes(termo) ? '' : 'none';
        });
    }



































    
    // !!! IMPORTANTE: Defina aqui qual ID deve aparecer no topo.
    // Pode vir do localStorage: localStorage.getItem('idInstituicaoUsuario')
    const ID_INSTITUICAO_ATUAL = 602; 

    document.addEventListener('DOMContentLoaded', () => {
        // ... seus inits anteriores ...
        
        carregarCabecalhoInstituicao(); // <--- CHAME ESSA NOVA FUNÇÃO
    });

    // --- NOVA FUNÇÃO: Carregar Cabeçalho ---
    async function carregarCabecalhoInstituicao() {
        try {
            // Busca a instituição específica pelo ID
            const res = await fetch(`${API_INSTITUICOES}/${ID_INSTITUICAO_ATUAL}`);
            
            if (res.ok) {
                const inst = await res.json();
                
                // Preenche o HTML
                document.getElementById('headerCodigo').innerText = inst.codigo || `#${inst.id}`;
                document.getElementById('headerNome').innerText = inst.nome;
                
                // Se tiver campo 'tipo', mostra. Se não, tenta inferir ou deixa vazio.
                const tipo = inst.tipo || "GERAL"; 
                document.getElementById('headerTipo').innerText = tipo.toUpperCase();
            }
        } catch (error) {
            console.error("Erro ao carregar cabeçalho:", error);
            document.getElementById('headerNome').innerText = "Instituição não identificada";
        }
    }
    // ... resto do código ...