package com.aerotickets.controller;

import com.aerotickets.dto.AuthResponseDTO;
import com.aerotickets.dto.LoginRequestDTO;
import com.aerotickets.dto.UserRegistrationDTO;
import com.aerotickets.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) { this.authService = authService; }

  @PostMapping("/register")
  public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody UserRegistrationDTO dto) {
    return ResponseEntity.ok(authService.register(dto));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
    return ResponseEntity.ok(authService.login(dto));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me() {
    return ResponseEntity.ok().build();
  }
}