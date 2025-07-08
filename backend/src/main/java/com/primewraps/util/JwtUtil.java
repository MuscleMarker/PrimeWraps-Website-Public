package com.primewraps.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.annotation.PostConstruct;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

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

    @PostConstruct
    public void validateSecret() {
        if (SECRET_KEY == null || SECRET_KEY.length() < 32) {
            throw new IllegalStateException("JWT secret key must be at least 32 characters long and set via environment variable.");
        }
    }

    /**
     * Generates a JWT for a given username.
     * @param username The username for which the token is to be generated.
     * @return The generated JWT string.
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(java.util.stream.Collectors.toList()));
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Creates the JWT with specified claims and subject.
     * @param claims Additional claims to be included in the JWT.
     * @param subject The subject of the JWT (typically the username).
     * @return The compact JWT string.
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Retrieves the signing key from the base64 encoded secret.
     * @return The Key object used for signing JWTs.
     */
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
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
            final String extractedUsername = extractUsername(token);
            return (extractedUsername.equals(username) && !isTokenExpired(token));
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // Token is expired
            return false;
        } catch (Exception e) {
            // Other validation errors
            return false;
        }
    }

    /**
     * Extracts the username (subject) from a JWT token.
     * @param token The JWT string.
     * @return The username extracted from the token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from a JWT token.
     * @param token The JWT string.
     * @return The expiration Date of the token.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from the JWT.
     * @param token The JWT string.
     * @param claimsResolver A function to resolve the desired claim from the Claims object.
     * @param <T> The type of the claim.
     * @return The extracted claim.
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from a JWT token.
     * @param token The JWT string.
     * @return The Claims object containing all claims from the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if the JWT token is expired.
     * @param token The JWT string.
     * @return True if the token is expired, false otherwise.
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}