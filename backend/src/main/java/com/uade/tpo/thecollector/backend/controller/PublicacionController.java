package com.uade.tpo.thecollector.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;
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
	public ResponseEntity<ApiResponseDTO<Page<PublicacionResponseDTO>>> getPublicaciones(Pageable pageable) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Publicaciones obtenidas correctamente",
				publicacionService.getPublicaciones(pageable), LocalDateTime.now()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponseDTO<PublicacionResponseDTO>> getPublicacionById(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Publicación obtenida correctamente",
				publicacionService.getPublicacionById(id), LocalDateTime.now()));
	}

	@PostMapping
	public ResponseEntity<ApiResponseDTO<PublicacionResponseDTO>> createPublicacion(@Valid @RequestBody PublicacionRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponseDTO<>(HttpStatus.CREATED.value(), "Publicación creada correctamente",
						publicacionService.createPublicacion(request), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/estado")
	public ResponseEntity<ApiResponseDTO<PublicacionResponseDTO>> updateEstado(@PathVariable Long id,
			@Valid @RequestBody UpdateEstadoRequestDTO request) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Estado de publicación actualizado correctamente",
				publicacionService.updateEstado(id, request), LocalDateTime.now()));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponseDTO<Map<String, Long>>> deletePublicacion(@PathVariable Long id) {
		publicacionService.deletePublicacion(id);
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Publicación eliminada correctamente",
				Map.of("id", id), LocalDateTime.now()));
	}
}
