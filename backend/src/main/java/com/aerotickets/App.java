package com.aerotickets;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

  public static void main(String[] args) {
    // 🔹 Cargar automáticamente variables desde .env
    Dotenv dotenv = Dotenv.load();

    // 🔹 Inyectarlas al entorno de Java
    dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

    // 🔹 Arrancar la app normalmente
    SpringApplication.run(App.class, args);

    System.out.println("✅ Vueler Backend corriendo en http://localhost:8080");
  }
}