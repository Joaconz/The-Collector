package com.uade.tpo.thecollector.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.thecollector.backend.model.Publicacion;


public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
}
