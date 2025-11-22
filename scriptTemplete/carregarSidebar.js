// carregarSidebar.js
  document.addEventListener("DOMContentLoaded", function () {
    // Código existente para carregar a sidebar...
    const sidebarContainer = document.getElementById("sidebar-container");
    fetch("sidebar.html")
      .then(response => response.text())
      .then(data => {
        sidebarContainer.innerHTML = data;
      })
      .catch(error => {
        console.error("Erro ao carregar a sidebar:", error);
      });
// NOVO: Funcionalidade para injetar o formulário após a busca (simulada)
const formBusca = document.getElementById("form-busca");
const resultadosDiv = document.getElementById("resultados");

// Simulando um objeto de dados do usuário que viria de uma API
// No seu sistema real, isso viria da resposta da sua requisição de busca
const mockUserData = {
    name: "João da Silva",
    city: "Blumenau",
    region: "SC",
    accessProfile: "Admin", // <<< Este é o campo que queremos readonly
    email: "joao.silva@example.com",
    password: "hashed_password" // Ou vazio para não exibir
};

if (formBusca) {
    formBusca.addEventListener("submit", function (e) {
        e.preventDefault(); // Impede o envio real do formulário

        // Pega o termo de busca (opcional, se quiser usar para algo)
        const termoBusca = document.getElementById("termo_busca").value;
        console.log("Buscando por:", termoBusca);

        // Simula uma espera de carregamento
        resultadosDiv.innerHTML = '<p class="text-center text-gray-600 mt-4">Buscando usuário...</p>';

        setTimeout(() => {
            // HTML do Formulário de Resultados - AGORA COM CLASSES TAILWIND E READONLY
            const formularioHTML = `
                <div class="mt-8 p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-6 text-gray-800">Detalhes do Usuário Encontrado</h2>
                    <form id="resultado-usuario-form">

                        <div class="mb-4">
                            <label for="nome" class="block text-gray-700 text-sm font-bold mb-2">Nome</label>
                            <input type="text" id="nome" name="nome" value="${mockUserData.name}" required
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>

                        <div class="flex flex-wrap -mx-2 mb-4">
                            <div class="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                <label for="cidade" class="block text-gray-700 text-sm font-bold mb-2">Cidade</label>
                                <input type="text" id="cidade" name="cidade" value="${mockUserData.city}"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            </div>
                            <div class="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                                <label for="regiao" class="block text-gray-700 text-sm font-bold mb-2">Região</label>
                                <input type="text" id="regiao" name="regiao" value="${mockUserData.region}"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            </div>
                            <div class="w-full md:w-1/3 px-2">
                                <label for="perfil_acesso" class="block text-gray-700 text-sm font-bold mb-2">Perfil Acesso</label>
                                <input type="text" id="perfil_acesso" name="perfil_acesso" value="${mockUserData.accessProfile}" readonly
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                                           bg-gray-100 cursor-not-allowed text-gray-600 focus:outline-none focus:shadow-outline">
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input type="email" id="email" name="email" value="${mockUserData.email}" required
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>

                        <div class="mb-6">
                            <label for="senha" class="block text-gray-700 text-sm font-bold mb-2">Senha</label>
                            <input type="password" id="senha" name="senha" placeholder="********" value=""
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>

                        <div class="flex justify-end gap-4 mt-6">
                            <button type="submit"
                                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
                                Salvar Alterações
                            </button>
                            <button type="button"
                                class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
                                Excluir Usuário
                            </button>
                        </div>

                    </form>
                </div>
            `;
            resultadosDiv.innerHTML = formularioHTML;
        }, 1000); // Espera de 1 segundo
    });
}});