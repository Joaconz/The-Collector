package com.uade.tpo.thecollector.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.*;


@Entity
@Table(name = "productos")
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nombre;

	@Column(columnDefinition = "TEXT")
	private String descripcion;

	@Column(columnDefinition = "TEXT")
	private String historia;

	@Column(nullable = false)
	private BigDecimal precio;

	@Column(nullable = false)
	private Integer stock;

	@Column
	private String categoria;

	@Column(name = "imagen_url")
	private String imagenUrl;

	public Producto() {
	}

	public Producto(String nombre, String descripcion, String historia, BigDecimal precio, Integer stock,
			String categoria, String imagenUrl) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.historia = historia;
		this.precio = precio;
		this.stock = stock;
		this.categoria = categoria;
		this.imagenUrl = imagenUrl;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

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

	public BigDecimal getPrecio() {
		return precio;
	}
	public void setPrecio(BigDecimal precio) {
		this.precio = precio;
	}

	public Integer getStock() {
		return stock;
	}
	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public String getCategoria() {
		return categoria;
	}
	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}
	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}
}
