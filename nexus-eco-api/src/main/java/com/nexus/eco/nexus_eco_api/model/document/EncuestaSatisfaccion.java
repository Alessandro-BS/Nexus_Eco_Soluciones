package com.nexus.eco.nexus_eco_api.model.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "encuestas_satisfaccion")
public class EncuestaSatisfaccion {
    @Id
    private String id;
    private Integer idCliente;
    private Integer idEjecucionServicio;
    private LocalDateTime fechaRespuesta;
    
    // Original mappings
    private Integer puntuacionGeneral;
    private Integer calidadServicio;
    private Integer puntualidad;
    private Integer profesionalismo;
    private String comentarios;
    private Boolean recomendaria;
    private String origen;
    private String googleFormResponseId;

    // Google Form specific responses
    private String nombreCliente;
    private String tipoServicioRecibido;
    private String facilidadProgramacion;
    private String puntualidadDetalle;
    private String presentacionEpp;
    private Integer amabilidadProfesionalismo;
    private Integer calidadGeneral;
    private String limpiezaOrden;
    private String recomendacionesSeguridad;
    private String dudasResueltas;
    private String recomendariaEmpresa;
    private String sugerenciasComentarios;
}
