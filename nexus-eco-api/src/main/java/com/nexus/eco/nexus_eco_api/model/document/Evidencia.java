package com.nexus.eco.nexus_eco_api.model.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "evidencias")
public class Evidencia {
    
    @Id
    private String id;
    
    private String nombreArchivo;
    private String tipoArchivo;
    private Long tamanio;
    private byte[] datos;
    private LocalDateTime fechaSubida = LocalDateTime.now();
    
}
