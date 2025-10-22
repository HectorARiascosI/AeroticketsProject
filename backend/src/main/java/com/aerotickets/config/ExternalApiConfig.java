package com.aerotickets.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "external.apis")
public class ExternalApiConfig {

    private Aviationstack aviationstack = new Aviationstack();
    private Aerodatabox aerodatabox = new Aerodatabox();

    public Aviationstack getAviationstack() { return aviationstack; }
    public Aerodatabox getAerodatabox() { return aerodatabox; }

    public static class Aviationstack {
        private String baseUrl = "http://api.aviationstack.com/v1";
        private String apiKey;
        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    }

    public static class Aerodatabox {
        private String baseUrl = "https://aerodatabox.p.rapidapi.com";
        private String apiKey; // RapidAPI Key
        private String host = "aerodatabox.p.rapidapi.com";
        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
        public String getHost() { return host; }
        public void setHost(String host) { this.host = host; }
    }
}