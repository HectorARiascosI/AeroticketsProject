package com.aerotickets.service;

import com.aerotickets.dto.FlightSearchDTO;
import com.aerotickets.model.LiveFlight;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class LiveFlightService {

    private final FlightSimulatorService simulator;

    public LiveFlightService(FlightSimulatorService simulator) {
        this.simulator = simulator;
    }

    public List<LiveFlight> searchLive(String origin, String destination, String dateIso, String ignored) {
        FlightSearchDTO dto = new FlightSearchDTO();
        dto.setOrigin(origin);
        dto.setDestination(destination);
        if (dateIso != null && !dateIso.isBlank()) {
            try { dto.setDate(LocalDate.parse(dateIso)); } catch (Exception ignored2) {}
        }
        return simulator.search(dto);
    }

    public List<Map<String, Object>> autocompleteAirports(String query) {
        return simulator.autocompleteAirports(query);
    }
}