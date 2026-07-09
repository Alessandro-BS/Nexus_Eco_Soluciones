package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.Inspeccion;
import com.nexus.eco.nexus_eco_api.service.InspeccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspeccions")
@CrossOrigin(origins = "*")
public class InspeccionController {

    @Autowired
    private InspeccionService service;

    @GetMapping
    public List<Inspeccion> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inspeccion> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Inspeccion create(@RequestBody Inspeccion entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inspeccion> update(@PathVariable Integer id, @RequestBody Inspeccion entity) {
        return service.findById(id).map(existing -> {
            entity.setIdInspeccion(id);
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
