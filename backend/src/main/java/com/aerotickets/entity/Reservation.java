package com.aerotickets.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
    name = "reservations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_res_flight_seat_active",
            columnNames = {"flight_id", "seat_number", "status"}
        ),
        @UniqueConstraint(
            name = "uk_res_flight_user_active",
            columnNames = {"flight_id", "user_id", "status"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Usuario
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_res_user"))
    private User user;

    // Vuelo
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_res_flight"))
    private Flight flight;

    // Asiento
    @Column(name = "seat_number")
    private Integer seatNumber;

    // Estado
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 12)
    private ReservationStatus status = ReservationStatus.ACTIVE;

    // Creado
    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Version
    private Integer version;
}