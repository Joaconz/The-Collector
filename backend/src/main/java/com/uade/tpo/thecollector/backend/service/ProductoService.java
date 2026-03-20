package com.uade.tpo.thecollector.backend.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ProductoService {

    public List<Map<String, Object>> getProductos() {
        return List.of(
                Map.of("id", 1, "nombre", "Reloj Vintage Rolex", "precio", 5000),
                Map.of("id", 2, "nombre", "Cuadro Renacentista", "precio", 15000)
        );
    }

    public Map<String, Object> getProductoById(Long id) {
        return Map.of("id", id, "nombre", "Producto Test " + id, "precio", 999);
    }

    public Map<String, Object> createProducto(Map<String, Object> producto) {
        return Map.of("message", "Producto creado exitosamente", "producto", producto);
    }

    public Map<String, Object> updateProducto(Long id, Map<String, Object> producto) {
        return Map.of("message", "Producto modificado exitosamente", "id", id);
    }

    public Map<String, Object> deleteProducto(Long id) {
        return Map.of("message", "Producto eliminado exitosamente", "id", id);
    }
}
