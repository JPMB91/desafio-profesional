package com.digitalhouse.turnos.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private static final Logger logger = LoggerFactory.getLogger(LoginService.class);

    public void logLoginAttempt(String email, boolean success) {
        logger.info("Login attempt for email: {}, Success: {}", email, success);
    }
}