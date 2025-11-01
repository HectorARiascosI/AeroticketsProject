package com.aerotickets.sim;

import java.time.LocalTime;
import java.util.Random;

public class DisruptionEngine {

    public static class Disruption {
        public final boolean diverted;
        public final boolean emergency;
        public final Integer extraDelay; // minutos adicionales por congestión
        public Disruption(boolean d, boolean e, Integer x) {
            this.diverted = d; this.emergency = e; this.extraDelay = x;
        }
    }

    public Disruption compute(LocalTime depTime, int weatherDelay, String aircraftType, int distanceKm, int baseDelaySeed) {
        Random rnd = new Random(baseDelaySeed);

        // Hora punta incrementa retrasos (06-09, 17-21)
        boolean peak = (depTime.getHour() >= 6 && depTime.getHour() <= 9)
                || (depTime.getHour() >= 17 && depTime.getHour() <= 21);
        int congestion = peak ? 3 + rnd.nextInt(12) : rnd.nextInt(5);

        // Penalización por aeronave y distancia (operación/rodaje/pista)
        int typeBias = (aircraftType.startsWith("ATR") ? 2 : 0); // turbohélice: más sensibles a WX
        int distBias = distanceKm > 900 ? 3 : (distanceKm > 500 ? 1 : 0);

        int extra = congestion + typeBias + distBias;

        // Desvío bajo pero no cero; emergencia casi nula
        boolean diverted = rnd.nextDouble() < (0.007 + weatherDelay / 600.0); // ~0.7% + clima
        boolean emergency = rnd.nextDouble() < 0.002; // 0.2%

        return new Disruption(diverted, emergency, extra);
    }
}