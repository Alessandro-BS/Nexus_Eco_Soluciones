package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.Empleado;
import com.nexus.eco.nexus_eco_api.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "*")
public class EmpleadoController {

    @Autowired
    private EmpleadoService service;

    @GetMapping
    public List<Empleado> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Empleado create(@RequestBody Empleado entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empleado> update(@PathVariable Integer id, @RequestBody Empleado entity) {
        return service.findById(id).map(existing -> {
            entity.setIdEmpleado(id);
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
