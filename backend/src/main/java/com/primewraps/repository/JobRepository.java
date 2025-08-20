package com.primewraps.repository;

import com.primewraps.model.Job;
import com.primewraps.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Job entity.
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    /**
     * Find jobs by status.
     */
    List<Job> findByStatus(JobStatus status);

    /**
     * Find jobs by client name.
     */
    List<Job> findByClientNameContainingIgnoreCase(String clientName);

    /**
     * Find jobs within a date range.
     */
    List<Job> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find active jobs (not completed or cancelled).
     */
    @Query("SELECT j FROM Job j WHERE j.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY j.startDate DESC")
    List<Job> findActiveJobs();

    /**
     * Find completed jobs.
     */
    @Query("SELECT j FROM Job j WHERE j.status = 'COMPLETED' ORDER BY j.endDate DESC")
    List<Job> findCompletedJobs();

    /**
     * Calculate total revenue within a date range.
     */
    @Query("SELECT SUM(j.totalRevenue) FROM Job j WHERE j.startDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalRevenueInDateRange(@Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);

    /**
     * Calculate total profit within a date range.
     */
    @Query("SELECT SUM(j.profitMargin) FROM Job j WHERE j.status = 'COMPLETED' AND j.endDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalProfitInDateRange(@Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);

    /**
     * Find jobs by team member.
     */
    @Query("SELECT DISTINCT j FROM Job j JOIN j.teamMembers tm WHERE tm.id = :userId")
    List<Job> findJobsByTeamMember(@Param("userId") Long userId);

    /**
     * Find jobs within a date range.
     */
    @Query("SELECT j FROM Job j WHERE j.startDate BETWEEN :startDate AND :endDate")
    List<Job> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                              @Param("endDate") LocalDateTime endDate);

    /**
     * Calculate total revenue across all jobs.
     */
    @Query("SELECT COALESCE(SUM(j.totalRevenue), 0) FROM Job j")
    BigDecimal calculateTotalRevenue();

    /**
     * Calculate total profit across all completed jobs.
     */
    @Query("SELECT COALESCE(SUM(j.profitMargin), 0) FROM Job j WHERE j.status = 'COMPLETED'")
    BigDecimal calculateTotalProfit();

    /**
     * Count jobs by status.
     */
    long countByStatus(JobStatus status);
}
