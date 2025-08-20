package com.primewraps.model;

/**
 * Enum representing the status of a settlement.
 */
public enum SettlementStatus {
    PENDING("Pending"),
    PAID("Paid"),
    OVERDUE("Overdue"),
    CANCELLED("Cancelled");

    private final String displayName;

    SettlementStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
