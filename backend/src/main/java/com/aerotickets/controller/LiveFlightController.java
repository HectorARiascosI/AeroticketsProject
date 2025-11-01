package com.aerotickets.controller;

import com.aerotickets.model.LiveFlight;
import com.aerotickets.service.LiveFlightService;
import com.aerotickets.service.SimulationRegistry;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;

@RestController
@RequestMapping("/api/live")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LiveFlightController {

    private final LiveFlightService service;
    private final SimulationRegistry registry;

    public LiveFlightController(LiveFlightService service, SimulationRegistry registry) {
        this.service = service;
        this.registry = registry;
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<Map<String, Object>>> autocomplete(@RequestParam("query") String query) {
        if (query == null || query.isBlank()) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(service.autocompleteAirports(query.trim()));
    }

    @GetMapping("/flights/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam(required = false) String date
    ) {
        List<LiveFlight> items = service.searchLive(origin, destination, date, "simulator");
        Map<String, Object> body = new HashMap<>();
        body.put("source", "live/simulator");
        body.put("count", items.size());
        body.put("items", items);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/status/{flightNumber}")
    public ResponseEntity<?> status(@PathVariable String flightNumber) {
        return registry.get(flightNumber)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Stream de eventos (SSE): EventSource en frontend
    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return registry.subscribe();
    }
}