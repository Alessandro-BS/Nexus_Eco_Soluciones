package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.TecnicoPlanificacion;
import com.nexus.eco.nexus_eco_api.service.TecnicoPlanificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tecnico-planificacions")
@CrossOrigin(origins = "*")
public class TecnicoPlanificacionController {

    @Autowired
    private TecnicoPlanificacionService service;

    @GetMapping
    public List<TecnicoPlanificacion> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TecnicoPlanificacion> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TecnicoPlanificacion create(@RequestBody TecnicoPlanificacion entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TecnicoPlanificacion> update(@PathVariable Integer id, @RequestBody TecnicoPlanificacion entity) {
        return service.findById(id).map(existing -> {
            entity.setIdTecnicoPlanificacion(id);
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
