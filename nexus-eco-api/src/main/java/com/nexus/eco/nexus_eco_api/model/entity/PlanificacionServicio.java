package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "PLANIFICACION_SERVICIO")
public class PlanificacionServicio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_planificacion_servicio")
    private Integer idPlanificacionServicio;
    @Column(name = "fecha_programada", nullable = false)
    private LocalDateTime fechaProgramada;
    @Column(name = "hora_inicio")
    private LocalTime horaInicio;
    @Column(name = "estado_plan")
    private String estadoPlan = "PROGRAMADO";
    @ManyToOne
    @JoinColumn(name = "id_ubicacion")
    private Ubicacion ubicacion;
}
