package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.Ubicacion;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.UbicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UbicacionService {

    @Autowired
    private UbicacionRepository repository;

    public List<Ubicacion> findAll() {
        return repository.findAll();
    }

    public Optional<Ubicacion> findById(Integer id) {
        return repository.findById(id);
    }

    public Ubicacion save(Ubicacion entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
