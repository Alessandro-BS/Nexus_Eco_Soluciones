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
    @jakarta.validation.constraints.NotBlank(message = "El nombre del servicio es obligatorio")
    @jakarta.validation.constraints.Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombreServicio;
    
    @Column(name = "descripcion_ts")
    private String descripcionTs;
    
    @Column(name = "precio_base")
    @jakarta.validation.constraints.NotNull(message = "El precio base es obligatorio")
    @jakarta.validation.constraints.DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal precioBase;
}
