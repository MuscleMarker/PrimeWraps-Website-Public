package com.primewraps.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a contact submission from the website.
 * This entity is mapped to the "contacts" table in the database.
 */
@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    @Column(length = 1000)
    private String service;
    @Column(length = 2000)
    private String message;
    private LocalDateTime submissionTime;

    @Enumerated(EnumType.STRING)
    private ContactStatus status;

    /**
     * Default constructor.
     * Sets the submission time to the current time and status to PENDING.
     */
    public Contact() {
        this.submissionTime = LocalDateTime.now();
        this.status = ContactStatus.PENDING;
    }

    // Getters and Setters for all fields

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSubmissionTime() {
        return submissionTime;
    }

    public void setSubmissionTime(LocalDateTime submissionTime) {
        this.submissionTime = submissionTime;
    }

    public ContactStatus getStatus() {
        return status;
    }

    public void setStatus(ContactStatus status) {
        this.status = status;
    }
}