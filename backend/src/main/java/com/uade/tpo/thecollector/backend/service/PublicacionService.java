package com.uade.tpo.thecollector.backend.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionRequestDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionResponseDTO;
import com.uade.tpo.thecollector.backend.dto.publicacion.UpdateEstadoRequestDTO;
import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;
import com.uade.tpo.thecollector.backend.model.Producto;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.PublicacionRepository;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class PublicacionService {

	private final PublicacionRepository publicacionRepository;
	private final UsuarioRepository usuarioRepository;

	public PublicacionService(PublicacionRepository publicacionRepository, UsuarioRepository usuarioRepository) {
		this.publicacionRepository = publicacionRepository;
		this.usuarioRepository = usuarioRepository;
	}

	@Transactional(readOnly = true)
	public Page<PublicacionResponseDTO> getPublicaciones(Pageable pageable) {
		return publicacionRepository.findAll(pageable).map(PublicacionResponseDTO::new);
	}

	@Transactional(readOnly = true)
	public PublicacionResponseDTO getPublicacionById(Long id) {
		Publicacion publicacion = publicacionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Publicación no encontrada"));
		return new PublicacionResponseDTO(publicacion);
	}

	@Transactional
	public PublicacionResponseDTO createPublicacion(PublicacionRequestDTO request) {
		Usuario vendedor = usuarioRepository.findById(request.getVendedorId())
				.orElseThrow(() -> new ResourceNotFoundException("Vendedor no encontrado"));

		Producto producto = new Producto(request.getProducto().getNombre(), request.getProducto().getDescripcion(),
				request.getProducto().getHistoria(), request.getProducto().getPrecio(),
				request.getProducto().getStock(), request.getProducto().getCategoria(),
				request.getProducto().getImagenUrl());

		Publicacion publicacion = new Publicacion(producto, vendedor, EstadoPublicacion.ACTIVA, LocalDateTime.now());

		publicacion = publicacionRepository.save(publicacion);
		return new PublicacionResponseDTO(publicacion);
	}

	@Transactional
	public PublicacionResponseDTO updateEstado(Long id, UpdateEstadoRequestDTO request) {
		Publicacion publicacion = publicacionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Publicación no encontrada"));

		publicacion.setEstado(request.getEstado());
		publicacion = publicacionRepository.save(publicacion);

		return new PublicacionResponseDTO(publicacion);
	}

	@Transactional
	public void deletePublicacion(Long id) {
		Publicacion publicacion = publicacionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Publicación no encontrada"));
		publicacionRepository.delete(publicacion);
	}
}
