package com.primewraps.model;

/**
 * Enum representing the status of an expense.
 */
public enum ExpenseStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    REIMBURSED("Reimbursed"),
    REJECTED("Rejected");

    private final String displayName;

    ExpenseStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
