package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.OrdenTrabajo;
import com.nexus.eco.nexus_eco_api.service.OrdenTrabajoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orden-trabajos")
@CrossOrigin(origins = "*")
public class OrdenTrabajoController {

    @Autowired
    private OrdenTrabajoService service;

    @GetMapping
    public List<OrdenTrabajo> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenTrabajo> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrdenTrabajo create(@RequestBody OrdenTrabajo entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdenTrabajo> update(@PathVariable Integer id, @RequestBody OrdenTrabajo entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdOrdenTrabajo(id);
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
