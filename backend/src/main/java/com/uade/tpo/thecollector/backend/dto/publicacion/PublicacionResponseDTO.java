package com.uade.tpo.thecollector.backend.dto.publicacion;

import java.time.LocalDateTime;
import com.uade.tpo.thecollector.backend.dto.producto.ProductoResponseDTO;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;
import com.uade.tpo.thecollector.backend.model.Publicacion;


public class PublicacionResponseDTO {
	private Long id;
	private Long vendedorId;
	private EstadoPublicacion estado;
	private LocalDateTime fechaPublicacion;
	private ProductoResponseDTO producto;

	public PublicacionResponseDTO() {
	}

	public PublicacionResponseDTO(Publicacion publicacion) {
		this.id = publicacion.getId();
		this.vendedorId = publicacion.getVendedor().getId();
		this.estado = publicacion.getEstado();
		this.fechaPublicacion = publicacion.getFechaPublicacion();
		this.producto = new ProductoResponseDTO(publicacion.getProducto());
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

	public Long getVendedorId() {
		return vendedorId;
	}
	public void setVendedorId(Long vendedorId) {
		this.vendedorId = vendedorId;
	}

	public EstadoPublicacion getEstado() {
		return estado;
	}
	public void setEstado(EstadoPublicacion estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaPublicacion() {
		return fechaPublicacion;
	}
	public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public ProductoResponseDTO getProducto() {
		return producto;
	}
	public void setProducto(ProductoResponseDTO producto) {
		this.producto = producto;
	}
}
