package com.uade.tpo.thecollector.backend.dto.publicacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import com.uade.tpo.thecollector.backend.model.Categoria;

public class UpdatePublicacionRequestDTO {

	@NotBlank(message = "El nombre no puede estar vacío")
	private String nombre;

	private String descripcion;
	private String historia;
	private String imagenUrl;
	private Categoria categoria;

	@Positive(message = "El precio debe ser mayor a 0")
	private BigDecimal precio;

	// Solo para modo SUBASTA
	@Future(message = "La fecha límite debe ser en el futuro")
	private LocalDateTime fechaLimiteSubasta;

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getHistoria() {
		return historia;
	}

	public void setHistoria(String historia) {
		this.historia = historia;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public BigDecimal getPrecio() {
		return precio;
	}

	public void setPrecio(BigDecimal precio) {
		this.precio = precio;
	}

	public LocalDateTime getFechaLimiteSubasta() {
		return fechaLimiteSubasta;
	}

	public void setFechaLimiteSubasta(LocalDateTime fechaLimiteSubasta) {
		this.fechaLimiteSubasta = fechaLimiteSubasta;
	}
}
