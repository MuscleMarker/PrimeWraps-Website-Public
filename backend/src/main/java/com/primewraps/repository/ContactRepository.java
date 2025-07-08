package com.primewraps.repository;

import com.primewraps.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Contact entities.
 * Provides CRUD operations for Contact objects.
 */
public interface ContactRepository extends JpaRepository<Contact, Long> {
}