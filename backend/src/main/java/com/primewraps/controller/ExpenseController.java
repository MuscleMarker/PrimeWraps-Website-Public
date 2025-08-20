package com.primewraps.controller;

import com.primewraps.dto.ExpenseDTO;
import com.primewraps.dto.ExpenseRequest;
import com.primewraps.model.ExpenseStatus;
import com.primewraps.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for expense management operations.
 */
@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    /**
     * Create a new expense.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createExpense(@RequestBody ExpenseRequest request) {
        try {
            ExpenseDTO expense = expenseService.createExpense(request);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            System.err.println("Error creating expense: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating expense: " + e.getMessage());
        }
    }

    /**
     * Get all expenses.
     */
    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        try {
            List<ExpenseDTO> expenses = expenseService.getAllExpenses();
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get expense by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        try {
            return expenseService.getExpenseById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update an expense.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequest request) {
        try {
            ExpenseDTO expense = expenseService.updateExpense(id, request);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete an expense.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update expense status.
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExpenseDTO> updateExpenseStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            ExpenseStatus expenseStatus = ExpenseStatus.valueOf(status.toUpperCase());
            ExpenseDTO expense = expenseService.updateExpenseStatus(id, expenseStatus);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get expenses by status.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByStatus(@PathVariable String status) {
        try {
            ExpenseStatus expenseStatus = ExpenseStatus.valueOf(status.toUpperCase());
            List<ExpenseDTO> expenses = expenseService.getExpensesByStatus(expenseStatus);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get expenses by category.
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByCategory(@PathVariable String category) {
        try {
            List<ExpenseDTO> expenses = expenseService.getExpensesByCategory(category);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get expenses by user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByUser(@PathVariable Long userId) {
        try {
            List<ExpenseDTO> expenses = expenseService.getExpensesByUser(userId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get expenses by job.
     */
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByJob(@PathVariable Long jobId) {
        try {
            List<ExpenseDTO> expenses = expenseService.getExpensesByJob(jobId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get pending expenses.
     */
    @GetMapping("/pending")
    public ResponseEntity<List<ExpenseDTO>> getPendingExpenses() {
        try {
            List<ExpenseDTO> expenses = expenseService.getPendingExpenses();
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get shared expenses.
     */
    @GetMapping("/shared")
    public ResponseEntity<List<ExpenseDTO>> getSharedExpenses() {
        try {
            List<ExpenseDTO> expenses = expenseService.getSharedExpenses();
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get tax deductible expenses.
     */
    @GetMapping("/tax-deductible")
    public ResponseEntity<List<ExpenseDTO>> getTaxDeductibleExpenses() {
        try {
            List<ExpenseDTO> expenses = expenseService.getTaxDeductibleExpenses();
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get recurring expenses.
     */
    @GetMapping("/recurring")
    public ResponseEntity<List<ExpenseDTO>> getRecurringExpenses() {
        try {
            List<ExpenseDTO> expenses = expenseService.getRecurringExpenses();
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
