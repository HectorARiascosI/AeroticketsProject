package com.aerotickets.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "reservations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"flight_id", "seat_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Usuario que hizo la reserva
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    // Vuelo reservado
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @Column(nullable = false)
    private String status; // ACTIVA, CANCELADA

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}