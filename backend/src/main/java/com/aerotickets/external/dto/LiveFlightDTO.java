package com.aerotickets.external.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LiveFlightDTO {
    private String provider;        // "Aviationstack" u otro
    private String airline;
    private String flightNumber;
    private String originIata;
    private String destinationIata;
    private LocalDateTime departureAt;
    private LocalDateTime arrivalAt;
    private String status;          // scheduled, active, landed, etc.
    // No hay precio real en estas APIs free; lo dejamos null o estimado
    private BigDecimal indicativePrice;

    // getters/setters
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }
    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    public String getOriginIata() { return originIata; }
    public void setOriginIata(String originIata) { this.originIata = originIata; }
    public String getDestinationIata() { return destinationIata; }
    public void setDestinationIata(String destinationIata) { this.destinationIata = destinationIata; }
    public LocalDateTime getDepartureAt() { return departureAt; }
    public void setDepartureAt(LocalDateTime departureAt) { this.departureAt = departureAt; }
    public LocalDateTime getArrivalAt() { return arrivalAt; }
    public void setArrivalAt(LocalDateTime arrivalAt) { this.arrivalAt = arrivalAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getIndicativePrice() { return indicativePrice; }
    public void setIndicativePrice(BigDecimal indicativePrice) { this.indicativePrice = indicativePrice; }
}