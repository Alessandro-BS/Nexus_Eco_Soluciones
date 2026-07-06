package com.nexus.eco.nexus_eco_api.repository.sqlserver;
import com.nexus.eco.nexus_eco_api.model.entity.SolicitudServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Integer> {
}
