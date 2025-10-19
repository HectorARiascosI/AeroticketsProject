package com.aerotickets.service;

import com.aerotickets.dto.AuthResponseDTO;
import com.aerotickets.dto.LoginRequestDTO;
import com.aerotickets.dto.UserRegistrationDTO;
import com.aerotickets.entity.User;
import com.aerotickets.repository.UserRepository;
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
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder encoder,
                       AuthenticationManager authManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtService = jwtService;
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
        u.setRole("USER"); // por defecto

        userRepository.save(u);

        var ud = org.springframework.security.core.userdetails.User
                .withUsername(u.getEmail())
                .password(u.getPasswordHash())
                .roles("USER")
                .build();

        String token = jwtService.generateToken(ud);
        return new AuthResponseDTO(token, u.getFullName(), u.getEmail());
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        var auth = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
        authManager.authenticate(auth);

        var user = userRepository.findByEmail(dto.getEmail()).orElseThrow();

        var ud = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles((user.getRole() == null || user.getRole().isBlank()) ? "USER" : user.getRole())
                .build();

        String token = jwtService.generateToken(ud);
        return new AuthResponseDTO(token, user.getFullName(), user.getEmail());
    }
}