package com.aerotickets.service;

import com.aerotickets.dto.AuthResponseDTO;
import com.aerotickets.dto.LoginRequestDTO;
import com.aerotickets.dto.UserRegistrationDTO;
import com.aerotickets.entity.User;
import com.aerotickets.repository.UserRepository;
import com.aerotickets.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder encoder;
  private final AuthenticationManager authManager;
  private final JwtUtil jwtUtil;

  public AuthService(UserRepository userRepository, PasswordEncoder encoder,
                     AuthenticationManager authManager, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.encoder = encoder;
    this.authManager = authManager;
    this.jwtUtil = jwtUtil;
  }

  @Transactional
  public AuthResponseDTO register(UserRegistrationDTO dto) {
    if (userRepository.existsByEmail(dto.getEmail())) {
      throw new IllegalArgumentException("El correo ya está registrado");
    }
    User u = new User();
    u.setFullName(dto.getFullName());
    u.setEmail(dto.getEmail());
    u.setPasswordHash(encoder.encode(dto.getPassword()));
    userRepository.save(u);

    String token = jwtUtil.generate(u.getEmail());
    return new AuthResponseDTO(token, u.getFullName(), u.getEmail());
  }

  public AuthResponseDTO login(LoginRequestDTO dto) {
    var auth = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
    authManager.authenticate(auth); // lanza excepción si no coincide
    var user = userRepository.findByEmail(dto.getEmail()).orElseThrow();
    String token = jwtUtil.generate(user.getEmail());
    return new AuthResponseDTO(token, user.getFullName(), user.getEmail());
  }
}