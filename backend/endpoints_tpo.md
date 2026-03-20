# Endpoints Iniciales del Backend - The Collector

A continuación se detallan los endpoints de prueba definidos para representar las operaciones principales del proyecto en esta etapa inicial. Utilizan datos mockeados provistos por la capa Service.

## 1. Auth (Simulado)
- **POST `/api/auth/register`**: Registra un nuevo usuario.
- **POST `/api/auth/login`**: Realiza el login y retorna un JWT simulado.

## 2. Productos
- **GET `/api/productos`**: Lista los productos del catálogo.
- **GET `/api/productos/{id}`**: Obtiene el detalle de un producto específico.
- **POST `/api/productos`**: Crea un nuevo producto.
- **PUT `/api/productos/{id}`**: Actualiza los datos de un producto.
- **DELETE `/api/productos/{id}`**: Elimina un producto.

## 3. Órdenes
- **GET `/api/ordenes`**: Lista las órdenes del usuario autenticado.
- **GET `/api/ordenes/{id}`**: Obtiene el detalle de una orden (ítems, estado).
- **POST `/api/ordenes`**: Crea una nueva orden a partir del carrito (checkout).

## 4. Publicaciones
- **GET `/api/publicaciones`**: Lista todas las publicaciones activas.
- **POST `/api/publicaciones`**: Crea una nueva publicación en el catálogo.
- **PUT `/api/publicaciones/{id}`**: Actualiza el estado de una publicación (ej. PAUSADA, VENDIDA).

## 5. Health Check
- **GET `/status`**: Verifica que la API está funcionando.
