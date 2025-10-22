package com.aerotickets.external.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalFlightDTO {

    private String airline;
    private String origin;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private Double price;

}