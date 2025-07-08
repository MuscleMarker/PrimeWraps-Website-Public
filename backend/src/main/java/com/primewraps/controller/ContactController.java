package com.primewraps.controller;

import com.primewraps.dto.ContactRequest;
import com.primewraps.dto.ContactResponse;
import com.primewraps.service.ContactService;
import io.github.bucket4j.Bucket;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling contact form submissions.
 */
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private Bucket contactFormBucket;

    /**
     * Submits a contact form.
     * This endpoint is rate-limited to prevent abuse.
     * @param request The contact request, containing the user's name, email, and message.
     * @return A response indicating whether the message was sent successfully.
     */
    @PostMapping("/submit")
    public ResponseEntity<ContactResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        // Consume a token from the rate-limiting bucket
        if (!contactFormBucket.tryConsume(1)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ContactResponse(false, "Too many requests. Please try again later."));
        }
        try {
            // Send the contact email
            contactService.sendContactEmail(request);
            return ResponseEntity.ok(new ContactResponse(true, "Message sent successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ContactResponse(false, "Failed to send message. Please try again."));
        }
    }

    /**
     * Health check endpoint for the contact service.
     * @return A response indicating that the service is running.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Contact service is running");
    }
}