// Anuncio superior (public/data/anuncio.json)

export const LIMITE_TEXTO_ANUNCIO = 160;
export const DESCUENTO_MAXIMO = 90;

export const ANUNCIO_VACIO = {
  activo: false,
  texto: '',
  desde: '',
  hasta: '',
  descuento: 0
};

const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Fecha de hoy en formato AAAA-MM-DD
export const fechaDeHoy = () => new Date().toLocaleDateString('en-CA');

export function prepararAnuncio(formulario) {
  return {
    activo: Boolean(formulario.activo),
    texto: formulario.texto.trim(),
    desde: formulario.desde || '',
    hasta: formulario.hasta || '',
    descuento: formulario.descuento === '' || formulario.descuento == null ? 0 : Number(formulario.descuento)
  };
}

// Devuelve los errores por campo
export function validarAnuncio(anuncio) {
  const errores = {};

  if (anuncio.activo && !anuncio.texto) errores.texto = 'Escribí el texto del anuncio para poder mostrarlo.';
  else if (anuncio.texto.length > LIMITE_TEXTO_ANUNCIO) errores.texto = `Máximo ${LIMITE_TEXTO_ANUNCIO} caracteres.`;

  if (anuncio.desde && !FORMATO_FECHA.test(anuncio.desde)) errores.desde = 'Fecha inválida.';
  if (anuncio.hasta && !FORMATO_FECHA.test(anuncio.hasta)) errores.hasta = 'Fecha inválida.';
  else if (anuncio.desde && anuncio.hasta && anuncio.hasta < anuncio.desde) {
    errores.hasta = 'Tiene que ser igual o posterior a la fecha "desde".';
  }

  if (!Number.isInteger(anuncio.descuento) || anuncio.descuento < 0 || anuncio.descuento > DESCUENTO_MAXIMO) {
    errores.descuento = `El descuento es un número entero de 0 a ${DESCUENTO_MAXIMO}.`;
  }

  return errores;
}

// visible, programado, vencido u oculto
export function estadoAnuncio(anuncio, hoy = fechaDeHoy()) {
  if (!anuncio?.activo || !anuncio.texto) return 'oculto';
  if (anuncio.desde && hoy < anuncio.desde) return 'programado';
  if (anuncio.hasta && hoy > anuncio.hasta) return 'vencido';
  return 'visible';
}

// Descuento vigente hoy
export const descuentoVigente = (anuncio, hoy = fechaDeHoy()) =>
  estadoAnuncio(anuncio, hoy) === 'visible' ? anuncio.descuento || 0 : 0;
