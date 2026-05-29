package com.uade.tpo.thecollector.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.dto.reserva.ReservaRequestDTO;
import com.uade.tpo.thecollector.backend.dto.reserva.ReservaResponseDTO;
import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;
import com.uade.tpo.thecollector.backend.model.EstadoReserva;
import com.uade.tpo.thecollector.backend.model.ModoPublicacion;
import com.uade.tpo.thecollector.backend.model.OrigenReserva;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Reserva;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.PublicacionRepository;
import com.uade.tpo.thecollector.backend.repository.ReservaRepository;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class ReservaService {

	private final ReservaRepository reservaRepository;
	private final PublicacionRepository publicacionRepository;
	private final UsuarioRepository usuarioRepository;

	public ReservaService(ReservaRepository reservaRepository, PublicacionRepository publicacionRepository,
			UsuarioRepository usuarioRepository) {
		this.reservaRepository = reservaRepository;
		this.publicacionRepository = publicacionRepository;
		this.usuarioRepository = usuarioRepository;
	}

	@Transactional
	public ReservaResponseDTO crearReserva(ReservaRequestDTO request) {
		Usuario comprador = usuarioAutenticado();
		Publicacion publicacion = publicacionRepository.findById(request.getPublicacionId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Publicación con id " + request.getPublicacionId() + " no encontrada"));

		if (!EstadoPublicacion.ACTIVA.equals(publicacion.getEstado())) {
			throw new IllegalArgumentException("La publicación no está activa");
		}
		if (publicacion.getProducto().getStock() <= 0) {
			throw new IllegalArgumentException("No hay stock disponible");
		}
		if (publicacion.getVendedor().getId().equals(comprador.getId())) {
			throw new IllegalArgumentException("No puedes reservar tu propia publicación");
		}
		if (ModoPublicacion.SUBASTA.equals(publicacion.getModo())) {
			throw new IllegalArgumentException("Las publicaciones en modo subasta no admiten reservas directas");
		}
		if (reservaRepository.existsByCompradorAndPublicacionAndEstado(comprador, publicacion,
				EstadoReserva.PENDIENTE)) {
			throw new IllegalArgumentException("Ya tienes una reserva pendiente para esta publicación");
		}

		Reserva reserva = new Reserva(comprador, publicacion, publicacion.getProducto().getPrecio(),
				OrigenReserva.DIRECTA, LocalDateTime.now());
		reserva = reservaRepository.save(reserva);
		return new ReservaResponseDTO(reserva);
	}

	@Transactional(readOnly = true)
	public List<ReservaResponseDTO> getMisReservasComprador() {
		Usuario comprador = usuarioAutenticado();
		return reservaRepository.findByComprador(comprador).stream().map(ReservaResponseDTO::new).toList();
	}

	@Transactional(readOnly = true)
	public List<ReservaResponseDTO> getMisReservasVendedor() {
		Usuario vendedor = usuarioAutenticado();
		return reservaRepository.findByVendedor(vendedor).stream().map(ReservaResponseDTO::new).toList();
	}

	@Transactional
	public ReservaResponseDTO confirmarReserva(Long id) {
		Reserva reserva = reservaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Reserva con id " + id + " no encontrada"));

		verificarVendedor(reserva);
		verificarEstadoPendiente(reserva);

		Publicacion publicacion = reserva.getPublicacion();
		int nuevoStock = publicacion.getProducto().getStock() - 1;
		publicacion.getProducto().setStock(nuevoStock);

		if (nuevoStock == 0) {
			publicacion.setEstado(EstadoPublicacion.VENDIDA);
		}

		reserva.setEstado(EstadoReserva.CONFIRMADA);
		reserva.setFechaRespuesta(LocalDateTime.now());
		publicacionRepository.save(publicacion);
		reserva = reservaRepository.save(reserva);
		return new ReservaResponseDTO(reserva);
	}

	@Transactional
	public ReservaResponseDTO rechazarReserva(Long id) {
		Reserva reserva = reservaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Reserva con id " + id + " no encontrada"));

		verificarVendedor(reserva);
		verificarEstadoPendiente(reserva);

		reserva.setEstado(EstadoReserva.RECHAZADA);
		reserva.setFechaRespuesta(LocalDateTime.now());
		reserva = reservaRepository.save(reserva);
		return new ReservaResponseDTO(reserva);
	}

	@Transactional
	public ReservaResponseDTO cancelarReserva(Long id) {
		Reserva reserva = reservaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Reserva con id " + id + " no encontrada"));

		verificarComprador(reserva);
		verificarEstadoPendiente(reserva);

		reserva.setEstado(EstadoReserva.CANCELADA);
		reserva.setFechaRespuesta(LocalDateTime.now());
		reserva = reservaRepository.save(reserva);
		return new ReservaResponseDTO(reserva);
	}

	private void verificarEstadoPendiente(Reserva reserva) {
		if (!EstadoReserva.PENDIENTE.equals(reserva.getEstado())) {
			throw new IllegalArgumentException("Solo se pueden modificar reservas en estado PENDIENTE");
		}
	}

	private void verificarVendedor(Reserva reserva) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		if (!reserva.getPublicacion().getVendedor().getEmail().equals(email)) {
			throw new AccessDeniedException("Solo el vendedor puede responder esta reserva");
		}
	}

	private void verificarComprador(Reserva reserva) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		if (!reserva.getComprador().getEmail().equals(email)) {
			throw new AccessDeniedException("Solo el comprador puede cancelar su reserva");
		}
	}

	private Usuario usuarioAutenticado() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado"));
	}
}
