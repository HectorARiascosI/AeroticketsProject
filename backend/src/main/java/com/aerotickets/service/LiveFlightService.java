package com.aerotickets.service;

import com.aerotickets.external.FlightProvider;
import com.aerotickets.external.dto.LiveFlightDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LiveFlightService {

    private final List<FlightProvider> providers; // se inyectan Aviationstack/AeroDataBox

    public List<LiveFlightDTO> search(String providerName, String origin, String destination,
                                      LocalDate date, String airline) throws Exception {
        FlightProvider provider = resolve(providerName);
        return provider.search(blankToNull(origin), blankToNull(destination), date, blankToNull(airline));
    }

    private FlightProvider resolve(String providerName) {
        return providers.stream()
                .filter(p -> p.getProviderName().equalsIgnoreCase(providerName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no soportado: " + providerName));
    }

    private String blankToNull(String s) { return (s == null || s.isBlank()) ? null : s.trim(); }
}