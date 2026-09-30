import {useEffect, useState} from 'react';
import {ordenarProductos} from '../data/modeloCatalogo';

function useCatalogo() {
  const [catalogo, setCatalogo] = useState({rubros: [], productos: []});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    // no-store: después de editar en el panel queremos el archivo nuevo
    fetch('/data/catalogo.json', {cache: 'no-store'})
      .then(respuesta => {
        if (!respuesta.ok) {
          throw new Error('No se pudo obtener el catálogo');
        }

        return respuesta.json();
      })
      .then(datos => {
        if (!cancelado) setCatalogo({rubros: datos.rubros, productos: datos.productos});
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

  const rubros = [...catalogo.rubros].sort((a, b) => a.orden - b.orden);
  const nombreRubro = new Map(rubros.map(rubro => [rubro.id, rubro.nombre]));
  const todos = ordenarProductos(catalogo.productos, rubros).map(producto => ({
    ...producto,
    rubroNombre: nombreRubro.get(producto.rubro) ?? ''
  }));

  return {
    rubros,
    // Para el panel: todos, incluso los ocultos
    todosLosProductos: todos,
    // Para la tienda: solo los activos
    productos: todos.filter(producto => producto.activo),
    cargando,
    error,
    // Lo usa el panel después de guardar en el JSON
    reemplazarCatalogo: setCatalogo
  };
}

export default useCatalogo;
