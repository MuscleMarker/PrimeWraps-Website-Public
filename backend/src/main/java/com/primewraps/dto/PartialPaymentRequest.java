package com.primewraps.dto;

import java.math.BigDecimal;

public class PartialPaymentRequest {
    private Long originalSettlementId;
    private BigDecimal amountPaid;
    private String paymentMethod;
    private String notes;

    // Default constructor
    public PartialPaymentRequest() {}

    // Constructor with all fields
    public PartialPaymentRequest(Long originalSettlementId, BigDecimal amountPaid, String paymentMethod, String notes) {
        this.originalSettlementId = originalSettlementId;
        this.amountPaid = amountPaid;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
    }

    // Getters and setters
    public Long getOriginalSettlementId() {
        return originalSettlementId;
    }

    public void setOriginalSettlementId(Long originalSettlementId) {
        this.originalSettlementId = originalSettlementId;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
