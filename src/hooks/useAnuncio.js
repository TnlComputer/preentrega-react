import {useEffect, useState} from 'react';
import {ANUNCIO_VACIO} from '../data/modeloAnuncio';

function useAnuncio() {
  const [anuncio, setAnuncio] = useState(ANUNCIO_VACIO);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    // no-store: para ver los cambios del panel
    fetch(`${import.meta.env.BASE_URL}data/anuncio.json`, {cache: 'no-store'})
      .then(respuesta => (respuesta.ok ? respuesta.json() : ANUNCIO_VACIO))
      .then(datos => {
        if (!cancelado) setAnuncio({...ANUNCIO_VACIO, ...datos});
      })
      // Si falla, sigue sin anuncio
      .catch(() => {})
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return {
    anuncio,
    cargando,
    // Se usa al guardar en el panel
    reemplazarAnuncio: setAnuncio
  };
}

export default useAnuncio;
