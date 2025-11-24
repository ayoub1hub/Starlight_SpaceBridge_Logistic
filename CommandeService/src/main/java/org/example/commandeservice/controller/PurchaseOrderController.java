package org.example.commandeservice.controller;

import org.example.sslproject.commandeservice.entity.PurchaseOrder;
import org.example.sslproject.commandeservice.service.PurchaseOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService service;

    public PurchaseOrderController(PurchaseOrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<PurchaseOrder> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Optional<PurchaseOrder> getById(@PathVariable UUID id) { return service.getById(id); }

    @PostMapping
    public PurchaseOrder create(@RequestBody PurchaseOrder order) { return service.save(order); }

    @PutMapping("/{id}")
    public PurchaseOrder update(@PathVariable UUID id, @RequestBody PurchaseOrder order) {
        order.setId(id);
        return service.save(order);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) { service.delete(id); }
}