package com.aerotickets.external;

import com.aerotickets.external.dto.LiveFlightDTO;

import java.time.LocalDate;
import java.util.List;

public interface FlightProvider {
    String getProviderName();
    List<LiveFlightDTO> search(String originIata,
                               String destinationIata,
                               LocalDate date,
                               String airlineName) throws Exception;
}