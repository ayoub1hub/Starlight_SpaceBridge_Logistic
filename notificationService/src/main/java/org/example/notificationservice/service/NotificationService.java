package org.example.notificationservice.service;

import org.example.notificationservice.dto.NotificationRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired(required = false)  // Make it optional if SmsService doesn't exist
    private SmsService smsService;

    public void sendNotification(NotificationRequest request) {
        switch(request.getType()) {
            case EMAIL:
                emailService.sendEmail(request);
                break;
            case SMS:
                if (smsService != null) {
                    smsService.sendSms(request);
                } else {
                    throw new RuntimeException("SMS service not configured");
                }
                break;
            case BOTH:
                emailService.sendEmail(request);
                if (smsService != null) {
                    smsService.sendSms(request);
                }
                break;
        }
    }
}