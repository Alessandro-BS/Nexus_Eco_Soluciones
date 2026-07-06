package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "EMPLEADO")
public class Empleado {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer idEmpleado;
    @Column(name = "nombre_emp", nullable = false)
    private String nombreEmp;
    @Column(name = "apellido_emp", nullable = false)
    private String apellidoEmp;
    @Column(name = "cargo_emp")
    private String cargoEmp;
    private String area;
}
