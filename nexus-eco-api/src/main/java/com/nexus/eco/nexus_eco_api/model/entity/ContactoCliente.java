package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "CONTACTO_CLIENTE")
public class ContactoCliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contacto_cliente")
    private Integer idContactoCliente;
    @Column(name = "nombre_con", nullable = false)
    private String nombreCon;
    private String cargo;
    @Column(name = "telefono_con")
    private String telefonoCon;
    @Column(name = "email_contacto")
    private String emailContacto;
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
}
