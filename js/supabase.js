var SUPABASE_URL = 'https://jgsiyegfmgofrwtwpzbu.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_P_nxjSvSFPBXzGqqnljOTQ_20fyocEb';

function normalizarProducto(p) {
    return {
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        categoria: p.categoria,
        imagen: p.imagen,
        descripcion: p.descripcion,
        oferta: p.oferta,
        precioAnterior: p.precio_anterior || p.precioAnterior || null,
        destacado: p.destacado
    };
}

function obtenerProductos() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return Promise.reject(new Error('Supabase no configurado'));
    }
    return fetch(SUPABASE_URL + '/rest/v1/productos?select=*', {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
        }
    }).then(function(resp) {
        if (!resp.ok) {
            return resp.json().then(function(err) {
                throw new Error(err.message || JSON.stringify(err));
            });
        }
        return resp.json();
    }).then(function(data) {
        return data.map(normalizarProducto);
    });
}

function obtenerProductoPorId(id) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return Promise.reject(new Error('Supabase no configurado'));
    }
    return fetch(SUPABASE_URL + '/rest/v1/productos?id=eq.' + id + '&select=*', {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
        }
    }).then(function(resp) {
        if (!resp.ok) {
            return resp.json().then(function(err) {
                throw new Error(err.message || JSON.stringify(err));
            });
        }
        return resp.json();
    }).then(function(data) {
        if (!data || !data.length) throw new Error('Producto no encontrado');
        return normalizarProducto(data[0]);
    });
}

function insertarProductoEnSupabase(producto) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return Promise.reject(new Error('Supabase no configurado. Configura SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase.js'));
    }
    var datos = {
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        imagen: producto.imagen,
        descripcion: producto.descripcion,
        oferta: producto.oferta,
        precioAnterior: producto.precio_anterior || producto.precioAnterior || null
    };
    return fetch(SUPABASE_URL + '/rest/v1/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(datos)
    }).then(function(resp) {
        if (!resp.ok) {
            return resp.json().then(function(err) {
                throw new Error(err.message || JSON.stringify(err));
            });
        }
        return resp.json();
    });
}

function insertarOrdenEnSupabase(orden) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return Promise.reject(new Error('Supabase no configurado. Configura SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase.js'));
    }
    return fetch(SUPABASE_URL + '/rest/v1/ordenes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(orden)
    }).then(function(resp) {
        if (!resp.ok) {
            return resp.json().then(function(err) {
                throw new Error(err.message || JSON.stringify(err));
            });
        }
        return resp.json();
    });
}

var categoriasHardcodeadas = [
    { slug: 'procesadores', nombre: 'Procesadores', imagen: 'img/categoria-procesadores.jpg', descripcion: 'CPUs de última generación Intel y AMD para todas las necesidades' },
    { slug: 'memorias', nombre: 'Memorias RAM', imagen: 'img/categoria-ram.jpg', descripcion: 'Módulos de memoria DDR4 y DDR5 de alta velocidad' },
    { slug: 'discos', nombre: 'Discos SSD', imagen: 'img/categoria-ssd.jpg', descripcion: 'Unidades de estado sólido NVMe y SATA para máximo rendimiento' },
    { slug: 'placas-video', nombre: 'Placas de Video', imagen: 'img/categoria-placas-video.jpg', descripcion: 'GPUs NVIDIA y AMD para gaming y trabajo profesional' },
    { slug: 'motherboards', nombre: 'Motherboards', imagen: 'img/categoria-motherboards.jpg', descripcion: 'Placas madre con los últimos chipsets y conectividad' },
    { slug: 'monitores', nombre: 'Monitores', imagen: 'img/categoria-monitores.jpg', descripcion: 'Pantallas Full HD, 4K y ultra-wide para gaming y trabajo' },
    { slug: 'coolers', nombre: 'Coolers', imagen: 'img/categoria-coolers.jpg', descripcion: 'Sistemas de refrigeración por aire y líquida para tu equipo' },
    { slug: 'fuentes', nombre: 'Fuentes', imagen: 'img/categoria-fuentes.jpg', descripcion: 'Fuentes de alimentación certificadas de alta eficiencia' },
    { slug: 'gabinetes', nombre: 'Gabinetes', imagen: 'img/categoria-gabinetes.jpg', descripcion: 'Torres con excelente flujo de aire y diseño' }
];

var categoriasCache = null;

function obtenerCategorias() {
    if (categoriasCache) return Promise.resolve(categoriasCache);
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        categoriasCache = categoriasHardcodeadas;
        return Promise.resolve(categoriasCache);
    }
    return fetch(SUPABASE_URL + '/rest/v1/categorias?select=*&order=nombre.asc', {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
        }
    }).then(function(resp) {
        if (!resp.ok) return categoriasHardcodeadas;
        return resp.json().then(function(data) {
            return data.length ? data : categoriasHardcodeadas;
        });
    }).then(function(data) {
        categoriasCache = data;
        return data;
    }).catch(function() {
        categoriasCache = categoriasHardcodeadas;
        return categoriasCache;
    });
}
