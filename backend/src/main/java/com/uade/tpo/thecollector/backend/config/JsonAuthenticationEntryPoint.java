package com.uade.tpo.thecollector.backend.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class JsonAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().write("""
				{
				  "status": %d,
				  "error": "Unauthorized",
				  "message": "No autenticado o token inválido",
				  "path": "%s",
				  "timestamp": "%s"
				}
				""".formatted(
				HttpStatus.UNAUTHORIZED.value(),
				request.getRequestURI(),
				LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
		));
	}
}
