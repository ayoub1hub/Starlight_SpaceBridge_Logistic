package org.example.stockservice.controller;
import jakarta.validation.Valid;
import org.example.stockservice.dto.PersonDto;
import org.example.stockservice.service.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/persons")

public class PersonController {
    private final PersonService personService;
    public PersonController(PersonService personService) {
        this.personService = personService;
    }
    @GetMapping
    public ResponseEntity<List<PersonDto>> getAllPersons() {
        return ResponseEntity.ok(personService.getAllPersons());
    }
    @GetMapping("/{id}")
    public ResponseEntity<PersonDto> getPerson(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(personService.getPersonById(id));
    }
    @PostMapping
    public ResponseEntity<PersonDto> createPerson(@Valid @RequestBody PersonDto dto) {
        PersonDto result = personService.createPerson(dto);
        return ResponseEntity.ok(result);
    }
    @PutMapping("/{id}")
    public ResponseEntity<PersonDto> updatePerson(@PathVariable("id") UUID id, @Valid @RequestBody PersonDto dto) {
        return ResponseEntity.ok(personService.updatePerson(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable("id") UUID id) {
        personService.deletePerson(id);
        return ResponseEntity.noContent().build();
    }
}