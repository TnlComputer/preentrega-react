import {estadoAnuncio} from '../../data/modeloAnuncio';
import styles from './BarraAnuncio.module.css';

// Solo se muestra si el anuncio está vigente (vistaPrevia: siempre)
function BarraAnuncio({anuncio, vistaPrevia = false}) {
  if (!vistaPrevia && estadoAnuncio(anuncio) !== 'visible') return null;

  return (
    <aside className={styles.barraAnuncio} aria-label="Anuncio">
      <span className={styles.icono} aria-hidden="true">
        🎣
      </span>
      <p>{anuncio.texto || 'Acá va el texto del anuncio'}</p>
      {anuncio.descuento > 0 && <strong className={styles.descuento}>{anuncio.descuento}% OFF al pagar</strong>}
    </aside>
  );
}

export default BarraAnuncio;
