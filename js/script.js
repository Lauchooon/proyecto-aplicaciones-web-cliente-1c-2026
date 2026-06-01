let allProducts = [];
let catalogProducts = [];


document.addEventListener("DOMContentLoaded", (event) => {
    const productsGrid = document.querySelector(".products-grid");
    if (!productsGrid) return;

    fetch(`${SUPABASE_URL}/rest/v1/Products`, {
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
    })
        .then(response => response.json())
        .then(data => { 
            allProducts = data.map(item => ({
                id: item.id,
                name: item.name,
                price: `$${parseFloat(item.price).toFixed(2)}`,
                image: item.image,
                quotes: item.quotes,
                location: item.location,
                description: item.description
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

    productCard.addEventListener("click", function () {
        window.location.href = `/product-detail.html?id=${product.id}`;
    });
    
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

const inputSearchProducts = document.getElementById("input-search");
if (inputSearchProducts) {
    inputSearchProducts.addEventListener("input", function() {
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
}


async function insertProduct(product) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/Products`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response;
}

const productForm = document.getElementById("product-form");
if (productForm) {
    productForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector(".form-submit");
        const messageEl = document.getElementById("form-message");

        submitBtn.disabled = true;
        submitBtn.textContent = "Guardando...";
        messageEl.style.display = "none";
        messageEl.className = "form-message";

        const product = {
            name: document.getElementById("nombre").value.trim(),
            price: parseFloat(document.getElementById("precio").value),
            image: document.getElementById("imageurl").value.trim(),
            location: document.getElementById("location").value.trim(),
            quotes: Number(document.getElementById("quotes").value.trim())
        };

        try {
            await insertProduct(product);
            messageEl.className = "form-message success";
            messageEl.textContent = "Producto guardado correctamente.";
            this.reset();
        } catch (error) {
            messageEl.className = "form-message error";
            messageEl.textContent = `Error al guardar: ${error.message}`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Guardar Producto";
        }
    });
}

