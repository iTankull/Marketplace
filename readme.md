# Marketplace

Marketplace é uma landing page de e-commerce desenvolvida com HTML, CSS e JavaScript puro. O projeto apresenta uma vitrine de produtos em destaque, categorias de navegação, busca visual no cabeçalho, botões de ação e cards de produtos renderizados dinamicamente a partir de uma lista JavaScript.

## Visão geral

A interface foi construída para simular a página inicial de um marketplace moderno, com foco em produtos de tecnologia e games. A página inclui:

- Topbar com textura visual da marca.
- Cabeçalho com logo, campo de pesquisa e ações de login, favoritos e carrinho.
- Menu de navegação por categorias.
- Seção hero com chamada promocional.
- Grade de categorias com ícones.
- Vitrine de produtos em destaque gerada via JavaScript.
- Cards com imagem, avaliação, preço, desconto e economia calculada.
- Botão de favorito com alteração visual ao clicar.

## Tecnologias utilizadas

- HTML5
- CSS3 modularizado com `@import`
- JavaScript vanilla
- [Lucide Icons](https://lucide.dev/) via CDN
- Python HTTP Server para execução local simples
- Node.js para validações sintáticas e utilitárias do projeto

## Estrutura do projeto

```text
.
├── Assets/
│   └── images/              # Imagens, logo e textura usadas na interface
├── css/
│   ├── base/                # Reset, variáveis e estilos globais
│   ├── components/          # Cards, botões, badges, produtos, categorias etc.
│   ├── layout/              # Header, navbar, hero, topbar, footer e carousel
│   ├── pages/               # Estilos específicos de página/responsividade
│   └── style.css            # Arquivo principal que importa os módulos CSS
├── js/
│   ├── products.js          # Lista de produtos exibidos na vitrine
│   ├── main.js              # Renderização dos cards e interação de favoritos
│   └── scripts/validade.js  # Script auxiliar de validação local
├── index.html               # Página principal
├── package.json             # Scripts npm do projeto
└── README.md
```

## Como executar localmente

> É necessário ter Python 3 instalado para usar o script de servidor local definido no `package.json`.

1. Clone o repositório ou baixe os arquivos do projeto.
2. Acesse a pasta do projeto.
3. Inicie o servidor local:

```bash
npm start
```

4. Abra o navegador em:

```text
http://localhost:4173
```

Também é possível abrir o arquivo `index.html` diretamente no navegador, mas o servidor local evita problemas comuns com caminhos e carregamento de assets.

## Scripts disponíveis

```bash
npm start
```

Inicia um servidor HTTP local com Python na porta `4173`.

```bash
npm test
```

Executa as validações configuradas no `package.json`.

## Como os produtos são exibidos

Os produtos ficam definidos em `js/products.js`. Cada item contém informações como:

- `id`
- `name`
- `image`
- `price`
- `rating`
- `reviews`
- `discount`
- `favorite`

O arquivo `js/main.js` lê essa lista, monta os cards em HTML, calcula o preço com desconto, formata os valores em reais e inicializa os ícones da biblioteca Lucide.

## Personalização

### Alterar produtos

Edite o array `products` em `js/products.js` para adicionar, remover ou atualizar os itens exibidos.

### Alterar estilos

Os estilos são separados por responsabilidade dentro da pasta `css/`:

- Use `css/base/variables.css` para alterar cores, sombras, raios de borda e fonte principal.
- Use `css/layout/` para ajustar áreas estruturais da página.
- Use `css/components/` para alterar elementos reutilizáveis como cards, badges e botões.
- Use `css/style.css` como ponto de entrada dos estilos.

### Alterar imagens

Adicione novas imagens em `Assets/images/` e atualize os caminhos correspondentes em `index.html`, `css/` ou `js/products.js`.

## Observações

Este projeto é uma página estática de demonstração. Atualmente não há integração com backend, autenticação real, checkout, carrinho persistente ou banco de dados. As interações acontecem no navegador e servem como base visual para uma experiência de marketplace.
