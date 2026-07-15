package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "DETALLE_ORDEN")
public class DetalleOrden {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_orden")
    private Integer idDetalleOrden;
    @Column(nullable = false)
    @jakarta.validation.constraints.NotNull(message = "La cantidad es obligatoria")
    @jakarta.validation.constraints.Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
    
    @Column(name = "precio_unitario", nullable = false)
    @jakarta.validation.constraints.NotNull(message = "El precio unitario es obligatorio")
    @jakarta.validation.constraints.DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal precioUnitario;
    
    @Column(nullable = false)
    @jakarta.validation.constraints.NotNull(message = "El subtotal es obligatorio")
    @jakarta.validation.constraints.DecimalMin(value = "0.0", inclusive = false, message = "El subtotal debe ser mayor a 0")
    private BigDecimal subtotal;
    @ManyToOne
    @JoinColumn(name = "id_orden_servicio")
    @JsonIgnore
    private OrdenServicio ordenServicio;
    @ManyToOne
    @JoinColumn(name = "id_tipo_servicio")
    private TipoServicio tipoServicio;
}
