# Cívica — Metro de Medellín

Simulador de la **tarjeta Cívica del Metro de Medellín** hecho con **HTML, CSS y JavaScript puro** (sin frameworks).

> 🌐 **En vivo:** <https://macaqui.github.io/civica-metro-medellin/>

## Qué hace

- Muestra una tarjeta personalizada con **volteo 3D** (frente y reverso).
- Genera automáticamente el **número de tarjeta**, el **serial** y un **código de barras**.
- Permite escribir un **nombre** y verlo reflejado en el nombre impreso y en la **firma** de la tarjeta.

## Cómo verlo

Abre el archivo en cualquier navegador (no necesita servidor):

```bash
xdg-open civica-metro-medellin.html
```

## Estructura

```
civica-metro-medellin.html   # todo el proyecto: HTML + CSS + JavaScript
```

## Notas

- Es un ejercicio de **manipulación del DOM** y **CSS 3D** (`transform`, `rotateY`).
- El código está comentado por secciones para facilitar su lectura.

## Backend

Incluye un backend sencillo con Node.js, Express, Prisma y SQLite que sirve la página
y guarda las tarjetas.

Cómo instalarlo y arrancarlo:

```bash
cd server
npm install
npx prisma db push
npm start
```

Queda en <http://localhost:3002/> y la base de datos es el archivo `server/prisma/dev.db`.

Rutas de la API:

- `GET /api/tarjetas` - lista todas las tarjetas.
- `GET /api/tarjetas/:id` - devuelve una tarjeta.
- `POST /api/tarjetas` - crea una tarjeta.
- `PUT /api/tarjetas/:id` - actualiza una tarjeta.
- `DELETE /api/tarjetas/:id` - borra una tarjeta.

La página consume estas rutas con `fetch` para listar, cargar y borrar tarjetas.

---

Proyecto desarrollado por **Samuel Hincapié**.
