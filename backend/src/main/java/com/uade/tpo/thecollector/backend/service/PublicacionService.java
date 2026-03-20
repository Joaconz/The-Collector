package com.uade.tpo.thecollector.backend.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class PublicacionService {

    public List<Map<String, Object>> getPublicaciones() {
        return List.of(Map.of("id", 1, "productoId", 1, "estado", "ACTIVA"));
    }

    public Map<String, Object> createPublicacion(Map<String, Object> request) {
        return Map.of("message", "Publicación creada", "publicacionId", 2);
    }

    public Map<String, Object> updateEstadoPublicacion(Long id, Map<String, Object> request) {
        return Map.of("message", "Estado de publicación actualizado", "id", id, "nuevoEstado", request.getOrDefault("estado", "PAUSADA"));
    }
}
