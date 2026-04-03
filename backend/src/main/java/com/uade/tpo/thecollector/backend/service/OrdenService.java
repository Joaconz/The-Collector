package com.uade.tpo.thecollector.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.dto.orden.OrdenRequestDTO;
import com.uade.tpo.thecollector.backend.dto.orden.OrdenResponseDTO;
import com.uade.tpo.thecollector.backend.model.EstadoOrden;
import com.uade.tpo.thecollector.backend.model.Orden;
import com.uade.tpo.thecollector.backend.model.OrdenItem;
import com.uade.tpo.thecollector.backend.model.Producto;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.OrdenRepository;
import com.uade.tpo.thecollector.backend.repository.ProductoRepository;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class OrdenService {

	private final OrdenRepository ordenRepository;
	private final UsuarioRepository usuarioRepository;
	private final ProductoRepository productoRepository;

	public OrdenService(OrdenRepository ordenRepository, UsuarioRepository usuarioRepository,
			ProductoRepository productoRepository) {
		this.ordenRepository = ordenRepository;
		this.usuarioRepository = usuarioRepository;
		this.productoRepository = productoRepository;
	}

	@Transactional(readOnly = true)
	public Page<OrdenResponseDTO> getOrdenes(Pageable pageable) {
		return ordenRepository.findAll(pageable).map(OrdenResponseDTO::new);
	}

	@Transactional(readOnly = true)
	public OrdenResponseDTO getOrdenById(Long id) {
		Orden orden = ordenRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada"));
		return new OrdenResponseDTO(orden);
	}

	@Transactional
	public OrdenResponseDTO createOrden(OrdenRequestDTO request) {
		Usuario comprador = usuarioRepository.findById(request.getCompradorId())
				.orElseThrow(() -> new ResourceNotFoundException("Comprador no encontrado"));

		Orden orden = new Orden(comprador, BigDecimal.ZERO, EstadoOrden.PENDIENTE, LocalDateTime.now());
		BigDecimal total = BigDecimal.ZERO;

		for (Long productoId : request.getProductoIds()) {
			Producto producto = productoRepository.findById(productoId)
					.orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + productoId));

			OrdenItem item = new OrdenItem(producto, 1, producto.getPrecio());
			orden.addItem(item);
			total = total.add(producto.getPrecio());
		}

		orden.setTotal(total);
		orden = ordenRepository.save(orden);

		return new OrdenResponseDTO(orden);
	}
}
