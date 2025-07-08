package com.primewraps.service;

import com.primewraps.dto.AuthRequest;
import com.primewraps.dto.AuthResponse;
import com.primewraps.model.User;
import com.primewraps.repository.UserRepository;
import com.primewraps.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

/**
 * Service class for handling authentication and user management operations.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Set<String> ALLOWED_ROLES = Set.of("USER", "ADMIN");

    /**
     * Registers a new user.
     * Encodes the password and saves the user to the database with a default "USER" role.
     * Generates a JWT token for the newly registered user.
     * @param request The authentication request containing username and password.
     * @return An AuthResponse containing the generated JWT token and a success message.
     * @throws RuntimeException if the username already exists.
     */
    public AuthResponse register(AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()), Collections.singleton("USER"));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, "User registered successfully");
    }

    /**
     * Authenticates a user and generates a JWT token upon successful login.
     * @param request The authentication request containing username and password.
     * @return An AuthResponse containing the generated JWT token and a success message.
     */
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, "Login successful");
    }

    /**
     * Creates an admin user programmatically.
     * This method is intended for initial setup and is not exposed via API.
     * @param username The username for the admin user.
     * @param password The plain-text password for the admin user.
     * @throws RuntimeException if the admin user already exists.
     */
    public void createAdminUser(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Admin user already exists: " + username);
        }
        User adminUser = new User(username, passwordEncoder.encode(password), Collections.singleton("ADMIN"));
        userRepository.save(adminUser);
    }

    /**
     * Creates a new user with specified roles.
     * This method is typically used by an admin to create other users.
     * @param username The username for the new user.
     * @param password The plain-text password for the new user.
     * @param roles The set of roles to assign to the new user.
     * @return An AuthResponse containing a JWT token for the new user and a success message.
     * @throws RuntimeException if the username already exists.
     */
    public AuthResponse createUser(String username, String password, Set<String> roles) {
        for (String role : roles) {
            if (!ALLOWED_ROLES.contains(role)) {
                throw new IllegalArgumentException("Invalid role: " + role);
            }
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists: " + username);
        }
        User newUser = new User(username, passwordEncoder.encode(password), roles);
        userRepository.save(newUser);
        String token = jwtUtil.generateToken(newUser.getUsername());
        return new AuthResponse(token, "User created successfully");
    }
}