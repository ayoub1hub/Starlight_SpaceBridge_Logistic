package LivraisonService.src.main.java.org.example.livraisonservice.service;

import LivraisonService.src.main.java.org.example.livraisonservice.dto.DriverDto;
import LivraisonService.src.main.java.org.example.livraisonservice.entity.Driver;
import LivraisonService.src.main.java.org.example.livraisonservice.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public DriverDto getDriverById(UUID id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));
        return mapToDto(driver);
    }

    public DriverDto updateDriverLocation(UUID id, Double latitude, Double longitude) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));
        driver.setCurrentLatitude(latitude);
        driver.setCurrentLongitude(longitude);
        driver.setUpdatedAt(LocalDateTime.now());
        return mapToDto(driverRepository.save(driver));
    }

    // Mapping Entité → DTO (selon VOTRE DriverDto)
    private DriverDto mapToDto(Driver entity) {
        DriverDto dto = new DriverDto();
        dto.setId(entity.getId()); // UUID
        // Vos entités n'ont pas "name", "phone" → d'où viennent-ils ?
        // Hypothèse : ils sont dans un microservice "Person", donc vous les récupérez via API
        // Pour l'instant, on laisse null ou on utilise des champs fictifs
        dto.setName("Nom inconnu"); // ⚠️ à remplacer par appel à PersonService si nécessaire
        dto.setPhone("Téléphone inconnu");
        dto.setVehiclePlate(entity.getVehiclePlateNumber());
        dto.setAvailable("Available".equals(entity.getStatus()));
        dto.setCurrentLatitude(entity.getCurrentLatitude());
        dto.setCurrentLongitude(entity.getCurrentLongitude());
        return dto;
    }
}