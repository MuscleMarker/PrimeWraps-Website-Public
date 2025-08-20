package com.primewraps.controller;

import com.primewraps.model.JobStatus;
import com.primewraps.service.JobService;
import com.primewraps.dto.JobRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * REST controller for Job-related operations.
 */
@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    /**
     * Create a new job.
     */
    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobRequest request) {
        return jobService.createJob(request);
    }

    /**
     * Get all jobs.
     */
    @GetMapping
    public ResponseEntity<?> getAllJobs() {
        return jobService.getAllJobs();
    }

    /**
     * Get a job by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    /**
     * Update a job.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody JobRequest request) {
        return jobService.updateJob(id, request);
    }

    /**
     * Delete a job.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        return jobService.deleteJob(id);
    }

    /**
     * Update job status.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestParam JobStatus status) {
        return jobService.updateJobStatus(id, status);
    }

    /**
     * Get jobs by status.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getJobsByStatus(@PathVariable JobStatus status) {
        return jobService.getJobsByStatus(status);
    }

    /**
     * Get active jobs.
     */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveJobs() {
        return jobService.getActiveJobs();
    }

    /**
     * Get completed jobs.
     */
    @GetMapping("/completed")
    public ResponseEntity<?> getCompletedJobs() {
        return jobService.getCompletedJobs();
    }

    /**
     * Get jobs by team member.
     */
    @GetMapping("/team-member/{userId}")
    public ResponseEntity<?> getJobsByTeamMember(@PathVariable Long userId) {
        return jobService.getJobsByTeamMember(userId);
    }

    /**
     * Get jobs by date range.
     */
    @GetMapping("/date-range")
    public ResponseEntity<?> getJobsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return jobService.getJobsByDateRange(startDate, endDate);
    }

    /**
     * Get jobs by client name.
     */
    @GetMapping("/client")
    public ResponseEntity<?> getJobsByClient(@RequestParam String clientName) {
        return jobService.getJobsByClient(clientName);
    }

    /**
     * Get total revenue.
     */
    @GetMapping("/revenue/total")
    public ResponseEntity<?> getTotalRevenue() {
        return jobService.getTotalRevenue();
    }

    /**
     * Get total profit.
     */
    @GetMapping("/profit/total")
    public ResponseEntity<?> getTotalProfit() {
        return jobService.getTotalProfit();
    }

    /**
     * Get job summary statistics.
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getJobSummary() {
        return jobService.getJobSummary();
    }
}
