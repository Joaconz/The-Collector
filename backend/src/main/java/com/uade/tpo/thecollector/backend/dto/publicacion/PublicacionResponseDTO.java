package com.uade.tpo.thecollector.backend.dto.publicacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.uade.tpo.thecollector.backend.dto.producto.ProductoResponseDTO;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;
import com.uade.tpo.thecollector.backend.model.EstadoSubasta;
import com.uade.tpo.thecollector.backend.model.ModoPublicacion;
import com.uade.tpo.thecollector.backend.model.Publicacion;

public class PublicacionResponseDTO {

	private Long id;
	private Long vendedorId;
	private String vendedorNombre;
	private EstadoPublicacion estado;
	private ModoPublicacion modo;
	private BigDecimal precioBase;
	private LocalDateTime fechaLimiteSubasta;
	private EstadoSubasta estadoSubasta;
	private LocalDateTime fechaPublicacion;
	private ProductoResponseDTO producto;
	private String ref;
	private Boolean destacado;
	private BigDecimal incrementoMinimo;
	private BigDecimal pujaActual;

	public PublicacionResponseDTO() {
	}

	public PublicacionResponseDTO(Publicacion publicacion) {
		this.id = publicacion.getId();
		this.vendedorId = publicacion.getVendedor().getId();
		this.vendedorNombre = publicacion.getVendedor().getNombre();
		this.estado = publicacion.getEstado();
		this.modo = publicacion.getModo();
		this.precioBase = publicacion.getPrecioBase();
		this.fechaLimiteSubasta = publicacion.getFechaLimiteSubasta();
		this.estadoSubasta = publicacion.getEstadoSubasta();
		this.fechaPublicacion = publicacion.getFechaPublicacion();
		this.producto = new ProductoResponseDTO(publicacion.getProducto());
		this.ref = "REF-" + this.id;
		this.destacado = publicacion.getDestacado();
		this.incrementoMinimo = publicacion.getIncrementoMinimo();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getVendedorId() {
		return vendedorId;
	}

	public void setVendedorId(Long vendedorId) {
		this.vendedorId = vendedorId;
	}

	public String getVendedorNombre() {
		return vendedorNombre;
	}

	public void setVendedorNombre(String vendedorNombre) {
		this.vendedorNombre = vendedorNombre;
	}

	public EstadoPublicacion getEstado() {
		return estado;
	}

	public void setEstado(EstadoPublicacion estado) {
		this.estado = estado;
	}

	public ModoPublicacion getModo() {
		return modo;
	}

	public void setModo(ModoPublicacion modo) {
		this.modo = modo;
	}

	public BigDecimal getPrecioBase() {
		return precioBase;
	}

	public void setPrecioBase(BigDecimal precioBase) {
		this.precioBase = precioBase;
	}

	public LocalDateTime getFechaLimiteSubasta() {
		return fechaLimiteSubasta;
	}

	public void setFechaLimiteSubasta(LocalDateTime fechaLimiteSubasta) {
		this.fechaLimiteSubasta = fechaLimiteSubasta;
	}

	public EstadoSubasta getEstadoSubasta() {
		return estadoSubasta;
	}

	public void setEstadoSubasta(EstadoSubasta estadoSubasta) {
		this.estadoSubasta = estadoSubasta;
	}

	public LocalDateTime getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public ProductoResponseDTO getProducto() {
		return producto;
	}

	public void setProducto(ProductoResponseDTO producto) {
		this.producto = producto;
	}

	public String getRef() {
		return ref;
	}

	public void setRef(String ref) {
		this.ref = ref;
	}

	public Boolean getDestacado() {
		return destacado;
	}

	public void setDestacado(Boolean destacado) {
		this.destacado = destacado;
	}

	public BigDecimal getIncrementoMinimo() {
		return incrementoMinimo;
	}

	public void setIncrementoMinimo(BigDecimal incrementoMinimo) {
		this.incrementoMinimo = incrementoMinimo;
	}

	public BigDecimal getPujaActual() {
		return pujaActual;
	}

	public void setPujaActual(BigDecimal pujaActual) {
		this.pujaActual = pujaActual;
	}
}
