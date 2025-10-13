package com.aerotickets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {
  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
    System.out.println("✅ Vueler Backend corriendo en http://localhost:8080");
  }
}