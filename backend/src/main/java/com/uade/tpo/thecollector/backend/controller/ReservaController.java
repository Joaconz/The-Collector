package com.uade.tpo.thecollector.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;
import com.uade.tpo.thecollector.backend.dto.reserva.ReservaRequestDTO;
import com.uade.tpo.thecollector.backend.dto.reserva.ReservaResponseDTO;
import com.uade.tpo.thecollector.backend.service.ReservaService;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

	private final ReservaService reservaService;

	public ReservaController(ReservaService reservaService) {
		this.reservaService = reservaService;
	}

	@PostMapping
	public ResponseEntity<ApiResponseDTO<ReservaResponseDTO>> crearReserva(
			@Valid @RequestBody ReservaRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO<>(HttpStatus.CREATED.value(),
				"Reserva creada correctamente", reservaService.crearReserva(request), LocalDateTime.now()));
	}

	@GetMapping("/comprador")
	public ResponseEntity<ApiResponseDTO<List<ReservaResponseDTO>>> getMisReservasComprador() {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Reservas obtenidas correctamente",
				reservaService.getMisReservasComprador(), LocalDateTime.now()));
	}

	@GetMapping("/vendedor")
	public ResponseEntity<ApiResponseDTO<List<ReservaResponseDTO>>> getMisReservasVendedor() {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Reservas obtenidas correctamente",
				reservaService.getMisReservasVendedor(), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/confirmar")
	public ResponseEntity<ApiResponseDTO<ReservaResponseDTO>> confirmarReserva(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Reserva confirmada correctamente",
				reservaService.confirmarReserva(id), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/rechazar")
	public ResponseEntity<ApiResponseDTO<ReservaResponseDTO>> rechazarReserva(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Reserva rechazada correctamente",
				reservaService.rechazarReserva(id), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/cancelar")
	public ResponseEntity<ApiResponseDTO<ReservaResponseDTO>> cancelarReserva(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Reserva cancelada correctamente",
				reservaService.cancelarReserva(id), LocalDateTime.now()));
	}
}
