package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "INCIDENTE")
public class Incidente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incidente")
    private Integer idIncidente;
    @Column(name = "tipo_incidente")
    private String tipoIncidente;
    @Column(name = "descripcion_inc", columnDefinition = "TEXT")
    private String descripcionInc;
    private String gravedad;
    @Column(name = "estado_inc")
    private String estadoInc = "REPORTADO";
    @ManyToOne
    @JoinColumn(name = "id_ejecucion_servicio")
    private EjecucionServicio ejecucionServicio;
}
