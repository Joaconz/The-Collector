package com.uade.tpo.thecollector.backend.dto.publicacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import com.uade.tpo.thecollector.backend.dto.producto.ProductoRequestDTO;
import com.uade.tpo.thecollector.backend.model.ModoPublicacion;

public class PublicacionRequestDTO {

	@NotNull(message = "El modo de publicación es obligatorio")
	private ModoPublicacion modo;

	@Valid
	@NotNull(message = "Los datos del producto son obligatorios")
	private ProductoRequestDTO producto;

	// Solo para modo SUBASTA
	@Positive(message = "El precio base debe ser mayor a 0")
	private BigDecimal precioBase;

	@Future(message = "La fecha límite debe ser en el futuro")
	private LocalDateTime fechaLimiteSubasta;

	@Positive(message = "El incremento mínimo debe ser mayor a 0")
	private BigDecimal incrementoMinimo;

	private Boolean destacado;

	public ModoPublicacion getModo() {
		return modo;
	}

	public void setModo(ModoPublicacion modo) {
		this.modo = modo;
	}

	public ProductoRequestDTO getProducto() {
		return producto;
	}

	public void setProducto(ProductoRequestDTO producto) {
		this.producto = producto;
	}

	public BigDecimal getPrecioBase() {
		return precioBase;
	}

	public void setPrecioBase(BigDecimal precioBase) {
		this.precioBase = precioBase;
	}

	public LocalDateTime getFechaLimiteSubasta() {
		return fechaLimiteSubasta;
	}

	public void setFechaLimiteSubasta(LocalDateTime fechaLimiteSubasta) {
		this.fechaLimiteSubasta = fechaLimiteSubasta;
	}

	public BigDecimal getIncrementoMinimo() {
		return incrementoMinimo;
	}

	public void setIncrementoMinimo(BigDecimal incrementoMinimo) {
		this.incrementoMinimo = incrementoMinimo;
	}

	public Boolean getDestacado() {
		return destacado;
	}

	public void setDestacado(Boolean destacado) {
		this.destacado = destacado;
	}
}
