package com.aerotickets.security;

import com.aerotickets.service.CustomUserDetailsService;
import com.aerotickets.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String path = request.getRequestURI();

        // 1) Ignorar por completo endpoints públicos (no validar token aquí)
        if (path.startsWith("/api/auth")
                || ("GET".equals(request.getMethod()) && path.startsWith("/api/flights"))) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2) Si no hay Authorization Bearer, seguir como anónimo
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3) Validar token, pero de forma tolerante (si es malo, no reventar la cadena)
        final String jwt = authHeader.substring(7);
        String userEmail = null;
        try {
            userEmail = jwtService.extractUsername(jwt); // retorna null si es inválido
        } catch (Exception e) {
            // Token inválido/expirado: continuar sin autenticación
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails user = userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(jwt, user)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                user, null, user.getAuthorities()
                        );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}