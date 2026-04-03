package com.uade.tpo.thecollector.backend.dto.publicacion;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import com.uade.tpo.thecollector.backend.dto.producto.ProductoRequestDTO;


public class PublicacionRequestDTO {

	@NotNull(message = "El vendedor es obligatorio")
	private Long vendedorId;

	@Valid
	@NotNull(message = "Los datos del producto son obligatorios")
	private ProductoRequestDTO producto;

	public Long getVendedorId() {
		return vendedorId;
	}
	public void setVendedorId(Long vendedorId) {
		this.vendedorId = vendedorId;
	}

	public ProductoRequestDTO getProducto() {
		return producto;
	}
	public void setProducto(ProductoRequestDTO producto) {
		this.producto = producto;
	}
}
