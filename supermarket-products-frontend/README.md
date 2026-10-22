# Mercado · Frontend de gestión de productos

SPA en React + Vite + Tailwind con arquitectura modular, React Router, React Hook Form, Zod, Axios y SweetAlert2.

## Requisitos
- Node.js 18+
- Backend disponible en `http://localhost:3000` con los endpoints descritos.

## Ejecutar
```bash
npm install
cp .env.example .env
npm run dev
```
Abrir la URL que indique Vite (normalmente http://localhost:5173).

## Configuración API
La URL base se configura mediante `VITE_API_URL`. Por defecto es `http://localhost:3000/api/products`.
Si frontend y backend usan puertos distintos, el backend debe permitir CORS para el origen de Vite.

## Contrato asumido
- Las respuestas pueden venir como objeto directo o envueltas en `{ data: ... }`.
- La lista puede ser un array directo o `{ data: [] }` / `{ products: [] }`.
- Los IDs se aceptan como `id` o `_id`.
- `POST`/`PUT` aceptan `{ nombre, categoria, precio, stock, marca, descripcion }`.
- Los endpoints PATCH de estado/activo se envían sin body por defecto. Si tu backend requiere un body, adapta las funciones en `src/services/productService.js`.
- Soft delete y restore asumen `PATCH /:id/soft-delete` y `PATCH /:id/restore`.
- Los campos de formulario se validan en cliente con Zod; ajusta `productSchema` si el backend usa otras reglas.

## Funcionalidades
- Listado, búsqueda, filtro por estado, paginación y acciones.
- Crear, editar y consultar detalle.
- Soft delete, restaurar, borrado físico, cambiar `status` y alternar `isActive`.
- Estados de carga, errores y notificaciones/confirmaciones.
- Rutas cargadas con `React.lazy` y `Suspense`.

## Estructura
```text
src/
  components/ {AppLayout, Datatable, Error, Skeleton, ProductForm, ProductDetail}
  context/ProductContext.jsx
  features/products/schemaEvents.js
  hooks/useProducts.js
  pages/{List,Create,Edit,Detail}.jsx
  routes/AppRoutes.jsx
  services/{apiClient,productService}.js
  utils/{errorHandler,alerts}.js
```

## Nota sobre borrado lógico
El listado principal usa `GET /api/products` para que se puedan ver y restaurar productos eliminados si el backend los incluye. Si la API excluye los borrados lógicos por defecto, revisa si dispone de un endpoint de papelera. El botón “Activos” usa `GET /is-active`.
