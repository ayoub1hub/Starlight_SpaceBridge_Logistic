package org.example.commandeservice.service;

import org.example.commandeservice.client.StockClient;
import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.example.commandeservice.dto.ReceiveOrderItem;
import org.example.commandeservice.dto.ReceiveOrderRequest;
import org.example.commandeservice.dto.external.StockUpdateItem;
import org.example.commandeservice.dto.external.StockUpdateRequest;
import org.example.commandeservice.entity.PurchaseOrder;
import org.example.commandeservice.entity.PurchaseOrderItem;
import org.example.commandeservice.entity.Supplier;
import org.example.commandeservice.mapper.PurchaseOrderMapper;
import org.example.commandeservice.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseOrderService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository repository;
    private final PurchaseOrderMapper mapper;
    private final StockClient stockClient;

    public PurchaseOrderService(SupplierRepository supplierRepository, PurchaseOrderRepository repository, PurchaseOrderMapper purchaseOrderMapper, StockClient stockClient) {
        this.supplierRepository = supplierRepository;
        this.repository = repository;
        this.mapper = purchaseOrderMapper;
        this.stockClient = stockClient;
    }

    public List<PurchaseOrderResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getById(UUID id) {
        PurchaseOrder entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        return mapper.toDto(entity);   // tout est déjà chargé grâce à @EntityGraph
    }

    public PurchaseOrderResponse create(PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        PurchaseOrder order = new PurchaseOrder();
        order.setOrderNumber(request.getOrderNumber());
        order.setSupplier(supplier);
        order.setStatus(request.getStatus() != null ? request.getStatus() : "DRAFT");
        order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());

        List<PurchaseOrderItem> items = request.getItems().stream()
                .map(dto -> {
                    PurchaseOrderItem item = new PurchaseOrderItem();
                    item.setProductId(dto.getProductId());
                    item.setQuantity(dto.getQuantity());
                    item.setUnitPrice(dto.getUnitPrice());
                    BigDecimal totalPrice = dto.getUnitPrice()
                            .multiply(BigDecimal.valueOf(dto.getQuantity()));
                    item.setTotalPrice(totalPrice);
                    item.setPurchaseOrder(order);
                    return item;
                })
                .collect(Collectors.toList());

        order.setItems(items);

        BigDecimal total = items.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        PurchaseOrder saved = repository.save(order);
        return mapper.toDto(saved); // mapper now sets purchaseOrderId automatically
    }


    public PurchaseOrderResponse update(UUID id, PurchaseOrderRequest request) {
        // Find existing entity
        PurchaseOrder existingEntity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found for update with id: " + id));

        // Update existing entity with new data from request
        mapper.updateEntityFromDto(request, existingEntity);

        // Update timestamp
        existingEntity.setUpdatedAt(LocalDateTime.now());

        // Save updated entity
        PurchaseOrder updatedEntity = repository.save(existingEntity);

        // Convert to DTO and return
        return mapper.toDto(updatedEntity);
    }

    @Transactional
    public PurchaseOrderResponse receiveOrder(UUID orderId, ReceiveOrderRequest request) {
        // Chargement de la commande avec ses items
        PurchaseOrder order = repository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Commande d'achat non trouvée : " + orderId));

        // Vérification du statut
        if (!"APPROVED".equals(order.getStatus())) {
            throw new RuntimeException("Seule une commande APPROVED peut être reçue. Statut actuel : " + order.getStatus());
        }

        // Compteurs pour déterminer le statut final
        int totalItems = order.getItems().size();
        int fullyReceivedItems = 0;

        // Traitement de chaque item reçu
        for (ReceiveOrderItem receiveItem : request.getItems()) {
            PurchaseOrderItem item = order.getItems().stream()
                    .filter(i -> i.getId().equals(receiveItem.getItemId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Item non trouvé dans la commande : " + receiveItem.getItemId()));

            // Mise à jour de la quantité reçue
            Integer currentReceived = item.getReceivedQuantity() != null ? item.getReceivedQuantity() : 0;
            int newReceived = currentReceived + receiveItem.getReceivedQuantity();
            item.setReceivedQuantity(newReceived);

            // Vérification si l'item est complètement reçu
            if (newReceived >= item.getQuantity()) {
                fullyReceivedItems++;
            }
        }

        // Mise à jour du statut de la commande
        if (fullyReceivedItems == totalItems) {
            order.setStatus("RECEIVED");
        } else {
            order.setStatus("PARTIALLY_RECEIVED");
        }

        // Appel à stockservice pour ajouter les quantités reçues au stock
        StockUpdateRequest stockRequest = buildStockUpdateRequest(order, request);
        stockClient.updateStockOnReceive(stockRequest);

        // Sauvegarde et retour
        PurchaseOrder saved = repository.save(order);
        return mapper.toDto(saved);
    }

    // Méthode privée pour construire la requête vers stockservice
    private StockUpdateRequest buildStockUpdateRequest(PurchaseOrder order, ReceiveOrderRequest request) {
        List<StockUpdateItem> stockItems = request.getItems().stream()
                .map(receiveItem -> {
                    PurchaseOrderItem orderItem = order.getItems().stream()
                            .filter(i -> i.getId().equals(receiveItem.getItemId()))
                            .findFirst()
                            .orElseThrow();

                    return StockUpdateItem.builder()
                            .productId(orderItem.getProductId())
                            .quantity(receiveItem.getReceivedQuantity())
                            .build();
                })
                .toList();

        return StockUpdateRequest.builder()
                .warehouseId(order.getWarehouseId())
                .items(stockItems)
                .build();
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Order not found for deletion with id: " + id);
        }
        repository.deleteById(id);
    }
}