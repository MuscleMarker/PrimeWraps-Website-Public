package com.primewraps.service;

import com.primewraps.model.*;
import com.primewraps.repository.JobRepository;
import com.primewraps.repository.UserRepository;
import com.primewraps.dto.JobRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> createJob(JobRequest request) {
        try {
            // Validate required fields
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job title is required");
            }

            if (request.getStartDate() == null) {
                return ResponseEntity.badRequest().body("Start date is required");
            }

            // Create new job
            Job job = new Job();
            job.setTitle(request.getTitle());
            job.setDescription(request.getDescription());
            job.setStartDate(request.getStartDate());
            job.setEndDate(request.getEndDate());
            job.setStatus(JobStatus.PLANNING);
            job.setTotalRevenue(request.getTotalRevenue() != null ? request.getTotalRevenue() : BigDecimal.ZERO);
            job.setTotalExpenses(BigDecimal.ZERO);
            job.setProfitMargin(BigDecimal.ZERO);
            job.setClientName(request.getClientName());
            job.setLocation(request.getLocation());
            job.setCreatedAt(LocalDateTime.now());

            // Save the job first to get the ID
            Job savedJob = jobRepository.save(job);

            // Handle team member assignments if provided
            if (request.getTeamMemberIds() != null && !request.getTeamMemberIds().isEmpty()) {
                Set<JobAssignment> assignments = request.getTeamMemberIds().stream()
                    .map(userId -> {
                        Optional<User> userOpt = userRepository.findById(userId);
                        if (userOpt.isPresent()) {
                            JobAssignment assignment = new JobAssignment();
                            assignment.setJob(savedJob);
                            assignment.setUser(userOpt.get());
                            assignment.setAssignedDate(LocalDateTime.now());
                            assignment.setStatus(AssignmentStatus.ASSIGNED);
                            assignment.setHourlyRate(BigDecimal.ZERO); // Default, can be updated later
                            assignment.setTotalEarnings(BigDecimal.ZERO);
                            return assignment;
                        }
                        return null;
                    })
                    .filter(assignment -> assignment != null)
                    .collect(Collectors.toSet());

                savedJob.setJobAssignments(assignments);
                jobRepository.save(savedJob);
            }

            return ResponseEntity.ok(savedJob);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating job: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getAllJobs() {
        try {
            List<Job> jobs = jobRepository.findAll();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching jobs: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getJobById(Long id) {
        try {
            Optional<Job> jobOpt = jobRepository.findById(id);
            if (jobOpt.isPresent()) {
                return ResponseEntity.ok(jobOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching job: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateJob(Long id, JobRequest request) {
        try {
            Optional<Job> jobOpt = jobRepository.findById(id);
            if (!jobOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Job job = jobOpt.get();
            
            // Update fields
            if (request.getTitle() != null) {
                job.setTitle(request.getTitle());
            }
            if (request.getDescription() != null) {
                job.setDescription(request.getDescription());
            }
            if (request.getStartDate() != null) {
                job.setStartDate(request.getStartDate());
            }
            if (request.getEndDate() != null) {
                job.setEndDate(request.getEndDate());
            }
            if (request.getStatus() != null) {
                job.setStatus(JobStatus.valueOf(request.getStatus()));
            }
            if (request.getTotalRevenue() != null) {
                job.setTotalRevenue(request.getTotalRevenue());
            }
            if (request.getClientName() != null) {
                job.setClientName(request.getClientName());
            }
            if (request.getLocation() != null) {
                job.setLocation(request.getLocation());
            }

            // Update profit margin
            updateJobProfitMargin(job);

            Job updatedJob = jobRepository.save(job);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating job: " + e.getMessage());
        }
    }

    public ResponseEntity<?> deleteJob(Long id) {
        try {
            Optional<Job> jobOpt = jobRepository.findById(id);
            if (!jobOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Job job = jobOpt.get();
            
            // Check if job can be deleted (no active assignments or expenses)
            if (job.getJobAssignments() != null && 
                job.getJobAssignments().stream().anyMatch(a -> a.getStatus() == AssignmentStatus.IN_PROGRESS)) {
                return ResponseEntity.badRequest().body("Cannot delete job with active assignments");
            }

            jobRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting job: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateJobStatus(Long id, JobStatus status) {
        try {
            Optional<Job> jobOpt = jobRepository.findById(id);
            if (!jobOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Job job = jobOpt.get();
            job.setStatus(status);
            
            // If job is completed, update end date if not set
            if (status == JobStatus.COMPLETED && job.getEndDate() == null) {
                job.setEndDate(LocalDateTime.now());
            }

            Job updatedJob = jobRepository.save(job);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating job status: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getJobsByStatus(JobStatus status) {
        try {
            List<Job> jobs = jobRepository.findByStatus(status);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching jobs by status: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getActiveJobs() {
        try {
            List<Job> jobs = jobRepository.findActiveJobs();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching active jobs: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getCompletedJobs() {
        try {
            List<Job> jobs = jobRepository.findCompletedJobs();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching completed jobs: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getJobsByTeamMember(Long userId) {
        try {
            List<Job> jobs = jobRepository.findJobsByTeamMember(userId);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching jobs by team member: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getJobsByDateRange(LocalDate startDate, LocalDate endDate) {
        try {
            List<Job> jobs = jobRepository.findByDateRange(
                startDate.atStartOfDay(), 
                endDate.atTime(23, 59, 59)
            );
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching jobs by date range: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getJobsByClient(String clientName) {
        try {
            List<Job> jobs = jobRepository.findByClientNameContainingIgnoreCase(clientName);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching jobs by client: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getTotalRevenue() {
        try {
            BigDecimal totalRevenue = jobRepository.calculateTotalRevenue();
            return ResponseEntity.ok(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculating total revenue: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getTotalProfit() {
        try {
            BigDecimal totalProfit = jobRepository.calculateTotalProfit();
            return ResponseEntity.ok(totalProfit != null ? totalProfit : BigDecimal.ZERO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculating total profit: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getJobSummary() {
        try {
            long totalJobs = jobRepository.count();
            long activeJobs = jobRepository.countByStatus(JobStatus.IN_PROGRESS);
            long completedJobs = jobRepository.countByStatus(JobStatus.COMPLETED);
            BigDecimal totalRevenue = jobRepository.calculateTotalRevenue();
            BigDecimal totalProfit = jobRepository.calculateTotalProfit();

            return ResponseEntity.ok(new JobSummary(
                totalJobs,
                activeJobs,
                completedJobs,
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalProfit != null ? totalProfit : BigDecimal.ZERO
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching job summary: " + e.getMessage());
        }
    }

    // Helper method to update job profit margin
    private void updateJobProfitMargin(Job job) {
        if (job.getTotalRevenue() != null && job.getTotalExpenses() != null) {
            if (job.getTotalRevenue().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal profit = job.getTotalRevenue().subtract(job.getTotalExpenses());
                BigDecimal margin = profit.divide(job.getTotalRevenue(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
                job.setProfitMargin(margin);
            } else {
                job.setProfitMargin(BigDecimal.ZERO);
            }
        }
    }

    // Helper method to update job expenses
    public void updateJobExpenses(Long jobId, BigDecimal newTotalExpenses) {
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isPresent()) {
            Job job = jobOpt.get();
            job.setTotalExpenses(newTotalExpenses);
            updateJobProfitMargin(job);
            jobRepository.save(job);
        }
    }

    // Inner class for job summary
    public static class JobSummary {
        private long totalJobs;
        private long activeJobs;
        private long completedJobs;
        private BigDecimal totalRevenue;
        private BigDecimal totalProfit;

        public JobSummary(long totalJobs, long activeJobs, long completedJobs, 
                         BigDecimal totalRevenue, BigDecimal totalProfit) {
            this.totalJobs = totalJobs;
            this.activeJobs = activeJobs;
            this.completedJobs = completedJobs;
            this.totalRevenue = totalRevenue;
            this.totalProfit = totalProfit;
        }

        // Getters
        public long getTotalJobs() { return totalJobs; }
        public long getActiveJobs() { return activeJobs; }
        public long getCompletedJobs() { return completedJobs; }
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public BigDecimal getTotalProfit() { return totalProfit; }
    }
}
