package com.primewraps.dto;

/**
 * Data Transfer Object for contact form responses.
 * This class is used to return the success status and a message after a contact form submission.
 */
public class ContactResponse {
    private boolean success;
    private String message;

    /**
     * Default constructor.
     */
    public ContactResponse() {}

    /**
     * Constructor with all fields.
     * @param success A boolean indicating whether the operation was successful.
     * @param message A message providing details about the operation's outcome.
     */
    public ContactResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}