package com.uade.tpo.thecollector.backend.dto.puja;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PujaRequestDTO {

	@NotNull(message = "El monto es obligatorio")
	@Positive(message = "El monto debe ser mayor a 0")
	private BigDecimal monto;

	public BigDecimal getMonto() {
		return monto;
	}

	public void setMonto(BigDecimal monto) {
		this.monto = monto;
	}
}
