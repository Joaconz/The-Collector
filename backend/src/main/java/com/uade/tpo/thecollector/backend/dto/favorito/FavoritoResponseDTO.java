package com.uade.tpo.thecollector.backend.dto.favorito;

import java.time.LocalDateTime;

import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionResponseDTO;
import com.uade.tpo.thecollector.backend.model.Favorito;

public class FavoritoResponseDTO {

	private Long id;
	private PublicacionResponseDTO publicacion;
	private LocalDateTime fechaAgregado;

	public FavoritoResponseDTO() {
	}

	public FavoritoResponseDTO(Favorito favorito) {
		this.id = favorito.getId();
		this.publicacion = new PublicacionResponseDTO(favorito.getPublicacion());
		this.fechaAgregado = favorito.getFechaAgregado();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public PublicacionResponseDTO getPublicacion() {
		return publicacion;
	}

	public void setPublicacion(PublicacionResponseDTO publicacion) {
		this.publicacion = publicacion;
	}

	public LocalDateTime getFechaAgregado() {
		return fechaAgregado;
	}

	public void setFechaAgregado(LocalDateTime fechaAgregado) {
		this.fechaAgregado = fechaAgregado;
	}
}
