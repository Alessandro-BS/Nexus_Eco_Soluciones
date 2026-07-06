package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "TECNICO_PLANIFICACION")
public class TecnicoPlanificacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tecnico_planificacion")
    private Integer idTecnicoPlanificacion;
    private String rol;
    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;
    @ManyToOne
    @JoinColumn(name = "id_planificacion_servicio")
    private PlanificacionServicio planificacionServicio;
    @ManyToOne
    @JoinColumn(name = "id_tecnico")
    private Tecnico tecnico;
}
