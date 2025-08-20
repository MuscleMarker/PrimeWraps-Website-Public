package com.primewraps.service;

import com.primewraps.model.*;
import com.primewraps.repository.SettlementRepository;
import com.primewraps.repository.ExpenseRepository;
import com.primewraps.repository.UserRepository;
import com.primewraps.dto.PartialPaymentRequest;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SettlementService {

    @Autowired
    private SettlementRepository settlementRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> createSettlement(Settlement settlement) {
        try {
            // Validate required fields
            if (settlement.getFromUser() == null || settlement.getToUser() == null) {
                return ResponseEntity.badRequest().body("Both fromUser and toUser are required");
            }

            if (settlement.getAmount() == null || settlement.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body("Amount must be greater than zero");
            }

            // Set default values
            settlement.setCreatedAt(LocalDateTime.now());
            settlement.setStatus(SettlementStatus.PENDING);
            settlement.setDueDate(LocalDateTime.now().plusDays(30)); // Default 30 days

            Settlement savedSettlement = settlementRepository.save(settlement);
            return ResponseEntity.ok(savedSettlement);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating settlement: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getAllSettlements() {
        try {
            List<Settlement> settlements = settlementRepository.findAll();
            return ResponseEntity.ok(settlements);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching settlements: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getSettlementById(Long id) {
        try {
            Optional<Settlement> settlementOpt = settlementRepository.findById(id);
            if (settlementOpt.isPresent()) {
                return ResponseEntity.ok(settlementOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching settlement: " + e.getMessage());
        }
    }

    public Settlement updateSettlement(Long id, Settlement settlementDetails) {
        Settlement settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        // Validate amount before updating
        if (settlementDetails.getAmount() != null) {
            if (settlementDetails.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Settlement amount must be greater than zero");
            }
            settlement.setAmount(settlementDetails.getAmount());
        }
        
        return settlementRepository.save(settlement);
    }

    public ResponseEntity<?> deleteSettlement(Long id) {
        try {
            Optional<Settlement> settlementOpt = settlementRepository.findById(id);
            if (!settlementOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Settlement settlement = settlementOpt.get();
            
            // Only allow deletion of pending settlements
            if (settlement.getStatus() != SettlementStatus.PENDING) {
                return ResponseEntity.badRequest().body("Cannot delete non-pending settlements");
            }

            settlementRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting settlement: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateSettlementStatus(Long id, SettlementStatus status) {
        try {
            Optional<Settlement> settlementOpt = settlementRepository.findById(id);
            if (!settlementOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Settlement settlement = settlementOpt.get();
            settlement.setStatus(status);
            
            // Update paid date if status is PAID
            if (status == SettlementStatus.PAID && settlement.getPaidDate() == null) {
                settlement.setPaidDate(LocalDateTime.now());
            }

            Settlement updatedSettlement = settlementRepository.save(settlement);
            return ResponseEntity.ok(updatedSettlement);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating settlement status: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateSettlementStatusWithPayment(Long id, SettlementStatus status, String paymentMethod, String notes) {
        try {
            Settlement settlement = settlementRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Settlement not found"));

            settlement.setStatus(status);
            if (status == SettlementStatus.PAID) {
                settlement.setPaidDate(LocalDateTime.now());
                settlement.setPaymentMethod(paymentMethod);
                settlement.setNotes(notes);
            }

            Settlement updatedSettlement = settlementRepository.save(settlement);
            
            // After marking a settlement as paid, recalculate all settlements to update balances
            if (status == SettlementStatus.PAID) {
                System.out.println("Settlement marked as paid, recalculating settlements...");
                updateAndPersistSettlements();
            }
            
            return ResponseEntity.ok(updatedSettlement);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating settlement: " + e.getMessage());
        }
    }



    public Settlement createPartialPaymentRecord(PartialPaymentRequest request) {
        // Get the original settlement to copy user details
        Settlement originalSettlement = settlementRepository.findById(request.getOriginalSettlementId())
                .orElseThrow(() -> new RuntimeException("Original settlement not found"));

        // Create a new settlement record for the partial payment
        Settlement paymentRecord = new Settlement();
        paymentRecord.setFromUser(originalSettlement.getFromUser());
        paymentRecord.setToUser(originalSettlement.getToUser());
        paymentRecord.setAmount(request.getAmountPaid());
        paymentRecord.setStatus(SettlementStatus.PAID);
        paymentRecord.setDueDate(originalSettlement.getDueDate());
        paymentRecord.setPaidDate(LocalDateTime.now());
        paymentRecord.setPaymentMethod(request.getPaymentMethod());
        paymentRecord.setNotes(request.getNotes());

        return settlementRepository.save(paymentRecord);
    }

    public ResponseEntity<?> getSettlementsByStatus(SettlementStatus status) {
        try {
            List<Settlement> settlements = settlementRepository.findByStatus(status);
            return ResponseEntity.ok(settlements);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching settlements by status: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getSettlementsByUser(Long userId) {
        try {
            List<Settlement> settlements = settlementRepository.findByFromUserOrToUser(userId, userId);
            return ResponseEntity.ok(settlements);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching settlements by user: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getPendingSettlements() {
        try {
            List<Settlement> settlements = settlementRepository.findByStatus(SettlementStatus.PENDING);
            return ResponseEntity.ok(settlements);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching pending settlements: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getOverdueSettlements() {
        try {
            List<Settlement> settlements = settlementRepository.findOverdueSettlements();
            return ResponseEntity.ok(settlements);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching overdue settlements: " + e.getMessage());
        }
    }

    public ResponseEntity<?> calculateSettlements() {
        try {
            List<User> users = userRepository.findAll();
            Map<Long, BigDecimal> userBalances = new HashMap<>();
            
            // Initialize balances
            for (User user : users) {
                userBalances.put(user.getId(), BigDecimal.ZERO);
            }

            // Calculate balances from shared expenses (include PENDING expenses too)
            List<Expense> sharedExpenses = expenseRepository.findByIsSharedExpenseTrue();
            for (Expense expense : sharedExpenses) {
                // Include both PENDING and APPROVED expenses in settlement calculations
                if (expense.getStatus() == ExpenseStatus.APPROVED || expense.getStatus() == ExpenseStatus.PENDING) {
                    BigDecimal amount = expense.getAmount();
                    Long payerId = expense.getPaidByUser().getId();
                    
                    // Add to payer's balance (they paid)
                    userBalances.put(payerId, userBalances.get(payerId).add(amount));
                    
                    // Subtract from other team members' balances (they owe)
                    if (expense.getSplitCount() > 1) {
                        BigDecimal perPersonAmount = amount.divide(BigDecimal.valueOf(expense.getSplitCount()), 2, RoundingMode.HALF_UP);
                        
                        // Subtract the payer's own share from their balance
                        userBalances.put(payerId, userBalances.get(payerId).subtract(perPersonAmount));
                        
                        // Subtract from the users who are actually in the split
                        for (ExpenseSplit split : expense.getSplitUsers()) {
                            userBalances.put(split.getUser().getId(), userBalances.get(split.getUser().getId()).subtract(perPersonAmount));
                        }
                    }
                }
            }

            // Subtract paid settlements from balances (account for payments that have been made)
            List<Settlement> paidSettlements = settlementRepository.findByStatus(SettlementStatus.PAID);
            for (Settlement settlement : paidSettlements) {
                Long fromUserId = settlement.getFromUser().getId();
                Long toUserId = settlement.getToUser().getId();
                BigDecimal amount = settlement.getAmount();
                
                // The person who paid (fromUser) gets credited (reduces their positive balance or increases their negative balance)
                userBalances.put(fromUserId, userBalances.get(fromUserId).subtract(amount));
                
                // The person who received payment (toUser) gets debited (reduces their negative balance or increases their positive balance)
                userBalances.put(toUserId, userBalances.get(toUserId).add(amount));
            }

            // Generate settlement suggestions
            List<SettlementSuggestion> suggestions = generateSettlementSuggestions(userBalances);
            
            return ResponseEntity.ok(new SettlementCalculationResult(userBalances, suggestions));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculating settlements: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getSettlementSummary() {
        try {
            long totalSettlements = settlementRepository.count();
            long pendingSettlements = settlementRepository.countByStatus(SettlementStatus.PENDING);
            long paidSettlements = settlementRepository.countByStatus(SettlementStatus.PAID);
            long overdueSettlements = settlementRepository.countOverdueSettlements();
            
            BigDecimal totalAmount = settlementRepository.calculateTotalAmount();
            BigDecimal pendingAmount = settlementRepository.calculatePendingAmount();

            return ResponseEntity.ok(new SettlementSummary(
                totalSettlements,
                pendingSettlements,
                paidSettlements,
                overdueSettlements,
                totalAmount != null ? totalAmount : BigDecimal.ZERO,
                pendingAmount != null ? pendingAmount : BigDecimal.ZERO
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching settlement summary: " + e.getMessage());
        }
    }

    // Helper method to generate settlement suggestions
    private List<SettlementSuggestion> generateSettlementSuggestions(Map<Long, BigDecimal> userBalances) {
        List<SettlementSuggestion> suggestions = new ArrayList<>();
        
        // Find users with positive balances (they are owed money)
        List<Map.Entry<Long, BigDecimal>> creditors = userBalances.entrySet().stream()
            .filter(entry -> entry.getValue().compareTo(BigDecimal.ZERO) > 0)
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .collect(Collectors.toList());
        
        // Find users with negative balances (they owe money)
        List<Map.Entry<Long, BigDecimal>> debtors = userBalances.entrySet().stream()
            .filter(entry -> entry.getValue().compareTo(BigDecimal.ZERO) < 0)
            .sorted((a, b) -> a.getValue().compareTo(b.getValue()))
            .collect(Collectors.toList());
        
        // Generate optimal settlement suggestions
        for (Map.Entry<Long, BigDecimal> creditor : creditors) {
            BigDecimal remainingCredit = creditor.getValue();
            
            for (Map.Entry<Long, BigDecimal> debtor : debtors) {
                if (remainingCredit.compareTo(BigDecimal.ZERO) <= 0) break;
                
                BigDecimal debt = debtor.getValue().abs();
                BigDecimal settlementAmount = remainingCredit.min(debt);
                
                if (settlementAmount.compareTo(BigDecimal.ZERO) > 0) {
                    suggestions.add(new SettlementSuggestion(
                        debtor.getKey(),
                        creditor.getKey(),
                        settlementAmount
                    ));
                    
                    remainingCredit = remainingCredit.subtract(settlementAmount);
                    userBalances.put(debtor.getKey(), debtor.getValue().add(settlementAmount));
                }
            }
        }
        
        return suggestions;
    }

    // Inner classes for response data
    public static class SettlementCalculationResult {
        private Map<Long, BigDecimal> userBalances;
        private List<SettlementSuggestion> suggestions;

        public SettlementCalculationResult(Map<Long, BigDecimal> userBalances, List<SettlementSuggestion> suggestions) {
            this.userBalances = userBalances;
            this.suggestions = suggestions;
        }

        // Getters
        public Map<Long, BigDecimal> getUserBalances() { return userBalances; }
        public List<SettlementSuggestion> getSuggestions() { return suggestions; }
    }

    public static class SettlementSuggestion {
        private Long fromUserId;
        private Long toUserId;
        private BigDecimal amount;

        public SettlementSuggestion(Long fromUserId, Long toUserId, BigDecimal amount) {
            this.fromUserId = fromUserId;
            this.toUserId = toUserId;
            this.amount = amount;
        }

        // Getters
        public Long getFromUserId() { return fromUserId; }
        public Long getToUserId() { return toUserId; }
        public BigDecimal getAmount() { return amount; }
    }

    public static class SettlementSummary {
        private long totalSettlements;
        private long pendingSettlements;
        private long paidSettlements;
        private long overdueSettlements;
        private BigDecimal totalAmount;
        private BigDecimal pendingAmount;

        public SettlementSummary(long totalSettlements, long pendingSettlements, long paidSettlements,
                               long overdueSettlements, BigDecimal totalAmount, BigDecimal pendingAmount) {
            this.totalSettlements = totalSettlements;
            this.pendingSettlements = pendingSettlements;
            this.paidSettlements = paidSettlements;
            this.overdueSettlements = overdueSettlements;
            this.totalAmount = totalAmount;
            this.pendingAmount = pendingAmount;
        }

        // Getters
        public long getTotalSettlements() { return totalSettlements; }
        public long getPendingSettlements() { return pendingSettlements; }
        public long getPaidSettlements() { return paidSettlements; }
        public long getOverdueSettlements() { return overdueSettlements; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public BigDecimal getPendingAmount() { return pendingAmount; }
    }

    /**
     * Updates and persists settlements based on current shared expenses.
     * This method should be called after a shared expense is created, updated, or deleted.
     */
    @Transactional
    public void updateAndPersistSettlements() {
        System.out.println("SettlementService: Starting updateAndPersistSettlements()");
        
        // Get current settlement suggestions
        ResponseEntity<?> calculationResultResponse = calculateSettlements();
        if (!calculationResultResponse.getStatusCode().is2xxSuccessful() || !(calculationResultResponse.getBody() instanceof SettlementCalculationResult)) {
            // Log error or handle appropriately
            System.err.println("Failed to calculate settlements: " + calculationResultResponse.getBody());
            return;
        }
        SettlementCalculationResult calculationResult = (SettlementCalculationResult) calculationResultResponse.getBody();
        if (calculationResult == null) {
            System.err.println("Settlement calculation result is null");
            return;
        }
        List<SettlementSuggestion> newSuggestions = calculationResult.getSuggestions();

        // Get all existing PENDING settlements
        List<Settlement> existingPendingSettlements = settlementRepository.findByStatus(SettlementStatus.PENDING);
        Map<String, Settlement> existingSettlementMap = new HashMap<>();
        for (Settlement s : existingPendingSettlements) {
            // Create a unique key for each settlement (fromUser, toUser)
            if (s.getFromUser() == null || s.getToUser() == null) {
                System.err.println("Skipping settlement with null fromUser or toUser: " + s.getId());
                continue;
            }
            String key = s.getFromUser().getId() + "-" + s.getToUser().getId();
            existingSettlementMap.put(key, s);
        }

        System.out.println("SettlementService: Found " + newSuggestions.size() + " settlement suggestions");
        
        // Process new suggestions
        Set<String> processedSuggestionKeys = new HashSet<>();
        for (SettlementSuggestion suggestion : newSuggestions) {
            String key = suggestion.getFromUserId() + "-" + suggestion.getToUserId();
            processedSuggestionKeys.add(key);

            Settlement settlement;
            if (existingSettlementMap.containsKey(key)) {
                // Update existing settlement
                settlement = existingSettlementMap.get(key);
                settlement.setAmount(suggestion.getAmount());
                // Remove from map to identify settlements that are no longer needed
                existingSettlementMap.remove(key);
            } else {
                // Create new settlement
                settlement = new Settlement();
                settlement.setFromUser(userRepository.findById(suggestion.getFromUserId()).orElseThrow(() -> new RuntimeException("From User not found")));
                settlement.setToUser(userRepository.findById(suggestion.getToUserId()).orElseThrow(() -> new RuntimeException("To User not found")));
                settlement.setAmount(suggestion.getAmount());
                settlement.setDueDate(LocalDateTime.now().plusDays(30)); // Default due date
                settlement.setStatus(SettlementStatus.PENDING);
            }
            settlementRepository.save(settlement);
        }

        // Cancel remaining existing PENDING settlements that are no longer suggested
        for (Settlement oldSettlement : existingSettlementMap.values()) {
            oldSettlement.setStatus(SettlementStatus.CANCELLED);
            settlementRepository.save(oldSettlement);
        }
    }
}
