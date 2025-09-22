package com.aerotickets.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightDTO {
    @NotBlank
    private String airline;
    @NotBlank
    private String origin;
    @NotBlank
    private String destination;
    @NotNull
    private LocalDateTime departureAt;
    @NotNull
    private LocalDateTime arriveAt;
    @NotNull
    private Integer totalSeats;
    @NotNull
    private BigDecimal price;
}
