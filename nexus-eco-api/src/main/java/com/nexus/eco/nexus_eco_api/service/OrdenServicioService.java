package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.OrdenServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@org.springframework.transaction.annotation.Transactional
public class OrdenServicioService {

    @Autowired
    private OrdenServicioRepository repository;

    @Autowired
    private com.nexus.eco.nexus_eco_api.repository.sqlserver.SolicitudServicioRepository solicitudServicioRepository;

    public List<OrdenServicio> findAll() {
        return repository.findAll();
    }

    public Optional<OrdenServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public OrdenServicio save(OrdenServicio entity) {
        OrdenServicio saved = repository.save(entity);
        if (saved.getSolicitudServicio() != null) {
            solicitudServicioRepository.findById(saved.getSolicitudServicio().getIdSolicitudServicio()).ifPresent(sol -> {
                sol.setEstadoSol("APROBADA");
                solicitudServicioRepository.save(sol);
            });
        }
        return saved;
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
