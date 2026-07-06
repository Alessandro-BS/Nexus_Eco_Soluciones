package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "SEGUIMIENTO_INCIDENTE")
public class SeguimientoIncidente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_seguimiento_incidente")
    private Integer idSeguimientoIncidente;
    @Column(name = "fecha_seguimiento")
    private LocalDateTime fechaSeguimiento;
    @Column(name = "accion_tomada", columnDefinition = "TEXT")
    private String accionTomada;
    @Column(name = "estado_seg")
    private String estadoSeg;
    @ManyToOne
    @JoinColumn(name = "id_incidente")
    private Incidente incidente;
}
