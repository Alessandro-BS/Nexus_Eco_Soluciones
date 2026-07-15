package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "CONTACTO_CLIENTE")
public class ContactoCliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contacto_cliente")
    private Integer idContactoCliente;
    @Column(name = "nombre_con", nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "El nombre del contacto es obligatorio")
    @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "El nombre del contacto solo debe contener letras")
    private String nombreCon;

    @Column(nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "El cargo del contacto es obligatorio")
    @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "El cargo del contacto solo debe contener letras")
    private String cargo;

    @Column(name = "telefono_con", nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "El teléfono del contacto es obligatorio")
    @jakarta.validation.constraints.Pattern(regexp = "^9\\d{8}$", message = "El teléfono debe ser un número de celular de Perú de 9 dígitos")
    private String telefonoCon;

    @Column(name = "email_contacto", nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "El correo del contacto es obligatorio")
    @jakarta.validation.constraints.Email(message = "Debe ser un correo electrónico de contacto válido")
    private String emailContacto;
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    @JsonIgnore
    private Cliente cliente;
}
