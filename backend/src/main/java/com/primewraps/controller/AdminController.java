package com.primewraps.controller;

import com.primewraps.model.Contact;
import com.primewraps.model.ContactStatus;
import com.primewraps.repository.ContactRepository;
import com.primewraps.service.AuthService;
import com.primewraps.dto.UserCreationRequest;
import com.primewraps.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for admin-related operations.
 * This controller handles requests for managing contacts and users.
 * Access to these endpoints is restricted to users with the 'ADMIN' role.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private AuthService authService;

    /**
     * Retrieves all contact submissions.
     * @return A list of all contacts.
     */
    @GetMapping("/contacts")
    public ResponseEntity<List<Contact>> getAllContacts() {
        return ResponseEntity.ok(contactRepository.findAll());
    }

    /**
     * Retrieves a contact by its ID.
     * @param id The ID of the contact to retrieve.
     * @return The contact with the specified ID, or a 404 Not Found response.
     */
    @GetMapping("/contacts/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        return contactRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates the status of a contact.
     * @param id The ID of the contact to update.
     * @param status The new status of the contact.
     * @return The updated contact, or a 404 Not Found response.
     */
    @PutMapping("/contacts/{id}/status")
    public ResponseEntity<Contact> updateContactStatus(@PathVariable Long id, @RequestParam ContactStatus status) {
        return contactRepository.findById(id)
                .map(contact -> {
                    contact.setStatus(status);
                    return ResponseEntity.ok(contactRepository.save(contact));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a contact by its ID.
     * @param id The ID of the contact to delete.
     * @return A 204 No Content response if successful, or a 404 Not Found response.
     */
    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Retrieves all users.
     * @return A list of all users.
     */
    @GetMapping("/users")
    public ResponseEntity<List<com.primewraps.model.User>> getAllUsers() {
        try {
            List<com.primewraps.model.User> users = authService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Creates a new user.
     * @param request The user creation request, containing username, password, and roles.
     * @return A response containing a JWT token and a success message, or an error message.
     */
    @PostMapping("/users")
    public ResponseEntity<AuthResponse> createUser(@RequestBody UserCreationRequest request) {
        try {
            AuthResponse response = authService.createUser(request.getUsername(), request.getPassword(), request.getRoles());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, e.getMessage()));
        }
    }
}