package com.aerotickets.config;

import com.aerotickets.repository.UserRepository;
import com.aerotickets.security.JwtAuthFilter;
import com.aerotickets.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
public class SecurityConfig {

  private final String allowedOrigins;

  public SecurityConfig(@Value("${vueler.cors.allowed-origins}") String allowedOrigins) {
    this.allowedOrigins = allowedOrigins;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public UserDetailsService userDetailsService(UserRepository userRepository) {
    return username -> userRepository.findByEmail(username)
        .map(u -> org.springframework.security.core.userdetails.User
            .withUsername(u.getEmail())
            .password(u.getPasswordHash())
            .authorities("USER")
            .build())
        .orElseThrow(() -> new UsernameNotFoundException("No existe: " + username));
  }

  @Bean
  public AuthenticationManager authenticationManager(PasswordEncoder encoder, UserDetailsService uds) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(encoder);
    provider.setUserDetailsService(uds);
    return new ProviderManager(provider);
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http, JwtUtil jwtUtil, UserRepository userRepository) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(req -> {
          var c = new CorsConfiguration();
          c.setAllowedOrigins(List.of(allowedOrigins.split(",")));
          c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
          c.setAllowedHeaders(List.of("*"));
          c.setAllowCredentials(true);
          return c;
        }))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(new JwtAuthFilter(jwtUtil, userRepository),
            org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
        .httpBasic(Customizer.withDefaults());

    return http.build();
  }
}