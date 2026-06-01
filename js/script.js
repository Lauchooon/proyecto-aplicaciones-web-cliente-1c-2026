let allProducts = [];
let catalogProducts = [];


document.addEventListener("DOMContentLoaded", (event) => {

    fetch("https://fakestoreapi.com/products?sort=desc")
        .then(response => response.json())
        .then(data => { 
            allProducts = data.map(item => ({
                name: item.title,
                price: `$${item.price.toFixed(2)}`,
                image: item.image,
                quotes: `${item.rating.count} cuotas sin interés de $${(item.price / item.rating.count).toFixed(2)}`,
                location: item.category
            }));
            catalogProducts = allProducts;
            loadProducts(catalogProducts);
        })
        .catch(error => console.error("Error fetching products:", error));

});

function newProductCard(product) {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");
    
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("product-image-container");
    
    const badge = document.createElement("span");
    badge.classList.add("badge-envio");
    badge.textContent = "Envío gratis";
    
    const img = document.createElement("img");
    img.classList.add("product-image");
    img.src = product.image;
    img.alt = product.name;
    
    imageContainer.appendChild(badge);
    imageContainer.appendChild(img);
    
    const name = document.createElement("h3");
    name.textContent = product.name;
    
    const price = document.createElement("p");
    price.classList.add("product-price");
    price.textContent = product.price;
    
    const quotes = document.createElement("p");
    quotes.classList.add("product-quotes");
    quotes.textContent = product.quotes;
    
    const location = document.createElement("p");
    location.classList.add("product-location");
    location.textContent = product.location;
    
    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");
    productInfo.appendChild(name);
    productInfo.appendChild(price);
    productInfo.appendChild(quotes);
    productInfo.appendChild(location);


    productCard.appendChild(imageContainer);
    productCard.appendChild(productInfo);
    
    return productCard;
}

function loadProducts(products) {
    const productsGrid = document.querySelector(".products-grid");
    products.forEach(product => {
        const productCard = newProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function clearProducts() {
    const productsGrid = document.querySelector(".products-grid");
    while (productsGrid.firstChild) {
        productsGrid.removeChild(productsGrid.firstChild);
    }
}

document.getElementById("input-search").addEventListener("input", function() {
    catalogProducts = [];
    clearProducts(); // Clear current products from the grid
    const query = this.value.toLowerCase();
    
    allProducts.forEach(product => {
        const name = product.name.toLowerCase();
        const location = product.location.toLowerCase();
        
        if (name.includes(query) || location.includes(query)) {
            catalogProducts.push(product);
        } else {
            // Do nothing, product is not displayed
        }
    });

    loadProducts(catalogProducts);
});

