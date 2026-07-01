package com.uade.tpo.thecollector.backend.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Puja;
import com.uade.tpo.thecollector.backend.model.Usuario;

public interface PujaRepository extends JpaRepository<Puja, Long> {

	List<Puja> findByPublicacionOrderByMontoDesc(Publicacion publicacion);

	@Query("SELECT p FROM Puja p WHERE p.publicacion = :publicacion ORDER BY p.monto DESC LIMIT 1")
	Optional<Puja> findPujaLider(@Param("publicacion") Publicacion publicacion);

	@Query("SELECT p FROM Puja p WHERE p.publicacion = :publicacion ORDER BY p.fechaPuja DESC LIMIT 1")
	Optional<Puja> findUltimaPuja(@Param("publicacion") Publicacion publicacion);

	boolean existsByPublicacionAndPujador(Publicacion publicacion, Usuario pujador);

	@Query("SELECT DISTINCT p.publicacion FROM Puja p WHERE p.pujador = :pujador")
	List<Publicacion> findPublicacionesParticipadas(@Param("pujador") Usuario pujador);

	@Query("SELECT MAX(p.monto) FROM Puja p WHERE p.publicacion = :publicacion AND p.pujador = :pujador")
	Optional<BigDecimal> findMaxMontoUsuario(@Param("publicacion") Publicacion publicacion,
			@Param("pujador") Usuario pujador);
}
