package com.aerotickets.service;

import com.aerotickets.dto.FlightSearchDTO;
import com.aerotickets.model.LiveFlight;
import com.aerotickets.sim.*;
import com.aerotickets.util.GeoUtil;
import com.aerotickets.util.IataResolver;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class FlightSimulatorService {

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    private static final List<String> AIRLINES = List.of("Avianca","LATAM Airlines","SATENA","Ultra Air (sim)","Viva (sim)");
    private static final Map<String,String> CODE = Map.of("Avianca","AV","LATAM Airlines","LA","SATENA","9R","Ultra Air (sim)","UL","Viva (sim)","VH");
    private static final String[] TYPES = AircraftCatalog.types();
    private static final String[] GATES = genGates();

    private final WeatherSimulator weather = new WeatherSimulator();
    private final DisruptionEngine disruptor = new DisruptionEngine();
    private final SimulationRegistry registry;

    public FlightSimulatorService(SimulationRegistry registry) {
        this.registry = registry;
    }

    public List<Map<String, Object>> autocompleteAirports(String query) {
        if (query == null || query.isBlank()) return List.of();
        String q = IataResolver.normalize(query);
        List<Map<String, Object>> out = new ArrayList<>();
        for (String iata : AirportCatalog.keys()) {
            AirportCatalog.AirportInfo a = AirportCatalog.get(iata);
            String normCity = com.aerotickets.util.IataResolver.normalize(a.city);
            if (iata.toLowerCase(Locale.ROOT).contains(q) || normCity.contains(q)) {
                out.add(Map.of(
                        "iata", a.iata,
                        "city", a.city,
                        "label", a.city + " (" + a.iata + "), " + a.country
                ));
            }
        }
        return out.size() > 12 ? out.subList(0,12) : out;
    }

    public List<LiveFlight> search(FlightSearchDTO dto) {
        String dep = IataResolver.toIata(dto.getOrigin());
        String arr = IataResolver.toIata(dto.getDestination());
        if (dep == null || arr == null || dep.equalsIgnoreCase(arr)) return List.of();

        LocalDate date = dto.getDate() != null ? dto.getDate() : LocalDate.now();
        int seed = Objects.hash(dep, arr, date.toString());
        Random rnd = new Random(seed);

        AirportCatalog.AirportInfo aDep = AirportCatalog.get(dep);
        AirportCatalog.AirportInfo aArr = AirportCatalog.get(arr);
        if (aDep == null || aArr == null) return List.of();

        double distKm = GeoUtil.haversineKm(aDep.lat, aDep.lon, aArr.lat, aArr.lon);

        int flights = 6 + rnd.nextInt(6); // 6-11
        List<LiveFlight> out = new ArrayList<>(flights);

        for (int i = 0; i < flights; i++) {
            String airline = AIRLINES.get(rnd.nextInt(AIRLINES.size()));
            String code = CODE.get(airline);
            String type = TYPES[rnd.nextInt(TYPES.length)];
            AircraftCatalog.Aircraft ac = AircraftCatalog.any(type);

            // Slot de salida verosímil
            int startHour = 5 + rnd.nextInt(17);
            int minute = (rnd.nextInt(6))*10;
            LocalTime depTime = LocalTime.of(startHour, minute);
            LocalDateTime departure = LocalDateTime.of(date, depTime);

            // Duración por distancia y velocidad crucero + márgenes (rodajes, ascenso/descenso)
            int blockMinutes = estimateBlockMinutes(distKm, ac.cruiseKmh, rnd);
            LocalDateTime arrival = departure.plusMinutes(blockMinutes);

            // Clima origen/destino y su impacto
            WeatherSimulator.WX wxDep = weather.weatherFor(dep, date, depTime);
            WeatherSimulator.WX wxArr = weather.weatherFor(arr, date, depTime.plusMinutes(blockMinutes));
            int wxDelay = Math.max(weather.delayFrom(wxDep), weather.delayFrom(wxArr));

            // Disrupciones por hora punta/tipo aeronave/distancia
            DisruptionEngine.Disruption d = disruptor.compute(depTime, wxDelay, type, (int) Math.round(distKm),
                    Objects.hash(dep,arr,date.toString(),i));

            Integer delay = (wxDelay + (d.extraDelay!=null?d.extraDelay:0));
            if (delay != null && delay < 0) delay = 0;

            LocalDateTime depFinal = departure.plusMinutes(delay!=null?delay:0);
            LocalDateTime arrFinal = arrival.plusMinutes(delay!=null?delay:0);

            String status = statusFor(depFinal, arrFinal);

            // Ocupación/carga
            int baseLoad = 60 + rnd.nextInt(36);
            int occupied = Math.min(ac.capacity, (int)Math.round(ac.capacity * baseLoad / 100.0));
            int cargoKg = estimateCargoKg(type, occupied, rnd);

            LiveFlight lf = new LiveFlight("simulator", airline, code + (100 + rnd.nextInt(900)),
                    dep, arr, depFinal.format(ISO), arrFinal.format(ISO), status);

            lf.setAircraftType(type);
            lf.setTerminal(rnd.nextBoolean() ? "T1" : "T2");
            lf.setGate(GATES[rnd.nextInt(GATES.length)]);
            lf.setBaggageBelt(String.valueOf(1 + rnd.nextInt(8)));
            lf.setDelayMinutes(delay!=null && delay>0 ? delay : null);
            lf.setDiverted(d.diverted);
            lf.setEmergency(d.emergency);
            lf.setTotalSeats(ac.capacity);
            lf.setOccupiedSeats(occupied);
            lf.setCargoKg(cargoKg);
            lf.setBoardingStartAt(depFinal.minusMinutes(25 + rnd.nextInt(16)).format(ISO));
            lf.setBoardingEndAt(depFinal.minusMinutes(5 + rnd.nextInt(8)).format(ISO));

            out.add(lf);
        }

        out.sort(Comparator.comparing(LiveFlight::getDepartureAt));
        // Cargar al registro vivo (para /stream y /status)
        registry.putAll(out);
        return out;
    }

    private static String[] genGates() {
        List<String> g = new ArrayList<>();
        for (char c='A'; c<='D'; c++) {
            for (int n=1;n<=24;n++) g.add(c+String.valueOf(n));
        }
        return g.toArray(new String[0]);
    }

    private int estimateBlockMinutes(double distKm, int cruiseKmh, Random rnd) {
        // block time = crucero + 20-35 min (rodajes/esperas)
        double cruiseHours = distKm / Math.max(400, cruiseKmh);
        int taxi = 20 + rnd.nextInt(16);
        int jitter = rnd.nextInt(9) - 4;
        int total = (int)Math.round(cruiseHours*60) + taxi + jitter;
        return Math.max(total, 40);
    }

    private int estimateCargoKg(String type, int pax, Random rnd) {
        int paxBags = pax * (10 + rnd.nextInt(8));
        int belly = switch (type) {
            case "A321" -> 6000;
            case "A320", "A320neo" -> 5000;
            case "B737-800", "B737 MAX 8" -> 5200;
            case "E190" -> 2500;
            case "ATR 72-600" -> 1200;
            default -> 4000;
        };
        int factor = 35 + rnd.nextInt(46);
        return Math.min(belly, paxBags + (belly*factor/100));
    }

    private String statusFor(LocalDateTime dep, LocalDateTime arr) {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("America/Bogota"));
        if (now.isBefore(dep.minusMinutes(60))) return "SCHEDULED";
        if (!now.isAfter(dep) && now.isAfter(dep.minusMinutes(60))) return "BOARDING";
        if (now.isAfter(dep) && now.isBefore(arr)) return "EN-ROUTE";
        return "LANDED";
    }

    public String forceIata(String input) { return IataResolver.toIata(input); }
    public Set<String> supportedIatas() { return AirportCatalog.keys(); }
}