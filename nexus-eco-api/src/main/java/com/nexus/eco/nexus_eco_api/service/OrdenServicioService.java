package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.OrdenServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenServicioService {

    @Autowired
    private OrdenServicioRepository repository;

    public List<OrdenServicio> findAll() {
        return repository.findAll();
    }

    public Optional<OrdenServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public OrdenServicio save(OrdenServicio entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
