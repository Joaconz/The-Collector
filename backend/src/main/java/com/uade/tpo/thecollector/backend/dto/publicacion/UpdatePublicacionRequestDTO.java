package com.uade.tpo.thecollector.backend.dto.publicacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

	private List<String> imagenes;
	private Map<String, String> especificaciones;

	// Solo para modo SUBASTA
	@Future(message = "La fecha límite debe ser en el futuro")
	private LocalDateTime fechaLimiteSubasta;

	@Positive(message = "El incremento mínimo debe ser mayor a 0")
	private BigDecimal incrementoMinimo;

	private Boolean destacado;

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

	public List<String> getImagenes() {
		return imagenes;
	}

	public void setImagenes(List<String> imagenes) {
		this.imagenes = imagenes;
	}

	public Map<String, String> getEspecificaciones() {
		return especificaciones;
	}

	public void setEspecificaciones(Map<String, String> especificaciones) {
		this.especificaciones = especificaciones;
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
