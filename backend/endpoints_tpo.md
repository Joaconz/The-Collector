# Endpoints Iniciales del Backend - The Collector

A continuación se detallan los endpoints de prueba definidos para representar las operaciones principales del proyecto en esta etapa inicial. No se encuentran completamente implementados con acceso a base de datos, pero sirven como base funcional.

## 1. Verificación de Estado (Health Check)
- **Endpoint:** `GET /status`
- **Descripción:** Verifica que el servidor de Spring Boot se encuentre en ejecución y respondiendo.
- **Respuesta de ejemplo:**
```json
{
  "status": "UP",
  "message": "The Collector API is running."
}
```

## 2. Catálogo de Productos
Estos endpoints representan el recurso principal del sistema: el producto coleccionable.

### Listar Productos
- **Endpoint:** `GET /api/productos`
- **Descripción:** Devuelve una lista de los productos disponibles. En el futuro, este endpoint soportará filtros por categoría, rango de precios, etc.
- **Respuesta de ejemplo:**
```json
[
  {
    "id": 1,
    "nombre": "Reloj Vintage Rolex",
    "precio": 5000
  },
  {
    "id": 2,
    "nombre": "Cuadro Renacentista",
    "precio": 15000
  }
]
```

### Crear Producto
- **Endpoint:** `POST /api/productos`
- **Descripción:** Permite a un usuario con rol VENDEDOR crear un nuevo producto coleccionable.
- **Cuerpo de la petición (ejemplo):**
```json
{
  "nombre": "Moneda Antigua Romana",
  "descripcion": "Moneda de plata del siglo I",
  "precio": 1200,
  "historia": "Encontrada en ruinas italianas...",
  "stock": 1,
  "categoria": "numismatica"
}
```
- **Respuesta de ejemplo:**
```json
{
  "message": "Producto creado exitosamente",
  "producto": {
    "nombre": "Moneda Antigua Romana",
    "precio": 1200,
    ...
  }
}
```
