package com.aerotickets.service;

import com.aerotickets.model.LiveFlight;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SimulationRegistry {

    // flightNumber -> LiveFlight
    private final Map<String, LiveFlight> live = new ConcurrentHashMap<>();
    private final List<SseEmitter> subscribers = new CopyOnWriteArrayList<>();

    public void putAll(List<LiveFlight> flights) {
        for (LiveFlight f : flights) {
            live.put(f.getFlightNumber(), f);
        }
        broadcastSnapshot();
    }

    public List<LiveFlight> list() { return new ArrayList<>(live.values()); }

    public Optional<LiveFlight> get(String flightNumber) {
        return Optional.ofNullable(live.get(flightNumber));
    }

    public void update(LiveFlight f) { live.put(f.getFlightNumber(), f); }

    public void clear() {
        live.clear();
        broadcastSnapshot();
    }

    // Actualiza estados cada 30s (zona Bogotá)
    @Scheduled(fixedRate = 30000, initialDelay = 10000)
    public void tick() {
        ZoneId tz = ZoneId.of("America/Bogota");
        LocalDateTime now = LocalDateTime.now(tz);

        for (LiveFlight f : live.values()) {
            LocalDateTime dep = LocalDateTime.parse(f.getDepartureAt());
            LocalDateTime arr = LocalDateTime.parse(f.getArrivalAt());

            if ("CANCELLED".equals(f.getStatus()) || "DIVERTED".equals(f.getStatus())) continue;

            boolean delayed = f.getDelayMinutes() != null && f.getDelayMinutes() > 10;
            if (now.isBefore(dep.minusMinutes(60))) {
                f.setStatus("SCHEDULED");
            } else if (!now.isAfter(dep) && now.isAfter(dep.minusMinutes(60))) {
                f.setStatus(delayed ? "DELAYED" : "BOARDING");
            } else if (now.isAfter(dep) && now.isBefore(arr)) {
                f.setStatus(delayed ? "DELAYED" : "EN-ROUTE");
            } else {
                f.setStatus("LANDED");
            }
        }
        broadcastSnapshot();
    }

    // SSE
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        subscribers.add(emitter);
        emitter.onCompletion(() -> subscribers.remove(emitter));
        emitter.onTimeout(() -> subscribers.remove(emitter));
        try {
            emitter.send(SseEmitter.event()
                    .name("snapshot")
                    .data(list(), MediaType.APPLICATION_JSON));
        } catch (Exception ignored) {}
        return emitter;
    }

    private void broadcastSnapshot() {
        List<LiveFlight> snapshot = list();
        for (SseEmitter em : new ArrayList<>(subscribers)) {
            try {
                em.send(SseEmitter.event()
                        .name("snapshot")
                        .data(snapshot, MediaType.APPLICATION_JSON));
            } catch (Exception e) {
                subscribers.remove(em);
            }
        }
    }
}