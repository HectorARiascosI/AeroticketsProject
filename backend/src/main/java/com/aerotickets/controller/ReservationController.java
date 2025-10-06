package com.aerotickets.controller;

import com.aerotickets.dto.ReservationRequestDTO;
import com.aerotickets.entity.Reservation;
import com.aerotickets.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    public ReservationController(ReservationService reservationService){ this.reservationService = reservationService; }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ReservationRequestDTO dto) {
        Reservation r = reservationService.createReservation(dto.getUserId(), dto.getFlightId(), dto.getSeatNumber());
        return ResponseEntity.ok("Reserva creada correctamente. ID: " + r.getId());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, @RequestParam Long userId) {
        reservationService.cancelReservation(id, userId);
        return ResponseEntity.ok("Reserva cancelada correctamente.");
    }
}
