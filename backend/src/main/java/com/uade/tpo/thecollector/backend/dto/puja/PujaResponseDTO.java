package com.uade.tpo.thecollector.backend.dto.puja;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.uade.tpo.thecollector.backend.model.Puja;

public class PujaResponseDTO {

	private Long id;
	private String pujadorNombre;
	private BigDecimal monto;
	private LocalDateTime fechaPuja;

	public PujaResponseDTO() {
	}

	public PujaResponseDTO(Puja puja) {
		this.id = puja.getId();
		this.pujadorNombre = puja.getPujador().getNombre();
		this.monto = puja.getMonto();
		this.fechaPuja = puja.getFechaPuja();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPujadorNombre() {
		return pujadorNombre;
	}

	public void setPujadorNombre(String pujadorNombre) {
		this.pujadorNombre = pujadorNombre;
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
