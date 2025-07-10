package com.primewraps.controller;

import com.primewraps.dto.AuthRequest;
import com.primewraps.dto.AuthResponse;
import com.primewraps.service.AuthService;
import io.github.bucket4j.Bucket;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controller for authentication-related operations.
 * This controller handles user registration and login.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private Bucket loginBucket;

    /**
     * Simple test endpoint to verify the controller is accessible.
     * @return A simple response to confirm the endpoint is accessible.
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("Test endpoint reached successfully");
        return ResponseEntity.ok("Auth controller is working - GET request");
    }

    /**
     * Registers a new user.
     * @param request The authentication request, containing username and password.
     * @return A response containing a JWT token and a success message.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        logger.info("Register request received for username: {}", request.getUsername());
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Authenticates a user and returns a JWT token.
     * @param request The authentication request, containing username and password.
     * @return A response containing a JWT token and a success message.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        logger.info("Login request received for username: {}", request.getUsername());
        
        // Check rate limiting
        if (!loginBucket.tryConsume(1)) {
            logger.warn("Rate limit exceeded for login request from username: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new AuthResponse(null, "Too many login attempts. Please try again later."));
        }
        
        logger.info("Rate limit check passed for username: {}", request.getUsername());
        
        try {
            AuthResponse response = authService.login(request);
            logger.info("Login successful for username: {}", request.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for username: {}", request.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, "Invalid username or password"));
        }
    }
}