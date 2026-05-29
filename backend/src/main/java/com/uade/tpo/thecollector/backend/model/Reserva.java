package com.uade.tpo.thecollector.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "reservas")
public class Reserva {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "comprador_id")
	private Usuario comprador;

	@ManyToOne(optional = false)
	@JoinColumn(name = "publicacion_id")
	private Publicacion publicacion;

	@Column(name = "precio_acordado", nullable = false)
	private BigDecimal precioAcordado;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoReserva estado;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private OrigenReserva origen;

	@ManyToOne
	@JoinColumn(name = "oferta_id")
	private Oferta oferta;

	@ManyToOne
	@JoinColumn(name = "puja_id")
	private Puja puja;

	@Column(name = "fecha_reserva", nullable = false)
	private LocalDateTime fechaReserva;

	@Column(name = "fecha_respuesta")
	private LocalDateTime fechaRespuesta;

	public Reserva() {
	}

	public Reserva(Usuario comprador, Publicacion publicacion, BigDecimal precioAcordado, OrigenReserva origen,
			LocalDateTime fechaReserva) {
		this.comprador = comprador;
		this.publicacion = publicacion;
		this.precioAcordado = precioAcordado;
		this.estado = EstadoReserva.PENDIENTE;
		this.origen = origen;
		this.fechaReserva = fechaReserva;
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

	public BigDecimal getPrecioAcordado() {
		return precioAcordado;
	}

	public void setPrecioAcordado(BigDecimal precioAcordado) {
		this.precioAcordado = precioAcordado;
	}

	public EstadoReserva getEstado() {
		return estado;
	}

	public void setEstado(EstadoReserva estado) {
		this.estado = estado;
	}

	public OrigenReserva getOrigen() {
		return origen;
	}

	public void setOrigen(OrigenReserva origen) {
		this.origen = origen;
	}

	public Oferta getOferta() {
		return oferta;
	}

	public void setOferta(Oferta oferta) {
		this.oferta = oferta;
	}

	public Puja getPuja() {
		return puja;
	}

	public void setPuja(Puja puja) {
		this.puja = puja;
	}

	public LocalDateTime getFechaReserva() {
		return fechaReserva;
	}

	public void setFechaReserva(LocalDateTime fechaReserva) {
		this.fechaReserva = fechaReserva;
	}

	public LocalDateTime getFechaRespuesta() {
		return fechaRespuesta;
	}

	public void setFechaRespuesta(LocalDateTime fechaRespuesta) {
		this.fechaRespuesta = fechaRespuesta;
	}
}
