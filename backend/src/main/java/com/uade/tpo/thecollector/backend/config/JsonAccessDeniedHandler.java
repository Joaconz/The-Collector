package com.uade.tpo.thecollector.backend.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class JsonAccessDeniedHandler implements AccessDeniedHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException, ServletException {
		response.setStatus(HttpStatus.FORBIDDEN.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().write("""
				{
				  "status": %d,
				  "error": "Forbidden",
				  "message": "No tenés permisos para acceder a este recurso",
				  "path": "%s",
				  "timestamp": "%s"
				}
				""".formatted(
				HttpStatus.FORBIDDEN.value(),
				request.getRequestURI(),
				LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
		));
	}
}
