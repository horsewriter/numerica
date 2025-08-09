# Astro Starter Kit: Minimal

# Plataforma de Subastas Numérica

Plataforma de subastas de maquinaria industrial desarrollada con Astro y conectada a Neon Database.

## Configuración de Base de Datos

Este proyecto utiliza Neon Database (PostgreSQL) a través de Netlify. La conexión se realiza automáticamente usando la variable de entorno `NETLIFY_DATABASE_URL`.

### Inicialización

Después del despliegue, visita `/api/init-db` para inicializar las tablas y datos de prueba.

## Variables de Entorno

- `NETLIFY_DATABASE_URL`: URL de conexión a Neon Database (configurada automáticamente por Netlify)

## Endpoints API

- `/api/users` - Lista todos los usuarios
- `/api/products` - Lista todos los productos
- `/api/machines` - Gestión de máquinas en subasta
- `/api/auth/login` - Autenticación de usuarios
- `/api/auth/register` - Registro de usuarios
- `/api/admin/login` - Autenticación de administradores
- `/api/bids` - Gestión de pujas
- `/api/init-db` - Inicialización de base de datos

## Credenciales de Prueba

- **Admin**: usuario `admin`, contraseña `admin123`
- **Usuario**: teléfono `5551234567`, contraseña de prueba

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
