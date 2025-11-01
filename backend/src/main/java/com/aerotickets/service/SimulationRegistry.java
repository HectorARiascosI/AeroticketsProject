package com.aerotickets.service;

import com.aerotickets.model.LiveFlight;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SimulationRegistry {

    // VueloId -> LiveFlight
    private final Map<String, LiveFlight> live = new ConcurrentHashMap<>();

    // Subscriptores EventSource (SSE)
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

    public void update(LiveFlight f) {
        live.put(f.getFlightNumber(), f);
    }

    public void clear() {
        live.clear();
        broadcastSnapshot();
    }

    // Ticker de 30s para actualizar estados en tiempo real
    @Scheduled(fixedRate = 30000, initialDelay = 10000)
    public void tick() {
        ZoneId tz = ZoneId.of("America/Bogota");
        LocalDateTime now = LocalDateTime.now(tz);
        for (LiveFlight f : live.values()) {
            LocalDateTime dep = LocalDateTime.parse(f.getDepartureAt());
            LocalDateTime arr = LocalDateTime.parse(f.getArrivalAt());

            if ("CANCELLED".equals(f.getStatus()) || "DIVERTED".equals(f.getStatus())) continue;

            if (now.isBefore(dep.minusMinutes(60))) {
                f.setStatus("SCHEDULED");
            } else if (!now.isAfter(dep) && now.isAfter(dep.minusMinutes(60))) {
                f.setStatus(f.getDelayMinutes()!=null && f.getDelayMinutes()>0 ? "DELAYED" : "BOARDING");
            } else if (now.isAfter(dep) && now.isBefore(arr)) {
                f.setStatus(f.getDelayMinutes()!=null && f.getDelayMinutes()>10 ? "DELAYED" : "EN-ROUTE");
            } else if (now.isAfter(arr)) {
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
            emitter.send(SseEmitter.event().name("snapshot").data(list()));
        } catch (Exception ignored) {}
        return emitter;
    }

    private void broadcastSnapshot() {
        Iterator<SseEmitter> it = subscribers.iterator();
        List<LiveFlight> snapshot = list();
        while (it.hasNext()) {
            SseEmitter em = it.next();
            try {
                em.send(SseEmitter.event().name("snapshot").data(snapshot));
            } catch (Exception e) {
                it.remove();
            }
        }
    }
}