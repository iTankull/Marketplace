function createProductCard(product, options){
    options = options || {};

    // ===== Badges e Classes =====

    const discountBadge = product.discount > 0
        ? `<span class="badge badge-discount">-${product.discount}%</span>`
        : "";

    const favoriteClass = product.favorite
        ? "is-favorite"
        : "";

    // ===== Cálculos =====

    const discountedPrice = Number(
        (
            product.price * (1 - product.discount / 100)
        ).toFixed(2)
    );

    const savings = product.price - discountedPrice;

    // ===== Formatação =====

    const fullStars =
    "★".repeat(Math.round(product.rating));
    const emptyStars =
    "☆".repeat(5 - Math.round(product.rating));
    const ratingHTML = `
    <div class="product-rating">

        <span class="stars">

            ${fullStars}${emptyStars}

        </span>

        <span class="reviews">

            (${product.reviews})

        </span>

    </div>
`;

    const formattedPrice = discountedPrice.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

    const formattedOriginalPrice = product.price.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

    const formattedSavings = savings.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

    // ===== HTML =====

    const savingsHTML = product.discount > 0
        ? `
            <span class="savings">
                Você economiza ${formattedSavings}
            </span>
        `
        : "";

    const priceHTML = `
        <div class="product-prices">

            <span class="old-price ${
                product.discount > 0 ? "" : "invisible"
            }">

                ${formattedOriginalPrice}

            </span>

            <span class="current-price">

                ${
                    product.discount > 0
                        ? formattedPrice
                        : formattedOriginalPrice
                }

            </span>

            ${savingsHTML}

        </div>
    `;

    const favoriteButton = `
        <button
            class="favorite-btn ${favoriteClass}"
            data-id="${product.id}">

            <i data-lucide="heart"></i>

        </button>
    `;

    const cardClass = options.cardClass
        ? ` ${options.cardClass}`
        : "";

    const metricHTML = options.metric
        ? `
            <div class="product-metric">
                <span>${options.metric.title}</span>
                <strong>${options.metric.value}</strong>
            </div>
        `
        : "";

    return `
        <article class="product-card card${cardClass}">

            <div class="product-image">

                ${discountBadge}

                ${favoriteButton}

                <img
                    src="${product.image}"
                    alt="${product.name}">

            </div>

            <div class="product-info">

                ${metricHTML}
                <h3>${product.name}</h3>
                ${ratingHTML}
                ${priceHTML}

            </div>

        </article>
    `;
}
const container = document.getElementById("products-container");
function renderProducts(list, containerId){

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";

    list.forEach(function(product){

        container.innerHTML +=
            createProductCard(product);

    });
}
renderProducts(
    products,
    "products-container"
);

function getPlatformStat(product, statName){
    if (!product.platformStats) {
        return 0;
    }

    return product.platformStats[statName] || 0;
}

function getTopProductByStat(statName){
    return products.reduce(function(topProduct, product){
        const topValue =
            getPlatformStat(topProduct, statName);

        const productValue =
            getPlatformStat(product, statName);

        return productValue > topValue
            ? product
            : topProduct;
    });
}

function formatStat(value){
    return value.toLocaleString("pt-BR");
}

function renderMarketInsights(){
    const container =
        document.getElementById("market-insights-container");

    if (!container) {
        return;
    }

    const insights = [
        {
            title: "Os mais favoritados",
            statName: "favorites",
            label: "favoritos"
        },
        {
            title: "Os mais visitados",
            statName: "visits",
            label: "visitas"
        },
        {
            title: "Os mais vendidos",
            statName: "sales",
            label: "vendas"
        }
    ];

    container.innerHTML = "";

    insights.forEach(function(insight){
        const product =
            getTopProductByStat(insight.statName);

        container.innerHTML += createProductCard(
            product,
            {
                cardClass: "market-insight-card",
                metric: {
                    title: insight.title,
                    value: `${formatStat(getPlatformStat(product, insight.statName))} ${insight.label}`
                }
            }
        );
    });
}

function setupFavoriteButtons(){
    const favoriteButtons =
        document.querySelectorAll(".favorite-btn");

    favoriteButtons.forEach(function(button){

        button.addEventListener("click", function(){

            const productId = Number(button.dataset.id);

            const product = products.find(function(item){

                return item.id === productId;

            });

            if (!product) {
                return;
            }

            product.favorite = !product.favorite;

            document
                .querySelectorAll(`.favorite-btn[data-id="${productId}"]`)
                .forEach(function(relatedButton){

                    relatedButton.classList.toggle(
                        "is-favorite",
                        product.favorite
                    );

                });

        });

    });
}

function setupProductsCarousel(){
    const track =
        document.getElementById("products-container");

    const previousButton =
        document.querySelector(".carousel-arrow-left");

    const nextButton =
        document.querySelector(".carousel-arrow-right");

    if (!track || !previousButton || !nextButton) {
        return;
    }

    function getScrollStep(){
        const card =
            track.querySelector(".product-card");

        if (!card) {
            return track.clientWidth;
        }

        const styles =
            window.getComputedStyle(track);

        const gap =
            Number.parseFloat(styles.columnGap || styles.gap) || 0;

        return card.offsetWidth + gap;
    }

    function isAtStart(){
        return track.scrollLeft <= 1;
    }

    function isAtEnd(){
        return track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    }

    function updateArrows(){
        previousButton.classList.toggle("is-edge", isAtStart());
        nextButton.classList.toggle("is-edge", isAtEnd());
    }

    previousButton.addEventListener("click", function(){
        if (isAtStart()) {
            track.scrollTo({
                left: track.scrollWidth,
                behavior: "smooth"
            });
            return;
        }

        track.scrollBy({
            left: -getScrollStep(),
            behavior: "smooth"
        });
    });

    nextButton.addEventListener("click", function(){
        if (isAtEnd()) {
            track.scrollTo({
                left: 0,
                behavior: "smooth"
            });
            return;
        }

        track.scrollBy({
            left: getScrollStep(),
            behavior: "smooth"
        });
    });

    track.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    updateArrows();
}

renderMarketInsights();
lucide.createIcons();
setupFavoriteButtons();
setupProductsCarousel();
