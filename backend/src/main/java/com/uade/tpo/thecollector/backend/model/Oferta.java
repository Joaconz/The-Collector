package com.uade.tpo.thecollector.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "ofertas")
public class Oferta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "comprador_id")
	private Usuario comprador;

	@ManyToOne(optional = false)
	@JoinColumn(name = "publicacion_id")
	private Publicacion publicacion;

	@Column(name = "precio_ofertado", nullable = false)
	private BigDecimal precioOfertado;

	@Column(name = "precio_contraoferta")
	private BigDecimal precioContraoferta;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoOferta estado;

	@Column(name = "fecha_oferta", nullable = false)
	private LocalDateTime fechaOferta;

	public Oferta() {
	}

	public Oferta(Usuario comprador, Publicacion publicacion, BigDecimal precioOfertado, LocalDateTime fechaOferta) {
		this.comprador = comprador;
		this.publicacion = publicacion;
		this.precioOfertado = precioOfertado;
		this.estado = EstadoOferta.PENDIENTE;
		this.fechaOferta = fechaOferta;
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

	public BigDecimal getPrecioOfertado() {
		return precioOfertado;
	}

	public void setPrecioOfertado(BigDecimal precioOfertado) {
		this.precioOfertado = precioOfertado;
	}

	public BigDecimal getPrecioContraoferta() {
		return precioContraoferta;
	}

	public void setPrecioContraoferta(BigDecimal precioContraoferta) {
		this.precioContraoferta = precioContraoferta;
	}

	public EstadoOferta getEstado() {
		return estado;
	}

	public void setEstado(EstadoOferta estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaOferta() {
		return fechaOferta;
	}

	public void setFechaOferta(LocalDateTime fechaOferta) {
		this.fechaOferta = fechaOferta;
	}
}
