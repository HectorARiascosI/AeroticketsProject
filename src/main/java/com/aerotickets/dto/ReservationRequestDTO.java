package com.aerotickets.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequestDTO {
    private Long userId;
    private Long flightId;
    private Integer seatNumber; // nullable -> auto-assign
}
