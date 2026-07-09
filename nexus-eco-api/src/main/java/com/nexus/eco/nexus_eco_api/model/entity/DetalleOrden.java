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
    private Integer cantidad;
    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario;
    @Column(nullable = false)
    private BigDecimal subtotal;
    @ManyToOne
    @JoinColumn(name = "id_orden_servicio")
    @JsonIgnore
    private OrdenServicio ordenServicio;
    @ManyToOne
    @JoinColumn(name = "id_tipo_servicio")
    private TipoServicio tipoServicio;
}
