package com.uade.tpo.thecollector.backend.dto.subasta;

import java.math.BigDecimal;

import com.uade.tpo.thecollector.backend.dto.publicacion.PublicacionResponseDTO;

public class MisSubastaResponseDTO {

	private PublicacionResponseDTO publicacion;
	private BigDecimal pujaUsuario;
	private BigDecimal pujaLider;
	/** "GANADA" | "NO_ADJUDICADA" | null si la subasta sigue abierta. */
	private String resultado;

	public MisSubastaResponseDTO() {
	}

	public MisSubastaResponseDTO(PublicacionResponseDTO publicacion, BigDecimal pujaUsuario, BigDecimal pujaLider,
			String resultado) {
		this.publicacion = publicacion;
		this.pujaUsuario = pujaUsuario;
		this.pujaLider = pujaLider;
		this.resultado = resultado;
	}

	public PublicacionResponseDTO getPublicacion() {
		return publicacion;
	}

	public void setPublicacion(PublicacionResponseDTO publicacion) {
		this.publicacion = publicacion;
	}

	public BigDecimal getPujaUsuario() {
		return pujaUsuario;
	}

	public void setPujaUsuario(BigDecimal pujaUsuario) {
		this.pujaUsuario = pujaUsuario;
	}

	public BigDecimal getPujaLider() {
		return pujaLider;
	}

	public void setPujaLider(BigDecimal pujaLider) {
		this.pujaLider = pujaLider;
	}

	public String getResultado() {
		return resultado;
	}

	public void setResultado(String resultado) {
		this.resultado = resultado;
	}
}
