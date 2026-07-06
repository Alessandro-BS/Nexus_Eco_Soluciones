package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "TIPO_SERVICIO")
public class TipoServicio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_servicio")
    private Integer idTipoServicio;
    @Column(name = "nombre_servicio", nullable = false)
    private String nombreServicio;
    @Column(name = "descripcion_ts")
    private String descripcionTs;
    @Column(name = "precio_base")
    private BigDecimal precioBase;
}
