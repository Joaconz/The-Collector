package com.uade.tpo.thecollector.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.thecollector.backend.model.EstadoReserva;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Reserva;
import com.uade.tpo.thecollector.backend.model.Usuario;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

	List<Reserva> findByComprador(Usuario comprador);

	@Query("SELECT r FROM Reserva r WHERE r.publicacion.vendedor = :vendedor")
	List<Reserva> findByVendedor(@Param("vendedor") Usuario vendedor);

	boolean existsByCompradorAndPublicacionAndEstado(Usuario comprador, Publicacion publicacion, EstadoReserva estado);

	boolean existsByPublicacionAndEstado(Publicacion publicacion, EstadoReserva estado);

	@Query("SELECT r FROM Reserva r WHERE r.publicacion = :publicacion AND r.estado = 'PENDIENTE'")
	List<Reserva> findPendientesByPublicacion(@Param("publicacion") Publicacion publicacion);
}
