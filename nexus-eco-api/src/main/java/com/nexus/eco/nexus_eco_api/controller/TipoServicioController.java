package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.TipoServicio;
import com.nexus.eco.nexus_eco_api.service.TipoServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipo-servicios")
@CrossOrigin(origins = "*")
public class TipoServicioController {

    @Autowired
    private TipoServicioService service;

    @GetMapping
    public List<TipoServicio> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoServicio> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TipoServicio create(@jakarta.validation.Valid @RequestBody TipoServicio entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoServicio> update(@PathVariable Integer id, @jakarta.validation.Valid @RequestBody TipoServicio entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdTipoServicio(id);
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
