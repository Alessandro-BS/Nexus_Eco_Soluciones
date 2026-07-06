package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.Incidente;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.IncidenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidenteService {

    @Autowired
    private IncidenteRepository repository;

    public List<Incidente> findAll() {
        return repository.findAll();
    }

    public Optional<Incidente> findById(Integer id) {
        return repository.findById(id);
    }

    public Incidente save(Incidente entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
