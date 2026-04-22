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
import com.uade.tpo.thecollector.backend.dto.producto.ProductoRequestDTO;
import com.uade.tpo.thecollector.backend.dto.producto.ProductoResponseDTO;
import com.uade.tpo.thecollector.backend.service.ProductoService;


@RestController
@RequestMapping("/api/productos")
public class ProductoController {

	private final ProductoService productoService;

	public ProductoController(ProductoService productoService) {
		this.productoService = productoService;
	}

	@GetMapping
	public ResponseEntity<ApiResponseDTO<Page<ProductoResponseDTO>>> getProductos(Pageable pageable) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Productos obtenidos correctamente",
				productoService.getProductos(pageable), LocalDateTime.now()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> getProductoById(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Producto obtenido correctamente",
				productoService.getProductoById(id), LocalDateTime.now()));
	}

	@PostMapping
	public ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> createProducto(@Valid @RequestBody ProductoRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponseDTO<>(HttpStatus.CREATED.value(), "Producto creado correctamente",
						productoService.createProducto(request), LocalDateTime.now()));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> updateProducto(@PathVariable Long id,
			@Valid @RequestBody ProductoRequestDTO request) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Producto actualizado correctamente",
				productoService.updateProducto(id, request), LocalDateTime.now()));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponseDTO<Map<String, Long>>> deleteProducto(@PathVariable Long id) {
		productoService.deleteProducto(id);
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Producto eliminado correctamente",
				Map.of("id", id), LocalDateTime.now()));
	}
}
