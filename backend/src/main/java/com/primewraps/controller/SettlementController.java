package com.primewraps.controller;

import com.primewraps.model.Settlement;
import com.primewraps.model.SettlementStatus;
import com.primewraps.service.SettlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;
import com.primewraps.dto.PartialPaymentRequest;

/**
 * REST controller for Settlement-related operations.
 */
@RestController
@RequestMapping("/api/settlements")
@CrossOrigin(origins = "*")
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    /**
     * Create a new settlement.
     */
    @PostMapping
    public ResponseEntity<?> createSettlement(@RequestBody Settlement settlement) {
        return settlementService.createSettlement(settlement);
    }

    /**
     * Get all settlements.
     */
    @GetMapping
    public ResponseEntity<?> getAllSettlements() {
        return settlementService.getAllSettlements();
    }

    /**
     * Get a settlement by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSettlementById(@PathVariable Long id) {
        return settlementService.getSettlementById(id);
    }

    /**
     * Update a settlement.
     */
    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily removed
    public ResponseEntity<?> updateSettlement(@PathVariable Long id, @RequestBody Settlement settlement) {
        return settlementService.updateSettlement(id, settlement);
    }

    /**
     * Delete a settlement.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSettlement(@PathVariable Long id) {
        return settlementService.deleteSettlement(id);
    }

    /**
     * Update settlement status.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateSettlementStatus(@PathVariable Long id, @RequestParam SettlementStatus status) {
        return settlementService.updateSettlementStatus(id, status);
    }

    /**
     * Update settlement status with payment details.
     */
    @PatchMapping("/{id}/status-with-payment")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily removed
    public ResponseEntity<?> updateSettlementStatusWithPayment(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) String notes) {
        try {
            return settlementService.updateSettlementStatusWithPayment(id, SettlementStatus.valueOf(status), paymentMethod, notes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating settlement: " + e.getMessage());
        }
    }

    /**
     * Get settlements by status.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getSettlementsByStatus(@PathVariable SettlementStatus status) {
        return settlementService.getSettlementsByStatus(status);
    }

    /**
     * Get settlements by user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getSettlementsByUser(@PathVariable Long userId) {
        return settlementService.getSettlementsByUser(userId);
    }

    /**
     * Get pending settlements.
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingSettlements() {
        System.out.println("SettlementController: getPendingSettlements called");
        
        // Debug authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            System.out.println("SettlementController: Authenticated user: " + auth.getName());
            System.out.println("SettlementController: User authorities: " + auth.getAuthorities());
        } else {
            System.out.println("SettlementController: No authentication found");
        }
        
        try {
            return settlementService.getPendingSettlements();
        } catch (Exception e) {
            System.err.println("SettlementController: Error in getPendingSettlements: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    /**
     * Get overdue settlements.
     */
    @GetMapping("/overdue")
    public ResponseEntity<?> getOverdueSettlements() {
        return settlementService.getOverdueSettlements();
    }

    /**
     * Calculate settlements based on shared expenses.
     */
    @GetMapping("/calculate")
    public ResponseEntity<?> calculateSettlements() {
        return settlementService.calculateSettlements();
    }

    /**
     * Manually trigger settlement creation for all shared expenses.
     */
    @PostMapping("/create-settlements")
    public ResponseEntity<?> createSettlements() {
        try {
            settlementService.updateAndPersistSettlements();
            return ResponseEntity.ok("Settlements created successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating settlements: " + e.getMessage());
        }
    }

    /**
     * Get settlement summary statistics.
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getSettlementSummary() {
        return settlementService.getSettlementSummary();
    }

    /**
     * Debug endpoint to check current user authentication.
     */
    @GetMapping("/debug-auth")
    public ResponseEntity<?> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return ResponseEntity.ok(Map.of(
                "username", auth.getName(),
                "authorities", auth.getAuthorities().stream().map(Object::toString).collect(Collectors.toList()),
                "authenticated", auth.isAuthenticated()
            ));
        } else {
            return ResponseEntity.ok(Map.of("message", "No authentication found"));
        }
    }

    @PostMapping("/partial-payment")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily removed
    public ResponseEntity<?> createPartialPaymentRecord(@RequestBody PartialPaymentRequest request) {
        try {
            Settlement paymentRecord = settlementService.createPartialPaymentRecord(request);
            return ResponseEntity.ok(paymentRecord);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating partial payment record: " + e.getMessage());
        }
    }
}
