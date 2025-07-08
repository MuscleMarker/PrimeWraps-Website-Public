package com.primewraps.service;

import com.primewraps.dto.ContactRequest;
import com.primewraps.model.Contact;
import com.primewraps.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service class for handling contact form submissions.
 * This service saves contact requests to the database and sends email notifications.
 */
@Service
public class ContactService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ContactRepository contactRepository;

    // Injects the recipient email address from application properties
    @Value("${spring.mail.recipient}")
    private String recipientEmail;

    /**
     * Saves the contact request to the database and sends a notification email.
     * @param request The ContactRequest object containing the submission details.
     */
    public void sendContactEmail(ContactRequest request) {
        // Save contact details to the database
        Contact contact = new Contact();
        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setService(request.getService());
        contact.setMessage(request.getMessage());
        contactRepository.save(contact);

        // Prepare and send the email notification
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("New Contact Form Submission - " + request.getName());
        message.setText(createEmailContent(request));
        message.setFrom("Inquiry@primewraps.co"); // Sender email address
        
        mailSender.send(message);
    }

    /**
     * Creates the content for the notification email based on the contact request.
     * @param request The ContactRequest object.
     * @return A formatted string containing the email content.
     */
    private String createEmailContent(ContactRequest request) {
        StringBuilder content = new StringBuilder();
        content.append("New contact form submission:\n\n");
        content.append("Name: ").append(request.getName()).append("\n");
        content.append("Email: ").append(request.getEmail()).append("\n");
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            content.append("Phone: ").append(request.getPhone()).append("\n");
        }
        if (request.getService() != null && !request.getService().isEmpty()) {
            content.append("Service: ").append(request.getService()).append("\n");
        }
        content.append("Message: ").append(request.getMessage()).append("\n");
        
        return content.toString();
    }
}