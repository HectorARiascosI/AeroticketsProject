package com.aerotickets.external.aviationstack;

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
public class AviationstackProvider {

    private final WebClient webClient;

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getLiveFlights(String depIata, String arrIata) {
        String baseUrl = "http://api.aviationstack.com/v1/flights";
        String apiKey = System.getenv("AVIATIONSTACK_KEY");

        String url = String.format("%s?access_key=%s&dep_iata=%s&arr_iata=%s",
                baseUrl, apiKey, depIata, arrIata);

        log.info("🔍 Consultando Aviationstack: {}", url);

        Map<String, Object> response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(e -> {
                    log.error("❌ Error al consumir Aviationstack: {}", e.getMessage());
                    return Mono.just(Map.of());
                })
                .block();

        if (response == null || !response.containsKey("data")) {
            return List.of();
        }

        return (List<Map<String, Object>>) response.get("data");
    }
}