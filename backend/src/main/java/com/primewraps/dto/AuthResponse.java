package com.primewraps.dto;

/**
 * Data Transfer Object for authentication responses.
 * This class is used to return a JWT token and a message after authentication.
 */
public class AuthResponse {
    private String token;
    private String message;

    /**
     * Constructor for AuthResponse.
     * @param token The JWT token.
     * @param message A message related to the authentication process.
     */
    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // Getters and setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}