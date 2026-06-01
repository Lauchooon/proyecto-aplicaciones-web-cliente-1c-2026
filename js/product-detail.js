document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        document.getElementById("product-detail").innerHTML = "<p>Producto no encontrado.</p>";
        return;
    }

    fetch(`${SUPABASE_URL}/rest/v1/Products?id=eq.${productId}`, {
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById("product-detail").innerHTML = "<p>Producto no encontrado.</p>";
                return;
            }

            const product = data[0];

            document.getElementById("detail-image").src = product.image;
            document.getElementById("detail-image").alt = product.name;
            document.getElementById("detail-title").textContent = product.name;
            document.getElementById("detail-price").textContent = `$${parseFloat(product.price).toFixed(2)}`;
            document.getElementById("detail-quotes").textContent = product.quotes;
            document.getElementById("detail-location").textContent = product.location;
            document.getElementById("detail-description").textContent = product.description || "Sin descripción disponible.";
        })
        .catch(error => {
            console.error("Error fetching product:", error);
            document.getElementById("product-detail").innerHTML = "<p>Error al cargar el producto.</p>";
        });
});
