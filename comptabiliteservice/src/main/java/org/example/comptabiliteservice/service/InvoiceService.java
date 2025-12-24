package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.client.CommandeClient;
import org.example.comptabiliteservice.client.VenteClient;
import org.example.comptabiliteservice.dto.InvoiceRequest;
import org.example.comptabiliteservice.dto.InvoiceResponse;
import org.example.comptabiliteservice.dto.external.PurchaseResponse;
import org.example.comptabiliteservice.dto.external.SaleResponse;
import org.example.comptabiliteservice.entity.Invoice;
import org.example.comptabiliteservice.entity.InvoiceItem;
import org.example.comptabiliteservice.mapper.InvoiceMapper;
import org.example.comptabiliteservice.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class InvoiceService {

    private final InvoiceRepository repository;
    private final InvoiceMapper mapper;
    private final VenteClient venteClient;
    private final CommandeClient commandeClient;

    public InvoiceService(InvoiceRepository repository,
                          InvoiceMapper invoiceMapper,
                          VenteClient venteClient,
                          CommandeClient commandeClient) {
        this.repository = repository;
        this.mapper = invoiceMapper;
        this.venteClient = venteClient;
        this.commandeClient = commandeClient;
    }

    // === Méthodes CRUD classiques (cas manuels) ===
    public List<InvoiceResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    public InvoiceResponse getById(UUID id) {
        Invoice entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return mapper.toDto(entity);
    }

    public InvoiceResponse create(InvoiceRequest request) {
        Invoice entity = mapper.toEntity(request);
        updateInvoiceStatus(entity);
        Invoice saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public InvoiceResponse update(UUID id, InvoiceRequest request) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Invoice not found for update");
        }
        Invoice entity = mapper.toEntityForUpdate(id, request);
        updateInvoiceStatus(entity);
        Invoice updated = repository.save(entity);
        return mapper.toDto(updated);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public InvoiceResponse createFromSale(UUID saleId) {
        SaleResponse sale = venteClient.getSaleById(saleId);

        Invoice invoice = Invoice.builder()
                .invoiceType("Customer")
                .referenceId(sale.getId())
                .referenceType("Sale")
                .customerId(sale.getCustomerId())
                .currency(sale.getCurrency())
                .paymentMethod(sale.getPaymentMethod())
                .totalAmount(sale.getTotalAmount())
                .taxAmount(sale.getTaxAmount())
                .discountAmount(sale.getDiscountAmount())
                .status("Pending")
                .build();

        List<InvoiceItem> items = sale.getItems().stream()
                .map(item -> InvoiceItem.builder()
                        .invoice(invoice)
                        .productId(item.getProductId())
                        .description(item.getDescription())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .taxRate(item.getTaxRate())
                        .discountRate(item.getDiscountRate())
                        .build())
                .toList();

        invoice.setItems(items);
        invoice.setPayments(List.of());

        updateInvoiceStatus(invoice);
        Invoice saved = repository.save(invoice);
        return mapper.toDto(saved);
    }

    public InvoiceResponse createFromPurchase(UUID purchaseId) {
        PurchaseResponse purchase = commandeClient.getPurchaseById(purchaseId);

        Invoice invoice = Invoice.builder()
                .invoiceType("Supplier")
                .referenceId(purchase.getId())
                .referenceType("PurchaseOrder")
                .supplierId(purchase.getSupplierId())
                .currency(purchase.getCurrency())
                .paymentMethod(purchase.getPaymentMethod())
                .totalAmount(purchase.getTotalAmount())
                .taxAmount(purchase.getTaxAmount())
                .discountAmount(purchase.getDiscountAmount())
                .status("Pending")
                .build();

        List<InvoiceItem> items = purchase.getItems().stream()
                .map(item -> InvoiceItem.builder()
                        .invoice(invoice)
                        .productId(item.getProductId())
                        .description(item.getDescription())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .taxRate(item.getTaxRate())
                        .discountRate(item.getDiscountRate())
                        .build())
                .toList();

        invoice.setItems(items);
        invoice.setPayments(List.of());

        updateInvoiceStatus(invoice);
        Invoice saved = repository.save(invoice);
        return mapper.toDto(saved);
    }

    // Méthode utilitaire pour calculer le statut
    private void updateInvoiceStatus(Invoice invoice) {
        double totalPaid = invoice.getPayments().stream()
                .mapToDouble(p -> p.getAmountPaid() != null ? p.getAmountPaid() : 0.0)
                .sum();

        double totalDue = invoice.getTotalAmount() != null ? invoice.getTotalAmount() : 0.0;

        if (totalDue == 0) {
            invoice.setStatus("Draft");
        } else if (totalPaid >= totalDue) {
            invoice.setStatus("Paid");
        } else if (totalPaid > 0) {
            invoice.setStatus("Partially Paid");
        } else {
            invoice.setStatus("Pending");
        }
    }

    // Méthode utilitaire pour récupérer une facture existante par référence
    public Optional<InvoiceResponse> findExistingInvoice(String referenceType, UUID referenceId) {
        return repository.findByReferenceTypeAndReferenceId(referenceType, referenceId)
                .map(mapper::toDto);
    }

}