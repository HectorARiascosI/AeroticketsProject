package com.aerotickets.util;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class IataResolver {

    private static final Map<String, String> cityToIata = new HashMap<>();

    static {
        cityToIata.put("bogota", "BOG");
        cityToIata.put("bogotá", "BOG");
        cityToIata.put("medellin", "MDE");
        cityToIata.put("medellín", "MDE");
        cityToIata.put("cali", "CLO");
        cityToIata.put("cartagena", "CTG");
        cityToIata.put("barranquilla", "BAQ");
        cityToIata.put("pasto", "PSO");
        cityToIata.put("panama", "PTY");
        cityToIata.put("panamá", "PTY");
    }

    private static String normalize(String s) {
        if (s == null) return null;
        return s.trim().toLowerCase(Locale.forLanguageTag("es-CO"));
    }

    public static String toIata(String text) {
        if (text == null || text.isBlank()) return null;

        Matcher matcher = Pattern.compile("\\(([A-Z]{3})\\)").matcher(text);
        if (matcher.find()) {
            return matcher.group(1);
        }

        String t = normalize(text);
        if (t.matches("^[a-zA-Z]{3}$")) return t.toUpperCase();
        return cityToIata.getOrDefault(t, null);
    }
}