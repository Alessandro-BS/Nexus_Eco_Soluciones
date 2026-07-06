package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.SolicitudServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.SolicitudServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitudServicioService {

    @Autowired
    private SolicitudServicioRepository repository;

    public List<SolicitudServicio> findAll() {
        return repository.findAll();
    }

    public Optional<SolicitudServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public SolicitudServicio save(SolicitudServicio entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
