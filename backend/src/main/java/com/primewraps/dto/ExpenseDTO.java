package com.primewraps.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.primewraps.dto.ExpenseSplitDTO;

/**
 * Data Transfer Object for Expense entities.
 * This is used to prevent LazyInitializationException when serializing Expense objects.
 */
public class ExpenseDTO {

    private Long id;
    private String description;
    private BigDecimal amount;
    private String category;
    private String status;
    private LocalDateTime date;
    private String notes;
    private boolean isTaxDeductible;
    private boolean isRecurring;
    private String recurringFrequency;
    private String paidByUsername;
    private UserDTO paidByUser;
    private String createdByUsername;
    private UserDTO createdBy;
    private String jobTitle;
    private boolean isSharedExpense;
    private int splitCount;
    private List<ExpenseSplitDTO> splitUsers;
    private LocalDateTime createdAt;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
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

    public String getPaidByUsername() {
        return paidByUsername;
    }

    public void setPaidByUsername(String paidByUsername) {
        this.paidByUsername = paidByUsername;
    }

    public UserDTO getPaidByUser() {
        return paidByUser;
    }

    public void setPaidByUser(UserDTO paidByUser) {
        this.paidByUser = paidByUser;
    }

    public String getCreatedByUsername() {
        return createdByUsername;
    }

    public void setCreatedByUsername(String createdByUsername) {
        this.createdByUsername = createdByUsername;
    }

    public UserDTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserDTO createdBy) {
        this.createdBy = createdBy;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public boolean isSharedExpense() {
        return isSharedExpense;
    }

    public void setSharedExpense(boolean sharedExpense) {
        isSharedExpense = sharedExpense;
    }

    public int getSplitCount() {
        return splitCount;
    }

    public void setSplitCount(int splitCount) {
        this.splitCount = splitCount;
    }

    public List<ExpenseSplitDTO> getSplitUsers() {
        return splitUsers;
    }

    public void setSplitUsers(List<ExpenseSplitDTO> splitUsers) {
        this.splitUsers = splitUsers;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
