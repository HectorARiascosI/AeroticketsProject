package com.aerotickets.controller;

import com.aerotickets.dto.UserRegistrationDTO;
import com.aerotickets.entity.User;
import com.aerotickets.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing user registration.
 * Handles incoming requests for creating new user accounts.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Constructor-based dependency injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Registers a new user.
     * @param dto User registration data
     * @return ResponseEntity with success message
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDTO dto) {
        User u = userService.register(dto.getFullName(), dto.getEmail(), dto.getPassword());
        return ResponseEntity.ok("Usuario registrado correctamente: " + u.getFullName());
    }
}