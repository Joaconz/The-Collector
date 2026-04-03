package com.uade.tpo.thecollector.backend.controller;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionRequestDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionResponseDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.UpdateEstadoRequestDTO;
import com.uade.tpo.thecollector.backend.service.PublicacionService;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionController {

	private final PublicacionService publicacionService;

	public PublicacionController(PublicacionService publicacionService) {
		this.publicacionService = publicacionService;
	}

	@GetMapping
	public ResponseEntity<Page<PublicacionResponseDTO>> getPublicaciones(Pageable pageable) {
		return ResponseEntity.ok(publicacionService.getPublicaciones(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<PublicacionResponseDTO> getPublicacionById(@PathVariable Long id) {
		return ResponseEntity.ok(publicacionService.getPublicacionById(id));
	}

	@PostMapping
	public ResponseEntity<PublicacionResponseDTO> createPublicacion(@Valid @RequestBody PublicacionRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(publicacionService.createPublicacion(request));
	}

	@PatchMapping("/{id}/estado")
	public ResponseEntity<PublicacionResponseDTO> updateEstado(@PathVariable Long id,
			@Valid @RequestBody UpdateEstadoRequestDTO request) {
		return ResponseEntity.ok(publicacionService.updateEstado(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePublicacion(@PathVariable Long id) {
		publicacionService.deletePublicacion(id);
		return ResponseEntity.noContent().build();
	}
}
