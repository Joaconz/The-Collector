package com.uade.tpo.thecollector.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getProductos() {
        // Mock data for test endpoint
        List<Map<String, Object>> productos = List.of(
                Map.of("id", 1, "nombre", "Reloj Vintage Rolex", "precio", 5000),
                Map.of("id", 2, "nombre", "Cuadro Renacentista", "precio", 15000)
        );
        return ResponseEntity.ok(productos);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProducto(@RequestBody Map<String, Object> producto) {
        // Mock response for test endpoint
        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message", "Producto creado exitosamente", "producto", producto)
        );
    }
}
