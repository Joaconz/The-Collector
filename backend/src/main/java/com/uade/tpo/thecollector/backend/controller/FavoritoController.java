package com.uade.tpo.thecollector.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;
import com.uade.tpo.thecollector.backend.dto.favorito.FavoritoResponseDTO;
import com.uade.tpo.thecollector.backend.service.FavoritoService;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

	private final FavoritoService favoritoService;

	public FavoritoController(FavoritoService favoritoService) {
		this.favoritoService = favoritoService;
	}

	@GetMapping
	public ResponseEntity<ApiResponseDTO<List<FavoritoResponseDTO>>> getMisFavoritos() {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Lista de deseos obtenida correctamente",
				favoritoService.getMisFavoritos(), LocalDateTime.now()));
	}

	@PostMapping("/{publicacionId}")
	public ResponseEntity<ApiResponseDTO<FavoritoResponseDTO>> agregarFavorito(@PathVariable Long publicacionId) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponseDTO<>(HttpStatus.CREATED.value(), "Publicación agregada a favoritos",
						favoritoService.agregarFavorito(publicacionId), LocalDateTime.now()));
	}

	@DeleteMapping("/{publicacionId}")
	public ResponseEntity<Void> eliminarFavorito(@PathVariable Long publicacionId) {
		favoritoService.eliminarFavorito(publicacionId);
		return ResponseEntity.noContent().build();
	}
}
