# Proyecto E-commerce: Distrimin SAS

Este es un proyecto de aplicación web de e-commerce completo construido con Next.js y el App Router, diseñado para una ferretería ficticia llamada "Distrimin SAS". La aplicación cuenta con una tienda pública, un panel de control para clientes y un completo panel de administración para ventas y gestión de la tienda, con funcionalidades de IA integradas mediante Genkit.

## Stack Tecnológico

- **Framework:** Next.js (con App Router)
- **Lenguaje:** TypeScript
- **UI:** React
- **Componentes UI:** ShadCN UI
- **Estilos:** Tailwind CSS
- **Inteligencia Artificial:** Genkit para la integración con Google Gemini
- **Formularios:** React Hook Form con Zod para validación
- **Estado Global:** React Context (para autenticación y carrito de compras)

## Características Principales

### 1. Tienda Pública (Cliente)

- **Página de Inicio:** Presenta productos destacados y categorías populares para una navegación rápida.
- **Catálogo de Productos:** Página de listado de productos con funcionalidades de búsqueda por texto y filtrado por categoría.
- **Detalle de Producto:** Tarjetas de producto con carrusel de imágenes (principal y galería).
- **Carrito de Compras:** Funcionalidad completa para agregar, eliminar y actualizar la cantidad de productos.
- **Simulación de Checkout:** Un flujo de pago simulado para completar una compra.
- **Autenticación de Usuarios:** Flujos de inicio de sesión y registro.

### 2. Panel de Cliente (`/account`)

- **Dashboard Personal:** Una vez que un cliente inicia sesión, accede a un panel personal.
- **Gestión de Perfil:** Permite a los usuarios ver y (simuladamente) actualizar su información personal y contraseña.
- **Acceso Restringido:** Protegido por el contexto de autenticación, redirige a los usuarios no autenticados.

### 3. Panel de Administración y Ventas (`/sales`)

- **Acceso Basado en Roles:** Solo accesible para usuarios con rol de `admin` o `vendedor`.
- **Dashboard Estadístico:** (Exclusivo para `admin`) Muestra métricas clave de la tienda como ingresos, nuevos clientes, y gráficos de ventas por categoría y productos más vendidos.
- **Gestión de Productos (CRUD):**
  - Crear, leer, actualizar y eliminar productos.
  - Los datos persisten en la sesión del navegador a través de `localStorage` para simular una base de datos.
  - **Integración de IA:** Generación de imágenes de productos y galería mediante una descripción de texto (`hint`) usando Genkit y la API de Gemini.
- **Gestión de Usuarios Registrados:**
  - (Exclusivo para `admin`) Permite ver, crear, editar, activar/desactivar y eliminar usuarios del sistema.
- **Gestión de Cotizaciones (Quotes):**
  - **Creación de Cotizaciones:** Los vendedores pueden crear cotizaciones para clientes específicos, agregando productos manualmente.
  - **Sugerencias con IA:** Un asistente de IA (Genkit) sugiere productos basándose en la descripción de las necesidades del cliente.
  - **Listado y Edición:** Las cotizaciones guardadas (borradores o enviadas) se listan y pueden ser editadas o eliminadas.

## Estructura del Proyecto

El proyecto sigue las convenciones del App Router de Next.js:

-   `src/app/`: Contiene todas las rutas de la aplicación.
    -   `/` (Raíz): Rutas públicas como la página de inicio, productos, contacto, etc.
    -   `/account`: Rutas protegidas para el panel de cliente.
    -   `/sales`: Rutas protegidas para el panel de ventas y administración.
    -   `layout.tsx`: Layout raíz que provee los contextos globales (Autenticación y Carrito).
    -   `globals.css`: Estilos globales y variables de tema de Tailwind/ShadCN.
-   `src/components/`:
    -   `/ui`: Componentes base de ShadCN UI (Button, Card, Input, etc.).
    -   Componentes reutilizables de la aplicación como `ProductCard`, `PageHeader`, `AiProductSuggester`.
-   `src/context/`:
    -   `auth-context.tsx`: Maneja el estado de autenticación del usuario, simulando el login/logout y el registro.
    -   `cart-context.tsx`: Gestiona el estado del carrito de compras a nivel global.
-   `src/data/`: Contiene los archivos JSON (`products.json`, `users.json`, etc.) que sirven como datos iniciales (semilla) para la aplicación.
-   `src/hooks/`: Hooks personalizados, como `useToast` para notificaciones y `useMobile` para detectar dispositivos móviles.
-   `src/lib/`:
    -   `dummy-data.tsx`: Carga los datos iniciales y los asocia con componentes (iconos).
    -   `utils.ts`: Utilidades generales como `cn` para fusionar clases de Tailwind.
-   `src/ai/`: Lógica relacionada con la Inteligencia Artificial.
    -   `genkit.ts`: Archivo de configuración e inicialización de Genkit.
    -   `/flows`: Define los flujos de IA que pueden ser llamados desde el servidor (Server Actions), como `suggestProductsForQuote` y `generateProductImage`.

## Lógica de Negocio y Simulación

-   **Persistencia de Datos:** Para simular una base de datos sin un backend real, la aplicación utiliza `localStorage` para la gestión CRUD de productos y usuarios. Los datos se inicializan desde los archivos JSON en `src/data/` si no existen en `localStorage`.
-   **Autenticación:** El sistema de autenticación es una simulación que no utiliza contraseñas reales (excepto para el admin). Verifica la existencia del email en una lista de usuarios precargada o en los usuarios registrados en `localStorage`.
-   **Server Actions:** Las interacciones con los flujos de IA de Genkit se realizan a través de Server Actions de Next.js (`src/app/sales/.../actions.ts`), lo que permite ejecutar código de servidor de forma segura desde componentes de cliente sin crear endpoints de API explícitos.
