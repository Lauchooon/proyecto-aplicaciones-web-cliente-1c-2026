function formatearPrecio(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function obtenerCarrito() {
    try {
        var data = localStorage.getItem('carrito');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function eliminarDelCarrito(id) {
    var carrito = obtenerCarrito();
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            carrito.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoNav();
}

function actualizarCarritoNav() {
    var carrito = obtenerCarrito();
    var badge = document.getElementById('carrito-badge');
    var preview = document.getElementById('carrito-preview');

    var totalItems = carrito.reduce(function(acc, p) { return acc + (p.cantidad || 1); }, 0);

    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline' : 'none';
    }

    if (!preview) return;

    if (carrito.length === 0) {
        preview.innerHTML = '<p class="carrito-preview-vacio">No hay productos</p>';
        return;
    }

    var subtotal = carrito.reduce(function(acc, p) { return acc + p.precio * (p.cantidad || 1); }, 0);

    var html = '<ul class="carrito-preview-lista">';
    carrito.forEach(function(p) {
        var cant = p.cantidad || 1;
        var subtotalItem = p.precio * cant;
        html += '<li class="carrito-preview-item">' +
            '<span class="carrito-preview-nombre">' + p.nombre + '</span>' +
            '<span class="carrito-preview-detalle">' + cant + ' x $' + formatearPrecio(p.precio) + '</span>' +
            '<span class="carrito-preview-precio">$' + formatearPrecio(subtotalItem) + '</span>' +
            '<button class="carrito-preview-eliminar" data-id="' + p.id + '">✕</button>' +
        '</li>';
    });
    html += '</ul>';
    html += '<div class="carrito-preview-subtotal">Subtotal: <strong>$' + formatearPrecio(subtotal) + '</strong></div>';
    html += '<a href="carrito.html" class="carrito-preview-link">Ir al carrito</a>';
    preview.innerHTML = html;

    preview.querySelectorAll('.carrito-preview-eliminar').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            eliminarDelCarrito(parseInt(this.dataset.id));
        });
    });
}

document.addEventListener('DOMContentLoaded', actualizarCarritoNav);
