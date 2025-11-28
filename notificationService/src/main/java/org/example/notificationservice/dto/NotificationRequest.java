package org.example.notificationservice.dto;



import lombok.Data;

@Data
public class NotificationRequest {
    private String to;              // Recipient email/phone
    private String subject;         // Email subject
    private String message;         // Email body
    private NotificationType type;  // EMAIL, SMS, BOTH
}