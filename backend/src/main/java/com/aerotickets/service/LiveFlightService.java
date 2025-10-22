package com.aerotickets.service;

import com.aerotickets.external.aerodatabox.AeroDataBoxProvider;
import com.aerotickets.external.aviationstack.AviationstackProvider;
import com.aerotickets.model.LiveFlight;
import com.aerotickets.util.IataResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Servicio encargado de obtener vuelos en tiempo real
 * desde diferentes proveedores externos (Aviationstack, AeroDataBox)
 * y de normalizar los resultados a la entidad LiveFlight.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LiveFlightService {

    private final AviationstackProvider aviationstackProvider;
    private final AeroDataBoxProvider aeroDataBoxProvider;

    /**
     * Método principal para buscar vuelos en vivo según origen, destino y fecha.
     * Este método mantiene compatibilidad con el controlador.
     */
    public List<LiveFlight> searchLiveFlights(String origin, String destination, String date) {
        // La fecha se puede usar luego para filtrar, pero por ahora no se requiere.
        return getLiveFlights(origin, destination);
    }

    /**
     * Obtiene vuelos desde los proveedores externos.
     */
    public List<LiveFlight> getLiveFlights(String origin, String destination) {
        List<LiveFlight> flights = new ArrayList<>();

        String depIata = IataResolver.toIata(origin);
        String arrIata = IataResolver.toIata(destination);

        if (depIata == null) {
            log.warn("⚠ No se pudo resolver el IATA de origen: {}", origin);
            return flights;
        }

        // === Fuente 1: Aviationstack ===
        try {
            List<Map<String, Object>> data = aviationstackProvider.getLiveFlights(depIata, arrIata);
            flights.addAll(mapToLiveFlights(data, "Aviationstack"));
        } catch (Exception e) {
            log.error("❌ Error al obtener vuelos desde Aviationstack: {}", e.getMessage());
        }

        // === Fuente 2: AeroDataBox (respaldo) ===
        try {
            List<Map<String, Object>> data = aeroDataBoxProvider.getDepartures(depIata);
            flights.addAll(mapToLiveFlights(data, "AeroDataBox"));
        } catch (Exception e) {
            log.error("❌ Error al obtener vuelos desde AeroDataBox: {}", e.getMessage());
        }

        log.info("✅ Se encontraron {} vuelos en total (Aviationstack + AeroDataBox).", flights.size());

        return flights;
    }

    /**
     * Convierte una lista de mapas genéricos provenientes de la API a entidades LiveFlight.
     */
    private List<LiveFlight> mapToLiveFlights(List<Map<String, Object>> data, String source) {
        List<LiveFlight> result = new ArrayList<>();

        if (data == null) return result;

        for (Map<String, Object> item : data) {
            try {
                LiveFlight lf = new LiveFlight();

                if ("Aviationstack".equals(source)) {
                    lf.setAirline(getString(item, "airline", "name"));
                    lf.setFlightNumber(getString(item, "flight", "iata"));
                    lf.setOriginIata(getString(item, "departure", "iata"));
                    lf.setDestinationIata(getString(item, "arrival", "iata"));
                    lf.setDepartureAt(getString(item, "departure", "estimated"));
                    lf.setArrivalAt(getString(item, "arrival", "estimated"));
                    lf.setStatus((String) item.getOrDefault("flight_status", "scheduled"));
                    lf.setProvider("Aviationstack");
                } else if ("AeroDataBox".equals(source)) {
                    lf.setAirline(getString(item, "airline", "name"));
                    lf.setFlightNumber(getString(item, "number"));
                    lf.setOriginIata(getString(item, "departure", "airport", "iata"));
                    lf.setDestinationIata(getString(item, "arrival", "airport", "iata"));
                    lf.setDepartureAt(getString(item, "departure", "scheduledTime"));
                    lf.setArrivalAt(getString(item, "arrival", "scheduledTime"));
                    lf.setStatus((String) item.getOrDefault("status", "scheduled"));
                    lf.setProvider("AeroDataBox");
                }

                result.add(lf);
            } catch (Exception e) {
                log.warn("Error mapeando vuelo: {}", e.getMessage());
            }
        }

        return result;
    }

    /**
     * Extrae un valor anidado de un mapa de forma segura.
     */
    @SuppressWarnings("unchecked")
    private String getString(Map<String, Object> base, String... keys) {
        Object current = base;
        for (String key : keys) {
            if (!(current instanceof Map)) return null;
            current = ((Map<String, Object>) current).get(key);
            if (current == null) return null;
        }
        return current.toString();
    }
}