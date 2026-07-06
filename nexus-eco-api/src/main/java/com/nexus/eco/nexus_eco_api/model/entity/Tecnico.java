package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "TECNICO")
public class Tecnico {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tecnico")
    private Integer idTecnico;
    @Column(name = "nombre_tec", nullable = false)
    private String nombreTec;
    @Column(name = "apellido_tec", nullable = false)
    private String apellidoTec;
    @Column(name = "estado_tec")
    private String estadoTec = "ACTIVO";
    @ManyToOne
    @JoinColumn(name = "id_especialidad")
    private Especialidad especialidad;
}
