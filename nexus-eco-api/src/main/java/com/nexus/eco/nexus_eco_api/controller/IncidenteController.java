package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.Incidente;
import com.nexus.eco.nexus_eco_api.service.IncidenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidentes")
@CrossOrigin(origins = "*")
public class IncidenteController {

    @Autowired
    private IncidenteService service;

    @GetMapping
    public List<Incidente> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incidente> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Incidente create(@RequestBody Incidente entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Incidente> update(@PathVariable Integer id, @RequestBody Incidente entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdIncidente(id);
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
