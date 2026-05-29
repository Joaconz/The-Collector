package com.uade.tpo.thecollector.backend.dto.reserva;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.uade.tpo.thecollector.backend.model.EstadoReserva;
import com.uade.tpo.thecollector.backend.model.OrigenReserva;
import com.uade.tpo.thecollector.backend.model.Reserva;

public class ReservaResponseDTO {

	private Long id;
	private Long compradorId;
	private String compradorNombre;
	private Long publicacionId;
	private String nombreProducto;
	private BigDecimal precioAcordado;
	private EstadoReserva estado;
	private OrigenReserva origen;
	private LocalDateTime fechaReserva;
	private LocalDateTime fechaRespuesta;

	public ReservaResponseDTO() {
	}

	public ReservaResponseDTO(Reserva reserva) {
		this.id = reserva.getId();
		this.compradorId = reserva.getComprador().getId();
		this.compradorNombre = reserva.getComprador().getNombre();
		this.publicacionId = reserva.getPublicacion().getId();
		this.nombreProducto = reserva.getPublicacion().getProducto().getNombre();
		this.precioAcordado = reserva.getPrecioAcordado();
		this.estado = reserva.getEstado();
		this.origen = reserva.getOrigen();
		this.fechaReserva = reserva.getFechaReserva();
		this.fechaRespuesta = reserva.getFechaRespuesta();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCompradorId() {
		return compradorId;
	}

	public void setCompradorId(Long compradorId) {
		this.compradorId = compradorId;
	}

	public String getCompradorNombre() {
		return compradorNombre;
	}

	public void setCompradorNombre(String compradorNombre) {
		this.compradorNombre = compradorNombre;
	}

	public Long getPublicacionId() {
		return publicacionId;
	}

	public void setPublicacionId(Long publicacionId) {
		this.publicacionId = publicacionId;
	}

	public String getNombreProducto() {
		return nombreProducto;
	}

	public void setNombreProducto(String nombreProducto) {
		this.nombreProducto = nombreProducto;
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
