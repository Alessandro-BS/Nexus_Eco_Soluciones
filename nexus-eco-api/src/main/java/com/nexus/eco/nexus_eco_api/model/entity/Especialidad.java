package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ESPECIALIDAD")
public class Especialidad {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especialidad")
    private Integer idEspecialidad;
    @Column(name = "nombre_espec", nullable = false)
    private String nombreEspec;
    private String descripcion;
}
