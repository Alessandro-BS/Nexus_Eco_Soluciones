package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ORDEN_TRABAJO")
public class OrdenTrabajo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden_trabajo")
    private Integer idOrdenTrabajo;
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    @Column(name = "descripcion_ot", columnDefinition = "TEXT")
    private String descripcionOt;
    @Column(name = "estado_ot")
    private String estadoOt = "PENDIENTE";
    private String prioridad;
    @ManyToOne
    @JoinColumn(name = "id_orden_servicio")
    private OrdenServicio ordenServicio;
}
