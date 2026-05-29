package com.uade.tpo.thecollector.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.thecollector.backend.model.EstadoOferta;
import com.uade.tpo.thecollector.backend.model.Oferta;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Usuario;

public interface OfertaRepository extends JpaRepository<Oferta, Long> {

	List<Oferta> findByComprador(Usuario comprador);

	@Query("SELECT o FROM Oferta o WHERE o.publicacion.vendedor = :vendedor")
	List<Oferta> findByVendedor(@Param("vendedor") Usuario vendedor);

	boolean existsByCompradorAndPublicacionAndEstadoIn(Usuario comprador, Publicacion publicacion,
			List<EstadoOferta> estados);
}
