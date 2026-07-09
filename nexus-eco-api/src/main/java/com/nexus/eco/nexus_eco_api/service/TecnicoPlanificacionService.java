package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.TecnicoPlanificacion;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.TecnicoPlanificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TecnicoPlanificacionService {

    @Autowired
    private TecnicoPlanificacionRepository repository;

    public List<TecnicoPlanificacion> findAll() {
        return repository.findAll();
    }

    public Optional<TecnicoPlanificacion> findById(Integer id) {
        return repository.findById(id);
    }

    public TecnicoPlanificacion save(TecnicoPlanificacion entity) {
        if (entity.getFechaAsignacion() == null) {
            entity.setFechaAsignacion(java.time.LocalDateTime.now());
        }
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
