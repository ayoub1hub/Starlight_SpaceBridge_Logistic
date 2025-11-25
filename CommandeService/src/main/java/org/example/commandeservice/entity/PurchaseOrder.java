package CommandeService.src.main.java.org.example.commandeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.commandeservice.entity.Supplier;
import org.example.commandeservice.entity.PurchaseOrderItem;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;

    private String status;          // e.g. "Pending", "Received", "Cancelled"
    private UUID warehouseId;       // references warehouse (from another microservice)

    private Double totalAmount;
    private String currency;
    private String paymentStatus;   // e.g. "Paid", "Unpaid", "Partial"

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String customsStatus;
    private String trackingNumber;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private CustomsDeclaration customsDeclaration;


}