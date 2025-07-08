package com.primewraps;

import com.primewraps.repository.UserRepository;
import com.primewraps.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import java.util.Arrays;


/**
 * Main entry point for the Prime Wraps Spring Boot application.
 */
@SpringBootApplication
public class PrimeWrapsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrimeWrapsApplication.class, args);
    }

    @Bean
    public CommandLineRunner createDefaultAdmin(AuthService authService, UserRepository userRepository, Environment env) {
        return args -> {
            if (env.getActiveProfiles() != null && Arrays.asList(env.getActiveProfiles()).contains("dev") && userRepository.findByUsername("admin").isEmpty()) {
                try {
                    authService.createAdminUser("admin", "password");
                    System.out.println("Default admin user 'admin' created (dev mode).");
                } catch (RuntimeException e) {
                    System.err.println("Error creating default admin user: " + e.getMessage());
                }
            }
        };
    }
}