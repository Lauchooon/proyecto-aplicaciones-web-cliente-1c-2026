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

var catalogoProductos = [
    { id: 1, nombre: "AMD Ryzen 9 7950X", precio: 650000, categoria: "procesadores", imagen: "img/amd.jpg", descripcion: "16 núcleos, 32 hilos, 5.7GHz - Socket AM5", oferta: false },
    { id: 2, nombre: "Intel Core i9-14900K", precio: 680000, categoria: "procesadores", imagen: "img/intel.jpg", descripcion: "24 núcleos, 32 hilos, 6.0GHz - Socket LGA1700", oferta: false },
    { id: 3, nombre: "AMD Ryzen 7 5800X3D", precio: 320000, categoria: "procesadores", imagen: "img/amd.jpg", descripcion: "8 núcleos, 16 hilos, 4.7GHz - Socket AM4", oferta: false },
    { id: 4, nombre: "Intel Core i5-13600K", precio: 285000, categoria: "procesadores", imagen: "img/intel.jpg", descripcion: "14 núcleos, 20 hilos, 5.1GHz - Socket LGA1700", oferta: false },
    { id: 5, nombre: "AMD Ryzen 9 5900X", precio: 259990, categoria: "procesadores", imagen: "img/amd.jpg", descripcion: "12 núcleos 24 hilos - Socket AM4", oferta: true, precioAnterior: 320000 },
    { id: 6, nombre: "Corsair Vengeance 32GB DDR5", precio: 145000, categoria: "memorias", imagen: "img/ram.jpg", descripcion: "5600MHz, kit 2x16GB, CL36", oferta: false },
    { id: 7, nombre: "G.Skill Trident Z5 16GB DDR5", precio: 95000, categoria: "memorias", imagen: "img/ram.jpg", descripcion: "6400MHz, RGB, kit 2x8GB, CL32", oferta: false },
    { id: 8, nombre: "Kingston Fury Beast 32GB DDR4", precio: 78000, categoria: "memorias", imagen: "img/ram.jpg", descripcion: "3200MHz, kit 2x16GB, CL16", oferta: false },
    { id: 9, nombre: "Samsung 990 Pro 2TB NVMe", precio: 195000, categoria: "discos", imagen: "img/ssd-01.jpg", descripcion: "PCIe 4.0, lectura 7450MB/s, escritura 6900MB/s", oferta: false },
    { id: 10, nombre: "WD Black SN850X 1TB NVMe", precio: 105000, categoria: "discos", imagen: "img/ssd-02.jpg", descripcion: "PCIe 4.0, lectura 7300MB/s, escritura 6300MB/s", oferta: false },
    { id: 11, nombre: "Crucial P3 Plus 1TB NVMe", precio: 65000, categoria: "discos", imagen: "img/ssd-03.jpg", descripcion: "PCIe 4.0, lectura 5000MB/s, escritura 4200MB/s", oferta: false },
    { id: 12, nombre: "Kingston A400 480GB SATA", precio: 28000, categoria: "discos", imagen: "img/ssd-04.jpg", descripcion: 'SATA 3, lectura 500MB/s, formato 2.5"', oferta: false },
    { id: 13, nombre: "NVIDIA RTX 4090", precio: 1450000, categoria: "placas-video", imagen: "img/gpu-01.jpg", descripcion: "24GB GDDR6X, 16384 CUDA cores, Ada Lovelace", oferta: false },
    { id: 14, nombre: "NVIDIA RTX 4070 Ti Super", precio: 580000, categoria: "placas-video", imagen: "img/gpu-02.jpg", descripcion: "16GB GDDR6X, 8448 CUDA cores", oferta: false },
    { id: 15, nombre: "AMD Radeon RX 7900 XTX", precio: 620000, categoria: "placas-video", imagen: "img/gpu-03.jpg", descripcion: "24GB GDDR6, 6144 Stream Processors, RDNA 3", oferta: false },
    { id: 16, nombre: "NVIDIA RTX 3060 Ti", precio: 295000, categoria: "placas-video", imagen: "img/gpu-04.jpg", descripcion: "8GB GDDR6, 4864 CUDA cores, Ampere", oferta: false },
    { id: 17, nombre: "NVIDIA RTX 4070", precio: 379990, categoria: "placas-video", imagen: "img/gpu-05.jpg", descripcion: "12GB GDDR6X, ideal para gaming 1440p", oferta: true, precioAnterior: 450000 },
    { id: 18, nombre: "ASUS ROG Crosshair X670E Hero", precio: 485000, categoria: "motherboards", imagen: "img/mb-01.jpg", descripcion: "Socket AM5, DDR5, PCIe 5.0, WiFi 6E", oferta: false },
    { id: 19, nombre: "MSI MEG Z790 ACE", precio: 420000, categoria: "motherboards", imagen: "img/mb-02.jpg", descripcion: "Socket LGA1700, DDR5, PCIe 5.0, WiFi 6E", oferta: false },
    { id: 20, nombre: "Gigabyte B650 AORUS Elite AX", precio: 185000, categoria: "motherboards", imagen: "img/mb-03.jpg", descripcion: "Socket AM5, DDR5, PCIe 4.0, WiFi 6", oferta: false },
    { id: 21, nombre: 'LG UltraGear 27" 4K 144Hz', precio: 420000, categoria: "monitores", imagen: "img/monitor-01.jpg", descripcion: "IPS, HDMI 2.1, FreeSync Premium Pro, HDR400", oferta: false },
    { id: 22, nombre: 'Samsung Odyssey G7 32"', precio: 485000, categoria: "monitores", imagen: "img/monitor-02.jpg", descripcion: "VA, 240Hz, 1000R Curvo, G-Sync Compatible", oferta: false },
    { id: 23, nombre: 'ASUS ROG Swift 360Hz', precio: 650000, categoria: "monitores", imagen: "img/monitor-03.jpg", descripcion: "IPS, 360Hz, HDR, G-Sync Ultimate", oferta: false },
    { id: 24, nombre: 'Monitor 27" 144Hz', precio: 149990, categoria: "monitores", imagen: "img/monitor-04.jpg", descripcion: "IPS Full HD, FreeSync, tiempo de respuesta 1ms", oferta: true, precioAnterior: 185000 }
];

