package com.primewraps.model;

/**
 * Enum representing different categories of expenses.
 */
public enum ExpenseCategory {
    MATERIALS("Materials"),
    TOOLS("Tools"),
    TRAVEL("Travel"),
    MEALS("Meals"),
    UTILITIES("Utilities"),
    INSURANCE("Insurance"),
    SUBSCRIPTIONS("Subscriptions"),
    MARKETING("Marketing"),
    OFFICE_SUPPLIES("Office Supplies"),
    EQUIPMENT("Equipment"),
    MAINTENANCE("Maintenance"),
    OTHER("Other");

    private final String displayName;

    ExpenseCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
