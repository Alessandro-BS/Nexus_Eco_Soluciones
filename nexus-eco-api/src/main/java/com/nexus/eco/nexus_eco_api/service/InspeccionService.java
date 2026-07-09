package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.Inspeccion;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.InspeccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InspeccionService {

    @Autowired
    private InspeccionRepository repository;

    public List<Inspeccion> findAll() {
        return repository.findAll();
    }

    public Optional<Inspeccion> findById(Integer id) {
        return repository.findById(id);
    }

    public Inspeccion save(Inspeccion entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
