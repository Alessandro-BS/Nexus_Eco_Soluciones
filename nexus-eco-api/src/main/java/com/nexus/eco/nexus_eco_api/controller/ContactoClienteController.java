package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.model.entity.ContactoCliente;
import com.nexus.eco.nexus_eco_api.service.ContactoClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacto-clientes")
@CrossOrigin(origins = "*")
public class ContactoClienteController {

    @Autowired
    private ContactoClienteService service;

    @GetMapping
    public List<ContactoCliente> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactoCliente> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ContactoCliente create(@RequestBody ContactoCliente entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactoCliente> update(@PathVariable Integer id, @RequestBody ContactoCliente entity) {
        return service.findById(id).map(existing -> {
            // TODO: Añadir mapeo de campos específicos si es necesario
            entity.setIdContactoCliente(id);
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
