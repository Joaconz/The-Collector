package com.uade.tpo.thecollector.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;

@RestController
@RequestMapping("/status")
public class StatusController {

	@GetMapping
	public ResponseEntity<ApiResponseDTO<Map<String, String>>> getStatus() {
		return ResponseEntity.ok(new ApiResponseDTO<>(200, "Status obtenido correctamente",
				Map.of("status", "UP", "message", "The Collector API is running."), LocalDateTime.now()));
	}
}
