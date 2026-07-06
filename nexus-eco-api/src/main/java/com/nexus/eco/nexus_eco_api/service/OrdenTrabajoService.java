package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.OrdenTrabajo;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.OrdenTrabajoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenTrabajoService {

    @Autowired
    private OrdenTrabajoRepository repository;

    public List<OrdenTrabajo> findAll() {
        return repository.findAll();
    }

    public Optional<OrdenTrabajo> findById(Integer id) {
        return repository.findById(id);
    }

    public OrdenTrabajo save(OrdenTrabajo entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
