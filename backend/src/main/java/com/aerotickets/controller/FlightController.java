package com.aerotickets.controller;

import com.aerotickets.dto.FlightDTO;
import com.aerotickets.entity.Flight;
import com.aerotickets.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {
    private final FlightService flightService;
    public FlightController(FlightService flightService){ this.flightService = flightService; }

    @GetMapping
    public List<Flight> listAll() {
        return flightService.listAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody FlightDTO dto) {
        Flight f = Flight.builder()
                .airline(dto.getAirline())
                .origin(dto.getOrigin())
                .destination(dto.getDestination())
                .departureAt(dto.getDepartureAt())
                .arriveAt(dto.getArriveAt())
                .totalSeats(dto.getTotalSeats())
                .price(dto.getPrice())
                .build();
        Flight saved = flightService.create(f);
        return ResponseEntity.ok(saved);
    }
}
