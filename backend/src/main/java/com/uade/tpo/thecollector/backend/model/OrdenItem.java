package com.uade.tpo.thecollector.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.*;


@Entity
@Table(name = "orden_items")
public class OrdenItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "orden_id")
	private Orden orden;

	@ManyToOne(optional = false)
	@JoinColumn(name = "producto_id")
	private Producto producto;

	@Column(nullable = false)
	private Integer cantidad;

	@Column(nullable = false)
	private BigDecimal precioUnitario;

	public OrdenItem() {
	}

	public OrdenItem(Producto producto, Integer cantidad, BigDecimal precioUnitario) {
		this.producto = producto;
		this.cantidad = cantidad;
		this.precioUnitario = precioUnitario;
	}

	public Long getId() {
		return id;
	}

	public Orden getOrden() {
		return orden;
	}
	public void setOrden(Orden orden) {
		this.orden = orden;
	}

	public Producto getProducto() {
		return producto;
	}
	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	public Integer getCantidad() {
		return cantidad;
	}
	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public BigDecimal getPrecioUnitario() {
		return precioUnitario;
	}
	public void setPrecioUnitario(BigDecimal precioUnitario) {
		this.precioUnitario = precioUnitario;
	}
}
