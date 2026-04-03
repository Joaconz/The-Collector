package com.uade.tpo.thecollector.backend.dto.orden;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.uade.tpo.thecollector.backend.model.EstadoOrden;
import com.uade.tpo.thecollector.backend.model.Orden;


public class OrdenResponseDTO {
	private Long id;
	private Long compradorId;
	private BigDecimal total;
	private EstadoOrden estado;
	private LocalDateTime fechaCreacion;
	private List<Long> productoIds;

	public OrdenResponseDTO() {
	}

	public OrdenResponseDTO(Orden orden) {
		this.id = orden.getId();
		this.compradorId = orden.getComprador().getId();
		this.total = orden.getTotal();
		this.estado = orden.getEstado();
		this.fechaCreacion = orden.getFechaCreacion();
		this.productoIds = orden.getItems().stream().map(item -> item.getProducto().getId())
				.collect(Collectors.toList());
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

	public Long getCompradorId() {
		return compradorId;
	}
	public void setCompradorId(Long compradorId) {
		this.compradorId = compradorId;
	}

	public BigDecimal getTotal() {
		return total;
	}
	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public EstadoOrden getEstado() {
		return estado;
	}
	public void setEstado(EstadoOrden estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}
	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public List<Long> getProductoIds() {
		return productoIds;
	}
	public void setProductoIds(List<Long> productoIds) {
		this.productoIds = productoIds;
	}
}
