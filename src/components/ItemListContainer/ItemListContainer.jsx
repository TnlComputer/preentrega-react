import {useEffect, useRef, useState} from 'react';
import {prepararCatalogo} from '../../data/modeloCatalogo';
import {cargarProductos} from '../../services/productosApi';
import ItemList from '../ItemList/ItemList';
import styles from './ItemListContainer.module.css';

const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

const CLAVE_FAVORITOS = 'favoritos';
const PRODUCTOS_POR_PAGINA = 12;

const conCeros = numero => String(numero).padStart(2, '0');

function leerFavoritosGuardados() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || {};
  } catch {
    return {};
  }
}

function ItemListContainer({onAgregarAlCarrito}) {
  const [catalogo, setCatalogo] = useState({rubros: [], productos: []});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [favoritos, setFavoritos] = useState(leerFavoritosGuardados);
  const [rubroElegido, setRubroElegido] = useState('todos');
  const [pagina, setPagina] = useState(1);
  const catalogoRef = useRef(null);

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

  useEffect(() => {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  }, [favoritos]);

  const alternarFavorito = id => {
    setFavoritos(favoritosActuales => {
      const favoritosNuevos = {...favoritosActuales};
      if (favoritosNuevos[id]) {
        delete favoritosNuevos[id];
      } else {
        favoritosNuevos[id] = true;
      }
      return favoritosNuevos;
    });
  };

  const {rubros: todosLosRubros, productos: todosLosProductos} = prepararCatalogo(catalogo);
  // En la tienda solo se ven los activos
  const productos = todosLosProductos.filter(producto => producto.activo);
  const destacados = productos.filter(producto => producto.destacado);
  const rubros = todosLosRubros.filter(rubro => productos.some(producto => producto.rubro === rubro.id));

  const termino = busqueda.trim().toLowerCase();
  const vistaInicial = !termino && rubroElegido === 'todos';

  // Sin filtros, los destacados van arriba y no se repiten en el catálogo
  const productosFiltrados = productos.filter(
    producto =>
      !(vistaInicial && producto.destacado) &&
      (rubroElegido === 'todos' || producto.rubro === rubroElegido) &&
      [producto.nombre, producto.descripcion, producto.subrubro, producto.rubroNombre, producto.marca]
        .join(' ')
        .toLowerCase()
        .includes(termino)
  );

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const productosDeLaPagina = productosFiltrados.slice(
    (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    paginaActual * PRODUCTOS_POR_PAGINA
  );

  const buscar = texto => {
    setBusqueda(texto);
    setPagina(1);
  };

  const elegirRubro = id => {
    setRubroElegido(id);
    setPagina(1);
  };

  const irAPagina = numero => {
    setPagina(numero);
    catalogoRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  const propsLista = {
    favoritos,
    onAlternarFavorito: alternarFavorito,
    onAgregarAlCarrito,
    formatoPrecio
  };

  return (
    <section className={styles.searchSection} id="destacados">
      <div className={styles.sectionHeading}>
        <div>
          <span className="eyebrow">Armá tu equipo</span>
          <h3>{termino ? `Resultados para "${busqueda}"` : 'Para tu próxima salida'}</h3>
        </div>
        {!cargando && !error && (
          <span className={styles.availability}>
            {termino
              ? `${conCeros(productosFiltrados.length)} productos encontrados`
              : `${conCeros(productos.length)} productos · ${conCeros(destacados.length)} destacados`}
          </span>
        )}
      </div>

      <label className={styles.searchBox} htmlFor="buscador-productos">
        <span aria-hidden="true">🔍</span>
        <input
          id="buscador-productos"
          type="search"
          placeholder="Buscá cañas, señuelos, anzuelos, indumentaria…"
          value={busqueda}
          onChange={evento => buscar(evento.target.value)}
        />
        {termino && (
          <button type="button" aria-label="Limpiar búsqueda" onClick={() => buscar('')}>
            ✕
          </button>
        )}
      </label>

      {cargando && <p>Cargando productos…</p>}
      {error && <p role="alert">No pudimos cargar el catálogo: {error}</p>}

      {!cargando && !error && (
        <>
          {vistaInicial && destacados.length > 0 && (
            <div className={styles.bloque}>
              <h4 className={styles.subtitulo}>★ Destacados</h4>
              <ItemList productos={destacados} {...propsLista} />
            </div>
          )}

          <div className={styles.bloque} ref={catalogoRef}>
            <h4 className={styles.subtitulo}>Catálogo</h4>
            <div className={styles.filtros} role="group" aria-label="Filtrar por rubro">
              {[{id: 'todos', nombre: 'Todos'}, ...rubros].map(rubro => (
                <button
                  key={rubro.id}
                  type="button"
                  className={rubro.id === rubroElegido ? styles.activo : ''}
                  aria-pressed={rubro.id === rubroElegido}
                  onClick={() => elegirRubro(rubro.id)}>
                  {rubro.nombre}
                </button>
              ))}
            </div>

            {productosFiltrados.length === 0 ? (
              <p>No encontramos productos{termino && ` para "${busqueda}"`}.</p>
            ) : (
              <ItemList productos={productosDeLaPagina} {...propsLista} />
            )}

            {totalPaginas > 1 && (
              <nav className={styles.paginacion} aria-label="Páginas del catálogo">
                <button type="button" disabled={paginaActual === 1} onClick={() => irAPagina(paginaActual - 1)}>
                  ‹ Anterior
                </button>
                {Array.from({length: totalPaginas}, (_, i) => i + 1).map(numero => (
                  <button
                    key={numero}
                    type="button"
                    className={numero === paginaActual ? styles.activo : ''}
                    aria-current={numero === paginaActual ? 'page' : undefined}
                    onClick={() => irAPagina(numero)}>
                    {numero}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={paginaActual === totalPaginas}
                  onClick={() => irAPagina(paginaActual + 1)}>
                  Siguiente ›
                </button>
              </nav>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default ItemListContainer;
