package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "AUDITORIA")
public class Auditoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Integer idAuditoria;
    @Column(name = "fecha_auditoria", nullable = false)
    private LocalDateTime fechaAuditoria;
    private Integer calificacion;
    @Column(name = "observaciones_aud", columnDefinition = "TEXT")
    private String observacionesAud;
    @ManyToOne
    @JoinColumn(name = "id_ejecucion_servicio")
    private EjecucionServicio ejecucionServicio;
    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;
}