var fechasMock = [
    '2026-06-01','2026-05-15','2026-04-01','2026-03-10',
    '2026-02-28','2026-01-15','2025-12-05','2025-09-10',
    '2025-06-20','2025-03-15','2025-01-10','2024-11-20'
];
catalogoProductos.forEach(function(p, i) {
    p.fecha = fechasMock[i % fechasMock.length];
    p.ventas = Math.floor(Math.abs(Math.sin(i + 1) * 500) + 10);
});

function renderizarProductos(array) {
    var contenedor = document.querySelector('.productos');
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
    var minPrecio = parseInt(rangoMin.value);
    var maxPrecio = parseInt(rangoMax.value);
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
                case 'fecha-desc': return b.fecha.localeCompare(a.fecha);
                case 'ventas-desc': return b.ventas - a.ventas;
                default: return 0;
            }
        });
    }

    renderizarProductos(resultado);
}

/* ---- Inicialización ---- */
var precioMin = Infinity, precioMax = -Infinity;
catalogoProductos.forEach(function(p) {
    if (p.precio < precioMin) precioMin = p.precio;
    if (p.precio > precioMax) precioMax = p.precio;
});

/* ---- Range Slider ---- */
var rangoMin = document.getElementById('rango-min');
var rangoMax = document.getElementById('rango-max');
var labelMin = document.getElementById('rango-label-min');
var labelMax = document.getElementById('rango-label-max');
var track = document.getElementById('rango-track');

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

/* ---- Ordenar ---- */
document.getElementById('sort-select').addEventListener('change', aplicarFiltros);
