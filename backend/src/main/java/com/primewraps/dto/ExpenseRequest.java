package com.primewraps.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * DTO for expense creation and updates.
 */
public class ExpenseRequest {
    private String description;
    private BigDecimal amount;
    private String category;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime date;
    private String notes;
    private boolean isTaxDeductible;
    private boolean isRecurring;
    private String recurringFrequency;
    private Long paidByUserId;
    private Long jobId;
    private boolean isSharedExpense;
    private List<Long> splitUserIds;

    // Default constructor
    public ExpenseRequest() {}

    // Getters and Setters
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    
    // Custom setter for date string that handles timezone conversion
    public void setDate(String dateString) {
        if (dateString != null && !dateString.trim().isEmpty()) {
            try {
                // Try different date formats that might be sent from frontend
                LocalDateTime localDateTime = null;
                
                // Format: "2025-08-20 14:45" (space separator)
                try {
                    DateTimeFormatter formatter1 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
                    localDateTime = LocalDateTime.parse(dateString, formatter1);
                } catch (Exception e1) {
                    // Format: "2025-08-20T14:45" (T separator)
                    try {
                        DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
                        localDateTime = LocalDateTime.parse(dateString, formatter2);
                    } catch (Exception e2) {
                        // Format: "2025-08-20T14:45:00" (with seconds)
                        try {
                            DateTimeFormatter formatter3 = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                            localDateTime = LocalDateTime.parse(dateString, formatter3);
                        } catch (Exception e3) {
                            // Last resort: try ISO format
                            localDateTime = LocalDateTime.parse(dateString);
                        }
                    }
                }
                
                if (localDateTime != null) {
                    // Convert to Pacific timezone
                    ZoneId pacificZone = ZoneId.of("America/Los_Angeles");
                    ZonedDateTime pacificTime = localDateTime.atZone(pacificZone);
                    
                    // Convert to UTC for storage
                    ZonedDateTime utcTime = pacificTime.withZoneSameInstant(ZoneId.of("UTC"));
                    this.date = utcTime.toLocalDateTime();
                }
            } catch (Exception e) {
                System.err.println("Error parsing date string: " + dateString + " - " + e.getMessage());
                // Fallback: set to current time in Pacific timezone
                ZoneId pacificZone = ZoneId.of("America/Los_Angeles");
                ZonedDateTime pacificTime = ZonedDateTime.now(pacificZone);
                this.date = pacificTime.toLocalDateTime();
            }
        }
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isTaxDeductible() {
        return isTaxDeductible;
    }

    public void setTaxDeductible(boolean taxDeductible) {
        isTaxDeductible = taxDeductible;
    }

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public String getRecurringFrequency() {
        return recurringFrequency;
    }

    public void setRecurringFrequency(String recurringFrequency) {
        this.recurringFrequency = recurringFrequency;
    }

    public Long getPaidByUserId() {
        return paidByUserId;
    }

    public void setPaidByUserId(Long paidByUserId) {
        this.paidByUserId = paidByUserId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public boolean isSharedExpense() {
        return isSharedExpense;
    }

    public void setSharedExpense(boolean sharedExpense) {
        isSharedExpense = sharedExpense;
    }

    // Add this setter for Jackson compatibility
    public void setIsSharedExpense(boolean sharedExpense) {
        isSharedExpense = sharedExpense;
    }

    public List<Long> getSplitUserIds() {
        return splitUserIds;
    }

    public void setSplitUserIds(List<Long> splitUserIds) {
        this.splitUserIds = splitUserIds;
    }
}


