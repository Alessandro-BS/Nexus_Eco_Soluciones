package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.Empleado;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository repository;

    public List<Empleado> findAll() {
        return repository.findAll();
    }

    public Optional<Empleado> findById(Integer id) {
        return repository.findById(id);
    }

    public Empleado save(Empleado entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
