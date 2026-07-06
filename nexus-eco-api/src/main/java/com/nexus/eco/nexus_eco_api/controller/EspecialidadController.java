package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.Especialidad;
import com.nexus.eco.nexus_eco_api.service.EspecialidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/especialidads")
@CrossOrigin(origins = "*")
public class EspecialidadController {

    @Autowired
    private EspecialidadService service;

    @GetMapping
    public List<Especialidad> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Especialidad> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Especialidad create(@RequestBody Especialidad entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Especialidad> update(@PathVariable Integer id, @RequestBody Especialidad entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdEspecialidad(id);
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
