package com.uade.tpo.thecollector.backend.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.uade.tpo.thecollector.backend.model.Rol;


public class RegisterRequestDTO {

	@NotBlank(message = "El nombre no puede estar vacío")
	private String nombre;

	@NotBlank(message = "El email no puede estar vacío")
	@Email(message = "El email debe ser válido")
	private String email;

	@NotBlank(message = "La contraseña no puede estar vacía")
	private String password;

	@NotNull(message = "El rol no puede ser nulo")
	private Rol rol;

	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public Rol getRol() {
		return rol;
	}
	public void setRol(Rol rol) {
		this.rol = rol;
	}
}
