package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.Tecnico;
import com.nexus.eco.nexus_eco_api.service.TecnicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tecnicos")
@CrossOrigin(origins = "*")
public class TecnicoController {

    @Autowired
    private TecnicoService service;

    @GetMapping
    public List<Tecnico> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tecnico> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tecnico create(@jakarta.validation.Valid @RequestBody Tecnico entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tecnico> update(@PathVariable Integer id, @jakarta.validation.Valid @RequestBody Tecnico entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdTecnico(id);
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
