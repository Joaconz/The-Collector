package com.uade.tpo.thecollector.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.dto.carrito.CarritoItemResponseDTO;
import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.model.CarritoItem;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.CarritoItemRepository;
import com.uade.tpo.thecollector.backend.repository.PublicacionRepository;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class CarritoService {

	private final CarritoItemRepository carritoItemRepository;
	private final PublicacionRepository publicacionRepository;
	private final UsuarioRepository usuarioRepository;

	public CarritoService(CarritoItemRepository carritoItemRepository, PublicacionRepository publicacionRepository,
			UsuarioRepository usuarioRepository) {
		this.carritoItemRepository = carritoItemRepository;
		this.publicacionRepository = publicacionRepository;
		this.usuarioRepository = usuarioRepository;
	}

	@Transactional(readOnly = true)
	public List<CarritoItemResponseDTO> getMiCarrito() {
		Usuario comprador = usuarioAutenticado();
		return carritoItemRepository.findByComprador(comprador).stream().map(CarritoItemResponseDTO::new).toList();
	}

	@Transactional
	public CarritoItemResponseDTO agregarAlCarrito(Long publicacionId) {
		Usuario comprador = usuarioAutenticado();
		Publicacion publicacion = publicacionRepository.findById(publicacionId).orElseThrow(
				() -> new ResourceNotFoundException("Publicación con id " + publicacionId + " no encontrada"));

		if (!EstadoPublicacion.ACTIVA.equals(publicacion.getEstado())) {
			throw new IllegalArgumentException("La publicación no está disponible");
		}
		if (publicacion.getProducto().getStock() <= 0) {
			throw new IllegalArgumentException("No hay stock disponible");
		}
		if (publicacion.getVendedor().getId().equals(comprador.getId())) {
			throw new IllegalArgumentException("No puedes agregar tu propia publicación al carrito");
		}
		if (carritoItemRepository.existsByCompradorAndPublicacion(comprador, publicacion)) {
			throw new IllegalArgumentException("La publicación ya está en tu carrito");
		}

		CarritoItem item = new CarritoItem(comprador, publicacion, LocalDateTime.now());
		item = carritoItemRepository.save(item);
		return new CarritoItemResponseDTO(item);
	}

	@Transactional
	public void quitarDelCarrito(Long publicacionId) {
		Usuario comprador = usuarioAutenticado();
		Publicacion publicacion = publicacionRepository.findById(publicacionId).orElseThrow(
				() -> new ResourceNotFoundException("Publicación con id " + publicacionId + " no encontrada"));

		CarritoItem item = carritoItemRepository.findByCompradorAndPublicacion(comprador, publicacion)
				.orElseThrow(() -> new ResourceNotFoundException("La publicación no está en tu carrito"));

		carritoItemRepository.delete(item);
	}

	@Transactional
	public void checkout() {
		Usuario comprador = usuarioAutenticado();
		List<CarritoItem> items = carritoItemRepository.findByComprador(comprador);

		if (items.isEmpty()) {
			throw new IllegalArgumentException("El carrito está vacío");
		}

		for (CarritoItem item : items) {
			Publicacion publicacion = item.getPublicacion();

			if (!EstadoPublicacion.ACTIVA.equals(publicacion.getEstado())) {
				throw new IllegalStateException(
						"La publicación '" + publicacion.getProducto().getNombre() + "' ya no está disponible");
			}
			if (publicacion.getProducto().getStock() <= 0) {
				throw new IllegalStateException(
						"Sin stock disponible para '" + publicacion.getProducto().getNombre() + "'");
			}

			int nuevoStock = publicacion.getProducto().getStock() - 1;
			publicacion.getProducto().setStock(nuevoStock);

			if (nuevoStock == 0) {
				publicacion.setEstado(EstadoPublicacion.VENDIDA);
			}

			publicacionRepository.save(publicacion);
		}

		carritoItemRepository.deleteByComprador(comprador);
	}

	private Usuario usuarioAutenticado() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado"));
	}
}
