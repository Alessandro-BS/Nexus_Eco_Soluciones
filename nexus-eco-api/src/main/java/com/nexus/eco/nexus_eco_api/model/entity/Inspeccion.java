package com.nexus.eco.nexus_eco_api.model.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "INSPECCION")
public class Inspeccion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inspeccion")
    private Integer idInspeccion;
    @Column(name = "area_inspeccionada")
    private String areaInspeccionada;
    @Column(name = "resultado_insp")
    private String resultadoInsp;
    @Column(name = "mongo_doc_id_insp")
    private String mongoDocIdInsp;
    @ManyToOne
    @JoinColumn(name = "id_auditoria")
    private Auditoria auditoria;
}
