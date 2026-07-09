package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.Auditoria;
import com.nexus.eco.nexus_eco_api.model.entity.OrdenServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.AuditoriaRepository;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.EjecucionServicioRepository;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AuditoriaService {

    @Autowired
    private AuditoriaRepository repository;

    @Autowired
    private EjecucionServicioRepository ejecucionServicioRepository;

    @Autowired
    private OrdenServicioRepository ordenServicioRepository;

    public List<Auditoria> findAll() {
        return repository.findAll();
    }

    public Optional<Auditoria> findById(Integer id) {
        return repository.findById(id);
    }

    public Auditoria save(Auditoria entity) {
        Auditoria saved = repository.save(entity);
        
        // Propagate state to OrdenServicio -> AUDITADA
        if (saved.getEjecucionServicio() != null) {
            ejecucionServicioRepository.findById(saved.getEjecucionServicio().getIdEjecucionServicio()).ifPresent(es -> {
                if (es.getPlanificacionServicio() != null && es.getPlanificacionServicio().getOrdenServicio() != null) {
                    ordenServicioRepository.findById(es.getPlanificacionServicio().getOrdenServicio().getIdOrdenServicio()).ifPresent(os -> {
                        os.setEstadoOrden("AUDITADA");
                        ordenServicioRepository.save(os);
                    });
                }
            });
        }
        return saved;
    }

    public void deleteById(Integer id) {
        repository.findById(id).ifPresent(aud -> {
            // Revert state of OrdenServicio back to EJECUTADA when audit is deleted
            if (aud.getEjecucionServicio() != null) {
                ejecucionServicioRepository.findById(aud.getEjecucionServicio().getIdEjecucionServicio()).ifPresent(es -> {
                    if (es.getPlanificacionServicio() != null && es.getPlanificacionServicio().getOrdenServicio() != null) {
                        ordenServicioRepository.findById(es.getPlanificacionServicio().getOrdenServicio().getIdOrdenServicio()).ifPresent(os -> {
                            os.setEstadoOrden("EJECUTADA");
                            ordenServicioRepository.save(os);
                        });
                    }
                });
            }
        });
        repository.deleteById(id);
    }
}
