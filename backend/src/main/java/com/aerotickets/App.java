package com.aerotickets;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {
    public static void main(String[] args) {
        // Cargar variables desde .env si existe
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        String dbUrl = dotenv.get("DB_URL");
        System.out.println("Base de datos configurada: " + dbUrl);

        SpringApplication.run(App.class, args);
    }
}