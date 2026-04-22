package com.uade.tpo.thecollector.backend.controller;

import java.time.LocalDateTime;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;
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
	public ResponseEntity<ApiResponseDTO<Page<OrdenResponseDTO>>> getOrdenes(Pageable pageable) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Órdenes obtenidas correctamente",
				ordenService.getOrdenes(pageable), LocalDateTime.now()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponseDTO<OrdenResponseDTO>> getOrdenById(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Orden obtenida correctamente",
				ordenService.getOrdenById(id), LocalDateTime.now()));
	}

	@PostMapping
	public ResponseEntity<ApiResponseDTO<OrdenResponseDTO>> createOrden(@Valid @RequestBody OrdenRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponseDTO<>(HttpStatus.CREATED.value(), "Orden creada correctamente",
						ordenService.createOrden(request), LocalDateTime.now()));
	}
}
