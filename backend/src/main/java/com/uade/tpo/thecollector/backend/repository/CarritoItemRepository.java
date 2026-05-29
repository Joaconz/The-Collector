package com.uade.tpo.thecollector.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.thecollector.backend.model.CarritoItem;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Usuario;

public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {

	List<CarritoItem> findByComprador(Usuario comprador);

	Optional<CarritoItem> findByCompradorAndPublicacion(Usuario comprador, Publicacion publicacion);

	boolean existsByCompradorAndPublicacion(Usuario comprador, Publicacion publicacion);

	void deleteByComprador(Usuario comprador);
}
