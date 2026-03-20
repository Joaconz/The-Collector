package com.uade.tpo.thecollector.backend.controller;

import com.uade.tpo.thecollector.backend.service.PublicacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionController {

    private final PublicacionService publicacionService;

    public PublicacionController(PublicacionService publicacionService) {
        this.publicacionService = publicacionService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getPublicaciones() {
        return ResponseEntity.ok(publicacionService.getPublicaciones());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPublicacion(@RequestBody Map<String, Object> request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(publicacionService.createPublicacion(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEstadoPublicacion(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(publicacionService.updateEstadoPublicacion(id, request));
    }
}
