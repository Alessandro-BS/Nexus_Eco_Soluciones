package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.document.EncuestaSatisfaccion;
import com.nexus.eco.nexus_eco_api.service.EncuestaSatisfaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encuesta-satisfaccions")
@CrossOrigin(origins = "*")
public class EncuestaSatisfaccionController {

    @Autowired
    private EncuestaSatisfaccionService service;

    @GetMapping
    public List<EncuestaSatisfaccion> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EncuestaSatisfaccion> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EncuestaSatisfaccion create(@RequestBody EncuestaSatisfaccion entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EncuestaSatisfaccion> update(@PathVariable String id, @RequestBody EncuestaSatisfaccion entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findById(id).isPresent()) {
            service.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
