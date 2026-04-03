package com.uade.tpo.thecollector.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.dto.producto.ProductoRequestDTO;
import com.uade.tpo.thecollector.backend.dto.producto.ProductoResponseDTO;
import com.uade.tpo.thecollector.backend.model.Producto;
import com.uade.tpo.thecollector.backend.repository.ProductoRepository;

@Service
public class ProductoService {

	private final ProductoRepository productoRepository;

	public ProductoService(ProductoRepository productoRepository) {
		this.productoRepository = productoRepository;
	}

	@Transactional(readOnly = true)
	public Page<ProductoResponseDTO> getProductos(Pageable pageable) {
		return productoRepository.findAll(pageable).map(ProductoResponseDTO::new);
	}

	@Transactional(readOnly = true)
	public ProductoResponseDTO getProductoById(Long id) {
		Producto producto = productoRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con el id: " + id));
		return new ProductoResponseDTO(producto);
	}

	@Transactional
	public ProductoResponseDTO createProducto(ProductoRequestDTO dto) {
		Producto producto = new Producto(dto.getNombre(), dto.getDescripcion(), dto.getHistoria(), dto.getPrecio(),
				dto.getStock(), dto.getCategoria(), dto.getImagenUrl());
		producto = productoRepository.save(producto);
		return new ProductoResponseDTO(producto);
	}

	@Transactional
	public ProductoResponseDTO updateProducto(Long id, ProductoRequestDTO dto) {
		Producto producto = productoRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con el id: " + id));

		producto.setNombre(dto.getNombre());
		producto.setDescripcion(dto.getDescripcion());
		producto.setHistoria(dto.getHistoria());
		producto.setPrecio(dto.getPrecio());
		producto.setStock(dto.getStock());
		producto.setCategoria(dto.getCategoria());
		producto.setImagenUrl(dto.getImagenUrl());

		producto = productoRepository.save(producto);
		return new ProductoResponseDTO(producto);
	}

	@Transactional
	public void deleteProducto(Long id) {
		Producto producto = productoRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con el id: " + id));
		productoRepository.delete(producto);
	}
}
