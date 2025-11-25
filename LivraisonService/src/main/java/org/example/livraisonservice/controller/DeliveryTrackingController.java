package LivraisonService.src.main.java.org.example.livraisonservice.controller;

import LivraisonService.src.main.java.org.example.livraisonservice.dto.DeliveryTrackingDto;
import LivraisonService.src.main.java.org.example.livraisonservice.service.DeliveryTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "*")
public class DeliveryTrackingController {

    @Autowired
    private DeliveryTrackingService trackingService;

    @PostMapping("/location")
    public ResponseEntity<Void> recordLocation(
            @RequestParam UUID deliveryId,
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam String status) {

        trackingService.recordLocation(deliveryId, lat, lng, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history/{deliveryId}")
    public ResponseEntity<List<DeliveryTrackingDto>> getTrackingHistory(
            @PathVariable UUID deliveryId) {
        List<DeliveryTrackingDto> history = trackingService.getTrackingHistory(deliveryId);
        return ResponseEntity.ok(history);
    }
}