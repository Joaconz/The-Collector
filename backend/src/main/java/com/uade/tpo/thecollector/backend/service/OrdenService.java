package com.uade.tpo.thecollector.backend.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class OrdenService {

    public List<Map<String, Object>> getOrdenes() {
        return List.of(Map.of("id", 100, "total", 5000, "estado", "PENDIENTE"));
    }

    public Map<String, Object> getOrdenById(Long id) {
        return Map.of("id", id, "total", 5000, "estado", "CONFIRMADA", "items", List.of(1, 2));
    }

    public Map<String, Object> createOrden(Map<String, Object> request) {
        return Map.of("message", "Orden creada exitosamente", "ordenId", 101);
    }
}
