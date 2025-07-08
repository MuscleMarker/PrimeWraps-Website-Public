package com.primewraps.model;

/**
 * Enum representing the possible statuses of a contact submission.
 */
public enum ContactStatus {
    PENDING,    // The contact submission is new and awaiting review.
    REVIEWED,   // The contact submission has been reviewed.
    ARCHIVED    // The contact submission has been archived.
}