package com.uade.tpo.thecollector.backend.dto.oferta;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OfertaRequestDTO {

	@NotNull(message = "La publicación es obligatoria")
	private Long publicacionId;

	@NotNull(message = "El precio ofertado es obligatorio")
	@Positive(message = "El precio ofertado debe ser mayor a 0")
	private BigDecimal precioOfertado;

	public Long getPublicacionId() {
		return publicacionId;
	}

	public void setPublicacionId(Long publicacionId) {
		this.publicacionId = publicacionId;
	}

	public BigDecimal getPrecioOfertado() {
		return precioOfertado;
	}

	public void setPrecioOfertado(BigDecimal precioOfertado) {
		this.precioOfertado = precioOfertado;
	}
}
