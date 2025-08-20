package com.primewraps.repository;

import com.primewraps.model.Settlement;
import com.primewraps.model.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for Settlement entity.
 */
@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    /**
     * Find settlements by status.
     */
    List<Settlement> findByStatus(SettlementStatus status);

    /**
     * Find settlements by fromUser or toUser.
     */
    @Query("SELECT s FROM Settlement s WHERE s.fromUser.id = :fromUserId OR s.toUser.id = :toUserId")
    List<Settlement> findByFromUserOrToUser(@Param("fromUserId") Long fromUserId, @Param("toUserId") Long toUserId);

    /**
     * Find overdue settlements (pending settlements past due date).
     */
    @Query("SELECT s FROM Settlement s WHERE s.status = 'PENDING' AND s.dueDate < :today")
    List<Settlement> findOverdueSettlements(@Param("today") LocalDate today);

    /**
     * Find overdue settlements (pending settlements past due date).
     */
    default List<Settlement> findOverdueSettlements() {
        return findOverdueSettlements(LocalDate.now());
    }

    /**
     * Count settlements by status.
     */
    long countByStatus(SettlementStatus status);

    /**
     * Count overdue settlements.
     */
    @Query("SELECT COUNT(s) FROM Settlement s WHERE s.status = 'PENDING' AND s.dueDate < :today")
    long countOverdueSettlements(@Param("today") LocalDate today);

    /**
     * Count overdue settlements.
     */
    default long countOverdueSettlements() {
        return countOverdueSettlements(LocalDate.now());
    }

    /**
     * Calculate total amount across all settlements.
     */
    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Settlement s")
    BigDecimal calculateTotalAmount();

    /**
     * Calculate total pending amount.
     */
    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Settlement s WHERE s.status = 'PENDING'")
    BigDecimal calculatePendingAmount();
}
