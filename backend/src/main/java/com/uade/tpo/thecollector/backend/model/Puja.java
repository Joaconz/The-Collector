package com.uade.tpo.thecollector.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "pujas")
public class Puja {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "publicacion_id")
	private Publicacion publicacion;

	@ManyToOne(optional = false)
	@JoinColumn(name = "pujador_id")
	private Usuario pujador;

	@Column(nullable = false)
	private BigDecimal monto;

	@Column(name = "fecha_puja", nullable = false)
	private LocalDateTime fechaPuja;

	public Puja() {
	}

	public Puja(Publicacion publicacion, Usuario pujador, BigDecimal monto, LocalDateTime fechaPuja) {
		this.publicacion = publicacion;
		this.pujador = pujador;
		this.monto = monto;
		this.fechaPuja = fechaPuja;
	}

	public Long getId() {
		return id;
	}

	public Publicacion getPublicacion() {
		return publicacion;
	}

	public void setPublicacion(Publicacion publicacion) {
		this.publicacion = publicacion;
	}

	public Usuario getPujador() {
		return pujador;
	}

	public void setPujador(Usuario pujador) {
		this.pujador = pujador;
	}

	public BigDecimal getMonto() {
		return monto;
	}

	public void setMonto(BigDecimal monto) {
		this.monto = monto;
	}

	public LocalDateTime getFechaPuja() {
		return fechaPuja;
	}

	public void setFechaPuja(LocalDateTime fechaPuja) {
		this.fechaPuja = fechaPuja;
	}
}
