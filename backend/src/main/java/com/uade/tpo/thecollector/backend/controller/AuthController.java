package com.uade.tpo.thecollector.backend.controller;

import java.time.LocalDateTime;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;
import com.uade.tpo.thecollector.backend.dto.usuario.AuthResponseDTO;
import com.uade.tpo.thecollector.backend.dto.usuario.LoginRequestDTO;
import com.uade.tpo.thecollector.backend.dto.usuario.RegisterRequestDTO;
import com.uade.tpo.thecollector.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponseDTO<AuthResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO request) {
		AuthResponseDTO response = authService.register(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponseDTO<>(HttpStatus.CREATED.value(), "Usuario registrado correctamente", response,
						LocalDateTime.now()));
	}

	@PostMapping("/login")
	public ResponseEntity<ApiResponseDTO<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
		AuthResponseDTO response = authService.login(request);
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Login exitoso", response,
				LocalDateTime.now()));
	}
}
