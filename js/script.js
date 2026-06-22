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
            allProducts = data.map(item => {
                const numPrice = parseFloat(item.price);
                return {
                    id: item.id,
                    name: item.name,
                    price: `$${numPrice.toFixed(2)}`,
                    rawPrice: numPrice,
                    image: item.image,
                    quotes: item.quotes,
                    location: item.location,
                    description: item.description
                };
            });
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


    const addBtn = document.createElement("button");
    addBtn.className = "cart-add-btn";
    addBtn.textContent = "Agregar al carrito";
    addBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        addToCart(product);
    });

    productInfo.appendChild(addBtn);

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

// ==================== CART FUNCTIONS ====================

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === product.id);

    if (index >= 0) {
        cart[index].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.rawPrice,
            priceDisplay: product.price,
            image: product.image,
            location: product.location,
            quotes: product.quotes,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showCartToast(`"${product.name}" agregado al carrito`);
}

function removeFromCart(productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
    updateCartCount();
}

function updateQuantity(productId, delta) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);

    if (index >= 0) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    saveCart(cart);
    renderCart();
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartItemCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
    const count = getCartItemCount();
    const headerCount = document.getElementById("cart-header-count");
    if (headerCount) {
        headerCount.textContent = count;
        headerCount.style.display = count > 0 ? "flex" : "none";
    }
}

function showCartToast(message) {
    let toast = document.getElementById("cart-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "cart-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = `🛒 ${message}`;
    toast.className = "cart-toast show";
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.className = "cart-toast";
    }, 2500);
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    const cart = getCart();
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        const empty = document.createElement("div");
        empty.className = "cart-empty";
        empty.innerHTML = `
            <span class="cart-empty-icon">🛒</span>
            <p class="cart-empty-text">Tu carrito está vacío</p>
            <p class="cart-empty-subtext">Agregá productos para iniciar una compra</p>
            <a href="/" class="cart-empty-link">Ver productos</a>
        `;
        cartItems.appendChild(empty);
        document.getElementById("cart-subtitle").textContent = "No hay productos en tu carrito";
        document.getElementById("summary-items").textContent = "0";
        document.getElementById("summary-total").textContent = "$0";
        document.getElementById("checkout-btn").disabled = true;
        return;
    }

    document.getElementById("cart-subtitle").textContent =
        `${cart.length} ${cart.length === 1 ? "producto" : "productos"} en tu carrito`;

    cart.forEach(item => {
        const el = document.createElement("div");
        el.className = "cart-item";

        const subtotal = item.price * item.quantity;

        el.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <p class="cart-item-title">${item.name}</p>
                <p class="cart-item-location">${item.location}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button class="cart-qty-btn" data-id="${item.id}" data-delta="-1">−</button>
                <span class="cart-qty-value">${item.quantity}</span>
                <button class="cart-qty-btn" data-id="${item.id}" data-delta="1">+</button>
                <span class="cart-item-subtotal">$${subtotal.toFixed(2)}</span>
                <button class="cart-item-remove" data-id="${item.id}">✕</button>
            </div>
        `;

        cartItems.appendChild(el);
    });

    const total = getCartTotal();
    const count = getCartItemCount();
    document.getElementById("summary-items").textContent = `${count} ${count === 1 ? "producto" : "productos"}`;
    document.getElementById("summary-total").textContent = `$${total.toFixed(2)}`;
    document.getElementById("checkout-btn").disabled = false;
}

document.addEventListener("DOMContentLoaded", function () {
    const cartItems = document.getElementById("cart-items");
    if (cartItems) {
        cartItems.addEventListener("click", function (e) {
            const qtyBtn = e.target.closest(".cart-qty-btn");
            if (qtyBtn) {
                updateQuantity(Number(qtyBtn.dataset.id), Number(qtyBtn.dataset.delta));
                return;
            }
            const removeBtn = e.target.closest(".cart-item-remove");
            if (removeBtn) {
                removeFromCart(Number(removeBtn.dataset.id));
            }
        });
    }
    renderCart();
    updateCartCount();
});

