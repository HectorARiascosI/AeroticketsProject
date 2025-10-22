package com.aerotickets.external.aerodatabox;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AeroDataBoxProvider {

    private final WebClient webClient;

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getDepartures(String airportIcao) {
        String baseUrl = "https://aerodatabox.p.rapidapi.com/flights/airports/icao/";
        String apiKey = System.getenv("AERODATABOX_KEY");
        String host = "aerodatabox.p.rapidapi.com";

        String url = baseUrl + airportIcao + "/departures?limit=10";

        log.info("🔍 Consultando AeroDataBox: {}", url);

        Map<String, Object> response = webClient.get()
                .uri(url)
                .header("x-rapidapi-key", apiKey)
                .header("x-rapidapi-host", host)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(e -> {
                    log.error("❌ Error al consumir AeroDataBox: {}", e.getMessage());
                    return Mono.just(Map.of());
                })
                .block();

        if (response == null || !response.containsKey("departures")) {
            return List.of();
        }

        return (List<Map<String, Object>>) response.get("departures");
    }
}