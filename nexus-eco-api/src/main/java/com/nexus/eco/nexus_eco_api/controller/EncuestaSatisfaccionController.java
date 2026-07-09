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

    @Autowired
    private com.nexus.eco.nexus_eco_api.service.ClienteService clienteService;

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

    @PostMapping("/webhook")
    public EncuestaSatisfaccion receiveWebhook(@RequestBody EncuestaSatisfaccion entity) {
        entity.setFechaRespuesta(java.time.LocalDateTime.now());
        entity.setOrigen("GOOGLE_FORMS");
        
        // Intenta emparejar el nombre del cliente con SQL Server
        if (entity.getNombreCliente() != null) {
            String searchName = entity.getNombreCliente().toLowerCase().trim();
            clienteService.findAll().stream()
                .filter(c -> c.getRazonSocial().toLowerCase().contains(searchName) || 
                             searchName.contains(c.getRazonSocial().toLowerCase()))
                .findFirst()
                .ifPresent(c -> entity.setIdCliente(c.getIdCliente()));
        }
        
        // Mapear respuestas a los campos originales
        entity.setCalidadServicio(entity.getCalidadGeneral());
        entity.setProfesionalismo(entity.getAmabilidadProfesionalismo());
        entity.setComentarios(entity.getSugerenciasComentarios());
        
        if (entity.getPuntualidadDetalle() != null) {
            if (entity.getPuntualidadDetalle().contains("A tiempo") || entity.getPuntualidadDetalle().contains("antes")) {
                entity.setPuntualidad(5);
            } else if (entity.getPuntualidadDetalle().contains("Tarde")) {
                entity.setPuntualidad(3);
            } else {
                entity.setPuntualidad(1);
            }
        }
        
        if (entity.getRecomendariaEmpresa() != null) {
            entity.setRecomendaria(entity.getRecomendariaEmpresa().contains("Sí"));
        }
        
        // Calcular promedio de puntuación general
        int count = 0;
        int sum = 0;
        if (entity.getCalidadGeneral() != null) { sum += entity.getCalidadGeneral(); count++; }
        if (entity.getAmabilidadProfesionalismo() != null) { sum += entity.getAmabilidadProfesionalismo(); count++; }
        if (entity.getPuntualidad() != null) { sum += entity.getPuntualidad(); count++; }
        if (count > 0) {
            entity.setPuntuacionGeneral(Math.round((float) sum / count));
        }

        return service.save(entity);
    }

    @GetMapping("/resumen")
    public ResponseEntity<?> getResumen() {
        List<EncuestaSatisfaccion> list = service.findAll();
        long total = list.size();
        double avgCalidad = list.stream().filter(e -> e.getCalidadServicio() != null).mapToInt(EncuestaSatisfaccion::getCalidadServicio).average().orElse(0.0);
        double avgProfesionalismo = list.stream().filter(e -> e.getProfesionalismo() != null).mapToInt(EncuestaSatisfaccion::getProfesionalismo).average().orElse(0.0);
        double avgPuntualidad = list.stream().filter(e -> e.getPuntualidad() != null).mapToInt(EncuestaSatisfaccion::getPuntualidad).average().orElse(0.0);
        double avgGeneral = list.stream().filter(e -> e.getPuntuacionGeneral() != null).mapToInt(EncuestaSatisfaccion::getPuntuacionGeneral).average().orElse(0.0);
        
        java.util.Map<String, Object> res = new java.util.HashMap<>();
        res.put("total", total);
        res.put("avgCalidad", avgCalidad);
        res.put("avgProfesionalismo", avgProfesionalismo);
        res.put("avgPuntualidad", avgPuntualidad);
        res.put("avgGeneral", avgGeneral);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EncuestaSatisfaccion> update(@PathVariable String id, @RequestBody EncuestaSatisfaccion entity) {
        return service.findById(id).map(existing -> {
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
