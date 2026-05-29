package com.uade.tpo.thecollector.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.dto.favorito.FavoritoResponseDTO;
import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.model.Favorito;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.FavoritoRepository;
import com.uade.tpo.thecollector.backend.repository.PublicacionRepository;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class FavoritoService {

	private final FavoritoRepository favoritoRepository;
	private final PublicacionRepository publicacionRepository;
	private final UsuarioRepository usuarioRepository;

	public FavoritoService(FavoritoRepository favoritoRepository, PublicacionRepository publicacionRepository,
			UsuarioRepository usuarioRepository) {
		this.favoritoRepository = favoritoRepository;
		this.publicacionRepository = publicacionRepository;
		this.usuarioRepository = usuarioRepository;
	}

	@Transactional(readOnly = true)
	public List<FavoritoResponseDTO> getMisFavoritos() {
		Usuario comprador = usuarioAutenticado();
		return favoritoRepository.findByComprador(comprador).stream().map(FavoritoResponseDTO::new).toList();
	}

	@Transactional
	public FavoritoResponseDTO agregarFavorito(Long publicacionId) {
		Usuario comprador = usuarioAutenticado();
		Publicacion publicacion = publicacionRepository.findById(publicacionId).orElseThrow(
				() -> new ResourceNotFoundException("Publicación con id " + publicacionId + " no encontrada"));

		if (favoritoRepository.existsByCompradorAndPublicacion(comprador, publicacion)) {
			throw new IllegalArgumentException("La publicación ya está en tu lista de deseos");
		}

		Favorito favorito = new Favorito(comprador, publicacion, LocalDateTime.now());
		favorito = favoritoRepository.save(favorito);
		return new FavoritoResponseDTO(favorito);
	}

	@Transactional
	public void eliminarFavorito(Long publicacionId) {
		Usuario comprador = usuarioAutenticado();
		Publicacion publicacion = publicacionRepository.findById(publicacionId).orElseThrow(
				() -> new ResourceNotFoundException("Publicación con id " + publicacionId + " no encontrada"));

		Favorito favorito = favoritoRepository.findByCompradorAndPublicacion(comprador, publicacion)
				.orElseThrow(() -> new ResourceNotFoundException("La publicación no está en tu lista de deseos"));

		favoritoRepository.delete(favorito);
	}

	private Usuario usuarioAutenticado() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado"));
	}
}
