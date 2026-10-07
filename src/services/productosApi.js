// Se pide una sola vez y se comparte
let pedido = null;

export function cargarProductos() {
  if (!pedido) {
    // no-store: para ver los cambios del panel
    const nuevo = fetch(`${import.meta.env.BASE_URL}data/productos.json`, {cache: 'no-store'})
      .then(respuesta => {
        if (!respuesta.ok) {
          throw new Error('No se pudo obtener el catálogo');
        }

        return respuesta.json();
      })
      .then(datos => ({rubros: datos.rubros, productos: datos.productos}));

    // Si falla, se vuelve a pedir
    nuevo.catch(() => {
      if (pedido === nuevo) pedido = null;
    });
    pedido = nuevo;
  }

  return pedido;
}

// Recarga después de guardar en el panel
export function actualizarProductos(datos) {
  pedido = Promise.resolve(datos);
}
