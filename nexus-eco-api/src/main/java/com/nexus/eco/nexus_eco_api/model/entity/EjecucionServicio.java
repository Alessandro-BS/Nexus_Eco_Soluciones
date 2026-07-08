package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "EJECUCION_SERVICIO")
public class EjecucionServicio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ejecucion_servicio")
    private Integer idEjecucionServicio;
    @Column(name = "fecha_ejecucion", nullable = false)
    private LocalDateTime fechaEjecucion;
    private String resultado;
    @Column(name = "observaciones_ej", columnDefinition = "TEXT")
    private String observacionesEj;
    @Column(name = "mongo_doc_id")
    private String mongoDocId;
    @ManyToOne
    @JoinColumn(name = "id_planificacion_servicio")
    private PlanificacionServicio planificacionServicio;
}
