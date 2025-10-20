package com.aerotickets.repository;

import com.aerotickets.entity.Reservation;
import com.aerotickets.entity.ReservationStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    long countByFlight_IdAndStatus(Long flightId, ReservationStatus status);

    boolean existsByFlight_IdAndSeatNumberAndStatus(Long flightId, Integer seatNumber, ReservationStatus status);

    // ✅ Cargar el vuelo junto a la reserva (soluciona LazyInitializationException)
    @EntityGraph(attributePaths = {"flight"})
    List<Reservation> findByUser_EmailOrderByCreatedAtDesc(String email);

    @EntityGraph(attributePaths = {"flight"})
    Optional<Reservation> findByIdAndUser_Email(Long id, String email);
}