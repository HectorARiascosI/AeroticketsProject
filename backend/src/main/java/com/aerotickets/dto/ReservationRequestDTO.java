package com.aerotickets.dto;

import lombok.*;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequestDTO {
    @NotNull
    private Long userId;
    @NotNull
    private Long flightId;
    private Integer seatNumber; // nullable -> auto-assign if null
    // optional: paymentMethod later
}