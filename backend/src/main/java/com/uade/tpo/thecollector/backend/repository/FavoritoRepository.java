package com.uade.tpo.thecollector.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.thecollector.backend.model.Favorito;
import com.uade.tpo.thecollector.backend.model.Publicacion;
import com.uade.tpo.thecollector.backend.model.Usuario;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

	List<Favorito> findByComprador(Usuario comprador);

	Optional<Favorito> findByCompradorAndPublicacion(Usuario comprador, Publicacion publicacion);

	boolean existsByCompradorAndPublicacion(Usuario comprador, Publicacion publicacion);
}
