package com.uade.tpo.thecollector.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.thecollector.backend.model.Producto;


public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
