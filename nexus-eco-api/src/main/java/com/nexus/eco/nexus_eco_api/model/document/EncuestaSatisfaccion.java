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
    private Integer puntuacionGeneral;
    private Integer calidadServicio;
    private Integer puntualidad;
    private Integer profesionalismo;
    private String comentarios;
    private Boolean recomendaria;
    private String origen;
    private String googleFormResponseId;
}
