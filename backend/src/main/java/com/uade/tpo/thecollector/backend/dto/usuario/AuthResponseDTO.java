package com.uade.tpo.thecollector.backend.dto.usuario;
import com.uade.tpo.thecollector.backend.model.Rol;


public class AuthResponseDTO {
	private String token;
	private Rol rol;
	private String nombre;
	private Long id;

	public AuthResponseDTO() {
	}

	public AuthResponseDTO(String token, Rol rol, String nombre, Long id) {
		this.token = token;
		this.rol = rol;
		this.nombre = nombre;
		this.id = id;
	}

	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}

	public Rol getRol() {
		return rol;
	}
	public void setRol(Rol rol) {
		this.rol = rol;
	}

	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
}
