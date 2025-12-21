package org.example.notificationservice.service;

import org.example.notificationservice.dto.NotificationRequest;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public void sendSms(NotificationRequest request) {
        // TODO: Implement SMS sending later (Twilio, AWS SNS, etc.)
        System.out.println("📱 SMS would be sent to: " + request.getTo());
        System.out.println("📱 Message: " + request.getMessage());

        // For now, just log it
        // Later you can integrate with Twilio, AWS SNS, or other SMS providers
    }
}