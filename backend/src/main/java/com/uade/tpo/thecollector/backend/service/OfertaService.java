package com.uade.tpo.thecollector.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.dto.oferta.ContraofertaRequestDTO;
import com.uade.tpo.thecollector.backend.dto.oferta.OfertaRequestDTO;
import com.uade.tpo.thecollector.backend.dto.oferta.OfertaResponseDTO;
import com.uade.tpo.thecollector.backend.dto.reserva.ReservaResponseDTO;
import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.model.EstadoOferta;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;
import com.uade.tpo.thecollector.backend.model.EstadoReserva;
import com.uade.tpo.thecollector.backend.model.ModoPublicacion;
import com.uade.tpo.thecollector.backend.model.Oferta;
import com.uade.tpo.thecollector.backend.model.OrigenReserva;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Reserva;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.OfertaRepository;
import com.uade.tpo.thecollector.backend.repository.PublicacionRepository;
import com.uade.tpo.thecollector.backend.repository.ReservaRepository;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class OfertaService {

	private final OfertaRepository ofertaRepository;
	private final PublicacionRepository publicacionRepository;
	private final ReservaRepository reservaRepository;
	private final UsuarioRepository usuarioRepository;

	public OfertaService(OfertaRepository ofertaRepository, PublicacionRepository publicacionRepository,
			ReservaRepository reservaRepository, UsuarioRepository usuarioRepository) {
		this.ofertaRepository = ofertaRepository;
		this.publicacionRepository = publicacionRepository;
		this.reservaRepository = reservaRepository;
		this.usuarioRepository = usuarioRepository;
	}

	@Transactional
	public OfertaResponseDTO hacerOferta(OfertaRequestDTO request) {
		Usuario comprador = usuarioAutenticado();
		Publicacion publicacion = publicacionRepository.findById(request.getPublicacionId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Publicación con id " + request.getPublicacionId() + " no encontrada"));

		if (!EstadoPublicacion.ACTIVA.equals(publicacion.getEstado())) {
			throw new IllegalArgumentException("La publicación no está activa");
		}
		if (!ModoPublicacion.PRECIO_FIJO.equals(publicacion.getModo())) {
			throw new IllegalArgumentException("Las ofertas solo están disponibles en publicaciones de precio fijo");
		}
		if (publicacion.getVendedor().getId().equals(comprador.getId())) {
			throw new IllegalArgumentException("No puedes hacer una oferta sobre tu propia publicación");
		}
		if (request.getPrecioOfertado().compareTo(publicacion.getProducto().getPrecio()) >= 0) {
			throw new IllegalArgumentException("El precio ofertado debe ser menor al precio publicado");
		}
		if (ofertaRepository.existsByCompradorAndPublicacionAndEstadoIn(comprador, publicacion,
				List.of(EstadoOferta.PENDIENTE, EstadoOferta.CONTRAOFERTA))) {
			throw new IllegalArgumentException("Ya tienes una oferta activa para esta publicación");
		}

		Oferta oferta = new Oferta(comprador, publicacion, request.getPrecioOfertado(), LocalDateTime.now());
		oferta = ofertaRepository.save(oferta);
		return new OfertaResponseDTO(oferta);
	}

	@Transactional(readOnly = true)
	public List<OfertaResponseDTO> getMisOfertasComprador() {
		Usuario comprador = usuarioAutenticado();
		return ofertaRepository.findByComprador(comprador).stream().map(OfertaResponseDTO::new).toList();
	}

	@Transactional(readOnly = true)
	public List<OfertaResponseDTO> getMisOfertasVendedor() {
		Usuario vendedor = usuarioAutenticado();
		return ofertaRepository.findByVendedor(vendedor).stream().map(OfertaResponseDTO::new).toList();
	}

	@Transactional
	public ReservaResponseDTO aceptarOferta(Long id) {
		Oferta oferta = ofertaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Oferta con id " + id + " no encontrada"));

		verificarVendedor(oferta);
		verificarEstadoPendiente(oferta);

		oferta.setEstado(EstadoOferta.ACEPTADA);
		ofertaRepository.save(oferta);

		return confirmarVentaPorOferta(oferta, oferta.getPrecioOfertado());
	}

	@Transactional
	public OfertaResponseDTO rechazarOferta(Long id) {
		Oferta oferta = ofertaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Oferta con id " + id + " no encontrada"));

		verificarVendedor(oferta);
		verificarEstadoPendiente(oferta);

		oferta.setEstado(EstadoOferta.RECHAZADA);
		oferta = ofertaRepository.save(oferta);
		return new OfertaResponseDTO(oferta);
	}

	@Transactional
	public OfertaResponseDTO contraofertar(Long id, ContraofertaRequestDTO request) {
		Oferta oferta = ofertaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Oferta con id " + id + " no encontrada"));

		verificarVendedor(oferta);
		verificarEstadoPendiente(oferta);

		BigDecimal precioContraoferta = request.getPrecioContraoferta();
		BigDecimal precioLista = oferta.getPublicacion().getProducto().getPrecio();
		if (precioContraoferta.compareTo(oferta.getPrecioOfertado()) <= 0) {
			throw new IllegalArgumentException("La contraoferta debe ser mayor a la oferta del comprador");
		}
		if (precioContraoferta.compareTo(precioLista) >= 0) {
			throw new IllegalArgumentException("La contraoferta debe ser menor al precio de lista");
		}

		oferta.setPrecioContraoferta(precioContraoferta);
		oferta.setEstado(EstadoOferta.CONTRAOFERTA);
		oferta = ofertaRepository.save(oferta);
		return new OfertaResponseDTO(oferta);
	}

	@Transactional
	public ReservaResponseDTO aceptarContraoferta(Long id) {
		Oferta oferta = ofertaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Oferta con id " + id + " no encontrada"));

		verificarComprador(oferta);
		if (!EstadoOferta.CONTRAOFERTA.equals(oferta.getEstado())) {
			throw new IllegalArgumentException("Solo se puede aceptar una oferta en estado CONTRAOFERTA");
		}

		oferta.setEstado(EstadoOferta.ACEPTADA);
		ofertaRepository.save(oferta);

		return confirmarVentaPorOferta(oferta, oferta.getPrecioContraoferta());
	}

	/**
	 * Concreta una venta originada en una oferta aceptada: genera una reserva
	 * CONFIRMADA con origen OFERTA, descuenta stock y marca la pieza como VENDIDA
	 * cuando el stock llega a cero.
	 */
	private ReservaResponseDTO confirmarVentaPorOferta(Oferta oferta, BigDecimal precioAcordado) {
		Publicacion publicacion = oferta.getPublicacion();
		if (publicacion.getProducto().getStock() <= 0) {
			throw new IllegalArgumentException("No hay stock disponible para concretar la venta");
		}

		Reserva reserva = new Reserva(oferta.getComprador(), publicacion, precioAcordado, OrigenReserva.OFERTA,
				LocalDateTime.now());
		reserva.setOferta(oferta);
		reserva.setEstado(EstadoReserva.CONFIRMADA);
		reserva.setFechaRespuesta(LocalDateTime.now());

		int nuevoStock = publicacion.getProducto().getStock() - 1;
		publicacion.getProducto().setStock(nuevoStock);
		if (nuevoStock == 0) {
			publicacion.setEstado(EstadoPublicacion.VENDIDA);
		}
		publicacionRepository.save(publicacion);

		reserva = reservaRepository.save(reserva);
		return new ReservaResponseDTO(reserva);
	}

	@Transactional
	public OfertaResponseDTO cancelarOferta(Long id) {
		Oferta oferta = ofertaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Oferta con id " + id + " no encontrada"));

		verificarComprador(oferta);
		if (!EstadoOferta.PENDIENTE.equals(oferta.getEstado())
				&& !EstadoOferta.CONTRAOFERTA.equals(oferta.getEstado())) {
			throw new IllegalArgumentException("Solo se pueden cancelar ofertas en estado PENDIENTE o CONTRAOFERTA");
		}

		oferta.setEstado(EstadoOferta.CANCELADA);
		oferta = ofertaRepository.save(oferta);
		return new OfertaResponseDTO(oferta);
	}

	private void verificarEstadoPendiente(Oferta oferta) {
		if (!EstadoOferta.PENDIENTE.equals(oferta.getEstado())) {
			throw new IllegalArgumentException("Solo se pueden modificar ofertas en estado PENDIENTE");
		}
	}

	private void verificarVendedor(Oferta oferta) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		if (!oferta.getPublicacion().getVendedor().getEmail().equals(email)) {
			throw new AccessDeniedException("Solo el vendedor puede responder esta oferta");
		}
	}

	private void verificarComprador(Oferta oferta) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		if (!oferta.getComprador().getEmail().equals(email)) {
			throw new AccessDeniedException("Solo el comprador que realizó la oferta puede realizar esta acción");
		}
	}

	private Usuario usuarioAutenticado() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado"));
	}
}
