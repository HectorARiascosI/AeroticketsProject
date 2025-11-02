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
        return ResponseEntity.ok(service.create(auth.getName(), dto));
    }

    @GetMapping("/my")
    public List<ReservationResponseDTO> myReservations(Authentication auth) {
        return service.listMine(auth.getName());
    }

    @GetMapping("/me")
    public List<ReservationResponseDTO> myReservationsAlias(Authentication auth) {
        return service.listMine(auth.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(Authentication auth, @PathVariable Long id) {
        service.cancel(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}