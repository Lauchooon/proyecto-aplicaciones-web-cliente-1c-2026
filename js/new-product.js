(function() {
    function cargarCategorias() {
        obtenerCategorias().then(function(categorias) {
            var select = document.getElementById('categoria');
            categorias.forEach(function(c) {
                var option = document.createElement('option');
                option.value = c.slug;
                option.textContent = c.nombre;
                select.appendChild(option);
            });
        });
    }

    function mostrarMensaje(texto, tipo) {
        var msg = document.getElementById('mensaje-resultado');
        msg.textContent = texto;
        msg.className = 'mensaje mensaje--' + tipo;
        msg.style.display = 'block';
    }

    document.addEventListener('DOMContentLoaded', function() {
        cargarCategorias();

        var ofertaCheck = document.getElementById('oferta');
        var precioAnteriorGroup = document.getElementById('grupo-precio-anterior');

        ofertaCheck.addEventListener('change', function() {
            precioAnteriorGroup.style.display = this.checked ? 'block' : 'none';
        });

        document.getElementById('form-producto').addEventListener('submit', function(e) {
            e.preventDefault();
            var form = e.target;
            var formData = new FormData(form);
            var producto = {
                nombre: formData.get('nombre'),
                precio: parseFloat(formData.get('precio')),
                categoria: formData.get('categoria'),
                imagen: formData.get('imagen') || 'img/placeholder.jpg',
                descripcion: formData.get('descripcion') || '',
                oferta: formData.get('oferta') === 'on',
                precio_anterior: formData.get('oferta') === 'on' ? parseFloat(formData.get('precio_anterior')) : null
            };

            var btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Guardando...';

            insertarProductoEnSupabase(producto).then(function() {
                mostrarMensaje('Producto guardado correctamente.', 'exito');
                form.reset();
                precioAnteriorGroup.style.display = 'none';
            }).catch(function(err) {
                mostrarMensaje('Error al guardar: ' + err.message, 'error');
            }).finally(function() {
                btn.disabled = false;
                btn.textContent = 'Guardar Producto';
            });
        });
    });
})();
