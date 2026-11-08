# Digital Games

Reconstrucción estructural del frontend de `videojuegos-rose.vercel.app`, preparada para continuar el desarrollo.

> El bundle original estaba minificado y sin source maps. Esta base reproduce la arquitectura,
> rutas, contratos de API y comportamiento observados; el marcado y los estilos son una
> reconstrucción, no el código fuente original.

## Desarrollo

```bash
npm install
cp .env.example .env
npm run dev
```

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio (destacados) |
| `/Games` | Catálogo con filtro por categoría |
| `/Search?q=` | Resultados de búsqueda |
| `/Preview/:productId` | Detalle de producto |
| `/Login` | Login de administración |
| `/Dashboard` | Panel de administración (protegido) |
| `/About` `/Contact` `/Terms` `/Privacy` | Información |

## API

Base: `VITE_API_URL` (por defecto `https://backend-videojuegos.onrender.com`).

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | `/api/auth/login` | `{ username, password }` → `{ token }` |
| GET | `/api/products` | Listado |
| GET | `/api/products/:id` | Detalle |
| POST | `/api/products` | Crear (multipart) |
| PUT | `/api/products/:id` | Actualizar (multipart o JSON) |
| DELETE | `/api/products/:id` | Eliminar |
| PATCH | `/api/products/:id/highlight` | `{ isFeatured }` |

Producto: `_id, name, description, price, oldPrice, discount, image, category, type, features[], isFeatured`.

## Estado conocido

El backend original responde `404` (`x-render-routing: no-server`): el servicio de Render ya no
existe. Mientras no se apunte `VITE_API_URL` a un backend propio, el catálogo aparece vacío.

## Notas de seguridad

- El token se guarda en `localStorage` y se envía como `Authorization: Bearer`.
- En el bundle original el token nunca se enviaba y se imprimía en consola; aquí se corrigió.
- El login del panel solo comprueba que exista un token local; el backend debe validarlo.
