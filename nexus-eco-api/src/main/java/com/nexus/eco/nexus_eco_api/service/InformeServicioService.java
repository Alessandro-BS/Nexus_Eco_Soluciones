package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.InformeServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.InformeServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InformeServicioService {

    @Autowired
    private InformeServicioRepository repository;

    public List<InformeServicio> findAll() {
        return repository.findAll();
    }

    public Optional<InformeServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public InformeServicio save(InformeServicio entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
