package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.PlanificacionServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.PlanificacionServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanificacionServicioService {

    @Autowired
    private PlanificacionServicioRepository repository;

    public List<PlanificacionServicio> findAll() {
        return repository.findAll();
    }

    public Optional<PlanificacionServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public PlanificacionServicio save(PlanificacionServicio entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
