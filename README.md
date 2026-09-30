# El.Anzuelo · Casa de pesca

> **Proyecto académico** hecho para el curso **React JS de Talento Tech (comisión C26243)**, como preentrega.
> "El Anzuelo" es una tienda **ficticia**: los productos, precios, el equipo y los datos de contacto son de ejemplo.

**Sitio publicado:** https://tnlcomputer.github.io/preentrega-react/

![Captura de la página de inicio de El.Anzuelo](docs/captura.png)

## De qué se trata

Una tienda online de artículos de pesca, hecha con React. Tiene un catálogo de productos, buscador, carrito de compras y un panel de administración para cargar productos y avisos.

## Funcionalidades

**Tienda**
- Catálogo de productos agrupado por rubros (cañas y reels, señuelos, líneas y anzuelos, indumentaria), con precios de oferta y aviso de últimas unidades.
- Buscador de productos y tarjetas que se dan vuelta para ver las características.
- Favoritos y carrito de compras: se puede sumar o restar cantidades respetando el stock, y el carrito se guarda en el navegador.
- Franja de anuncio arriba de todo (por ejemplo, un "free day"), con fechas de inicio y fin y un descuento opcional que se aplica al total del carrito.
- Diseño adaptable: celular, tablet y escritorio hasta 1920 px; en pantallas más grandes aparece un fondo decorativo de pesca a los costados.

**Panel de administración** (`/admin`, con login)
- Alta, edición, baja y ocultamiento de productos, con subida de imágenes a ImgBB.
- Gestión de rubros y subrubros.
- Edición del anuncio: texto, fechas, descuento y vista previa.

> El panel funciona solo corriendo el proyecto en local (`npm run dev`), porque guarda los cambios en los archivos JSON del proyecto. El sitio publicado en GitHub Pages es estático: muestra la tienda y el anuncio, pero no permite editar.

## Tecnologías

- [React 19](https://react.dev/) con [Vite](https://vite.dev/) y React Compiler
- [React Router](https://reactrouter.com/) para la navegación
- [React Bootstrap](https://react-bootstrap.github.io/) y CSS Modules para los estilos
- Datos en JSON (`public/data/`): catálogo, equipo y anuncio
- Publicación automática en GitHub Pages con GitHub Actions

## Cómo correrlo en local

Se necesita [Node.js](https://nodejs.org/) 20.19 o superior (o 22.12+).

```bash
npm install
npm run dev
```

Se abre en http://localhost:5173/

Para usar el panel de administración, copiá `.env.example` como `.env.local` y completá el usuario, la contraseña y la clave de ImgBB. `.env.local` no se sube al repositorio.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo, con el panel de administración |
| `npm run build` | Genera la versión para publicar en `dist/` |
| `npm run preview` | Muestra la versión generada |
| `npm run lint` | Revisa el código con ESLint |

## Publicación

Cada `git push` a la rama `main` compila el sitio y lo publica en GitHub Pages ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

## Autor

**Jorge Martinez** · Curso React JS · Talento Tech · Comisión C26243
