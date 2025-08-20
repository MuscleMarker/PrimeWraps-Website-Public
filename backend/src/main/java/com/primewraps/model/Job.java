package com.primewraps.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Represents a job/project in the application.
 * This entity tracks jobs with team assignments, status, and financial information.
 */
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column
    private LocalDateTime endDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalRevenue;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalExpenses;

    @Column(precision = 10, scale = 2)
    private BigDecimal profitMargin;

    @Column
    private String clientName;

    @Column
    private String location;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "job_team_members",
        joinColumns = @JoinColumn(name = "job_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> teamMembers = new HashSet<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<JobAssignment> jobAssignments = new HashSet<>();

    // Default constructor
    public Job() {
        this.createdAt = LocalDateTime.now();
        this.startDate = LocalDateTime.now();
        this.status = JobStatus.IN_PROGRESS;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getProfitMargin() {
        return profitMargin;
    }

    public void setProfitMargin(BigDecimal profitMargin) {
        this.profitMargin = profitMargin;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<User> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(Set<User> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public Set<JobAssignment> getJobAssignments() {
        return jobAssignments;
    }

    public void setJobAssignments(Set<JobAssignment> jobAssignments) {
        this.jobAssignments = jobAssignments;
    }

    // Helper methods
    public void addTeamMember(User user) {
        this.teamMembers.add(user);
    }

    public void removeTeamMember(User user) {
        this.teamMembers.remove(user);
    }

    public void calculateProfitMargin() {
        if (this.totalRevenue != null && this.totalExpenses != null) {
            this.profitMargin = this.totalRevenue.subtract(this.totalExpenses);
        }
    }
}
