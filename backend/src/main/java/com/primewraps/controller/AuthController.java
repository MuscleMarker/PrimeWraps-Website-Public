package com.primewraps.controller;

import com.primewraps.dto.AuthRequest;
import com.primewraps.dto.AuthResponse;
import com.primewraps.service.AuthService;
import io.github.bucket4j.Bucket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


/**
 * Controller for authentication-related operations.
 * This controller handles user registration and login.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private Bucket loginBucket;

    /**
     * Registers a new user.
     * @param request The authentication request, containing username and password.
     * @return A response containing a JWT token and a success message.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Authenticates a user and returns a JWT token.
     * @param request The authentication request, containing username and password.
     * @return A response containing a JWT token and a success message.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (loginBucket.tryConsume(1)) {
            return ResponseEntity.ok(authService.login(request));
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }
}