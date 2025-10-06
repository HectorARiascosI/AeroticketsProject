package com.aerotickets.service;

import com.aerotickets.entity.Flight;
import com.aerotickets.entity.Reservation;
import com.aerotickets.entity.User;
import com.aerotickets.repository.FlightRepository;
import com.aerotickets.repository.ReservationRepository;
import com.aerotickets.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
    public Reservation createReservation(Long userId, Long flightId, Integer desiredSeat) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Flight flight = flightRepository.findById(flightId).orElseThrow(() -> new IllegalArgumentException("Vuelo no encontrado"));

        long occupied = reservationRepository.countByFlightIdAndStatus(flightId, "ACTIVA");
        if (occupied >= flight.getTotalSeats()) {
            throw new IllegalStateException("El vuelo está completo");
        }

        Integer seat = desiredSeat;
        if (seat == null) {
            List<Integer> occupiedList = reservationRepository.findBookedSeatsByFlightId(flightId);
            Set<Integer> occupiedSet = occupiedList.stream().collect(Collectors.toSet());
            seat = IntStream.rangeClosed(1, flight.getTotalSeats())
                    .filter(i -> !occupiedSet.contains(i))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("No hay asientos disponibles"));
        }

        Reservation r = Reservation.builder()
                .user(user)
                .flight(flight)
                .seatNumber(seat)
                .status("ACTIVA")
                .build();

        try {
            return reservationRepository.save(r);
        } catch (DataIntegrityViolationException ex) {
            // seat unique constraint violation
            throw new IllegalStateException("Asiento ya reservado, intenta de nuevo");
        }
    }

    @Transactional
    public void cancelReservation(Long reservationId, Long userId) {
        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
        if (!r.getUser().getId().equals(userId)) {
            throw new SecurityException("No autorizado");
        }
        r.setStatus("CANCELADA");
        reservationRepository.save(r);
    }
}
