package com.uade.tpo.thecollector.backend.service;

import java.time.LocalDate;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.authenticationManager = authenticationManager;
	}

	@Transactional
	public AuthResponseDTO register(RegisterRequestDTO request) {
		if (usuarioRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("El email ya está registrado");
		}

		Usuario usuario = new Usuario(request.getNombre(), request.getEmail(),
				passwordEncoder.encode(request.getPassword()), request.getRol(), LocalDate.now());

		usuario = usuarioRepository.save(usuario);

		String token = jwtService.generateToken(usuario);

		return new AuthResponseDTO(token, usuario.getRol(), usuario.getNombre(), usuario.getId());
	}

	@Transactional(readOnly = true)
	public AuthResponseDTO login(LoginRequestDTO request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmail(),
						request.getPassword()
				)
		);

		Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("Credenciales inválidas"));

		String token = jwtService.generateToken(usuario);

		return new AuthResponseDTO(token, usuario.getRol(), usuario.getNombre(), usuario.getId());
	}
}
