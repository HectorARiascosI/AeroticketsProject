package com.aerotickets.sim;

import java.time.*;
import java.util.Random;

public class WeatherSimulator {

    public static class WX {
        public final String condition; // CLEAR, RAIN, STORM, FOG, WIND
        public final int impact; // 0-100 severidad relativa
        public WX(String c, int i) { this.condition = c; this.impact = i; }
    }

    public WX weatherFor(String iata, LocalDate date, LocalTime hour) {
        // Semilla determinista por aeropuerto+fecha+franja
        int seed = (iata + date + (hour.getHour()/3)).hashCode();
        Random rnd = new Random(seed);

        double p = rnd.nextDouble();
        if (p < 0.60) return new WX("CLEAR", rnd.nextInt(10));         // mayoría de horas
        if (p < 0.80) return new WX("RAIN", 15 + rnd.nextInt(25));     // llovizna/lluvia
        if (p < 0.92) return new WX("FOG", 25 + rnd.nextInt(35));      // niebla
        if (p < 0.98) return new WX("WIND", 20 + rnd.nextInt(40));     // vientos
        return new WX("STORM", 50 + rnd.nextInt(40));                  // tormenta
    }

    // Retraso base en minutos por condición
    public int delayFrom(WX wx) {
        return switch (wx.condition) {
            case "CLEAR" -> 0;
            case "RAIN" -> 5 + wx.impact/10;
            case "FOG" -> 10 + wx.impact/8;
            case "WIND" -> 8 + wx.impact/9;
            case "STORM" -> 20 + wx.impact/5;
            default -> 0;
        };
    }
}