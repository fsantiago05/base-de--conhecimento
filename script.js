const cardConteiner = document.querySelector(".card-container");
const campoBusca = document.querySelector("#campo-busca");
let dados = [];

// Função para carregar os dados do JSON e renderizar todos os cards inicialmente.
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function iniciarBusca() {
    const termoBusca = campoBusca.value.toLowerCase();

    if (termoBusca.trim() === "") {
        renderizarCards(dados); // Mostra todos se a busca estiver vazia
        return;
    }

    const resultados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.tags.some(tag => tag.toLowerCase().includes(termoBusca))
    );

    renderizarCards(resultados);
}

function renderizarCards(cardsParaRenderizar) {
    cardConteiner.innerHTML = ""; 
    for (const dado of cardsParaRenderizar) {
        const article = document.createElement("article");
        article.classList.add("card");

        // Cria o HTML para as tags, envolvendo cada uma em um <span>
        const tagsHtml = dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p><strong>Ano de criação:</strong> ${dado.data_criacao}</p>
        <p>${dado.descricao}</p>
        <div class="tags-container">
            ${tagsHtml}
        </div>
        <a href="${dado.link}" target="_blank">Saiba mais</a>`;
        cardConteiner.appendChild(article);
    }
}

// Carrega os dados assim que o script é executado.
carregarDados();
