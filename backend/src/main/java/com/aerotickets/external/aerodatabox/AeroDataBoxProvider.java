package com.aerotickets.external.aerodatabox;

import com.aerotickets.config.ExternalApiConfig;
import com.aerotickets.external.FlightProvider;
import com.aerotickets.external.dto.LiveFlightDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Docs: https://rapidapi.com/aedbx-aedbx-default/api/aerodatabox/
 */
@Component
@RequiredArgsConstructor
public class AeroDataBoxProvider implements FlightProvider {

    private final WebClient webClient;
    private final ExternalApiConfig cfg;

    @Override
    public String getProviderName() { return "AeroDataBox"; }

    @Override
    @Cacheable(value = "liveFlights", key = "'adb-'+#originIata+'-'+#destinationIata+'-'+#date+'-'+#airlineName")
    public List<LiveFlightDTO> search(String originIata, String destinationIata, LocalDate date, String airlineName) throws Exception {
        // En ADB las búsquedas suelen ser por aeropuerto y rango horario (no fecha exacta)
        // Aquí hacemos un ejemplo simple por origen (dep_iata) y fecha (asumimos 00:00-23:59).
        String base = cfg.getAerodatabox().getBaseUrl()
                + "/flights/airports/iata/" + originIata + "/" + date + "T00:00/" + date + "T23:59";

        var resp = webClient.get().uri(builder -> builder
                        .path(base)
                        .queryParam("withCancelled", "false")
                        .queryParam("withCodeshared", "true")
                        .queryParam("withCargo", "false")
                        .queryParam("withPrivate", "false")
                        .build())
                .header("X-RapidAPI-Key", cfg.getAerodatabox().getApiKey())
                .header("X-RapidAPI-Host", cfg.getAerodatabox().getHost())
                .retrieve()
                .bodyToMono(ADBPage.class)
                .block();

        return ADBPage.toDTOs(resp, getProviderName(), destinationIata, airlineName);
    }

    // ====== mapeo respuesta mínima ======
    public static class ADBPage {
        public List<ADBFlight> departures;
        public static class ADBFlight {
            public String number;
            public ADBAirline airline;
            public ADBAirport arrival;
            public ADBTime time;
            public String status;
        }
        public static class ADBAirline { public String name; }
        public static class ADBAirport { public String iata; }
        public static class ADBTime { public String scheduled; public String local; }

        public static List<LiveFlightDTO> toDTOs(ADBPage p, String provider, String filterDest, String airlineName) {
            if (p == null || p.departures == null) return List.of();
            return p.departures.stream()
                    .filter(f -> filterDest == null || filterDest.isBlank()
                            || (f.arrival != null && filterDest.equalsIgnoreCase(f.arrival.iata)))
                    .filter(f -> airlineName == null || airlineName.isBlank()
                            || (f.airline != null && f.airline.name.toLowerCase().contains(airlineName.toLowerCase())))
                    .map(f -> {
                        LiveFlightDTO dto = new LiveFlightDTO();
                        dto.setProvider(provider);
                        dto.setAirline(f.airline != null ? f.airline.name : null);
                        dto.setFlightNumber(f.number);
                        dto.setOriginIata(null); // ADB no devuelve origen directo en este endpoint
                        dto.setDestinationIata(f.arrival != null ? f.arrival.iata : null);
                        dto.setDepartureAt(parseDate(f.time != null ? f.time.local : null));
                        dto.setArrivalAt(null);
                        dto.setStatus(f.status);
                        return dto;
                    }).toList();
        }

        private static LocalDateTime parseDate(String s) {
            try { return (s == null) ? null : LocalDateTime.parse(s.replace("Z","")); }
            catch (Exception e) { return null; }
        }
    }
}