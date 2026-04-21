package com.uade.tpo.thecollector.backend.exception;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
		ErrorResponseDTO error = new ErrorResponseDTO(HttpStatus.NOT_FOUND.value(), "Not Found", ex.getMessage(),
				request.getRequestURI(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex,
			HttpServletRequest request) {
		List<Map<String, String>> details = ex.getBindingResult().getFieldErrors().stream()
				.map(err -> Map.of("field", err.getField(), "message", err.getDefaultMessage()))
				.collect(Collectors.toList());

		ErrorResponseDTO error = new ErrorResponseDTO(422, "Unprocessable Entity", "Error de validación",
				request.getRequestURI(), LocalDateTime.now());
		error.setDetails(details);
		return ResponseEntity.status(422).body(error);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex, HttpServletRequest request) {
		ex.printStackTrace(); // TODO: Remover para production
		ErrorResponseDTO error = new ErrorResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
				"Ocurrió un error inesperado", request.getRequestURI(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
