package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.InformeServicio;
import com.nexus.eco.nexus_eco_api.service.InformeServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/informe-servicios")
@CrossOrigin(origins = "*")
public class InformeServicioController {

    @Autowired
    private InformeServicioService service;

    @GetMapping
    public List<InformeServicio> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InformeServicio> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public InformeServicio create(@RequestBody InformeServicio entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InformeServicio> update(@PathVariable Integer id, @RequestBody InformeServicio entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdInformeServicio(id);
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
