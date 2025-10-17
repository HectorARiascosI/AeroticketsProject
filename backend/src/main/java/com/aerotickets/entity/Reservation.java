package com.aerotickets.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

import static jakarta.persistence.FetchType.LAZY;

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
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = LAZY)
    @JoinColumn(name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_res_user"))
    private User user;

    @ManyToOne(optional = false, fetch = LAZY)
    @JoinColumn(name = "flight_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_res_flight"))
    private Flight flight;

    @Column(name = "seat_number")
    private Integer seatNumber;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReservationStatus status = ReservationStatus.ACTIVE;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Version
    private Integer version;
}