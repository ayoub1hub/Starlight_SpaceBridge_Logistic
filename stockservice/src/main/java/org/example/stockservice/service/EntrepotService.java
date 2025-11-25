package stockservice.src.main.java.org.example.stockservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stockservice.src.main.java.org.example.stockservice.dto.EntrepotDto;
import stockservice.src.main.java.org.example.stockservice.dto.PersonDto;
import stockservice.src.main.java.org.example.stockservice.entity.Entrepot;
import stockservice.src.main.java.org.example.stockservice.entity.Person;
import stockservice.src.main.java.org.example.stockservice.repository.EntrepotRepository;
import stockservice.src.main.java.org.example.stockservice.repository.PersonRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EntrepotService {

    @Autowired
    private EntrepotRepository entrepotRepository;

    @Autowired
    private PersonRepository personRepository;

    public List<EntrepotDto> getAllEntrepots() {
        return entrepotRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public EntrepotDto getEntrepotById(UUID id) {
        Entrepot entrepot = entrepotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrepôt non trouvé"));
        return mapToDto(entrepot);
    }

    public EntrepotDto createEntrepot(EntrepotDto dto) {
        Entrepot entrepot = new Entrepot();
        entrepot.setName(dto.getName());
        entrepot.setAddress(dto.getAddress());
        entrepot.setCapacity(dto.getCapacity());
        entrepot.setIsActive(dto.getActive() != null ? dto.getActive() : true);

        if (dto.getResponsable() != null && dto.getResponsable().getId() != null) {
            Person responsable = personRepository.findById(dto.getResponsable().getId())
                    .orElseThrow(() -> new RuntimeException("Responsable non trouvé"));
            entrepot.setResponsable(responsable);
        }

        Entrepot saved = entrepotRepository.save(entrepot);
        return mapToDto(saved);
    }

    private EntrepotDto mapToDto(Entrepot entity) {
        EntrepotDto dto = new EntrepotDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAddress(entity.getAddress());
        dto.setCapacity(entity.getCapacity());
        dto.setActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        if (entity.getResponsable() != null) {
            dto.setResponsable(mapPersonToDto(entity.getResponsable()));
        }
        return dto;
    }

    private PersonDto mapPersonToDto(Person person) {
        PersonDto dto = new PersonDto();
        dto.setId(person.getId());
        dto.setName(person.getName());
        dto.setPhone(person.getPhone());
        dto.setEmail(person.getEmail());
        dto.setType(person.getType());
        dto.setActive(person.getIsActive());
        return dto;
    }
}