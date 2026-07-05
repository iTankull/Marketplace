const container = document.getElementById("products-container");
container.innerHTML = "";
function createProductCard(product){

    return `
        <article class="product-card card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>R$ ${product.price}</p>
            </div>
        </article>
    `;
}
products.forEach(function(product){

    container.innerHTML += createProductCard(product);

});