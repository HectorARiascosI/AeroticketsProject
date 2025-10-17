package com.aerotickets.repository;

import com.aerotickets.entity.Reservation;
import com.aerotickets.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    long countByFlightIdAndStatus(Long flightId, ReservationStatus status);

    boolean existsByFlightIdAndSeatNumberAndStatus(Long flightId, Integer seatNumber, ReservationStatus status);

    List<Reservation> findByUserEmailOrderByCreatedAtDesc(String email);

    Optional<Reservation> findByIdAndUserEmail(Long id, String email);
}