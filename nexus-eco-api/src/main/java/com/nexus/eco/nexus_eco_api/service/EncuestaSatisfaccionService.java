package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.document.EncuestaSatisfaccion;
import com.nexus.eco.nexus_eco_api.repository.mongo.EncuestaSatisfaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EncuestaSatisfaccionService {

    @Autowired
    private EncuestaSatisfaccionRepository repository;

    public List<EncuestaSatisfaccion> findAll() {
        return repository.findAll();
    }

    public Optional<EncuestaSatisfaccion> findById(String id) {
        return repository.findById(id);
    }

    public EncuestaSatisfaccion save(EncuestaSatisfaccion entity) {
        return repository.save(entity);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
