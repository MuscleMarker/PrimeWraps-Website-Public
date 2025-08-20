package com.primewraps.dto;

/**
 * Data Transfer Object for User entities.
 * This is used to prevent LazyInitializationException when serializing User objects.
 */
public class UserDTO {

    private Long id;
    private String username;

    // Default constructor
    public UserDTO() {}

    // Constructor with parameters
    public UserDTO(Long id, String username) {
        this.id = id;
        this.username = username;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
