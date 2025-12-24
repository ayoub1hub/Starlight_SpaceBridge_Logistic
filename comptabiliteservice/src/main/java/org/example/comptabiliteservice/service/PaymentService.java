package org.example.comptabiliteservice.service;

import lombok.extern.slf4j.Slf4j;
import org.example.comptabiliteservice.dto.AddPaymentRequest;
import org.example.comptabiliteservice.dto.PaymentDto;
import org.example.comptabiliteservice.entity.Invoice;
import org.example.comptabiliteservice.entity.Payment;
import org.example.comptabiliteservice.mapper.PaymentMapper;
import org.example.comptabiliteservice.repository.InvoiceRepository;
import org.example.comptabiliteservice.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentMapper mapper;

    public PaymentService(PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository,
                          PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.mapper = paymentMapper;
    }

    // === CRUD classique (garde l'ancien endpoint /api/payments) ===
    public List<PaymentDto> getAll() {
        return paymentRepository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    public PaymentDto getById(UUID id) {
        Payment entity = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapper.toDto(entity);
    }

    public PaymentDto save(PaymentDto dto) {
        Payment entity = mapper.toEntity(dto);
        Payment saved = paymentRepository.save(entity);
        updateInvoiceStatusIfLinked(saved);
        return mapper.toDto(saved);
    }

    public PaymentDto update(UUID id, PaymentDto dto) {
        if (!paymentRepository.existsById(id)) {
            throw new RuntimeException("Payment not found for update");
        }
        Payment entity = mapper.toEntity(dto);
        entity.setId(id);
        Payment updated = paymentRepository.save(entity);
        updateInvoiceStatusIfLinked(updated);
        return mapper.toDto(updated);
    }

    public void delete(UUID id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        paymentRepository.delete(payment);
        updateInvoiceStatusIfLinked(payment); // recalcule après suppression
    }

    // === Nouvelle méthode : ajouter un paiement à une facture spécifique ===
    // Dans PaymentService.java

    public PaymentDto addPaymentToInvoice(UUID invoiceId, AddPaymentRequest request) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));

        // Validations
        if (request.getAmountPaid() == null || request.getAmountPaid() <= 0) {
            throw new IllegalArgumentException("Le montant payé doit être positif");
        }

        double remainingToPay = calculateRemainingAmount(invoice);

        if (request.getAmountPaid() > remainingToPay) {
            throw new IllegalArgumentException(
                    String.format("Le montant payé (%.2f) dépasse le montant restant dû (%.2f)",
                            request.getAmountPaid(), remainingToPay));
        }

        // Optionnel : vérifier la devise (peut être assoupli selon votre business)
        if (request.getCurrency() != null && !request.getCurrency().equals(invoice.getCurrency())) {
            log.warn("Paiement en devise différente ({}) pour facture en {}",
                    request.getCurrency(), invoice.getCurrency());
            // Vous pouvez aussi throw une exception si vous voulez être strict
        }

        Payment payment = Payment.builder()
                .invoice(invoice)
                .paymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDateTime.now())
                .amountPaid(request.getAmountPaid())
                .currency(request.getCurrency() != null ? request.getCurrency() : invoice.getCurrency())
                .paymentMethod(request.getPaymentMethod())
                .transactionReference(request.getTransactionReference())
                .notes(request.getNotes())
                .receivedBy(request.getReceivedBy())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        updateInvoiceStatus(invoice);

        log.info("Paiement de {} {} ajouté à la facture {}. Reste à payer : {}",
                request.getAmountPaid(), request.getCurrency(), invoiceId, calculateRemainingAmount(invoice));

        return mapper.toDto(savedPayment);
    }

    // Méthode utilitaire pour calculer le montant restant
    private double calculateRemainingAmount(Invoice invoice) {
        double totalPaid = invoice.getPayments().stream()
                .mapToDouble(p -> p.getAmountPaid() != null ? p.getAmountPaid() : 0.0)
                .sum();

        return (invoice.getTotalAmount() != null ? invoice.getTotalAmount() : 0.0) - totalPaid;
    }

    /**
     * Ajoute un paiement sortant pour une facture fournisseur
     */
    public PaymentDto addOutgoingPaymentToSupplierInvoice(UUID invoiceId, AddPaymentRequest request) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));

        if (!"Supplier".equals(invoice.getInvoiceType())) {
            throw new IllegalArgumentException("Cet endpoint est réservé aux factures fournisseurs");
        }

        // Même logique de validation que pour les paiements entrants
        if (request.getAmountPaid() == null || request.getAmountPaid() <= 0) {
            throw new IllegalArgumentException("Le montant payé doit être positif");
        }

        double remaining = calculateRemainingAmount(invoice);

        if (request.getAmountPaid() > remaining) {
            throw new IllegalArgumentException(
                    String.format("Montant payé (%.2f) supérieur au reste à payer (%.2f)",
                            request.getAmountPaid(), remaining));
        }

        Payment payment = Payment.builder()
                .invoice(invoice)
                .paymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDateTime.now())
                .amountPaid(request.getAmountPaid())  // positif = paiement sortant
                .currency(request.getCurrency() != null ? request.getCurrency() : invoice.getCurrency())
                .paymentMethod(request.getPaymentMethod())
                .transactionReference(request.getTransactionReference())
                .notes(request.getNotes())
                .receivedBy(request.getReceivedBy())
                .build();

        Payment saved = paymentRepository.save(payment);
        updateInvoiceStatus(invoice);

        log.info("Paiement sortant de {} {} enregistré pour facture fournisseur {}. Reste à payer : {}",
                request.getAmountPaid(), request.getCurrency(), invoiceId, calculateRemainingAmount(invoice));

        return mapper.toDto(saved);
    }

    // === Méthode utilitaire pour mettre à jour le statut de la facture ===
    private void updateInvoiceStatus(Invoice invoice) {
        double totalPaid = invoice.getPayments().stream()
                .mapToDouble(p -> p.getAmountPaid() != null ? p.getAmountPaid() : 0.0)
                .sum();

        double totalDue = invoice.getTotalAmount() != null ? invoice.getTotalAmount() : 0.0;

        String newStatus;
        if (totalDue == 0) {
            newStatus = "Draft";
        } else if (totalPaid >= totalDue) {
            newStatus = "Paid";
        } else if (totalPaid > 0) {
            newStatus = "Partially Paid";
        } else {
            newStatus = "Pending";
        }

        invoice.setStatus(newStatus);
        invoiceRepository.save(invoice); // nécessaire car on est dans la même transaction
    }

    // Appelé lors des opérations sur paiements "libres"
    private void updateInvoiceStatusIfLinked(Payment payment) {
        if (payment.getInvoice() != null) {
            updateInvoiceStatus(payment.getInvoice());
        }
    }
}