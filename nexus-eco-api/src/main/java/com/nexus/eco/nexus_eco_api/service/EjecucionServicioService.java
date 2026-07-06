package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.EjecucionServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.EjecucionServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EjecucionServicioService {

    @Autowired
    private EjecucionServicioRepository repository;

    public List<EjecucionServicio> findAll() {
        return repository.findAll();
    }

    public Optional<EjecucionServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public EjecucionServicio save(EjecucionServicio entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
