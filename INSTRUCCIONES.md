# Plataforma de Subastas Numérica - Instrucciones de Instalación y Uso

## Descripción
Plataforma de subastas de maquinaria industrial desarrollada con Astro, HTML, CSS, JavaScript vanilla y SQLite. Incluye funcionalidades de registro de usuarios, sistema de pujas en tiempo real y panel de administración.

## Características Principales
- ✅ Registro y autenticación de usuarios
- ✅ Panel de administración para agregar máquinas
- ✅ Sistema de pujas en tiempo real
- ✅ Interfaz responsive y moderna
- ✅ Base de datos SQLite integrada
- ✅ Imágenes de maquinaria industrial incluidas

## Requisitos del Sistema
- Node.js 18+ 
- npm o yarn

## Instalación

1. **Extraer el archivo ZIP**
   ```bash
   unzip numerica-auction-platform.zip
   cd numerica-auction
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación**
   - Abrir navegador en: http://localhost:4321

## Credenciales de Administrador
- **Usuario:** admin
- **Contraseña:** admin123

## Estructura del Proyecto

```
numerica-auction/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Página principal
│   │   ├── register.astro       # Registro de usuarios
│   │   ├── login.astro          # Inicio de sesión
│   │   ├── subastas.astro       # Lista de subastas
│   │   ├── admin.astro          # Panel de administración
│   │   └── api/                 # Endpoints de la API
│   ├── layouts/
│   │   └── Layout.astro         # Layout principal
│   └── lib/
│       └── database.js          # Configuración de SQLite
├── public/
│   └── images/                  # Imágenes de maquinaria
└── database.sqlite              # Base de datos SQLite
```

## Funcionalidades

### Para Usuarios
1. **Registro:** Crear cuenta con nombre, teléfono y contraseña
2. **Inicio de Sesión:** Acceder con teléfono y contraseña
3. **Ver Subastas:** Explorar máquinas disponibles
4. **Realizar Pujas:** Participar en subastas activas

### Para Administradores
1. **Acceso al Panel:** Login con credenciales de admin
2. **Agregar Máquinas:** Crear nuevas subastas
3. **Gestionar Inventario:** Ver máquinas activas
4. **Monitorear Pujas:** Seguimiento de actividad

## Workflow de Uso

### Como Administrador:
1. Acceder a `/admin`
2. Iniciar sesión con credenciales de admin
3. Agregar nueva máquina con:
   - Nombre de la máquina
   - Descripción
   - Precio inicial
   - Imagen (seleccionar de las disponibles)

### Como Usuario:
1. Registrarse en `/register`
2. Iniciar sesión en `/login`
3. Ir a `/subastas` para ver máquinas disponibles
4. Hacer clic en "Realizar Puja"
5. Ingresar monto mayor al precio actual
6. Confirmar puja

## Base de Datos
La aplicación utiliza SQLite con las siguientes tablas:
- `users` - Información de usuarios
- `machines` - Máquinas en subasta
- `bids` - Historial de pujas
- `admin_users` - Usuarios administradores

## Tecnologías Utilizadas
- **Frontend:** Astro, HTML5, CSS3, JavaScript ES6+
- **Backend:** Astro API Routes, Node.js
- **Base de Datos:** SQLite con better-sqlite3
- **Autenticación:** JWT (JSON Web Tokens)
- **Cifrado:** bcryptjs para contraseñas

## Comandos Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
```

## Personalización
- **Colores:** Modificar variables CSS en Layout.astro
- **Logo:** Reemplazar imagen en public/images/numerica_logo.jpg
- **Máquinas:** Agregar imágenes en public/images/
- **Estilos:** Personalizar CSS en cada componente .astro

## Notas Importantes
- La base de datos se crea automáticamente al iniciar
- Las pujas se actualizan cada 30 segundos
- El sistema valida que las pujas sean mayores al precio actual
- Los tokens JWT expiran en 24 horas

## Soporte
Para dudas o problemas, revisar:
1. Logs de la consola del navegador
2. Terminal donde se ejecuta el servidor
3. Verificar que todas las dependencias estén instaladas

## Licencia
Proyecto desarrollado para demostración. Imágenes libres de derechos de autor.

