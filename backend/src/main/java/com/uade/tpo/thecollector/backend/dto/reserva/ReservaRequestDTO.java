package com.uade.tpo.thecollector.backend.dto.reserva;

import jakarta.validation.constraints.NotNull;

public class ReservaRequestDTO {

	@NotNull(message = "La publicación es obligatoria")
	private Long publicacionId;

	public Long getPublicacionId() {
		return publicacionId;
	}

	public void setPublicacionId(Long publicacionId) {
		this.publicacionId = publicacionId;
	}
}
