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
    @jakarta.validation.constraints.NotBlank(message = "La razón social es obligatoria")
    @jakarta.validation.constraints.Size(max = 255, message = "La razón social no puede exceder 255 caracteres")
    @jakarta.validation.constraints.Pattern(regexp = "^[^<>]*$", message = "La razón social no puede contener caracteres HTML (< o >)")
    private String razonSocial;
    
    @Column(unique = true, nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "El RUC es obligatorio")
    @jakarta.validation.constraints.Pattern(regexp = "^\\d{11}$", message = "El RUC debe tener exactamente 11 dígitos numéricos")
    private String ruc;
    
    @Column(nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "La dirección es obligatoria")
    private String direccion;
    
    @Column(name = "email_cliente", nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "El correo electrónico es obligatorio")
    @jakarta.validation.constraints.Email(message = "Debe ser un correo electrónico válido")
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
