package org.example.comptabiliteservice.controller;

import org.example.comptabiliteservice.dto.InvoiceItemDto;
import org.example.comptabiliteservice.service.InvoiceItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoice-items")
@CrossOrigin(origins = "*")
public class InvoiceItemController {

    private final InvoiceItemService service;

    public InvoiceItemController(InvoiceItemService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<InvoiceItemDto> createInvoiceItem(@RequestBody InvoiceItemDto dto) {
        InvoiceItemDto created = service.createInvoiceItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceItemDto> getInvoiceItemById(@PathVariable UUID id) {
        InvoiceItemDto dto = service.getInvoiceItemById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<InvoiceItemDto>> getAllInvoiceItems() {
        List<InvoiceItemDto> list = service.getAllInvoiceItems();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceItemDto> updateInvoiceItem(
            @PathVariable UUID id,
            @RequestBody InvoiceItemDto dto) {
        InvoiceItemDto updated = service.updateInvoiceItem(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoiceItem(@PathVariable UUID id) {
        service.deleteInvoiceItem(id);
        return ResponseEntity.noContent().build();
    }
}
