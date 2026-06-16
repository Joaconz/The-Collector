package com.uade.tpo.thecollector.backend.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.*;

import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "productos")
@SQLRestriction("activo = true")
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Boolean activo = true;

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

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Categoria categoria;

	@Column(name = "imagen_url")
	private String imagenUrl;

	@ElementCollection
	@CollectionTable(name = "producto_especificaciones", joinColumns = @JoinColumn(name = "producto_id"))
	@MapKeyColumn(name = "clave")
	@Column(name = "valor")
	private Map<String, String> especificaciones = new LinkedHashMap<>();

	@ElementCollection
	@CollectionTable(name = "producto_imagenes", joinColumns = @JoinColumn(name = "producto_id"))
	@OrderColumn(name = "orden")
	@Column(name = "url")
	private List<String> imagenes = new ArrayList<>();

	public Producto() {
	}

	public Producto(String nombre, String descripcion, String historia, BigDecimal precio, Integer stock,
			Categoria categoria, String imagenUrl) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.historia = historia;
		this.precio = precio;
		this.stock = stock;
		this.categoria = categoria;
		this.imagenUrl = imagenUrl;
	}

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

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public Boolean getActivo() {
		return activo;
	}

	public void setActivo(Boolean activo) {
		this.activo = activo;
	}

	public Map<String, String> getEspecificaciones() {
		return especificaciones;
	}

	public void setEspecificaciones(Map<String, String> especificaciones) {
		this.especificaciones = especificaciones;
	}

	public List<String> getImagenes() {
		return imagenes;
	}

	public void setImagenes(List<String> imagenes) {
		this.imagenes = imagenes;
	}
}
