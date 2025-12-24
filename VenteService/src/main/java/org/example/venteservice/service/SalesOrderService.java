package org.example.venteservice.service;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.venteservice.client.ComptabiliteClient;
import org.example.venteservice.client.LivraisonClient;
import org.example.venteservice.client.StockClient;
import org.example.venteservice.dto.*;
import org.example.venteservice.dto.external.*;
import org.example.venteservice.entity.SalesOrder;
import org.example.venteservice.mapper.SalesOrderMapper;
import org.example.venteservice.repository.SalesOrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SalesOrderService {

    private final SalesOrderRepository repository;
    private final SalesOrderMapper salesOrderMapper;
    private final StockClient stockClient;
    private final LivraisonClient livraisonClient;
    private final ComptabiliteClient comptaClient;

    private static final Logger log = LoggerFactory.getLogger(SalesOrderService.class);

    public List<SalesOrderResponse> getAll() {
        return repository.findAll().stream()
                .map(salesOrderMapper::toDto)
                .toList();
    }

    public SalesOrderResponse getById(UUID id) {
        SalesOrder order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande vente non trouvée : " + id));
        return salesOrderMapper.toDto(order);
    }

    public SalesOrderResponse create(SalesOrderRequest request) {
        SalesOrder order = salesOrderMapper.toEntity(request);
        order.setStatus("PENDING");
        calculateTotal(order);

        SalesOrder saved = repository.save(order);

        reserveStock(saved);

        return salesOrderMapper.toDto(saved);
    }

    @Transactional // tout réussit ou tout est rollback
    public SalesOrderResponse confirm(UUID id) {
        SalesOrder order = getOrderById(id);

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Seule une commande en statut PENDING peut être confirmée");
        }

        order.setStatus("CONFIRMED");
        order.setUpdatedAt(LocalDateTime.now());

        // creation de la livraison
        DeliveryRequest deliveryRequest = DeliveryRequest.builder()
                .orderReference(order.getOrderNumber())
                .warehouseId(order.getWarehouseId())
                .status("PENDING")
                .scheduledDate(order.getExpectedDeliveryDate())
                .notes("Livraison automatique pour commande vente " + order.getOrderNumber())
                .items(order.getItems().stream()
                        .map(item -> DeliveryItemDto.builder()
                                .productId(item.getProductId())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .build())
                        .toList())
                .build();

        DeliveryResponse createdDelivery = livraisonClient.createDelivery(deliveryRequest);
        order.setDeliveryId(createdDelivery.getId());

        // creation de la facture dans comptabilite service
        try {
            ResponseEntity<?> invoiceResponse = comptaClient.createInvoiceFromSale(order.getId());

            if (!invoiceResponse.getStatusCode().is2xxSuccessful()) {
                log.warn("Facture créée mais réponse non-2xx pour la vente {} : {}", order.getId(), invoiceResponse.getStatusCode());
            } else {
                log.info("Facture créée avec succès pour la vente {}", order.getId());
            }
        } catch (FeignException e) {
            log.error("Échec de création de la facture pour la vente {} : {}. " +
                            "La facture devra être créée manuellement ou via retry plus tard.",
                    order.getId(), e.getMessage());
        }

        // Sauvegarde finale de la commande (avec deliveryId mis à jour)
        SalesOrder savedOrder = repository.save(order);

        return salesOrderMapper.toDto(savedOrder);
    }

    public SalesOrderResponse complete(UUID id) {
        SalesOrder order = getOrderById(id);

        if (!"CONFIRMED".equals(order.getStatus())) {
            throw new RuntimeException("La commande doit être CONFIRMED pour être finalisée");
        }

        order.setStatus("COMPLETED");
        order.setUpdatedAt(LocalDateTime.now());

        repository.save(order);
        return salesOrderMapper.toDto(order);
    }

    public void delete(UUID id) {
        SalesOrder order = getOrderById(id);

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Seules les commandes PENDING peuvent être supprimées");
        }

        repository.delete(order);
    }

    // Méthodes privées
    private SalesOrder getOrderById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande vente non trouvée : " + id));
    }

    private void calculateTotal(SalesOrder order) {
        BigDecimal total = order.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);

        order.getItems().forEach(item -> {
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        });
    }

    private void reserveStock(SalesOrder order) {
        ReserveStockRequest request = ReserveStockRequest.builder()
                .warehouseId(order.getWarehouseId())
                .items(order.getItems().stream()
                        .map(item -> ReserveStockItem.builder()
                                .productId(item.getProductId())
                                .quantity(item.getQuantity())
                                .build())
                        .toList())
                .build();

        stockClient.reserveStock(request);
    }
}