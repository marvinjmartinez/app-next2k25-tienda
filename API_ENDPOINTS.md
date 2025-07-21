# Especificación de API para Distrimin S.A.S

Esta es una guía de los endpoints necesarios para construir un backend robusto que respalde la aplicación de e-commerce "Distrimin S.A.S".

## Autenticación (`/api/auth`)

Maneja el registro, inicio y cierre de sesión de los usuarios.

### **`POST /api/auth/login`**

-   **Descripción:** Autentica a un usuario y devuelve un token de acceso (ej. JWT).
-   **Request Body:**
    ```json
    {
      "email": "sistemas@distrimin.com",
      "password": "123"
    }
    ```
-   **Response (Success 200 OK):**
    ```json
    {
      "token": "ey...",
      "user": {
        "id": "user-admin",
        "name": "Admin User",
        "email": "sistemas@distrimin.com",
        "role": "admin"
      }
    }
    ```
-   **Response (Error 401 Unauthorized):**
    ```json
    { "message": "Credenciales inválidas." }
    ```

### **`POST /api/auth/register`**

-   **Descripción:** Registra un nuevo usuario en el sistema.
-   **Request Body:**
    ```json
    {
      "name": "Nuevo Cliente",
      "email": "nuevo@cliente.com",
      "password": "passwordseguro"
    }
    ```
-   **Response (Success 201 Created):**
    ```json
    {
      "message": "Usuario registrado exitosamente.",
      "user": {
        "id": "user-new-123",
        "name": "Nuevo Cliente",
        "email": "nuevo@cliente.com",
        "role": "cliente"
      }
    }
    ```
-   **Response (Error 409 Conflict):**
    ```json
    { "message": "El correo electrónico ya está en uso." }
    ```

---

## Productos (`/api/products`)

Endpoints para la gestión del catálogo de productos (CRUD).

### **`GET /api/products`**

-   **Descripción:** Obtiene una lista paginada y filtrada de productos.
-   **Query Params:**
    -   `page` (number, opcional): Número de página.
    -   `limit` (number, opcional): Productos por página.
    -   `category` (string, opcional): Slug de la categoría.
    -   `search` (string, opcional): Término de búsqueda.
    -   `featured` (boolean, opcional): Filtrar por productos destacados.
-   **Response (Success 200 OK):**
    ```json
    {
      "data": [
        {
          "id": "prod_1",
          "name": "Taladro Percutor Inalámbrico 20V",
          "price": 1899.00,
          "category": "herramientas",
          "image": "url/a/imagen.png",
          "stock": 15
        }
      ],
      "meta": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 58
      }
    }
    ```

### **`GET /api/products/{id}`**

-   **Descripción:** Obtiene los detalles de un solo producto por su ID.
-   **Response (Success 200 OK):**
    ```json
    {
      "id": "prod_1",
      "name": "Taladro Percutor Inalámbrico 20V",
      "price": 1899.00,
      "priceTiers": { "tipo1": 1899.00, "tipo2": 1750.00, "tipo3": 1650.00 },
      "category": "herramientas",
      "description": "...",
      "stock": 15,
      "featured": true,
      "status": "activo",
      "gallery": ["url1.png", "url2.png"]
    }
    ```

### **`POST /api/products`** (Protegido: Admin)

-   **Descripción:** Crea un nuevo producto.
-   **Request Body:**
    ```json
    {
      "name": "Martillo de Uña",
      "price": 250.00,
      "priceTiers": { "tipo1": 250.00, "tipo2": 230.00, "tipo3": 210.00 },
      "stock": 50,
      "category": "herramientas",
      "description": "Mango de madera, cabeza de acero forjado."
    }
    ```
-   **Response (Success 201 Created):**
    ```json
    { /* Objeto del producto recién creado, con su nuevo ID */ }
    ```

### **`PUT /api/products/{id}`** (Protegido: Admin)

-   **Descripción:** Actualiza un producto existente.
-   **Request Body:** Mismos campos que en `POST`.
-   **Response (Success 200 OK):**
    ```json
    { /* Objeto del producto actualizado */ }
    ```

### **`DELETE /api/products/{id}`** (Protegido: Admin)

-   **Descripción:** Elimina un producto.
-   **Response (Success 204 No Content):** (Sin cuerpo de respuesta)

