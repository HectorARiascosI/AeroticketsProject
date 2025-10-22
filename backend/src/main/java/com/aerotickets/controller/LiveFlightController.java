package com.aerotickets.controller;

import com.aerotickets.external.dto.LiveFlightDTO;
import com.aerotickets.service.LiveFlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/live/flights")
@RequiredArgsConstructor
public class LiveFlightController {

    private final LiveFlightService service;

    @GetMapping("/search")
    public ResponseEntity<List<LiveFlightDTO>> search(
            @RequestParam(defaultValue = "Aviationstack") String provider,
            @RequestParam(required = false) String origin,        // IATA: BOG
            @RequestParam(required = false) String destination,   // IATA: MDE
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String airline        // e.g. Avianca
    ) throws Exception {
        return ResponseEntity.ok(service.search(provider, origin, destination, date, airline));
    }
}