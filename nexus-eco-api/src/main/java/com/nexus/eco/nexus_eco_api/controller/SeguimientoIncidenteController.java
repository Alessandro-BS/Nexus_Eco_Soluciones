package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.SeguimientoIncidente;
import com.nexus.eco.nexus_eco_api.service.SeguimientoIncidenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seguimiento-incidentes")
@CrossOrigin(origins = "*")
public class SeguimientoIncidenteController {

    @Autowired
    private SeguimientoIncidenteService service;

    @GetMapping
    public List<SeguimientoIncidente> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeguimientoIncidente> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SeguimientoIncidente create(@RequestBody SeguimientoIncidente entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeguimientoIncidente> update(@PathVariable Integer id, @RequestBody SeguimientoIncidente entity) {
        return service.findById(id).map(existing -> {
            entity.setIdSeguimientoIncidente(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
