package com.primewraps.dto;

/**
 * Data Transfer Object for authentication requests.
 * This class is used to transfer username and password for login and registration.
 */
public class AuthRequest {
    private String username;
    private String password;

    // Getters and setters

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}