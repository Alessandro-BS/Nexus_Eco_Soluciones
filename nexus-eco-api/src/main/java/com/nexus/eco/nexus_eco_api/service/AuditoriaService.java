package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.Auditoria;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuditoriaService {

    @Autowired
    private AuditoriaRepository repository;

    public List<Auditoria> findAll() {
        return repository.findAll();
    }

    public Optional<Auditoria> findById(Integer id) {
        return repository.findById(id);
    }

    public Auditoria save(Auditoria entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
