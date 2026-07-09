package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "ORDEN_SERVICIO")
public class OrdenServicio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden_servicio")
    private Integer idOrdenServicio;
    @Column(name = "fecha_orden")
    private LocalDateTime fechaOrden;
    @Column(name = "estado_orden")
    private String estadoOrden = "EN_PROCESO";
    @Column(name = "monto_total")
    private BigDecimal montoTotal;
    @ManyToOne
    @JoinColumn(name = "id_solicitud_servicio")
    private SolicitudServicio solicitudServicio;
    
    @OneToMany(mappedBy = "ordenServicio", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<DetalleOrden> detalles;

    public void setDetalles(java.util.List<DetalleOrden> detalles) {
        this.detalles = detalles;
        if (detalles != null) {
            for (DetalleOrden d : detalles) {
                d.setOrdenServicio(this);
            }
        }
    }
}
