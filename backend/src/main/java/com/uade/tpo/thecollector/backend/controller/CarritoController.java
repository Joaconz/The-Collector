package com.uade.tpo.thecollector.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;
import com.uade.tpo.thecollector.backend.dto.carrito.CarritoItemResponseDTO;
import com.uade.tpo.thecollector.backend.service.CarritoService;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

	private final CarritoService carritoService;

	public CarritoController(CarritoService carritoService) {
		this.carritoService = carritoService;
	}

	@GetMapping
	public ResponseEntity<ApiResponseDTO<List<CarritoItemResponseDTO>>> getMiCarrito() {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Carrito obtenido correctamente",
				carritoService.getMiCarrito(), LocalDateTime.now()));
	}

	@PostMapping("/{publicacionId}")
	public ResponseEntity<ApiResponseDTO<CarritoItemResponseDTO>> agregarAlCarrito(@PathVariable Long publicacionId) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponseDTO<>(HttpStatus.CREATED.value(), "Publicación agregada al carrito",
						carritoService.agregarAlCarrito(publicacionId), LocalDateTime.now()));
	}

	@DeleteMapping("/{publicacionId}")
	public ResponseEntity<Void> quitarDelCarrito(@PathVariable Long publicacionId) {
		carritoService.quitarDelCarrito(publicacionId);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/checkout")
	public ResponseEntity<ApiResponseDTO<Void>> checkout() {
		carritoService.checkout();
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Compra realizada correctamente", null,
				LocalDateTime.now()));
	}
}
