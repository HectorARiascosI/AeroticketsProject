package com.aerotickets.external.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ExternalFlightDTO {
    private String provider;          // Aviationstack | AeroDataBox
    private String airline;           // Nombre de la aerolínea
    private String flightNumber;      // Número de vuelo (ej: AV45)
    private String originIata;        // BOG
    private String originName;        // El Dorado
    private String destinationIata;   // MDE
    private String destinationName;   // Olaya Herrera
    private LocalDateTime departure;  // Fecha/hora local salida
    private LocalDateTime arrival;    // Fecha/hora local llegada
    private String status;            // scheduled/active/landed/cancelled
    private BigDecimal priceEstimate; // opcional
}