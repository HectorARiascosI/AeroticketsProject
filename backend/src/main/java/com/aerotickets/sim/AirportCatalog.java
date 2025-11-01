package com.aerotickets.sim;

import java.util.*;

public class AirportCatalog {

    public static class AirportInfo {
        public final String iata, name, city, country, timezone;
        public final double lat, lon;
        public AirportInfo(String iata, String name, String city, String country, String timezone,
                           double lat, double lon) {
            this.iata = iata; this.name = name; this.city = city; this.country = country; this.timezone = timezone;
            this.lat = lat; this.lon = lon;
        }
    }

    private static final Map<String, AirportInfo> DATA;

    static {
        Map<String, AirportInfo> m = new HashMap<>();
        m.put("BOG", new AirportInfo("BOG","El Dorado","Bogotá","Colombia","America/Bogota",4.70159,-74.1469));
        m.put("MDE", new AirportInfo("MDE","J. M. Córdova","Medellín","Colombia","America/Bogota",6.16454,-75.4231));
        m.put("EOH", new AirportInfo("EOH","Olaya Herrera","Medellín","Colombia","America/Bogota",6.21956,-75.5906));
        m.put("CLO", new AirportInfo("CLO","Alfonso Bonilla Aragón","Cali","Colombia","America/Bogota",3.54322,-76.3816));
        m.put("CTG", new AirportInfo("CTG","Rafael Núñez","Cartagena","Colombia","America/Bogota",10.442,-75.513));
        m.put("SMR", new AirportInfo("SMR","Simón Bolívar","Santa Marta","Colombia","America/Bogota",11.1196,-74.2306));
        m.put("BAQ", new AirportInfo("BAQ","Ernesto Cortissoz","Barranquilla","Colombia","America/Bogota",10.8896,-74.7808));
        m.put("PEI", new AirportInfo("PEI","Matecaña","Pereira","Colombia","America/Bogota",4.81267,-75.7395));
        m.put("CUC", new AirportInfo("CUC","Camilo Daza","Cúcuta","Colombia","America/Bogota",7.92757,-72.5115));
        m.put("ADZ", new AirportInfo("ADZ","G.O.G.S.A. Newball","San Andrés","Colombia","America/Bogota",12.5836,-81.7112));
        m.put("BGA", new AirportInfo("BGA","Palo Negro","Bucaramanga","Colombia","America/Bogota",7.1265,-73.1848));
        m.put("PSO", new AirportInfo("PSO","Antonio Nariño","Pasto","Colombia","America/Bogota",1.39625,-77.2915));
        m.put("LET", new AirportInfo("LET","Alfredo V. Cobo","Leticia","Colombia","America/Bogota",-4.19355,-69.9432));
        m.put("AXM", new AirportInfo("AXM","El Edén","Armenia","Colombia","America/Bogota",4.45278,-75.7664));
        m.put("MZL", new AirportInfo("MZL","La Nubia","Manizales","Colombia","America/Bogota",5.0296,-75.4647));
        m.put("NVA", new AirportInfo("NVA","Benito Salas","Neiva","Colombia","America/Bogota",2.95015,-75.294));
        m.put("PPN", new AirportInfo("PPN","G. L. Valencia","Popayán","Colombia","America/Bogota",2.4544,-76.6093));
        m.put("UIB", new AirportInfo("UIB","El Caraño","Quibdó","Colombia","America/Bogota",5.69076,-76.6412));
        m.put("MTR", new AirportInfo("MTR","Los Garzones","Montería","Colombia","America/Bogota",8.8237,-75.8258));
        m.put("VVC", new AirportInfo("VVC","Vanguardia","Villavicencio","Colombia","America/Bogota",4.16787,-73.6138));
        m.put("RCH", new AirportInfo("RCH","Almirante Padilla","Riohacha","Colombia","America/Bogota",11.5262,-72.926));
        DATA = Collections.unmodifiableMap(m);
    }

    public static AirportInfo get(String iata) { return DATA.get(iata); }
    public static Set<String> keys() { return DATA.keySet(); }
}