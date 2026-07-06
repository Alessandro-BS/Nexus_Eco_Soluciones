package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "INFORME_SERVICIO")
public class InformeServicio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_informe_servicio")
    private Integer idInformeServicio;
    @Column(name = "fecha_generacion")
    private LocalDateTime fechaGeneracion;
    @Column(name = "tipo_informe")
    private String tipoInforme;
    @Column(name = "estado_envio")
    private String estadoEnvio;
    @ManyToOne
    @JoinColumn(name = "id_ejecucion_servicio")
    private EjecucionServicio ejecucionServicio;
}
