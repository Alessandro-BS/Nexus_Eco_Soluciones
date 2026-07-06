package com.nexus.eco.nexus_eco_api.service;

import com.nexus.eco.nexus_eco_api.model.entity.ContactoCliente;
import com.nexus.eco.nexus_eco_api.repository.sqlserver.ContactoClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactoClienteService {

    @Autowired
    private ContactoClienteRepository repository;

    public List<ContactoCliente> findAll() {
        return repository.findAll();
    }

    public Optional<ContactoCliente> findById(Integer id) {
        return repository.findById(id);
    }

    public ContactoCliente save(ContactoCliente entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
