package com.uade.tpo.thecollector.backend.dto.oferta;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.uade.tpo.thecollector.backend.model.EstadoOferta;
import com.uade.tpo.thecollector.backend.model.Oferta;

public class OfertaResponseDTO {

	private Long id;
	private Long compradorId;
	private String compradorNombre;
	private Long publicacionId;
	private String nombreProducto;
	private BigDecimal precioOfertado;
	private BigDecimal precioContraoferta;
	private EstadoOferta estado;
	private LocalDateTime fechaOferta;

	public OfertaResponseDTO() {
	}

	public OfertaResponseDTO(Oferta oferta) {
		this.id = oferta.getId();
		this.compradorId = oferta.getComprador().getId();
		this.compradorNombre = oferta.getComprador().getNombre();
		this.publicacionId = oferta.getPublicacion().getId();
		this.nombreProducto = oferta.getPublicacion().getProducto().getNombre();
		this.precioOfertado = oferta.getPrecioOfertado();
		this.precioContraoferta = oferta.getPrecioContraoferta();
		this.estado = oferta.getEstado();
		this.fechaOferta = oferta.getFechaOferta();
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
