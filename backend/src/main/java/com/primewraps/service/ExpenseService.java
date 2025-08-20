package com.primewraps.service;

import com.primewraps.dto.ExpenseDTO;
import com.primewraps.dto.ExpenseRequest;
import com.primewraps.dto.ExpenseSplitDTO;
import com.primewraps.dto.UserDTO;
import com.primewraps.model.*;
import com.primewraps.repository.ExpenseRepository;

import com.primewraps.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service class for expense management operations.
 */
@Service
@Transactional
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SettlementService settlementService;

    /**
     * Create a new expense.
     */
    public ExpenseDTO createExpense(ExpenseRequest request) {
        System.out.println("Creating expense with request: isSharedExpense=" + request.isSharedExpense() + 
                          ", splitUserIds=" + request.getSplitUserIds());
        
        // Validate input
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Description cannot be empty");
        }
        if (request.getPaidByUserId() == null) {
            throw new IllegalArgumentException("Paid by user ID is required");
        }
        
        // Validate shared expense logic
        if (request.isSharedExpense()) {
            if (request.getSplitUserIds() == null || request.getSplitUserIds().isEmpty()) {
                throw new IllegalArgumentException("Split user IDs are required for shared expenses");
            }
            if (request.getSplitUserIds().contains(request.getPaidByUserId())) {
                throw new IllegalArgumentException("Payer cannot be included in split users");
            }
            // Check for duplicate split users
            if (request.getSplitUserIds().size() != request.getSplitUserIds().stream().distinct().count()) {
                throw new IllegalArgumentException("Duplicate split users are not allowed");
            }
        }
        
        Expense expense = new Expense();
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(ExpenseCategory.valueOf(request.getCategory()));
        // Set the date, defaulting to current time in Pacific timezone
        if (request.getDate() != null) {
            expense.setDate(request.getDate());
        } else {
            // Get current time in Pacific timezone
            ZoneId pacificZone = ZoneId.of("America/Los_Angeles");
            ZonedDateTime pacificTime = ZonedDateTime.now(pacificZone);
            expense.setDate(pacificTime.toLocalDateTime());
        }
        expense.setNotes(request.getNotes());
        expense.setTaxDeductible(request.isTaxDeductible());
        expense.setRecurring(request.isRecurring());
        expense.setRecurringFrequency(request.getRecurringFrequency());
        expense.setSharedExpense(request.isSharedExpense());
        
        System.out.println("Set expense.isSharedExpense to: " + expense.isSharedExpense());

        int splitCount = 1;
        if (request.isSharedExpense() && request.getSplitUserIds() != null) {
            splitCount = request.getSplitUserIds().size() + 1;
        }
        expense.setSplitCount(splitCount);

        // Set the user who paid
        if (request.getPaidByUserId() != null) {
            Optional<User> user = userRepository.findById(request.getPaidByUserId());
            if (user.isPresent()) {
                expense.setPaidByUser(user.get());
            } else {
                throw new RuntimeException("User not found with ID: " + request.getPaidByUserId());
            }
        }

        // Set the user who created the expense
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<User> currentUser = userRepository.findByUsername(currentUsername);
        if (currentUser.isPresent()) {
            expense.setCreatedBy(currentUser.get());
        } else {
            throw new RuntimeException("Current user not found: " + currentUsername);
        }

        Expense savedExpense = expenseRepository.save(expense);
        System.out.println("Saved expense with ID=" + savedExpense.getId() + 
                          ", isSharedExpense=" + savedExpense.isSharedExpense());

        if (request.isSharedExpense() && request.getSplitUserIds() != null) {
            Set<ExpenseSplit> splitUsers = new HashSet<>();
            for (Long userId : request.getSplitUserIds()) {
                Optional<User> user = userRepository.findById(userId);
                if (user.isPresent()) {
                    splitUsers.add(new ExpenseSplit(savedExpense, user.get()));
                } else {
                    throw new RuntimeException("User not found with ID: " + userId);
                }
            }
            savedExpense.setSplitUsers(splitUsers);
            savedExpense = expenseRepository.save(savedExpense);
            
            System.out.println("Created shared expense: ID=" + savedExpense.getId() + 
                             ", Description=" + savedExpense.getDescription() + 
                             ", Amount=" + savedExpense.getAmount() + 
                             ", Status=" + savedExpense.getStatus() + 
                             ", IsShared=" + savedExpense.isSharedExpense() + 
                             ", SplitCount=" + savedExpense.getSplitCount() + 
                             ", SplitUsers=" + savedExpense.getSplitUsers().size());
        }

        // Update settlements if it's a shared expense (regardless of status)
        if (savedExpense.isSharedExpense()) {
            settlementService.updateAndPersistSettlements();
        }

        return convertToDTO(savedExpense);
    }

    /**
     * Get all expenses.
     */
    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get expense by ID.
     */
    public Optional<ExpenseDTO> getExpenseById(Long id) {
        return expenseRepository.findById(id).map(this::convertToDTO);
    }

    /**
     * Update an expense.
     */
    public ExpenseDTO updateExpense(Long id, ExpenseRequest request) {
        Optional<Expense> existingExpense = expenseRepository.findById(id);
        if (existingExpense.isPresent()) {
            Expense expense = existingExpense.get();
            
            // Check if current user is the creator of the expense
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            if (!expense.getCreatedBy().getUsername().equals(currentUsername)) {
                throw new RuntimeException("You can only edit expenses that you created");
            }
            expense.setDescription(request.getDescription());
            expense.setAmount(request.getAmount());
            expense.setCategory(ExpenseCategory.valueOf(request.getCategory()));
            // Set the date, defaulting to current time in Pacific timezone if not provided
            if (request.getDate() != null) {
                expense.setDate(request.getDate());
            } else {
                // Get current time in Pacific timezone
                ZoneId pacificZone = ZoneId.of("America/Los_Angeles");
                ZonedDateTime pacificTime = ZonedDateTime.now(pacificZone);
                expense.setDate(pacificTime.toLocalDateTime());
            }
            expense.setNotes(request.getNotes());
            expense.setTaxDeductible(request.isTaxDeductible());
            expense.setRecurring(request.isRecurring());
            expense.setRecurringFrequency(request.getRecurringFrequency());
            expense.setSharedExpense(request.isSharedExpense());

            int splitCount = 1;
            if (request.isSharedExpense() && request.getSplitUserIds() != null) {
                splitCount = request.getSplitUserIds().size() + 1;
            }
            expense.setSplitCount(splitCount);

            expense.getSplitUsers().clear();
            if (request.isSharedExpense() && request.getSplitUserIds() != null) {
                for (Long userId : request.getSplitUserIds()) {
                    Optional<User> user = userRepository.findById(userId);
                    if (user.isPresent()) {
                        expense.getSplitUsers().add(new ExpenseSplit(expense, user.get()));
                    } else {
                        throw new RuntimeException("User not found with ID: " + userId);
                    }
                }
            }

            Expense savedExpense = expenseRepository.save(expense);

            // Update settlements if it's a shared expense (regardless of status)
            if (savedExpense.isSharedExpense()) {
                settlementService.updateAndPersistSettlements();
            }

            return convertToDTO(savedExpense);
        } else {
            throw new RuntimeException("Expense not found with ID: " + id);
        }
    }

    /**
     * Delete an expense.
     */
    public void deleteExpense(Long id) {
        Optional<Expense> existingExpense = expenseRepository.findById(id);
        if (existingExpense.isPresent()) {
            Expense expense = existingExpense.get();
            
            // Check if current user is the creator of the expense
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            if (!expense.getCreatedBy().getUsername().equals(currentUsername)) {
                throw new RuntimeException("You can only delete expenses that you created");
            }
            
            expenseRepository.deleteById(id);
        } else {
            throw new RuntimeException("Expense not found with ID: " + id);
        }
    }

    /**
     * Update expense status.
     */
    public ExpenseDTO updateExpenseStatus(Long id, ExpenseStatus status) {
        Optional<Expense> existingExpense = expenseRepository.findById(id);
        if (existingExpense.isPresent()) {
            Expense expense = existingExpense.get();
            expense.setStatus(status);
            return convertToDTO(expenseRepository.save(expense));
        } else {
            throw new RuntimeException("Expense not found with ID: " + id);
        }
    }

    /**
     * Get expenses by status.
     */
    public List<ExpenseDTO> getExpensesByStatus(ExpenseStatus status) {
        return expenseRepository.findByStatus(status).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get expenses by category.
     */
    public List<ExpenseDTO> getExpensesByCategory(String category) {
        return expenseRepository.findByCategory(category).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get expenses by user.
     */
    public List<ExpenseDTO> getExpensesByUser(Long userId) {
        return expenseRepository.findByPaidByUser_Id(userId).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get expenses by job.
     */
    public List<ExpenseDTO> getExpensesByJob(Long jobId) {
        return expenseRepository.findByJob_Id(jobId).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get pending expenses.
     */
    public List<ExpenseDTO> getPendingExpenses() {
        return expenseRepository.findPendingExpenses().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get total expenses by user in date range.
     */
    public BigDecimal getTotalExpensesByUserInDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal total = expenseRepository.calculateTotalExpensesByUserInDateRange(userId, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Get total expenses by category in date range.
     */
    public BigDecimal getTotalExpensesByCategoryInDateRange(String category, LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal total = expenseRepository.calculateTotalExpensesByCategoryInDateRange(category, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Get shared expenses.
     */
    public List<ExpenseDTO> getSharedExpenses() {
        // First, let's see all expenses to debug
        List<Expense> allExpenses = expenseRepository.findAll();
        System.out.println("Total expenses in database: " + allExpenses.size());
        for (Expense expense : allExpenses) {
            System.out.println("All expense: ID=" + expense.getId() + 
                             ", Description=" + expense.getDescription() + 
                             ", Amount=" + expense.getAmount() + 
                             ", Status=" + expense.getStatus() + 
                             ", IsShared=" + expense.isSharedExpense() + 
                             ", SplitCount=" + expense.getSplitCount());
        }
        
        List<Expense> sharedExpenses = expenseRepository.findByIsSharedExpenseTrue();
        System.out.println("Found " + sharedExpenses.size() + " shared expenses in database");
        for (Expense expense : sharedExpenses) {
            System.out.println("Shared expense: ID=" + expense.getId() + 
                             ", Description=" + expense.getDescription() + 
                             ", Amount=" + expense.getAmount() + 
                             ", Status=" + expense.getStatus() + 
                             ", SplitCount=" + expense.getSplitCount() + 
                             ", SplitUsers=" + expense.getSplitUsers().size());
        }
        return sharedExpenses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get tax deductible expenses.
     */
    public List<ExpenseDTO> getTaxDeductibleExpenses() {
        return expenseRepository.findByIsTaxDeductibleTrue().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get recurring expenses.
     */
    public List<ExpenseDTO> getRecurringExpenses() {
        return expenseRepository.findByIsRecurringTrue().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private ExpenseDTO convertToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory().name());
        dto.setStatus(expense.getStatus().name());
        dto.setDate(expense.getDate());
        dto.setNotes(expense.getNotes());
        dto.setTaxDeductible(expense.isTaxDeductible());
        dto.setRecurring(expense.isRecurring());
        dto.setRecurringFrequency(expense.getRecurringFrequency());
        if (expense.getPaidByUser() != null) {
            dto.setPaidByUsername(expense.getPaidByUser().getUsername());
            dto.setPaidByUser(new UserDTO(expense.getPaidByUser().getId(), expense.getPaidByUser().getUsername()));
        }
        if (expense.getCreatedBy() != null) {
            dto.setCreatedByUsername(expense.getCreatedBy().getUsername());
            dto.setCreatedBy(new UserDTO(expense.getCreatedBy().getId(), expense.getCreatedBy().getUsername()));
            System.out.println("Setting createdByUsername to: " + expense.getCreatedBy().getUsername());
        } else {
            System.out.println("WARNING: Expense " + expense.getId() + " has no createdBy field!");
        }
        if (expense.getJob() != null) {
            dto.setJobTitle(expense.getJob().getTitle());
        }
        dto.setSharedExpense(expense.isSharedExpense());
        dto.setSplitCount(expense.getSplitCount());
        if (expense.getSplitUsers() != null) {
            dto.setSplitUsers(expense.getSplitUsers().stream()
                    .map(split -> new ExpenseSplitDTO(split.getId(), split.getUser().getId(), split.getUser().getUsername()))
                    .collect(Collectors.toList()));
        }
        dto.setCreatedAt(expense.getCreatedAt());
        return dto;
    }
}
