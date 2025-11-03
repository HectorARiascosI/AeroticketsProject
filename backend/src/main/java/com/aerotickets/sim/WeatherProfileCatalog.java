package com.aerotickets.sim;

import java.time.LocalDate;
import java.util.*;

public final class WeatherProfileCatalog {

    public static final class Wx {
        public final int crosswindKts; // viento cruzado simulado (kts)
        public final boolean fog;      // niebla presente
        public final boolean heavyRain;// lluvia fuerte/tormenta

        public Wx(int crosswindKts, boolean fog, boolean heavyRain) {
            this.crosswindKts = crosswindKts;
            this.fog = fog;
            this.heavyRain = heavyRain;
        }
    }

    // Genera clima pseudo-realista con base a riesgos del aeropuerto y la estación del año
    public static Wx forAirportDay(AirportCatalogCO.Airport ap, LocalDate date, Random rnd) {
        int seasonBoostConv = (date.getMonthValue() >= 3 && date.getMonthValue() <= 5) ||
                              (date.getMonthValue() >= 9 && date.getMonthValue() <= 11) ? 15 : 0;
        int convProb = clamp(ap.convectiveRisk + seasonBoostConv + rnd.nextInt(20) - 10, 0, 100);
        int fogProb = clamp(ap.fogRisk + rnd.nextInt(20) - 10, 0, 100);
        int rainProb = clamp(ap.heavyRainRisk + rnd.nextInt(20) - 10, 0, 100);

        boolean fog = rnd.nextInt(100) < fogProb;
        boolean heavy = rnd.nextInt(100) < Math.max(convProb, rainProb);

        int crosswind = Math.max(0, (int)Math.round(rnd.nextGaussian()*5 + (heavy ? 18 : 10)));
        return new Wx(crosswind, fog, heavy);
    }

    private static int clamp(int v, int lo, int hi){ return Math.max(lo, Math.min(hi, v)); }
}