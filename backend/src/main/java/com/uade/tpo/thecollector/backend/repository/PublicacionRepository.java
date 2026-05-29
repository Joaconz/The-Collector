package com.uade.tpo.thecollector.backend.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.thecollector.backend.model.Categoria;
import com.uade.tpo.thecollector.backend.model.EstadoPublicacion;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Usuario;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {

	@Query("""
			SELECT p FROM Publicacion p
			WHERE p.estado = 'ACTIVA'
			AND (:categoria IS NULL OR p.producto.categoria = :categoria)
			AND (:precioMin IS NULL OR p.producto.precio >= :precioMin)
			AND (:precioMax IS NULL OR p.producto.precio <= :precioMax)
			""")
	Page<Publicacion> findCatalogo(@Param("categoria") Categoria categoria, @Param("precioMin") BigDecimal precioMin,
			@Param("precioMax") BigDecimal precioMax, Pageable pageable);

	List<Publicacion> findByVendedor(Usuario vendedor);

	boolean existsByIdAndEstado(Long id, EstadoPublicacion estado);
}
