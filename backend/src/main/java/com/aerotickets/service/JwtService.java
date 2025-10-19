package com.aerotickets.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // El string actual en tu proyecto (lo estamos tratando como BASE64)
    private static final String SECRET_KEY_BASE64 = "746B436D49794C75526A536B56566E586B48756A4E5442304E43755963615674";

    private Key getSignInKey() {
        // Si esta cadena fuese HEX y no Base64, cámbiala a HEX decoder. Pero como ya lo usas así, lo mantenemos.
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY_BASE64);
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);
        return key;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException e) {
            // Firma inválida
            throw e;
        }
    }

    private Boolean isTokenExpired(String token) {
        Date exp = extractClaim(token, Claims::getExpiration);
        return exp.before(new Date());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, 120); // 120 minutos
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, int expirationMinutes) {
        Date now = new Date(System.currentTimeMillis());
        Date exp = new Date(now.getTime() + (long) expirationMinutes * 60 * 1000L);
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}