// Cliente de la API del panel admin (server/catalogoApi.js).
// Esa API existe solo con `npm run dev`; en el sitio publicado no hay.
const CLAVE_TOKEN = 'admin-token';

export function leerToken() {
  try {
    return sessionStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

function guardarToken(token) {
  try {
    if (token) sessionStorage.setItem(CLAVE_TOKEN, token);
    else sessionStorage.removeItem(CLAVE_TOKEN);
  } catch {
    // Sin sessionStorage la sesión dura hasta recargar la página
  }
}

async function pedir(ruta, {method = 'GET', body, headers = {}} = {}) {
  const token = leerToken();
  let respuesta;

  try {
    respuesta = await fetch(`/api${ruta}`, {
      method,
      body,
      headers: {...(token && {Authorization: `Bearer ${token}`}), ...headers}
    });
  } catch (error) {
    throw new Error('No hay conexión con el servidor de desarrollo.', {cause: error});
  }

  const tipo = respuesta.headers.get('content-type') || '';
  if (!tipo.includes('application/json')) {
    // En el sitio publicado /api no existe y el servidor devuelve otra cosa
    throw new Error('El panel de administración solo funciona corriendo el proyecto en local (npm run dev).');
  }

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    if (respuesta.status === 401) guardarToken(null);
    throw Object.assign(new Error(datos.error || 'Algo salió mal.'), {estado: respuesta.status});
  }
  return datos;
}

export async function iniciarSesion(email, contrasenia) {
  const datos = await pedir('/login', {
    method: 'POST',
    body: JSON.stringify({email, contrasenia}),
    headers: {'Content-Type': 'application/json'}
  });
  guardarToken(datos.token);
  return datos.email;
}

export async function consultarSesion() {
  if (!leerToken()) return null;

  try {
    return (await pedir('/sesion')).email;
  } catch {
    return null;
  }
}

export async function cerrarSesion() {
  try {
    await pedir('/logout', {method: 'POST'});
  } finally {
    guardarToken(null);
  }
}

export function guardarCatalogo(catalogo) {
  return pedir('/catalogo', {
    method: 'PUT',
    body: JSON.stringify(catalogo),
    headers: {'Content-Type': 'application/json'}
  });
}

// Devuelve el anuncio tal como quedó guardado
export function guardarAnuncio(anuncio) {
  return pedir('/anuncio', {
    method: 'PUT',
    body: JSON.stringify(anuncio),
    headers: {'Content-Type': 'application/json'}
  });
}

export async function subirImagen(archivo) {
  const datos = await pedir('/imagenes', {
    method: 'POST',
    body: archivo,
    headers: {'Content-Type': archivo.type}
  });
  return datos.url;
}
