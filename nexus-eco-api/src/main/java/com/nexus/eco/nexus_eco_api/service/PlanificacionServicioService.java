package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.PlanificacionServicio;
import com.nexus.eco.nexus_eco_api.model.entity.OrdenServicio;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.PlanificacionServicioRepository;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PlanificacionServicioService {

    @Autowired
    private PlanificacionServicioRepository repository;

    @Autowired
    private OrdenServicioRepository ordenServicioRepository;

    @Autowired
    private com.nexus.eco.nexus_eco_api.repository.sqlserver.OrdenTrabajoRepository ordenTrabajoRepository;

    public List<PlanificacionServicio> findAll() {
        return repository.findAll();
    }

    public Optional<PlanificacionServicio> findById(Integer id) {
        return repository.findById(id);
    }

    public PlanificacionServicio save(PlanificacionServicio entity) {
        PlanificacionServicio saved = repository.save(entity);
        
        // Propagate state to OrdenServicio -> PLANIFICADA
        if (saved.getOrdenServicio() != null) {
            ordenServicioRepository.findById(saved.getOrdenServicio().getIdOrdenServicio()).ifPresent(os -> {
                os.setEstadoOrden("PLANIFICADA");
                ordenServicioRepository.save(os);
            });
            
            // Propagate state to OrdenTrabajo -> EN_PROCESO
            ordenTrabajoRepository.findByOrdenServicioIdOrdenServicio(saved.getOrdenServicio().getIdOrdenServicio())
                .forEach(ot -> {
                    ot.setEstadoOt("EN_PROCESO");
                    ordenTrabajoRepository.save(ot);
                });
        }
        return saved;
    }

    public void deleteById(Integer id) {
        repository.findById(id).ifPresent(ps -> {
            // Revert state of OrdenServicio back to EN_PROCESO when deleting its planification
            if (ps.getOrdenServicio() != null) {
                ordenServicioRepository.findById(ps.getOrdenServicio().getIdOrdenServicio()).ifPresent(os -> {
                    os.setEstadoOrden("EN_PROCESO");
                    ordenServicioRepository.save(os);
                });
                
                // Revert state of OrdenTrabajo back to PENDIENTE
                ordenTrabajoRepository.findByOrdenServicioIdOrdenServicio(ps.getOrdenServicio().getIdOrdenServicio())
                    .forEach(ot -> {
                        ot.setEstadoOt("PENDIENTE");
                        ordenTrabajoRepository.save(ot);
                    });
            }
        });
        repository.deleteById(id);
    }
}
