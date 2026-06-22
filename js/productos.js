function precioANumero(texto) {
    return parseInt(texto.replace('$', '').replace(/\./g, ''));
}

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

function guardarEnCarrito(producto) {
    var carrito = obtenerCarrito();
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

var catalogoProductos = [];

function renderizarProductos(array) {
    var contenedor = document.querySelector('.productos');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    array.forEach(function(p) {
        var enlace = document.createElement('a');
                enlace.href = 'producto-detalle.html?id=' + p.id;
        enlace.className = 'tarjeta-producto' + (p.oferta ? ' oferta' : '');
        enlace.dataset.categoria = p.categoria;
        enlace.dataset.precio = p.precio;
        enlace.dataset.nombre = p.nombre;
        enlace.dataset.fecha = p.fecha;
        enlace.dataset.ventas = p.ventas;

        if (p.oferta) {
            var etiqueta = document.createElement('span');
            etiqueta.className = 'etiqueta-oferta';
            etiqueta.textContent = 'OFERTA';
            enlace.appendChild(etiqueta);
        }

        var divImg = document.createElement('div');
        divImg.className = 'producto-imagen';
        var img = document.createElement('img');
        img.src = p.imagen;
        img.alt = p.nombre;
        divImg.appendChild(img);
        enlace.appendChild(divImg);

        var divInfo = document.createElement('div');
        divInfo.className = 'producto-info';
        var h4 = document.createElement('h4');
        h4.textContent = p.nombre;
        divInfo.appendChild(h4);
        var precioContainer = document.createElement('div');
        precioContainer.className = 'producto-precio-container';
        if (p.oferta) {
            var spanAnt = document.createElement('span');
            spanAnt.className = 'producto-precio-anterior';
            spanAnt.textContent = '$' + formatearPrecio(p.precioAnterior);
            precioContainer.appendChild(spanAnt);
        }
        var spanPrecio = document.createElement('span');
        spanPrecio.className = 'producto-precio';
        spanPrecio.textContent = '$' + formatearPrecio(p.precio);
        precioContainer.appendChild(spanPrecio);
        divInfo.appendChild(precioContainer);
        enlace.appendChild(divInfo);

        var divDesc = document.createElement('div');
        divDesc.className = 'producto-descripcion';
        var pDesc = document.createElement('p');
        pDesc.textContent = p.descripcion;
        divDesc.appendChild(pDesc);
        enlace.appendChild(divDesc);

        var btn = document.createElement('button');
        btn.className = 'btn-agregar-carrito';
        btn.textContent = 'Agregar al carrito';
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            guardarEnCarrito(p);
        });
        enlace.appendChild(btn);

        contenedor.appendChild(enlace);
    });
}

/* ---- Filtros y ordenamiento ---- */
var hashCategoria = {
    'filtro-todos': null,
    'filtro-procesadores': 'procesadores',
    'filtro-memorias': 'memorias',
    'filtro-discos': 'discos',
    'filtro-placas': 'placas-video',
    'filtro-motherboards': 'motherboards',
    'filtro-monitores': 'monitores'
};

function aplicarFiltros() {
    var rangoMin = document.getElementById('rango-min');
    if (!rangoMin) return;
    var minPrecio = parseInt(rangoMin.value);
    var maxPrecio = parseInt(document.getElementById('rango-max').value);
    var criterio = document.getElementById('sort-select').value;
    var resultado = catalogoProductos;

    var hash = window.location.hash.replace('#', '');
    var categoria = hashCategoria[hash];
    if (categoria) {
        resultado = resultado.filter(function(p) { return p.categoria === categoria; });
    }

    resultado = resultado.filter(function(p) {
        return p.precio >= minPrecio && p.precio <= maxPrecio;
    });

    if (criterio !== 'default') {
        resultado.sort(function(a, b) {
            switch (criterio) {
                case 'nombre-asc': return a.nombre.localeCompare(b.nombre);
                case 'nombre-desc': return b.nombre.localeCompare(a.nombre);
                case 'precio-asc': return a.precio - b.precio;
                case 'precio-desc': return b.precio - a.precio;
                case 'fecha-desc': return (b.fecha || '').localeCompare(a.fecha || '');
                case 'ventas-desc': return (b.ventas || 0) - (a.ventas || 0);
                default: return 0;
            }
        });
    }

    renderizarProductos(resultado);
}

/* ---- Inicialización desde Supabase ---- */
function inicializarCatalogo(productos) {
    catalogoProductos = productos;

    var rangoMin = document.getElementById('rango-min');
    if (!rangoMin) return;

    var rangoMax = document.getElementById('rango-max');
    var labelMin = document.getElementById('rango-label-min');
    var labelMax = document.getElementById('rango-label-max');
    var track = document.getElementById('rango-track');

    var precioMin = Infinity, precioMax = -Infinity;
    catalogoProductos.forEach(function(p) {
        if (p.precio < precioMin) precioMin = p.precio;
        if (p.precio > precioMax) precioMax = p.precio;
    });

    rangoMin.min = rangoMax.min = precioMin;
    rangoMin.max = rangoMax.max = precioMax;
    rangoMin.value = precioMin;
    rangoMax.value = precioMax;
    labelMin.textContent = formatearPrecio(precioMin);
    labelMax.textContent = formatearPrecio(precioMax);

    function actualizarRango() {
        var min = parseInt(rangoMin.value);
        var max = parseInt(rangoMax.value);

        if (min > max) {
            var tmp = min; min = max; max = tmp;
        }

        rangoMin.value = min;
        rangoMax.value = max;

        labelMin.textContent = formatearPrecio(min);
        labelMax.textContent = formatearPrecio(max);

        var pMin = (min - precioMin) / (precioMax - precioMin) * 100;
        var pMax = (max - precioMin) / (precioMax - precioMin) * 100;
        track.style.left = pMin + '%';
        track.style.right = (100 - pMax) + '%';

        aplicarFiltros();
    }

    rangoMin.addEventListener('input', actualizarRango);
    rangoMax.addEventListener('input', actualizarRango);
    actualizarRango();

    document.getElementById('sort-select').addEventListener('change', aplicarFiltros);

    aplicarFiltros();
}

/* ---- Arranque ---- */
function catalogoListo() {
    var evt = document.createEvent('Event');
    evt.initEvent('catalogo:listo', true, false);
    document.dispatchEvent(evt);
}

if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) {
    obtenerProductos().then(function(productos) {
        inicializarCatalogo(productos);
        catalogoListo();
    }).catch(function(err) {
        console.error('Error al cargar productos desde Supabase:', err);
        inicializarCatalogo([]);
        catalogoListo();
    });
} else {
    inicializarCatalogo([]);
    catalogoListo();
}
