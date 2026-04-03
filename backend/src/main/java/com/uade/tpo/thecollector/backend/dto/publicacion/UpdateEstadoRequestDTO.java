package com.uade.tpo.thecollector.backend.dto.publicacion;

import jakarta.validation.constraints.NotNull;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;


public class UpdateEstadoRequestDTO {

	@NotNull(message = "El estado es obligatorio")
	private EstadoPublicacion estado;

	public EstadoPublicacion getEstado() {
		return estado;
	}
	public void setEstado(EstadoPublicacion estado) {
		this.estado = estado;
	}
}
