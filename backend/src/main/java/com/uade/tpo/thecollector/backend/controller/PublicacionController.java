package com.uade.tpo.thecollector.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionRequestDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionResponseDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.UpdateEstadoRequestDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.UpdatePublicacionRequestDTO;
import com.uade.tpo.thecollector.backend.model.Categoria;
import com.uade.tpo.thecollector.backend.service.PublicacionService;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionController {

	private final PublicacionService publicacionService;

	public PublicacionController(PublicacionService publicacionService) {
		this.publicacionService = publicacionService;
	}

	@GetMapping
	public ResponseEntity<ApiResponseDTO<Page<PublicacionResponseDTO>>> getPublicaciones(
			@RequestParam(required = false) Categoria categoria, @RequestParam(required = false) BigDecimal precioMin,
			@RequestParam(required = false) BigDecimal precioMax, @RequestParam(defaultValue = "reciente") String orden,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Publicaciones obtenidas correctamente",
				publicacionService.getPublicaciones(categoria, precioMin, precioMax, orden, page, size),
				LocalDateTime.now()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponseDTO<PublicacionResponseDTO>> getPublicacionById(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Publicación obtenida correctamente",
				publicacionService.getPublicacionById(id), LocalDateTime.now()));
	}

	@PostMapping
	@PreAuthorize("hasRole('VENDEDOR')")
	public ResponseEntity<ApiResponseDTO<PublicacionResponseDTO>> createPublicacion(
			@Valid @RequestBody PublicacionRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponseDTO<>(HttpStatus.CREATED.value(), "Publicación creada correctamente",
						publicacionService.createPublicacion(request), LocalDateTime.now()));
	}

	@PutMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<ApiResponseDTO<PublicacionResponseDTO>> updatePublicacion(@PathVariable Long id,
			@Valid @RequestBody UpdatePublicacionRequestDTO request) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Publicación actualizada correctamente",
				publicacionService.updatePublicacion(id, request), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/estado")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<ApiResponseDTO<PublicacionResponseDTO>> updateEstado(@PathVariable Long id,
			@Valid @RequestBody UpdateEstadoRequestDTO request) {
		return ResponseEntity
				.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Estado de publicación actualizado correctamente",
						publicacionService.updateEstado(id, request), LocalDateTime.now()));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Void> eliminarPublicacion(@PathVariable Long id) {
		publicacionService.eliminarPublicacion(id);
		return ResponseEntity.noContent().build();
	}
}
