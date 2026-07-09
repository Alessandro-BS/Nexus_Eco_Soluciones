package com.nexus.eco.nexus_eco_api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.nexus.eco.nexus_eco_api.model.document.Evidencia;

@Repository
public interface EvidenciaRepository extends MongoRepository<Evidencia, String> {
}
