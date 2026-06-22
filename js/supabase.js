var SUPABASE_URL = 'https://jgsiyegfmgofrwtwpzbu.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnc2l5ZWdmbWdvZnJ3dHdwemJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwODA5MDksImV4cCI6MjA5NzY1NjkwOX0.dQxnfF36bbmLyYAT8MDKFdNRjRtSv90otRyuNt422zM';

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
        sku: p.sku || '',
        fecha: p.fecha || '',
        ventas: p.ventas || 0
    };
}

function obtenerProductos() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return Promise.reject(new Error('Supabase no configurado. Configura SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase.js'));
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
        return Promise.reject(new Error('Supabase no configurado. Configura SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase.js'));
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
        return data.length ? normalizarProducto(data[0]) : null;
    });
}

function insertarOrdenEnSupabase(orden) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return Promise.reject(new Error('Supabase no configurado'));
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
        if (resp.status === 404) {
            return null;
        }
        if (!resp.ok) {
            return resp.json().then(function(err) {
                throw new Error(err.message || JSON.stringify(err));
            });
        }
        return resp.json();
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
