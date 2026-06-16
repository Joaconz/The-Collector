package com.uade.tpo.thecollector.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "publicaciones")
@SQLRestriction("activo = true")
public class Publicacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Boolean activo = true;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "producto_id", referencedColumnName = "id")
	private Producto producto;

	@ManyToOne
	@JoinColumn(name = "vendedor_id", nullable = false)
	private Usuario vendedor;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoPublicacion estado;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ModoPublicacion modo;

	@Column(name = "precio_base")
	private BigDecimal precioBase;

	@Column(name = "fecha_limite_subasta")
	private LocalDateTime fechaLimiteSubasta;

	@Enumerated(EnumType.STRING)
	@Column(name = "estado_subasta")
	private EstadoSubasta estadoSubasta;

	@Column(name = "fecha_publicacion", nullable = false)
	private LocalDateTime fechaPublicacion;

	@Column(nullable = false)
	private Boolean destacado = false;

	@Column(name = "incremento_minimo")
	private BigDecimal incrementoMinimo;

	public Publicacion() {
	}

	public Publicacion(Producto producto, Usuario vendedor, EstadoPublicacion estado, ModoPublicacion modo,
			LocalDateTime fechaPublicacion) {
		this.producto = producto;
		this.vendedor = vendedor;
		this.estado = estado;
		this.modo = modo;
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

	public ModoPublicacion getModo() {
		return modo;
	}

	public void setModo(ModoPublicacion modo) {
		this.modo = modo;
	}

	public BigDecimal getPrecioBase() {
		return precioBase;
	}

	public void setPrecioBase(BigDecimal precioBase) {
		this.precioBase = precioBase;
	}

	public LocalDateTime getFechaLimiteSubasta() {
		return fechaLimiteSubasta;
	}

	public void setFechaLimiteSubasta(LocalDateTime fechaLimiteSubasta) {
		this.fechaLimiteSubasta = fechaLimiteSubasta;
	}

	public EstadoSubasta getEstadoSubasta() {
		return estadoSubasta;
	}

	public void setEstadoSubasta(EstadoSubasta estadoSubasta) {
		this.estadoSubasta = estadoSubasta;
	}

	public LocalDateTime getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public Boolean getActivo() {
		return activo;
	}

	public void setActivo(Boolean activo) {
		this.activo = activo;
	}

	public Boolean getDestacado() {
		return destacado;
	}

	public void setDestacado(Boolean destacado) {
		this.destacado = destacado;
	}

	public BigDecimal getIncrementoMinimo() {
		return incrementoMinimo;
	}

	public void setIncrementoMinimo(BigDecimal incrementoMinimo) {
		this.incrementoMinimo = incrementoMinimo;
	}
}
