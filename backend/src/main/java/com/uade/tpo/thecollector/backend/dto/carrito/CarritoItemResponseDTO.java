package com.uade.tpo.thecollector.backend.dto.carrito;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.uade.tpo.thecollector.backend.model.CarritoItem;

public class CarritoItemResponseDTO {

	private Long id;
	private Long publicacionId;
	private String nombreProducto;
	private BigDecimal precio;
	private String imagenUrl;
	private LocalDateTime fechaAgregado;

	public CarritoItemResponseDTO() {
	}

	public CarritoItemResponseDTO(CarritoItem item) {
		this.id = item.getId();
		this.publicacionId = item.getPublicacion().getId();
		this.nombreProducto = item.getPublicacion().getProducto().getNombre();
		this.precio = item.getPublicacion().getProducto().getPrecio();
		this.imagenUrl = item.getPublicacion().getProducto().getImagenUrl();
		this.fechaAgregado = item.getFechaAgregado();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getPublicacionId() {
		return publicacionId;
	}

	public void setPublicacionId(Long publicacionId) {
		this.publicacionId = publicacionId;
	}

	public String getNombreProducto() {
		return nombreProducto;
	}

	public void setNombreProducto(String nombreProducto) {
		this.nombreProducto = nombreProducto;
	}

	public BigDecimal getPrecio() {
		return precio;
	}

	public void setPrecio(BigDecimal precio) {
		this.precio = precio;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public LocalDateTime getFechaAgregado() {
		return fechaAgregado;
	}

	public void setFechaAgregado(LocalDateTime fechaAgregado) {
		this.fechaAgregado = fechaAgregado;
	}
}
