package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.EjecucionServicio;
import com.nexus.eco.nexus_eco_api.model.entity.PlanificacionServicio;
import com.nexus.eco.nexus_eco_api.model.entity.OrdenServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.EjecucionServicioRepository;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.PlanificacionServicioRepository;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EjecucionServicioService {

    @Autowired
    private EjecucionServicioRepository repository;

    @Autowired
    private PlanificacionServicioRepository planificacionServicioRepository;

    @Autowired
    private OrdenServicioRepository ordenServicioRepository;

    public List<EjecucionServicio> findAll() {
        return repository.findAll();
    }

    public Optional<EjecucionServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public EjecucionServicio save(EjecucionServicio entity) {
        EjecucionServicio saved = repository.save(entity);
        
        // Propagate state to PlanificacionServicio -> EJECUTADO and OrdenServicio -> EJECUTADA
        if (saved.getPlanificacionServicio() != null) {
            planificacionServicioRepository.findById(saved.getPlanificacionServicio().getIdPlanificacionServicio()).ifPresent(ps -> {
                ps.setEstadoPlan("EJECUTADO");
                planificacionServicioRepository.save(ps);
                
                if (ps.getOrdenServicio() != null) {
                    ordenServicioRepository.findById(ps.getOrdenServicio().getIdOrdenServicio()).ifPresent(os -> {
                        os.setEstadoOrden("EJECUTADA");
                        ordenServicioRepository.save(os);
                    });
                }
            });
        }
        return saved;
    }

    public void deleteById(Integer id) {
        repository.findById(id).ifPresent(es -> {
            // Revert state back to PROGRAMADO / PLANIFICADA
            if (es.getPlanificacionServicio() != null) {
                planificacionServicioRepository.findById(es.getPlanificacionServicio().getIdPlanificacionServicio()).ifPresent(ps -> {
                    ps.setEstadoPlan("PROGRAMADO");
                    planificacionServicioRepository.save(ps);
                    
                    if (ps.getOrdenServicio() != null) {
                        ordenServicioRepository.findById(ps.getOrdenServicio().getIdOrdenServicio()).ifPresent(os -> {
                            os.setEstadoOrden("PLANIFICADA");
                            ordenServicioRepository.save(os);
                        });
                    }
                });
            }
        });
        repository.deleteById(id);
    }
}
