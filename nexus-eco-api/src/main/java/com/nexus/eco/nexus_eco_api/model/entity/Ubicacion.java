package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "UBICACION")
public class Ubicacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ubicacion")
    private Integer idUbicacion;
    private String distrito;
    private String provincia;
    private String calle;
    private String referencia;
    @ManyToOne
    @JoinColumn(name = "id_planificacion_servicio")
    private PlanificacionServicio planificacionServicio;
}
