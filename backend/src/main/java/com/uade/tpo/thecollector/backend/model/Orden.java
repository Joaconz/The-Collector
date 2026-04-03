package com.uade.tpo.thecollector.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;


@Entity
@Table(name = "ordenes")
public class Orden {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "comprador_id")
	private Usuario comprador;

	@Column(nullable = false)
	private BigDecimal total;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoOrden estado;

	@Column(name = "fecha_creacion", nullable = false)
	private LocalDateTime fechaCreacion;

	@OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrdenItem> items = new ArrayList<>();

	public Orden() {
	}

	public Orden(Usuario comprador, BigDecimal total, EstadoOrden estado, LocalDateTime fechaCreacion) {
		this.comprador = comprador;
		this.total = total;
		this.estado = estado;
		this.fechaCreacion = fechaCreacion;
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

	public BigDecimal getTotal() {
		return total;
	}
	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public EstadoOrden getEstado() {
		return estado;
	}
	public void setEstado(EstadoOrden estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}
	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public List<OrdenItem> getItems() {
		return items;
	}
	public void addItem(OrdenItem item) {
		items.add(item);
		item.setOrden(this);
	}
}
