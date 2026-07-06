package com.nexus.eco.nexus_eco_api.repository.sqlserver;
import com.nexus.eco.nexus_eco_api.model.entity.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Integer> {
}
