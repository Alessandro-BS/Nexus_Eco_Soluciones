package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.SeguimientoIncidente;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.SeguimientoIncidenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeguimientoIncidenteService {

    @Autowired
    private SeguimientoIncidenteRepository repository;

    public List<SeguimientoIncidente> findAll() {
        return repository.findAll();
    }

    public Optional<SeguimientoIncidente> findById(Integer id) {
        return repository.findById(id);
    }

    public SeguimientoIncidente save(SeguimientoIncidente entity) {
        if (entity.getFechaSeguimiento() == null) {
            entity.setFechaSeguimiento(java.time.LocalDateTime.now());
        }
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
