package com.uade.tpo.thecollector.backend.service;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.thecollector.backend.exception.ResourceNotFoundException;
import com.uade.tpo.thecollector.backend.dto.usuario.AuthResponseDTO;
import com.uade.tpo.thecollector.backend.dto.usuario.LoginRequestDTO;
import com.uade.tpo.thecollector.backend.dto.usuario.RegisterRequestDTO;
import com.uade.tpo.thecollector.backend.model.Usuario;
import com.uade.tpo.thecollector.backend.repository.UsuarioRepository;

@Service
public class AuthService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public AuthResponseDTO register(RegisterRequestDTO request) {
		if (usuarioRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("El email ya está registrado");
		}

		Usuario usuario = new Usuario(request.getNombre(), request.getEmail(),
				passwordEncoder.encode(request.getPassword()), request.getRol(), LocalDate.now());

		usuario = usuarioRepository.save(usuario);

		// JWT mock (To be replaced with stateless JWT token generation)
		String mockToken = UUID.randomUUID().toString();

		return new AuthResponseDTO(mockToken, usuario.getRol(), usuario.getNombre(), usuario.getId());
	}

	@Transactional(readOnly = true)
	public AuthResponseDTO login(LoginRequestDTO request) {
		Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("Credenciales inválidas"));

		if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
			throw new IllegalArgumentException("Credenciales inválidas");
		}

		// JWT mock
		String mockToken = UUID.randomUUID().toString();

		return new AuthResponseDTO(mockToken, usuario.getRol(), usuario.getNombre(), usuario.getId());
	}
}
