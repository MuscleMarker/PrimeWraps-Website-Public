package com.primewraps.dto;

import java.util.Set;

/**
 * Data Transfer Object for user creation requests.
 * This class is used to transfer username, password, and roles when creating a new user.
 */
public class UserCreationRequest {
    private String username;
    private String password;
    private Set<String> roles;

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

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
