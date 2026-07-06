package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.OrdenServicio;
import com.nexus.eco.nexus_eco_api.service.OrdenServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orden-servicios")
@CrossOrigin(origins = "*")
public class OrdenServicioController {

    @Autowired
    private OrdenServicioService service;

    @GetMapping
    public List<OrdenServicio> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenServicio> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrdenServicio create(@RequestBody OrdenServicio entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdenServicio> update(@PathVariable Integer id, @RequestBody OrdenServicio entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdOrdenServicio(id);
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
