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
    private String googleFormResponseId;
    private String origen;
    private LocalDateTime fechaRespuesta;
    private Integer idCliente;
    private Integer idEjecucionServicio;

    // Google Form specific responses (In order of the form questions)
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

    // Mapped / Calculated metrics
    private Integer puntuacionGeneral;
    private Integer calidadServicio;
    private Integer puntualidad;
    private Integer profesionalismo;
    private Boolean recomendaria;
    private String comentarios;
}
