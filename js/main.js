function createProductCard(product){
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

    return `
        <article class="product-card card">

            <div class="product-image">

                ${discountBadge}

                ${favoriteButton}

                <img
                    src="${product.image}"
                    alt="${product.name}">

            </div>

            <div class="product-info">

                <h3>${product.name}</h3>
                ${ratingHTML}
                ${priceHTML}

            </div>

        </article>
    `;
}
const container = document.getElementById("products-container");
container.innerHTML = "";

products.forEach(function(product){

    container.innerHTML += createProductCard(product);

});

lucide.createIcons();

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(function(button){

    button.addEventListener("click", function(){

        const productId = Number(button.dataset.id);

        const product = products.find(function(item){

            return item.id === productId;

        });

        product.favorite = !product.favorite;

        button.classList.toggle("is-favorite");

    });

});