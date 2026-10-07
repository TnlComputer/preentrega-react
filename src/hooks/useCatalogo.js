import {useEffect, useState} from 'react';
import {prepararCatalogo} from '../data/modeloCatalogo';
import {actualizarProductos, cargarProductos} from '../services/productosApi';

function useCatalogo() {
  const [catalogo, setCatalogo] = useState({rubros: [], productos: []});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    cargarProductos()
      .then(datos => {
        if (!cancelado) setCatalogo(datos);
      })
      .catch(errorCapturado => {
        if (!cancelado) setError(errorCapturado.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const {rubros, productos: todos} = prepararCatalogo(catalogo);

  return {
    rubros,
    // Todos, incluso los ocultos
    todosLosProductos: todos,
    // Solo los activos
    productos: todos.filter(producto => producto.activo),
    cargando,
    error,
    // Se usa al guardar en el panel
    reemplazarCatalogo: datos => {
      actualizarProductos(datos);
      setCatalogo(datos);
    }
  };
}

export default useCatalogo;
