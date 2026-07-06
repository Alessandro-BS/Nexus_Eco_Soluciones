package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.SolicitudServicio;
import com.nexus.eco.nexus_eco_api.service.SolicitudServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitud-servicios")
@CrossOrigin(origins = "*")
public class SolicitudServicioController {

    @Autowired
    private SolicitudServicioService service;

    @GetMapping
    public List<SolicitudServicio> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudServicio> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SolicitudServicio create(@RequestBody SolicitudServicio entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitudServicio> update(@PathVariable Integer id, @RequestBody SolicitudServicio entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdSolicitudServicio(id);
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
