package com.uade.tpo.thecollector.backend.controller;

import com.uade.tpo.thecollector.backend.service.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getProductos() {
        return ResponseEntity.ok(productoService.getProductos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductoById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getProductoById(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProducto(@RequestBody Map<String, Object> producto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.createProducto(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProducto(@PathVariable Long id, @RequestBody Map<String, Object> producto) {
        return ResponseEntity.ok(productoService.updateProducto(id, producto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.deleteProducto(id));
    }
}
