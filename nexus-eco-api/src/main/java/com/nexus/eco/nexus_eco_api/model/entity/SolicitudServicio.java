package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "SOLICITUD_SERVICIO")
public class SolicitudServicio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud_servicio")
    private Integer idSolicitudServicio;
    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud;
    @Column(name = "descripcion_sol", columnDefinition = "TEXT")
    private String descripcionSol;
    @Column(name = "estado_sol")
    private String estadoSol = "PENDIENTE";
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;
}
