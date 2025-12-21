package org.example.stockservice.service;
import org.example.stockservice.dto.PersonDto;
import org.example.stockservice.entity.Person;
import org.example.stockservice.mapper.PersonMapper;
import org.example.stockservice.repository.PersonRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public class PersonService {
    private final PersonRepository personRepository;
    private final PersonMapper personMapper;
    public PersonService(PersonRepository personRepository, PersonMapper personMapper) {
        this.personRepository = personRepository;
        this.personMapper = personMapper;
    }
    public List<PersonDto> getAllPersons() {
        return personRepository.findAll().stream()
                .map(personMapper::toDto)
                .collect(Collectors.toList());
    }
    public PersonDto getPersonById(UUID id) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found with ID: " + id));
        return personMapper.toDto(person);
    }
    public PersonDto createPerson(PersonDto dto) {
// Optionnel : vérifier l'unicité de l'email si nécessaire
// Pour l'instant, on suit exactement le modèle de ProduitService
        Person entity = personMapper.toEntity(dto);
        Person saved = personRepository.save(entity);
        return personMapper.toDto(saved);
    }
    public PersonDto updatePerson(UUID id, PersonDto dto) {
        Person existing = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found with ID: " + id));
        Person updated = personMapper.toEntity(dto);
        updated.setId(id);
        updated.setCreatedAt(existing.getCreatedAt()); // préserve la date de création
        Person saved = personRepository.save(updated);
        return personMapper.toDto(saved);
    }
    public void deletePerson(UUID id) {
        if (!personRepository.existsById(id)) {
            throw new RuntimeException("Person not found with ID: " + id);
        }
        personRepository.deleteById(id);
    }
}