package com.uade.tpo.thecollector.backend.controller;

import com.uade.tpo.thecollector.backend.service.OrdenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getOrdenes() {
        return ResponseEntity.ok(ordenService.getOrdenes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrdenById(@PathVariable Long id) {
        return ResponseEntity.ok(ordenService.getOrdenById(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrden(@RequestBody Map<String, Object> request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ordenService.createOrden(request));
    }
}
