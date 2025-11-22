const swiperWrapper = document.querySelector(".swiper-wrapper");
const campoBusca = document.querySelector("#campo-busca");
const categoryButton = document.querySelector("#category-button");
const categoryList = document.querySelector("#category-list");
let dados = [];

let swiper; // Variável para armazenar a instância do Swiper
// Função para carregar os dados do JSON e renderizar todos os cards inicialmente.
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        popularCategorias();
        renderizarCards(dados);
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function popularCategorias() {
    // Lista de categorias curada que você pediu
    const categoriasPrincipais = [
        'Backend',
        'Frontend',
        'Mobile',
        'IA',
        'Banco de Dados',
        'Análise de Dados',
        'Web',
        'DevOps',
        'UX/UI'
    ];

    // Limpa a lista antes de adicionar novas categorias
    categoryList.innerHTML = '';

    // Adiciona a opção "Todas as Categorias"
    const todasOption = document.createElement('a');
    todasOption.href = '#';
    todasOption.textContent = 'Todas as Categorias';
    todasOption.onclick = (e) => { e.preventDefault(); buscarPorCategoria(''); };
    categoryList.appendChild(todasOption);

    // Adiciona as categorias da lista curada
    categoriasPrincipais.forEach(categoria => {
        const a = document.createElement('a'); 
        a.href = '#';
        a.textContent = categoria;
        // Passa a categoria em minúsculo para a função de busca
        a.onclick = (e) => { e.preventDefault(); buscarPorCategoria(categoria.toLowerCase()); };
        categoryList.appendChild(a);
    });
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

function buscarPorCategoria(categoria) {
    // Limpa o campo de busca de texto para evitar confusão
    campoBusca.value = "";
    categoryList.classList.remove('show'); // Esconde o dropdown após a seleção

    // Se a categoria for vazia (opção "Todas as Categorias"), mostra todos os cards
    if (categoria === "") {
        renderizarCards(dados);
        return;
    }

    // Mapeamento de categorias principais para tags específicas
    const mapeamentoTags = {
        'banco de dados': ['banco de dados', 'banco_de_dados', 'nosql', 'relacional', 'sql'],
        'análise de dados': ['análise de dados', 'analise', 'data science', 'big data'],
        'desenvolvimento web': ['web development', 'web'],
        'ia': ['ia', 'inteligencia_artificial', 'machine_learning'],
        'ux/ui': ['ui', 'design']
    };

    // Usa o mapeamento se a categoria existir, senão usa a própria categoria como termo de busca
    const tagsParaBuscar = mapeamentoTags[categoria] || [categoria];

    const resultados = dados.filter(dado =>
        // Verifica se alguma tag do card corresponde a alguma das tags que estamos buscando
        dado.tags.some(tag => tagsParaBuscar.includes(tag.toLowerCase()))
    );

    renderizarCards(resultados);
}

function renderizarCards(cardsParaRenderizar) {
    if (cardsParaRenderizar.length === 0) {
        swiperWrapper.innerHTML = `<div class="no-results">Nenhum resultado encontrado.</div>`;
        if (swiper) swiper.destroy(); // Destroi o carrossel se não houver resultados
        return;
    }

    swiperWrapper.innerHTML = ""; 
    for (const dado of cardsParaRenderizar) {
        // Cria o slide que conterá o card
        const swiperSlide = document.createElement("div");
        swiperSlide.classList.add("swiper-slide");

        const article = document.createElement("article");
        article.classList.add("card");

        // Cria o HTML para as tags, envolvendo cada uma em um <span>
        const tagsHtml = dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        // Monta o HTML do card usando a nova estrutura
        article.innerHTML = `
            <div class="card-header">
                <div class="card-icon">
                    <svg class="icon"><use xlink:href="icons/icons.svg#${dado.icone}"></use></svg>
                </div>
                <h2>${dado.nome}</h2>
            </div>
            <p class="card-description">${dado.descricao}</p>
            <p class="card-creation-date"><strong>Ano de criação:</strong> ${dado.data_criacao}</p>
            <div class="tags-container">
                ${tagsHtml}
            </div>
            <a href="${dado.link}" target="_blank" class="card-link">Saiba mais</a>
        `;
        // Adiciona o card dentro do slide e o slide dentro do wrapper
        swiperSlide.appendChild(article);
        swiperWrapper.appendChild(swiperSlide);
    }

    // Se o Swiper já existe, destrói a instância antiga antes de criar uma nova
    if (swiper) {
        swiper.destroy();
    }

    // Inicializa ou reinicializa o Swiper
    swiper = new Swiper('.swiper-container', {
      // Quantidade de slides visíveis
      slidesPerView: 1,
      spaceBetween: 30, // Espaço entre os slides
      loop: cardsParaRenderizar.length > 1, // Habilita o loop apenas se houver mais de 1 card

      // Paginação
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      // Navegação (setas)
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
}

// Carrega os dados assim que o script é executado.
carregarDados();

// Adiciona evento para buscar ao pressionar "Enter"
campoBusca.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        iniciarBusca();
    }
});

// Controla a exibição do dropdown de categorias
categoryButton.addEventListener('click', () => {
    categoryList.classList.toggle('show');
});

// Fecha o dropdown se clicar fora dele
window.addEventListener('click', (event) => {
    if (!event.target.matches('.category-button')) {
        if (categoryList.classList.contains('show')) {
            categoryList.classList.remove('show');
        }
    }
});
