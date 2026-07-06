package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.TipoServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.TipoServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoServicioService {

    @Autowired
    private TipoServicioRepository repository;

    public List<TipoServicio> findAll() {
        return repository.findAll();
    }

    public Optional<TipoServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public TipoServicio save(TipoServicio entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
