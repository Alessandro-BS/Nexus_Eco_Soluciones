package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.Especialidad;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.EspecialidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EspecialidadService {

    @Autowired
    private EspecialidadRepository repository;

    public List<Especialidad> findAll() {
        return repository.findAll();
    }

    public Optional<Especialidad> findById(Integer id) {
        return repository.findById(id);
    }

    public Especialidad save(Especialidad entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
