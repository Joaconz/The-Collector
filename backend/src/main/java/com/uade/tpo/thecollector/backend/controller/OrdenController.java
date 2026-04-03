package com.uade.tpo.thecollector.backend.controller;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.thecollector.backend.dto.orden.OrdenRequestDTO;
import com.uade.tpo.thecollector.backend.dto.orden.OrdenResponseDTO;
import com.uade.tpo.thecollector.backend.service.OrdenService;


@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

	private final OrdenService ordenService;

	public OrdenController(OrdenService ordenService) {
		this.ordenService = ordenService;
	}

	@GetMapping
	public ResponseEntity<Page<OrdenResponseDTO>> getOrdenes(Pageable pageable) {
		return ResponseEntity.ok(ordenService.getOrdenes(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrdenResponseDTO> getOrdenById(@PathVariable Long id) {
		return ResponseEntity.ok(ordenService.getOrdenById(id));
	}

	@PostMapping
	public ResponseEntity<OrdenResponseDTO> createOrden(@Valid @RequestBody OrdenRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(ordenService.createOrden(request));
	}
}
