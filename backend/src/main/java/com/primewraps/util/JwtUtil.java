package com.primewraps.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.annotation.PostConstruct;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for JSON Web Token (JWT) operations.
 * Handles generation, validation, and extraction of information from JWTs.
 */
@Component
public class JwtUtil {

    // Secret key for signing JWTs, injected from application properties
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    // Expiration time for JWTs in milliseconds, injected from application properties
    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    private Algorithm algorithm;
    private JWTVerifier verifier;

    @PostConstruct
    public void init() {
        if (SECRET_KEY == null || SECRET_KEY.length() < 32) {
            throw new IllegalStateException("JWT secret key must be at least 32 characters long and set via environment variable.");
        }
        this.algorithm = Algorithm.HMAC256(SECRET_KEY);
        this.verifier = JWT.require(algorithm)
                .build();
    }

    /**
     * Generates a JWT for a given username.
     * @param username The username for which the token is to be generated.
     * @return The generated JWT string.
     */
    public String generateToken(String username) {
        return JWT.create()
                .withSubject(username)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(algorithm);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(java.util.stream.Collectors.toList()));

        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .withPayload(claims)
                .sign(algorithm);
    }

    /**
     * Validates a given JWT token against a username.
     * Checks if the token is not expired and if the username extracted from the token matches the provided username.
     * @param token The JWT string to validate.
     * @param username The username to validate against.
     * @return True if the token is valid for the given username, false otherwise.
     */
    public Boolean validateToken(String token, String username) {
        try {
            DecodedJWT jwt = verifier.verify(token);
            final String extractedUsername = jwt.getSubject();
            return (extractedUsername.equals(username) && !isTokenExpired(jwt));
        } catch (JWTVerificationException exception){
            // Token is invalid or expired
            return false;
        }
    }

    /**
     * Extracts the username (subject) from a JWT token.
     * @param token The JWT string.
     * @return The username extracted from the token.
     */
    public String extractUsername(String token) {
        DecodedJWT jwt = verifier.verify(token);
        return jwt.getSubject();
    }

    /**
     * Extracts the expiration date from a JWT token.
     * @param token The JWT string.
     * @return The expiration Date of the token.
     */
    public Date extractExpiration(String token) {
        DecodedJWT jwt = verifier.verify(token);
        return jwt.getExpiresAt();
    }

    /**
     * Checks if the JWT token is expired.
     * @param jwt The DecodedJWT object.
     * @return True if the token is expired, false otherwise.
     */
    private Boolean isTokenExpired(DecodedJWT jwt) {
        return jwt.getExpiresAt().before(new Date());
    }
}
