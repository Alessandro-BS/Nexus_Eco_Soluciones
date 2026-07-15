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
    @jakarta.validation.constraints.NotBlank(message = "El nombre es obligatorio")
    @jakarta.validation.constraints.Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombreTec;
    
    @Column(name = "apellido_tec", nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "El apellido es obligatorio")
    @jakarta.validation.constraints.Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
    private String apellidoTec;
    
    @Column(name = "estado_tec")
    @jakarta.validation.constraints.Pattern(regexp = "^(ACTIVO|INACTIVO|VACACIONES)$", message = "El estado debe ser ACTIVO, INACTIVO o VACACIONES")
    private String estadoTec = "ACTIVO";
    @ManyToOne
    @JoinColumn(name = "id_especialidad")
    private Especialidad especialidad;
}
