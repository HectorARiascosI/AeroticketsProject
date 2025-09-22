package com.aerotickets.controller;

import com.aerotickets.dto.UserRegistrationDTO;
import com.aerotickets.entity.User;
import com.aerotickets.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService){ this.userService = userService; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDTO dto) {
        User u = userService.register(dto.getFullName(), dto.getEmail(), dto.getPassword());
        // show only safe fields to the user
        return ResponseEntity.ok("Usuario registrado correctamente.");
    }
}
