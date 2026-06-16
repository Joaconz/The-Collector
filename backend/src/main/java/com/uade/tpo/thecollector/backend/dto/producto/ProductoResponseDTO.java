package com.uade.tpo.thecollector.backend.dto.producto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.uade.tpo.thecollector.backend.model.Categoria;
import com.uade.tpo.thecollector.backend.model.Producto;

public class ProductoResponseDTO {

	private Long id;
	private String nombre;
	private String descripcion;
	private String historia;
	private BigDecimal precio;
	private Integer stock;
	private Categoria categoria;
	private String imagenUrl;
	private List<String> imagenes;
	private Map<String, String> especificaciones;

	public ProductoResponseDTO() {
	}

	public ProductoResponseDTO(Producto producto) {
		this.id = producto.getId();
		this.nombre = producto.getNombre();
		this.descripcion = producto.getDescripcion();
		this.historia = producto.getHistoria();
		this.precio = producto.getPrecio();
		this.stock = producto.getStock();
		this.categoria = producto.getCategoria();
		this.imagenUrl = producto.getImagenUrl();
		this.imagenes = producto.getImagenes();
		this.especificaciones = producto.getEspecificaciones();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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
}
