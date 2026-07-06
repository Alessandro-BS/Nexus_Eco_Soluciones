package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.Tecnico;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.TecnicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TecnicoService {

    @Autowired
    private TecnicoRepository repository;

    public List<Tecnico> findAll() {
        return repository.findAll();
    }

    public Optional<Tecnico> findById(Integer id) {
        return repository.findById(id);
    }

    public Tecnico save(Tecnico entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
