package org.example.comptabiliteservice.controller;

import jakarta.validation.Valid;
import org.example.comptabiliteservice.dto.AddPaymentRequest;
import org.example.comptabiliteservice.dto.InvoiceRequest;
import org.example.comptabiliteservice.dto.InvoiceResponse;
import org.example.comptabiliteservice.dto.PaymentDto;
import org.example.comptabiliteservice.service.InvoiceService;
import org.example.comptabiliteservice.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService service;
    private final PaymentService paymentService;

    public InvoiceController(InvoiceService service, PaymentService paymentService) {
        this.service = service;
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<InvoiceResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getById(@PathVariable("id") UUID id) {
        InvoiceResponse response = service.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<InvoiceResponse> create(@RequestBody InvoiceRequest request) {
        InvoiceResponse response = service.create(request);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceResponse> update(
            @PathVariable("id") UUID id,
            @RequestBody InvoiceRequest request) {
        InvoiceResponse response = service.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // === Création idempotente à partir d’une vente ===
    @PostMapping("/from-sale/{saleId}")
    public ResponseEntity<InvoiceResponse> createFromSale(@PathVariable("saleId") UUID saleId) {
        // Vérification efficace via le repository
        var existing = service.findExistingInvoice("Sale", saleId);

        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get()); // Déjà existante → 200 OK
        }

        InvoiceResponse created = service.createFromSale(saleId);
        return ResponseEntity.status(201).body(created); // Nouvelle → 201 Created
    }

    // === Création idempotente à partir d’un achat/commande ===
    @PostMapping("/from-purchase/{purchaseId}")
    public ResponseEntity<InvoiceResponse> createFromPurchase(@PathVariable("purchaseId") UUID purchaseId) {
        var existing = service.findExistingInvoice("PurchaseOrder", purchaseId);

        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        InvoiceResponse created = service.createFromPurchase(purchaseId);
        return ResponseEntity.status(201).body(created);
    }

    // === Ajouter un paiement à une facture spécifique ===
    @PostMapping("/{invoiceId}/payments")
    public ResponseEntity<PaymentDto> addPayment(
            @PathVariable("invoiceId") UUID invoiceId,
            @RequestBody @Valid AddPaymentRequest request) {

        PaymentDto payment = paymentService.addPaymentToInvoice(invoiceId, request);
        return ResponseEntity.status(201).body(payment);
    }

    @PostMapping("/{invoiceId}/outgoing-payments")
    public ResponseEntity<PaymentDto> addOutgoingPayment(
            @PathVariable("invoiceId") UUID invoiceId,
            @RequestBody @Valid AddPaymentRequest request) {

        PaymentDto payment = paymentService.addOutgoingPaymentToSupplierInvoice(invoiceId, request);
        return ResponseEntity.status(201).body(payment);
    }

}