---

## Cotizaciones y Pedidos (`/api/quotes`)

### **`GET /api/quotes`** (Protegido: Vendedor/Admin)

-   **Descripción:** Obtiene una lista de todas las cotizaciones y pedidos.
-   **Query Params:** `?status=Borrador&customerId=user-123`
-   **Response (Success 200 OK):**
    ```json
    { "data": [ /* Array de objetos de cotización */ ] }
    ```

### **`GET /api/quotes/my`** (Protegido: Cliente)

-   **Descripción:** Obtiene las cotizaciones y pedidos del usuario autenticado.
-   **Response (Success 200 OK):**
    ```json
    { "data": [ /* Array de objetos de cotización del cliente */ ] }
    ```

### **`POST /api/quotes`** (Protegido)

-   **Descripción:** Guarda una nueva cotización como borrador.
-   **Request Body:**
    ```json
    {
      "customerId": "user-cliente",
      "status": "Borrador",
      "items": [
        { "productId": "prod_1", "quantity": 2, "price": 1899.00 }
      ]
    }
    ```
-   **Response (Success 201 Created):**
    ```json
    { /* Objeto de la cotización creada */ }
    ```

### **`POST /api/checkout`** (Protegido)

-   **Descripción:** Procesa los artículos para crear un pedido con estado "Pagado".
-   **Request Body:**
    ```json
    {
      "items": [ { "productId": "prod_2", "quantity": 1 } ],
      "shippingAddress": { "street": "Av. Siempre Viva 123", "city": "Springfield" },
      "paymentToken": "tok_123..."
    }
    ```
-   **Response (Success 200 OK):**
    ```json
    {
      "message": "Pedido realizado con éxito.",
      "order": { /* Objeto del pedido con estado 'Pagada' */ }
    }
    ```

---

## Gestión de Usuarios (`/api/users`) (Protegido: Admin)

### **`GET /api/users`**

-   **Descripción:** Obtiene una lista de todos los usuarios registrados.
-   **Response (Success 200 OK):**
    ```json
    { "data": [ /* Array de objetos de usuario */ ] }
    ```

### **`PUT /api/users/{id}`**

-   **Descripción:** Actualiza la información de un usuario (nombre, rol, estado).
-   **Request Body:** `{ "name": "Juan Pérez Actualizado", "role": "cliente_especial", "status": "activo" }`
-   **Response (Success 200 OK):**
    ```json
    { /* Objeto del usuario actualizado */ }
    ```

---

## Punto de Venta (POS) (`/api/pos`)

Endpoints específicos para la terminal de punto de venta.

### **`POST /api/pos/sales`** (Protegido: Vendedor/Admin)

-   **Descripción:** Registra una nueva venta del POS.
-   **Request Body:**
    ```json
    {
      "customerId": "pos_user_1", // Opcional
      "paymentMethod": "Efectivo",
      "items": [ { "productId": "prod_5", "quantity": 1, "price": 280.00 } ]
    }
    ```
-   **Response (Success 201 Created):**
    ```json
    { /* Objeto de la venta creada */ }
    ```

### **`POST /api/pos/closings`** (Protegido: Vendedor/Admin)

-   **Descripción:** Registra un cierre de caja.
-   **Request Body:**
    ```json
    {
      "initialCash": 2000.00,
      "countedCash": 7250.50,
      "systemCashSales": 5250.50
    }
    ```
-   **Response (Success 201 Created):**
    ```json
    {
      "id": "cierre_123",
      "date": "...",
      "userName": "Vendedor User",
      "difference": 0
    }
    ```

---

## Funcionalidades de IA (`/api/ai`) (Protegido: Admin)

### **`POST /api/ai/generate-product-image`**

-   **Descripción:** Genera una imagen para un producto y devuelve la URL pública.
-   **Request Body:** `{ "hint": "Martillo de bola con mango de madera" }`
-   **Response (Success 200 OK):** `{ "imageUrl": "https://storage.googleapis.com/..." }`

### **`POST /api/files/upload`**

-   **Descripción:** Sube un archivo (imagen) y devuelve su URL pública.
-   **Request Body:** `FormData` con `file` y `path`.
-   **Response (Success 200 OK):** `{ "imageUrl": "https://storage.googleapis.com/..." }`
