package com.aerotickets.service;

import com.aerotickets.entity.Flight;
import com.aerotickets.repository.FlightRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FlightService {
    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository){
        this.flightRepository = flightRepository;
    }

    @Transactional
    public Flight create(Flight f) {
        return flightRepository.save(f);
    }

    public List<Flight> listAll() {
        return flightRepository.findAll();
    }
}
