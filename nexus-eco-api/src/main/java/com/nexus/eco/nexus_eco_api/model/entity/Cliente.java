package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "CLIENTE")
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;
    @Column(name = "razon_social", nullable = false)
    private String razonSocial;
    @Column(unique = true, nullable = false)
    private String ruc;
    private String direccion;
    @Column(name = "email_cliente")
    private String emailCliente;
    private String estado = "ACTIVO";
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactoCliente> contactos;

    public void setContactos(List<ContactoCliente> contactos) {
        this.contactos = contactos;
        if (contactos != null) {
            for (ContactoCliente c : contactos) {
                c.setCliente(this);
            }
        }
    }
}
