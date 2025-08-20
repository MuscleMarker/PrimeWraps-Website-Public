package com.primewraps.repository;

import com.primewraps.model.Expense;
import com.primewraps.model.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Expense entity.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Find expenses by status.
     */
    List<Expense> findByStatus(ExpenseStatus status);

    /**
     * Find expenses by category.
     */
    List<Expense> findByCategory(String category);

    /**
     * Find expenses by user who paid.
     */
    List<Expense> findByPaidByUser_Id(Long userId);

    /**
     * Find expenses by job.
     */
    List<Expense> findByJob_Id(Long jobId);

    /**
     * Find expenses within a date range.
     */
    List<Expense> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find shared expenses.
     */
    List<Expense> findByIsSharedExpenseTrue();

    /**
     * Find tax deductible expenses.
     */
    List<Expense> findByIsTaxDeductibleTrue();

    /**
     * Find recurring expenses.
     */
    List<Expense> findByIsRecurringTrue();

    /**
     * Calculate total expenses by user within a date range.
     */
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.paidByUser.id = :userId AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalExpensesByUserInDateRange(@Param("userId") Long userId, 
                                                     @Param("startDate") LocalDateTime startDate, 
                                                     @Param("endDate") LocalDateTime endDate);

    /**
     * Calculate total expenses by category within a date range.
     */
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.category = :category AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalExpensesByCategoryInDateRange(@Param("category") String category, 
                                                         @Param("startDate") LocalDateTime startDate, 
                                                         @Param("endDate") LocalDateTime endDate);

    /**
     * Find expenses pending approval.
     */
    @Query("SELECT e FROM Expense e WHERE e.status = 'PENDING' ORDER BY e.date DESC")
    List<Expense> findPendingExpenses();
}
