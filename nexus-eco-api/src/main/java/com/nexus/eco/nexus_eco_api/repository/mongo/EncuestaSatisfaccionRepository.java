package com.nexus.eco.nexus_eco_api.repository.mongo;
import com.nexus.eco.nexus_eco_api.model.document.EncuestaSatisfaccion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EncuestaSatisfaccionRepository extends MongoRepository<EncuestaSatisfaccion, String> {
}
