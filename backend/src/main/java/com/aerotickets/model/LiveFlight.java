package com.aerotickets.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa un vuelo obtenido en tiempo real
 * desde proveedores externos (Aviationstack o AeroDataBox).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "live_flights")
public class LiveFlight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String airline;
    private String flightNumber;

    private String originIata;
    private String destinationIata;

    private String departureAt;
    private String arrivalAt;

    private String status;       // Ej: "scheduled", "active", "landed"
    private String provider;     // Ej: "Aviationstack" o "AeroDataBox"
}