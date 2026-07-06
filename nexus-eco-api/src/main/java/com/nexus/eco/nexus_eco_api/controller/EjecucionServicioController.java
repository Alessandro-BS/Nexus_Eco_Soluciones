package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.EjecucionServicio;
import com.nexus.eco.nexus_eco_api.service.EjecucionServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ejecucion-servicios")
@CrossOrigin(origins = "*")
public class EjecucionServicioController {

    @Autowired
    private EjecucionServicioService service;

    @GetMapping
    public List<EjecucionServicio> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EjecucionServicio> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EjecucionServicio create(@RequestBody EjecucionServicio entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EjecucionServicio> update(@PathVariable Integer id, @RequestBody EjecucionServicio entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdEjecucionServicio(id);
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
