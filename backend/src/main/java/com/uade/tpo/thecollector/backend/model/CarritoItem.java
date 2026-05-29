package com.uade.tpo.thecollector.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "carrito_items", uniqueConstraints = {
		@UniqueConstraint(columnNames = {"comprador_id", "publicacion_id"})})
public class CarritoItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "comprador_id")
	private Usuario comprador;

	@ManyToOne(optional = false)
	@JoinColumn(name = "publicacion_id")
	private Publicacion publicacion;

	@Column(name = "fecha_agregado", nullable = false)
	private LocalDateTime fechaAgregado;

	public CarritoItem() {
	}

	public CarritoItem(Usuario comprador, Publicacion publicacion, LocalDateTime fechaAgregado) {
		this.comprador = comprador;
		this.publicacion = publicacion;
		this.fechaAgregado = fechaAgregado;
	}

	public Long getId() {
		return id;
	}

	public Usuario getComprador() {
		return comprador;
	}

	public void setComprador(Usuario comprador) {
		this.comprador = comprador;
	}

	public Publicacion getPublicacion() {
		return publicacion;
	}

	public void setPublicacion(Publicacion publicacion) {
		this.publicacion = publicacion;
	}

	public LocalDateTime getFechaAgregado() {
		return fechaAgregado;
	}

	public void setFechaAgregado(LocalDateTime fechaAgregado) {
		this.fechaAgregado = fechaAgregado;
	}
}
