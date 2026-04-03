package com.uade.tpo.thecollector.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;


@Entity
@Table(name = "publicaciones")
public class Publicacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "producto_id", referencedColumnName = "id")
	private Producto producto;

	@ManyToOne
	@JoinColumn(name = "vendedor_id", nullable = false)
	private Usuario vendedor;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoPublicacion estado;

	@Column(name = "fecha_publicacion", nullable = false)
	private LocalDateTime fechaPublicacion;

	public Publicacion() {
	}

	public Publicacion(Producto producto, Usuario vendedor, EstadoPublicacion estado, LocalDateTime fechaPublicacion) {
		this.producto = producto;
		this.vendedor = vendedor;
		this.estado = estado;
		this.fechaPublicacion = fechaPublicacion;
	}

	public Long getId() {
		return id;
	}

	public Producto getProducto() {
		return producto;
	}
	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	public Usuario getVendedor() {
		return vendedor;
	}
	public void setVendedor(Usuario vendedor) {
		this.vendedor = vendedor;
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
}
