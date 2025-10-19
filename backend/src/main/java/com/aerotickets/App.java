package com.aerotickets;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        // Cargar variables del archivo .env (si existe)
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // Obtener variables de entorno clave
        String dbUrl = dotenv.get("DB_URL", "jdbc:mysql://localhost:3306/aerotickets");
        String environment = dotenv.get("APP_ENV", "development");

        // Imprimir resumen inicial bonito
        System.out.println("\n==============================================");
        System.out.println("🚀 Iniciando Aerotickets Backend");
        System.out.println("🌎 Entorno: " + environment.toUpperCase());
        System.out.println("🗄️  Base de datos configurada: " + dbUrl);
        System.out.println("==============================================\n");

        try {
            SpringApplication.run(App.class, args);
            System.out.println("✅ Servidor iniciado correctamente en http://localhost:8080");
            System.out.println("📄 Logs activos en: logs/aerotickets.log\n");
        } catch (Exception e) {
            System.err.println("❌ Error crítico al iniciar la aplicación:");
            e.printStackTrace();
        }
    }
}