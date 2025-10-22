package com.aerotickets.controller;

import com.aerotickets.model.LiveFlight;
import com.aerotickets.service.LiveFlightService;
import com.aerotickets.util.IataResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controlador REST para vuelos en tiempo real y autocompletado.
 * Gestiona búsqueda de vuelos y sugerencias de aeropuertos/ciudades.
 */
@Slf4j
@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LiveFlightController {

    private final LiveFlightService liveFlightService;

    /**
     * 🔍 Endpoint para buscar vuelos en tiempo real
     * Ejemplo: /api/live/flights/search?origin=BOG&destination=MDE
     */
    @GetMapping("/flights/search")
    public ResponseEntity<Map<String, Object>> searchFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String date
    ) {
        try {
            log.info("✈️  Buscando vuelos en vivo: {} -> {}, fecha={}", origin, destination, date);

            List<LiveFlight> flights = liveFlightService.searchLiveFlights(origin, destination, date);
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("source", "live");
            body.put("count", flights.size());
            body.put("items", flights);

            return ResponseEntity.ok(body);
        } catch (Exception e) {
            log.error("❌ Error al buscar vuelos en vivo: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "No se pudieron obtener vuelos en vivo",
                    "details", e.getMessage()
            ));
        }
    }

    /**
     * 🧭 Endpoint de autocompletado: sugiere ciudades o aeropuertos.
     * Ejemplo: /api/live/autocomplete?query=bog
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<List<Map<String, String>>> autocomplete(
            @RequestParam String query
    ) {
        try {
            log.info("🔤 Autocompletando: {}", query);
            if (query == null || query.isBlank()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            String normalized = query.trim().toLowerCase(Locale.forLanguageTag("es-CO"));
            List<Map<String, String>> results = new ArrayList<>();

            // Buscamos coincidencias manuales desde el IataResolver
            Map<String, String> cityMap = getCityToIata();
            cityMap.forEach((city, iata) -> {
                if (city.contains(normalized) || iata.equalsIgnoreCase(normalized)) {
                    Map<String, String> suggestion = new HashMap<>();
                    suggestion.put("label", capitalize(city) + " (" + iata + ")");
                    suggestion.put("value", iata);
                    results.add(suggestion);
                }
            });

            // Si no encuentra nada, responde vacío sin error 500
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("❌ Error en autocomplete: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Collections.emptyList());
        }
    }

    // ===============================================================
    // 🔧 Métodos auxiliares
    // ===============================================================

    private Map<String, String> getCityToIata() {
        try {
            java.lang.reflect.Field field = IataResolver.class.getDeclaredField("cityToIata");
            field.setAccessible(true);
            return (Map<String, String>) field.get(null);
        } catch (Exception e) {
            log.error("Error al acceder a IataResolver.cityToIata: {}", e.getMessage());
            return Map.of();
        }
    }

    private String capitalize(String s) {
        if (s == null || s.isBlank()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }
}