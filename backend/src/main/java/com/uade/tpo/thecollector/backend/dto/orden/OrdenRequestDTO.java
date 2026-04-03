package com.uade.tpo.thecollector.backend.dto.orden;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;


public class OrdenRequestDTO {

	@NotNull(message = "El comprador es obligatorio")
	private Long compradorId;

	@NotEmpty(message = "Debe haber al menos un item en la orden")
	private List<Long> productoIds;

	public Long getCompradorId() {
		return compradorId;
	}
	public void setCompradorId(Long compradorId) {
		this.compradorId = compradorId;
	}

	public List<Long> getProductoIds() {
		return productoIds;
	}
	public void setProductoIds(List<Long> productoIds) {
		this.productoIds = productoIds;
	}
}
