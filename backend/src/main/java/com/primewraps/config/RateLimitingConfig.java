package com.primewraps.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration for rate limiting.
 * This class defines the rate limiting rules for different parts of the application.
 */
@Configuration
public class RateLimitingConfig {

    /**
     * Creates a bucket for rate limiting the contact form.
     * The limit is set to 5 requests per hour.
     * @return A Bucket object configured with the rate limit.
     */
    @Bean
    public Bucket contactFormBucket() {
        // Allow 5 requests per hour
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofHours(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    /**
     * Creates a bucket for rate limiting the login endpoint.
     * The limit is set to 10 requests per minute.
     * @return A Bucket object configured with the rate limit.
     */
    @Bean
    public Bucket loginBucket() {
        // Allow 10 requests per minute
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }
}