package com.nexus.eco.nexus_eco_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.nexus.eco.nexus_eco_api.model.document.Evidencia;
import com.nexus.eco.nexus_eco_api.service.EvidenciaService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/evidencias")
@CrossOrigin(origins = "*")
public class EvidenciaController {

    @Autowired
    private EvidenciaService evidenciaService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Evidencia evidencia = evidenciaService.uploadEvidencia(file);
            Map<String, String> response = new HashMap<>();
            response.put("mongo_doc_id", evidencia.getId());
            response.put("nombre", evidencia.getNombreArchivo());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String id) {
        Optional<Evidencia> evidenciaOpt = evidenciaService.getEvidencia(id);
        if (evidenciaOpt.isPresent()) {
            Evidencia evidencia = evidenciaOpt.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + evidencia.getNombreArchivo() + "\"")
                    .contentType(MediaType.parseMediaType(evidencia.getTipoArchivo()))
                    .body(evidencia.getDatos());
        }
        return ResponseEntity.notFound().build();
    }
}
