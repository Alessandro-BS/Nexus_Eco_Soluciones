package com.nexus.eco.nexus_eco_api.controller;

import com.nexus.eco.nexus_eco_api.service.ArchivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/archivos")
@CrossOrigin(origins = "*")
public class ArchivoController {

    @Autowired
    private ArchivoService archivoService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadArchivo(@RequestParam("file") MultipartFile file) {
        try {
            String fileId = archivoService.subirArchivo(file);
            Map<String, String> response = new HashMap<>();
            response.put("mongoDocId", fileId);
            response.put("message", "Archivo subido correctamente");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
