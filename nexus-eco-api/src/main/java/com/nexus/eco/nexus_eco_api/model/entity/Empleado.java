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
    @jakarta.validation.constraints.NotBlank(message = "El nombre es obligatorio")
    @jakarta.validation.constraints.Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombreEmp;
    
    @Column(name = "apellido_emp", nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "El apellido es obligatorio")
    @jakarta.validation.constraints.Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
    private String apellidoEmp;
    
    @Column(name = "cargo_emp")
    @jakarta.validation.constraints.Size(max = 100, message = "El cargo no puede exceder 100 caracteres")
    private String cargoEmp;
    
    @jakarta.validation.constraints.Size(max = 100, message = "El área no puede exceder 100 caracteres")
    private String area;
}
