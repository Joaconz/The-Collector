package com.uade.tpo.thecollector.backend.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    public Map<String, Object> register(Map<String, Object> request) {
        return Map.of("message", "Usuario registrado mock", "user", request.getOrDefault("email", "test@test.com"));
    }

    public Map<String, Object> login(Map<String, Object> request) {
        return Map.of("message", "Login exitoso", "token", UUID.randomUUID().toString());
    }
}
