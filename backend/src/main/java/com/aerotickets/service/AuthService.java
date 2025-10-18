package com.aerotickets.service;

import com.aerotickets.dto.AuthResponseDTO;
import com.aerotickets.dto.LoginRequestDTO;
import com.aerotickets.dto.UserRegistrationDTO;
import com.aerotickets.entity.User;
import com.aerotickets.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder encoder,
                       AuthenticationManager authManager,
                       JwtService jwtService) {
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
        u.setRole("USER");
        userRepository.save(u);

        UserBuilder ub = org.springframework.security.core.userdetails.User.builder()
                .username(u.getEmail())
                .password(u.getPasswordHash())
                .roles("USER");

        String token = jwtService.generateToken(ub.build());
        return new AuthResponseDTO(token, u.getFullName(), u.getEmail());
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        var auth = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
        authManager.authenticate(auth);

        var u = userRepository.findByEmail(dto.getEmail()).orElseThrow();

        UserBuilder ub = org.springframework.security.core.userdetails.User.builder()
                .username(u.getEmail())
                .password(u.getPasswordHash())
                .roles(u.getRole() != null ? u.getRole() : "USER");

        String token = jwtService.generateToken(ub.build());
        return new AuthResponseDTO(token, u.getFullName(), u.getEmail());
    }
}