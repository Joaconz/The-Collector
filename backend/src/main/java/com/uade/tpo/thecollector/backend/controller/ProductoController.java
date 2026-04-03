package com.uade.tpo.thecollector.backend.controller;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
	public ResponseEntity<Page<ProductoResponseDTO>> getProductos(Pageable pageable) {
		return ResponseEntity.ok(productoService.getProductos(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductoResponseDTO> getProductoById(@PathVariable Long id) {
		return ResponseEntity.ok(productoService.getProductoById(id));
	}

	@PostMapping
	public ResponseEntity<ProductoResponseDTO> createProducto(@Valid @RequestBody ProductoRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(productoService.createProducto(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductoResponseDTO> updateProducto(@PathVariable Long id,
			@Valid @RequestBody ProductoRequestDTO request) {
		return ResponseEntity.ok(productoService.updateProducto(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
		productoService.deleteProducto(id);
		return ResponseEntity.noContent().build();
	}
}
