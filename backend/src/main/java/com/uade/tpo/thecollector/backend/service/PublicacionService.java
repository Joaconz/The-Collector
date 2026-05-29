package com.uade.tpo.thecollector.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionRequestDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionResponseDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.UpdateEstadoRequestDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.UpdatePublicacionRequestDTO;
import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.model.Categoria;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;
import com.uade.tpo.thecollector.backend.model.EstadoReserva;
import com.uade.tpo.thecollector.backend.model.EstadoSubasta;
import com.uade.tpo.thecollector.backend.model.ModoPublicacion;
import com.uade.tpo.thecollector.backend.model.Producto;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.PublicacionRepository;
import com.uade.tpo.thecollector.backend.repository.ReservaRepository;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class PublicacionService {

	private final PublicacionRepository publicacionRepository;
	private final UsuarioRepository usuarioRepository;
	private final ReservaRepository reservaRepository;

	public PublicacionService(PublicacionRepository publicacionRepository, UsuarioRepository usuarioRepository,
			ReservaRepository reservaRepository) {
		this.publicacionRepository = publicacionRepository;
		this.usuarioRepository = usuarioRepository;
		this.reservaRepository = reservaRepository;
	}

	@Transactional(readOnly = true)
	public Page<PublicacionResponseDTO> getPublicaciones(Categoria categoria, BigDecimal precioMin,
			BigDecimal precioMax, String orden, int page, int size) {
		Sort sort = "precio".equals(orden)
				? Sort.by("producto.precio").ascending()
				: Sort.by("fechaPublicacion").descending();
		Pageable pageable = PageRequest.of(page, size, sort);
		return publicacionRepository.findCatalogo(categoria, precioMin, precioMax, pageable)
				.map(PublicacionResponseDTO::new);
	}

	@Transactional(readOnly = true)
	public PublicacionResponseDTO getPublicacionById(Long id) {
		Publicacion publicacion = publicacionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Publicación con id " + id + " no encontrada"));
		return new PublicacionResponseDTO(publicacion);
	}

	@Transactional
	public PublicacionResponseDTO createPublicacion(PublicacionRequestDTO request) {
		Usuario vendedor = usuarioAutenticado();

		if (request.getModo() == ModoPublicacion.SUBASTA) {
			validarCamposSubasta(request);
		}

		Producto producto = new Producto(request.getProducto().getNombre(), request.getProducto().getDescripcion(),
				request.getProducto().getHistoria(), request.getProducto().getPrecio(),
				request.getProducto().getStock(), request.getProducto().getCategoria(),
				request.getProducto().getImagenUrl());

		Publicacion publicacion = new Publicacion(producto, vendedor, EstadoPublicacion.ACTIVA, request.getModo(),
				LocalDateTime.now());

		if (request.getModo() == ModoPublicacion.SUBASTA) {
			publicacion.setPrecioBase(request.getPrecioBase());
			publicacion.setFechaLimiteSubasta(request.getFechaLimiteSubasta());
			publicacion.setEstadoSubasta(EstadoSubasta.ABIERTA);
		}

		publicacion = publicacionRepository.save(publicacion);
		return new PublicacionResponseDTO(publicacion);
	}

	@Transactional
	public PublicacionResponseDTO updatePublicacion(Long id, UpdatePublicacionRequestDTO request) {
		Publicacion publicacion = publicacionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Publicación con id " + id + " no encontrada"));

		verificarPropiedad(publicacion);

		Producto producto = publicacion.getProducto();
		producto.setNombre(request.getNombre());
		producto.setDescripcion(request.getDescripcion());
		producto.setHistoria(request.getHistoria());
		producto.setImagenUrl(request.getImagenUrl());
		if (request.getCategoria() != null) {
			producto.setCategoria(request.getCategoria());
		}
		if (request.getPrecio() != null) {
			producto.setPrecio(request.getPrecio());
		}
		if (publicacion.getModo() == ModoPublicacion.SUBASTA && request.getFechaLimiteSubasta() != null) {
			publicacion.setFechaLimiteSubasta(request.getFechaLimiteSubasta());
		}

		publicacion = publicacionRepository.save(publicacion);
		return new PublicacionResponseDTO(publicacion);
	}

	@Transactional
	public PublicacionResponseDTO updateEstado(Long id, UpdateEstadoRequestDTO request) {
		Publicacion publicacion = publicacionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Publicación con id " + id + " no encontrada"));

		verificarPropiedad(publicacion);

		publicacion.setEstado(request.getEstado());
		publicacion = publicacionRepository.save(publicacion);
		return new PublicacionResponseDTO(publicacion);
	}

	@Transactional
	public void eliminarPublicacion(Long id) {
		Publicacion publicacion = publicacionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Publicación con id " + id + " no encontrada"));

		verificarPropiedad(publicacion);

		if (reservaRepository.existsByPublicacionAndEstado(publicacion, EstadoReserva.PENDIENTE)) {
			throw new IllegalStateException("No se puede eliminar una publicación con reservas pendientes");
		}

		publicacion.setActivo(false);
		publicacionRepository.save(publicacion);
	}

	private void validarCamposSubasta(PublicacionRequestDTO request) {
		if (request.getPrecioBase() == null) {
			throw new IllegalArgumentException("El precio base es obligatorio para subastas");
		}
		if (request.getFechaLimiteSubasta() == null) {
			throw new IllegalArgumentException("La fecha límite es obligatoria para subastas");
		}
		long diasHastaFin = ChronoUnit.DAYS.between(LocalDateTime.now(), request.getFechaLimiteSubasta());
		if (diasHastaFin > 90) {
			throw new IllegalArgumentException("La fecha límite no puede superar 3 meses desde hoy");
		}
	}

	private void verificarPropiedad(Publicacion publicacion) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		if (!publicacion.getVendedor().getEmail().equals(email)) {
			throw new AccessDeniedException("No tienes permiso para modificar esta publicación");
		}
	}

	private Usuario usuarioAutenticado() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado"));
	}
}
