package com.uade.tpo.thecollector.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.thecollector.backend.dto.ApiResponseDTO;
import com.uade.tpo.thecollector.backend.dto.oferta.ContraofertaRequestDTO;
import com.uade.tpo.thecollector.backend.dto.oferta.OfertaRequestDTO;
import com.uade.tpo.thecollector.backend.dto.oferta.OfertaResponseDTO;
import com.uade.tpo.thecollector.backend.dto.reserva.ReservaResponseDTO;
import com.uade.tpo.thecollector.backend.service.OfertaService;

@RestController
@RequestMapping("/api/ofertas")
public class OfertaController {

	private final OfertaService ofertaService;

	public OfertaController(OfertaService ofertaService) {
		this.ofertaService = ofertaService;
	}

	@PostMapping
	public ResponseEntity<ApiResponseDTO<OfertaResponseDTO>> hacerOferta(@Valid @RequestBody OfertaRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO<>(HttpStatus.CREATED.value(),
				"Oferta enviada correctamente", ofertaService.hacerOferta(request), LocalDateTime.now()));
	}

	@GetMapping("/comprador")
	public ResponseEntity<ApiResponseDTO<List<OfertaResponseDTO>>> getMisOfertasComprador() {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Ofertas obtenidas correctamente",
				ofertaService.getMisOfertasComprador(), LocalDateTime.now()));
	}

	@GetMapping("/vendedor")
	public ResponseEntity<ApiResponseDTO<List<OfertaResponseDTO>>> getMisOfertasVendedor() {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Ofertas obtenidas correctamente",
				ofertaService.getMisOfertasVendedor(), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/aceptar")
	public ResponseEntity<ApiResponseDTO<ReservaResponseDTO>> aceptarOferta(@PathVariable Long id) {
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO<>(HttpStatus.CREATED.value(),
				"Oferta aceptada y reserva creada", ofertaService.aceptarOferta(id), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/rechazar")
	public ResponseEntity<ApiResponseDTO<OfertaResponseDTO>> rechazarOferta(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Oferta rechazada correctamente",
				ofertaService.rechazarOferta(id), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/contraofertar")
	public ResponseEntity<ApiResponseDTO<OfertaResponseDTO>> contraofertar(@PathVariable Long id,
			@Valid @RequestBody ContraofertaRequestDTO request) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Contraoferta enviada correctamente",
				ofertaService.contraofertar(id, request), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/aceptar-contraoferta")
	public ResponseEntity<ApiResponseDTO<ReservaResponseDTO>> aceptarContraoferta(@PathVariable Long id) {
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO<>(HttpStatus.CREATED.value(),
				"Contraoferta aceptada y reserva creada", ofertaService.aceptarContraoferta(id), LocalDateTime.now()));
	}

	@PatchMapping("/{id}/cancelar")
	public ResponseEntity<ApiResponseDTO<OfertaResponseDTO>> cancelarOferta(@PathVariable Long id) {
		return ResponseEntity.ok(new ApiResponseDTO<>(HttpStatus.OK.value(), "Oferta cancelada correctamente",
				ofertaService.cancelarOferta(id), LocalDateTime.now()));
	}
}
