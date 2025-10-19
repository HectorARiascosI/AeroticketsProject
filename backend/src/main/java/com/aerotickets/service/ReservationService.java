package com.aerotickets.service;

import com.aerotickets.dto.ReservationRequestDTO;
import com.aerotickets.dto.ReservationResponseDTO;
import com.aerotickets.entity.*;
import com.aerotickets.repository.FlightRepository;
import com.aerotickets.repository.ReservationRepository;
import com.aerotickets.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              FlightRepository flightRepository,
                              UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.flightRepository = flightRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReservationResponseDTO create(String userEmail, ReservationRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Flight flight = flightRepository.findById(dto.getFlightId())
                .orElseThrow(() -> new IllegalArgumentException("Vuelo no encontrado"));

        long ocupados = reservationRepository.countByFlight_IdAndStatus(flight.getId(), ReservationStatus.ACTIVE);
        if (ocupados >= flight.getTotalSeats()) {
            throw new IllegalStateException("No hay cupos disponibles para este vuelo");
        }

        if (dto.getSeatNumber() != null) {
            if (dto.getSeatNumber() < 1 || dto.getSeatNumber() > flight.getTotalSeats()) {
                throw new IllegalArgumentException("Número de asiento fuera de rango");
            }
            if (reservationRepository.existsByFlight_IdAndSeatNumberAndStatus(
                    flight.getId(), dto.getSeatNumber(), ReservationStatus.ACTIVE)) {
                throw new IllegalStateException("Ese asiento ya fue reservado");
            }
        }

        try {
            Reservation r = Reservation.builder()
                    .user(user)
                    .flight(flight)
                    .seatNumber(dto.getSeatNumber())
                    .status(ReservationStatus.ACTIVE)
                    .build();
            Reservation saved = reservationRepository.save(r);
            return toDto(saved);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalStateException("Conflicto de reserva: intenta con otro asiento");
        }
    }

    public List<ReservationResponseDTO> listMine(String userEmail) {
        return reservationRepository.findByUser_EmailOrderByCreatedAtDesc(userEmail)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void cancel(String userEmail, Long reservationId) {
        Reservation r = reservationRepository.findByIdAndUser_Email(reservationId, userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
        if (r.getStatus() == ReservationStatus.CANCELLED) return;
        r.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(r);
    }

    private ReservationResponseDTO toDto(Reservation r) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(r.getId());
        dto.setSeatNumber(r.getSeatNumber());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setFlightId(r.getFlight().getId());
        dto.setAirline(r.getFlight().getAirline());
        dto.setOrigin(r.getFlight().getOrigin());
        dto.setDestination(r.getFlight().getDestination());
        dto.setDepartureAt(r.getFlight().getDepartureAt());
        dto.setArriveAt(r.getFlight().getArriveAt());
        dto.setPrice(r.getFlight().getPrice());
        return dto;
    }
}