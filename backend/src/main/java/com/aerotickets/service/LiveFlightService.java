package com.aerotickets.service;

import com.aerotickets.dto.FlightSearchDTO;
import com.aerotickets.model.LiveFlight;
import com.aerotickets.sim.AirportCatalog;
import com.aerotickets.util.IataResolver;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

/**
 * Servicio de búsqueda de vuelos en tiempo real.
 * Incluye:
 *  - Conversión inteligente de texto natural a código IATA.
 *  - Autocompletado semántico de aeropuertos.
 *  - Validaciones robustas para uso en producción.
 */
@Service
public class LiveFlightService {

    private final FlightSimulatorService simulator;

    public LiveFlightService(FlightSimulatorService simulator) {
        this.simulator = simulator;
    }

    /**
     * Busca vuelos en vivo o simulados según los criterios del usuario.
     * Acepta nombres humanos (“bogota”, “medellin”) y los traduce a códigos IATA.
     */
    public List<LiveFlight> searchLive(String originRaw, String destinationRaw, String dateIso, String ignored) {
        String origin = smartToIata(originRaw);
        String destination = smartToIata(destinationRaw);

        if (origin == null || destination == null || origin.equalsIgnoreCase(destination)) {
            return List.of();
        }

        FlightSearchDTO dto = new FlightSearchDTO();
        dto.setOrigin(origin);
        dto.setDestination(destination);

        if (dateIso != null && !dateIso.isBlank()) {
            try {
                dto.setDate(LocalDate.parse(dateIso));
            } catch (Exception ignored2) {}
        }

        return simulator.search(dto);
    }

    /**
     * Retorna sugerencias de aeropuertos en base a texto ingresado (autocomplete).
     */
    public List<Map<String, Object>> autocompleteAirports(String query) {
        if (query == null || query.isBlank()) return List.of();
        query = IataResolver.normalize(query);

        List<Map<String, Object>> results = new ArrayList<>();
        for (String iata : AirportCatalog.keys()) {
            AirportCatalog.AirportInfo info = AirportCatalog.get(iata);
            if (matches(info, query)) {
                Map<String, Object> item = new HashMap<>();
                item.put("iata", iata);
                item.put("city", info.city);
                item.put("country", info.country);
                item.put("airport", info.name);
                results.add(item);
            }
        }
        results.sort(Comparator.comparing(m -> ((String) m.get("city"))));
        return results;
    }

    /**
     * Determina si una entrada de aeropuerto coincide parcialmente con la consulta del usuario.
     */
    private boolean matches(AirportCatalog.AirportInfo info, String query) {
        String city = IataResolver.normalize(info.city);
        String country = IataResolver.normalize(info.country);
        String name = IataResolver.normalize(info.name);
        String iata = info.iata.toLowerCase(Locale.ROOT); // ✅ cambiado aquí

        return iata.contains(query)
                || city.contains(query)
                || name.contains(query)
                || country.contains(query);
    
    }

    /**
     * Conversión flexible texto → código IATA:
     * - Exacto (“BOG”)
     * - Nombre completo (“Bogotá”)
     * - Parcial (“bog”, “rio negro”)
     */
    private String smartToIata(String input) {
        if (input == null || input.isBlank()) return null;

        // Primero, intenta con el resolver centralizado
        String resolved = IataResolver.toIata(input);
        if (resolved != null) return resolved;

        String normalized = IataResolver.normalize(input);
        String best = null;
        int bestScore = Integer.MAX_VALUE;

        for (String iata : AirportCatalog.keys()) {
            AirportCatalog.AirportInfo a = AirportCatalog.get(iata);
            String city = IataResolver.normalize(a.city);
            String name = IataResolver.normalize(a.name);

            // Coincidencia directa
            if (normalized.equals(iata.toLowerCase(Locale.ROOT))
                    || normalized.equals(city)
                    || normalized.equals(name)) {
                return iata;
            }

            // Coincidencia por proximidad
            int score = levenshtein(normalized, city);
            if (score < bestScore) {
                bestScore = score;
                best = iata;
            }
        }

        // Solo acepta coincidencias razonables
        return bestScore <= Math.max(2, normalized.length() / 2) ? best : null;
    }

    /**
     * Calcula la distancia de Levenshtein (mínimo número de ediciones entre dos palabras).
     */
    private int levenshtein(String a, String b) {
        int n = a.length(), m = b.length();
        if (n == 0) return m;
        if (m == 0) return n;

        int[] prev = new int[m + 1];
        int[] cur = new int[m + 1];

        for (int j = 0; j <= m; j++) prev[j] = j;
        for (int i = 1; i <= n; i++) {
            cur[0] = i;
            for (int j = 1; j <= m; j++) {
                int cost = (a.charAt(i - 1) == b.charAt(j - 1)) ? 0 : 1;
                cur[j] = Math.min(
                        Math.min(cur[j - 1] + 1, prev[j] + 1),
                        prev[j - 1] + cost
                );
            }
            int[] tmp = prev;
            prev = cur;
            cur = tmp;
        }
        return prev[m];
    }
}