# Resolución de la Consigna (UVA 1) - The Collector

A continuación se presentan el **Diagrama de Entidad-Relación (DER)** y el **Diagrama de Clases UML**, aplicando las mejores prácticas y configuración avanzada de diseño de diagramas de software.

---

## 1. Diagrama de Entidad-Relación (DER)

Este DER detalla de forma explícita las entidades principales y secundarias del sistema e identifica sus Claves Primarias (PK) y Foráneas (FK). Se utilizan las relaciones "Crow's foot" con multiplicidad explícita.

```mermaid
---
title: Diagrama de Entidad-Relación (Base de Datos)
config:
  theme: base
  look: handDrawn
  themeVariables:
    primaryColor: "#E2F0CB"
    lineColor: "#333333"
---
erDiagram
    %% Relaciones principales
    USUARIO ||--o{ PUBLICACION : "publica"
    USUARIO ||--o{ ORDEN : "realiza"
    USUARIO ||--o{ RESERVA : "gestiona"
    USUARIO ||--o{ OFERTA : "realiza"
    USUARIO ||--o{ FAVORITO : "guarda"
    
    %% Relación de productos y flujos
    PUBLICACION ||--|| PRODUCTO : "contiene"
    PUBLICACION ||--o{ ORDEN_ITEM : "se vende en"
    PUBLICACION ||--o{ RESERVA : "recibe"
    PUBLICACION ||--o{ OFERTA : "recibe"
    PUBLICACION ||--o{ FAVORITO : "es marcado como"
    
    %% Estructura de compras
    ORDEN ||--|{ ORDEN_ITEM : "contiene"
    PRODUCTO ||--o{ ORDEN_ITEM : "facturado en"
    
    %% Convertibilidad
    OFERTA |o--o| RESERVA : "deriva en"

    %% Entidades y atributos
    USUARIO {
        BigInt id PK
        Varchar nombre
        Varchar email
        Varchar password
        Varchar rol "COMPRADOR | VENDEDOR"
        Timestamp fecha_registro
    }

    PRODUCTO {
        BigInt id PK
        Varchar nombre
        Varchar descripcion
        Text historia
        Decimal precio
        Integer stock
        Varchar categoria
        Varchar imagen_url
    }

    PUBLICACION {
        BigInt id PK
        BigInt producto_id FK
        BigInt vendedor_id FK
        Varchar estado "ACTIVA | PAUSADA | VENDIDA"
        Timestamp fecha_publicacion
    }

    ORDEN {
        BigInt id PK
        BigInt comprador_id FK
        Decimal total
        Varchar estado "PENDIENTE | COMPLETADA"
        Timestamp fecha_creacion
    }

    ORDEN_ITEM {
        BigInt id PK
        BigInt orden_id FK
        BigInt producto_id FK
        Integer cantidad
        Decimal precio_unitario
    }

    RESERVA {
        BigInt id PK
        BigInt comprador_id FK
        BigInt publicacion_id FK
        BigInt oferta_id FK "nullable"
        Decimal precio_acordado
        Varchar estado "PENDIENTE | CONFIRMADA | RECHAZADA"
        Timestamp fecha_reserva
        Timestamp fecha_respuesta "nullable"
    }

    OFERTA {
        BigInt id PK
        BigInt comprador_id FK
        BigInt publicacion_id FK
        Decimal precio_ofertado
        Decimal precio_contraoferta "nullable"
        Varchar estado "PENDIENTE | ACEPTADA | CONTRAOFERTA"
        Timestamp fecha_oferta
    }

    FAVORITO {
        BigInt id PK
        BigInt comprador_id FK
        BigInt publicacion_id FK
        Timestamp fecha_agregado
    }
```

---

## 2. Diagrama de Clases UML (Modelo de Dominio / JPA)

Este modelo diagrama las entidades bajo el paradigma orientado a objetos (enfocado en el traslado a un framework como Spring Boot). Incorpora estereotipos `<<entity>>` y `<<enumeration>>`, visibilidad correcta de los miembros y multiplicidades explícitas en las líneas de relación.

```mermaid
---
title: Diagrama de Clases (Dominio del Sistema)
config:
  theme: default
  look: handDrawn
---
classDiagram
    %% Definición de Clases con Estereotipos
    class Usuario {
        <<entity>>
        -Long id
        -String nombre
        -String email
        -String password
        -Rol rol
        -LocalDateTime fechaRegistro
        +getId() Long
        +getRol() Rol
    }

    class Producto {
        <<entity>>
        -Long id
        -String nombre
        -String descripcion
        -String historia
        -BigDecimal precio
        -Integer stock
        -String imagenUrl
    }

    class Publicacion {
        <<entity>>
        -Long id
        -EstadoPublicacion estado
        -LocalDateTime fechaPublicacion
        +setEstado(estado: EstadoPublicacion)
    }

    class Orden {
        <<entity>>
        -Long id
        -BigDecimal total
        -EstadoOrden estado
        -LocalDateTime fechaCreacion
        +addItem(item: OrdenItem)
        +getTotal() BigDecimal
    }

    class OrdenItem {
        <<entity>>
        -Long id
        -Integer cantidad
        -BigDecimal precioUnitario
    }

    class Reserva {
        <<entity>>
        -Long id
        -BigDecimal precioAcordado
        -EstadoReserva estado
        -LocalDateTime fechaReserva
        -LocalDateTime fechaRespuesta
        +confirmar()
        +rechazar()
        +cancelar()
    }

    class Oferta {
        <<entity>>
        -Long id
        -BigDecimal precioOfertado
        -BigDecimal precioContraoferta
        -EstadoOferta estado
        -LocalDateTime fechaOferta
        +aceptar()
        +contraofertar(precio: BigDecimal)
    }
    
    class Favorito {
        <<entity>>
        -Long id
        -LocalDateTime fechaAgregado
    }

    %% Tipos Enumerados
    class EstadoPublicacion {
        <<enumeration>>
        ACTIVA
        PAUSADA
        VENDIDA
    }

    class Rol {
        <<enumeration>>
        COMPRADOR
        VENDEDOR
    }

    %% Relaciones UML con Cardinalidad Explícita y Labels
    Usuario "1" --> "0..*" Publicacion : publica
    Usuario "1" --> "0..*" Orden : compra
    Usuario "1" --> "0..*" Reserva : reserva
    Usuario "1" --> "0..*" Oferta : oferta
    Usuario "1" --> "0..*" Favorito : guarda

    Publicacion "1" *-- "1" Producto : contiene
    
    Orden "1" *-- "1..*" OrdenItem : contiene
    OrdenItem "0..*" --> "1" Orden : pertenece_a
    OrdenItem "0..*" --> "1" Producto : referencia_a
    
    Publicacion "1" o-- "0..*" Reserva : recibe
    Publicacion "1" o-- "0..*" Oferta : recibe
    Publicacion "1" o-- "0..*" Favorito : referenciada_en
    
    Reserva "0..1" --> "1" Oferta : se_crea_desde
    
    %% Relación de Dependencia a Enumeradores
    Publicacion ..> EstadoPublicacion
    Usuario ..> Rol
```
