package com.aerotickets.repository;

import com.aerotickets.entity.Flight;
import com.aerotickets.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    boolean existsByFlightAndSeatNumber(Flight flight, Integer seatNumber);

    @Query("select r.seatNumber from Reservation r where r.flight.id = ?1 and r.status = 'ACTIVA'")
    List<Integer> findBookedSeatsByFlightId(Long flightId);

    long countByFlightIdAndStatus(Long flightId, String status);
}
