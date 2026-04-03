package com.uade.tpo.thecollector.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.thecollector.backend.model.Orden;


public interface OrdenRepository extends JpaRepository<Orden, Long> {
}
