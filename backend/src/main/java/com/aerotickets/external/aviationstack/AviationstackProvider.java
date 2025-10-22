package com.aerotickets.external.aviationstack;

import com.aerotickets.external.dto.ExternalFlightDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AviationstackProvider {

    private final WebClient.Builder webClientBuilder;

    @Value("${external.apis.aviationstack.base-url}")
    private String baseUrl;

    @Value("${external.apis.aviationstack.api-key}")
    private String apiKey;

    @Cacheable("aviationstack-flights")
    public List<ExternalFlightDTO> getFlights(String origin, String destination) {
        try {
            String encodedOrigin = URLEncoder.encode(origin, StandardCharsets.UTF_8);
            String encodedDestination = URLEncoder.encode(destination, StandardCharsets.UTF_8);

            URI uri = new URI(baseUrl + "/flights?access_key=" + apiKey +
                    "&dep_iata=" + encodedOrigin +
                    "&arr_iata=" + encodedDestination +
                    "&limit=10");

            log.info("🌐 Consultando AviationStack API: {}", uri);

            WebClient client = webClientBuilder
                    .baseUrl(baseUrl)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();

            // ✅ Aquí corregimos el tipo esperado del body
            MapAviationstack response = client.get()
                    .uri(uri)
                    .retrieve()
                    .bodyToMono(MapAviationstack.class)
                    .onErrorResume(e -> {
                        log.error("❌ Error al consumir AviationStack API: {}", e.getMessage());
                        return Mono.empty();
                    })
                    .block();

            if (response == null) return Collections.emptyList();

            return response.toDTOs(response, origin);
        } catch (Exception e) {
            log.error("❌ Error general en AviationstackProvider: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Clase para mapear la respuesta de AviationStack
     */
    public static class MapAviationstack {
        public List<Map<String, Object>> data;
        @SuppressWarnings("unchecked")
        public List<ExternalFlightDTO> toDTOs(MapAviationstack map, String origin) {
            if (map == null || map.data == null) return Collections.emptyList();

            return map.data.stream()
                    .map((Map<String, Object> entry) -> {
                        Map<String, Object> flight = entry;
                        Map<String, Object> airline = (Map<String, Object>) flight.get("airline");
                        Map<String, Object> dep = (Map<String, Object>) flight.get("departure");
                        Map<String, Object> arr = (Map<String, Object>) flight.get("arrival");

                        ExternalFlightDTO dto = new ExternalFlightDTO();
                        dto.setAirline(airline != null ? (String) airline.get("name") : "Desconocida");
                        dto.setOrigin(dep != null ? (String) dep.get("iata") : origin);
                        dto.setDestination(arr != null ? (String) arr.get("iata") : "");
                        dto.setDepartureTime(dep != null ? (String) dep.get("scheduled") : null);
                        dto.setArrivalTime(arr != null ? (String) arr.get("scheduled") : null);
                        dto.setPrice(250000.0);
                        return dto;
                    })
                    .toList();
        }
    }
}