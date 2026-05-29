package com.uade.tpo.thecollector.backend.dto.oferta;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ContraofertaRequestDTO {

	@NotNull(message = "El precio de contraoferta es obligatorio")
	@Positive(message = "El precio de contraoferta debe ser mayor a 0")
	private BigDecimal precioContraoferta;

	public BigDecimal getPrecioContraoferta() {
		return precioContraoferta;
	}

	public void setPrecioContraoferta(BigDecimal precioContraoferta) {
		this.precioContraoferta = precioContraoferta;
	}
}
