package com.primewraps;

import com.primewraps.repository.UserRepository;
import com.primewraps.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Arrays;


/**
 * Main entry point for the Prime Wraps Spring Boot application.
 */
@SpringBootApplication
public class PrimeWrapsApplication {

    private static final Logger logger = LoggerFactory.getLogger(PrimeWrapsApplication.class);

    public static void main(String[] args) {
        logger.info("Starting Prime Wraps Application...");
        SpringApplication.run(PrimeWrapsApplication.class, args);
        logger.info("Prime Wraps Application started successfully!");
    }

    @Bean
    public CommandLineRunner createDefaultAdmin(AuthService authService, UserRepository userRepository, Environment env) {
        return args -> {
            logger.info("Application startup - checking for default admin user...");
            logger.info("Active profiles: {}", Arrays.toString(env.getActiveProfiles()));
            
            if (env.getActiveProfiles() != null && Arrays.asList(env.getActiveProfiles()).contains("dev") && userRepository.findByUsername("admin").isEmpty()) {
                try {
                    authService.createAdminUser("admin", "password");
                    logger.info("Default admin user 'admin' created (dev mode).");
                } catch (RuntimeException e) {
                    logger.error("Error creating default admin user: " + e.getMessage(), e);
                }
            } else {
                logger.info("Skipping admin user creation - not in dev mode or admin already exists");
            }
        };
    }
}