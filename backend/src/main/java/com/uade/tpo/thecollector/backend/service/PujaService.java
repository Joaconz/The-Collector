package com.uade.tpo.thecollector.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.dto.puja.PujaRequestDTO;
import com.uade.tpo.thecollector.backend.dto.puja.PujaResponseDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionResponseDTO;
import com.uade.tpo.thecollector.backend.dto.subasta.MisSubastaResponseDTO;
import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.model.EstadoSubasta;
import com.uade.tpo.thecollector.backend.model.ModoPublicacion;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Puja;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.PublicacionRepository;
import com.uade.tpo.thecollector.backend.repository.PujaRepository;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class PujaService {

	private final PujaRepository pujaRepository;
	private final PublicacionRepository publicacionRepository;
	private final UsuarioRepository usuarioRepository;

	public PujaService(PujaRepository pujaRepository, PublicacionRepository publicacionRepository,
			UsuarioRepository usuarioRepository) {
		this.pujaRepository = pujaRepository;
		this.publicacionRepository = publicacionRepository;
		this.usuarioRepository = usuarioRepository;
	}

	@Transactional
	public PujaResponseDTO crearPuja(Long publicacionId, PujaRequestDTO request) {
		Usuario pujador = usuarioAutenticado();
		Publicacion publicacion = publicacionRepository.findById(publicacionId).orElseThrow(
				() -> new ResourceNotFoundException("Publicación con id " + publicacionId + " no encontrada"));

		if (!ModoPublicacion.SUBASTA.equals(publicacion.getModo())) {
			throw new IllegalArgumentException("La publicación no es una subasta");
		}
		if (!EstadoSubasta.ABIERTA.equals(publicacion.getEstadoSubasta())) {
			throw new IllegalArgumentException("La subasta no está abierta");
		}
		if (publicacion.getFechaLimiteSubasta() != null
				&& LocalDateTime.now().isAfter(publicacion.getFechaLimiteSubasta())) {
			throw new IllegalArgumentException("La subasta ha finalizado");
		}
		if (publicacion.getVendedor().getId().equals(pujador.getId())) {
			throw new IllegalArgumentException("No puedes pujar en tu propia publicación");
		}

		BigDecimal incrementoMinimo = publicacion.getIncrementoMinimo() != null
				? publicacion.getIncrementoMinimo()
				: BigDecimal.ZERO;
		BigDecimal base = pujaRepository.findPujaLider(publicacion).map(Puja::getMonto)
				.orElse(publicacion.getPrecioBase());
		BigDecimal minimoRequerido = base.add(incrementoMinimo);

		if (request.getMonto().compareTo(minimoRequerido) < 0) {
			throw new IllegalArgumentException("La puja debe ser de al menos " + minimoRequerido);
		}

		Puja puja = new Puja(publicacion, pujador, request.getMonto(), LocalDateTime.now());
		puja = pujaRepository.save(puja);
		return new PujaResponseDTO(puja);
	}

	@Transactional(readOnly = true)
	public List<PujaResponseDTO> getPujas(Long publicacionId) {
		Publicacion publicacion = publicacionRepository.findById(publicacionId).orElseThrow(
				() -> new ResourceNotFoundException("Publicación con id " + publicacionId + " no encontrada"));
		return pujaRepository.findByPublicacionOrderByMontoDesc(publicacion).stream().map(PujaResponseDTO::new)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<MisSubastaResponseDTO> getMisSubastas() {
		Usuario pujador = usuarioAutenticado();
		List<Publicacion> participadas = pujaRepository.findPublicacionesParticipadas(pujador);
		List<MisSubastaResponseDTO> resultado = new ArrayList<>();

		for (Publicacion pub : participadas) {
			PublicacionResponseDTO pubDto = new PublicacionResponseDTO(pub);
			pujaRepository.findPujaLider(pub).ifPresent(lider -> pubDto.setPujaActual(lider.getMonto()));

			BigDecimal miPuja = pujaRepository.findMaxMontoUsuario(pub, pujador).orElse(BigDecimal.ZERO);
			BigDecimal pujaLider = pubDto.getPujaActual() != null ? pubDto.getPujaActual() : pub.getPrecioBase();

			String resultadoSubasta = null;
			if (pub.getEstadoSubasta() == com.uade.tpo.thecollector.backend.model.EstadoSubasta.CERRADA) {
				Puja lider = pujaRepository.findPujaLider(pub).orElse(null);
				resultadoSubasta = (lider != null && lider.getPujador().getId().equals(pujador.getId()))
						? "GANADA"
						: "NO_ADJUDICADA";
			}

			resultado.add(new MisSubastaResponseDTO(pubDto, miPuja, pujaLider, resultadoSubasta));
		}

		return resultado;
	}

	private Usuario usuarioAutenticado() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado"));
	}
}
