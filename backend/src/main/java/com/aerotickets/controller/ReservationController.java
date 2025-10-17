package com.aerotickets.controller;

import com.aerotickets.dto.ReservationRequestDTO;
import com.aerotickets.dto.ReservationResponseDTO;
import com.aerotickets.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> create(Authentication auth,
                                                         @Valid @RequestBody ReservationRequestDTO dto) {
        String email = auth.getName();
        return ResponseEntity.ok(service.create(email, dto));
    }

    @GetMapping("/my")
    public List<ReservationResponseDTO> myReservations(Authentication auth) {
        String email = auth.getName();
        System.out.println("🎟 Solicitando reservas de: " + email);
        return service.listMine(email);
    }

    // Alias para compatibilidad con /me
    @GetMapping("/me")
    public List<ReservationResponseDTO> myReservationsAlias(Authentication auth) {
        String email = auth.getName();
        System.out.println("🎟 (Alias /me) Solicitando reservas de: " + email);
        return service.listMine(email);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(Authentication auth, @PathVariable Long id) {
        service.cancel(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}