package com.aerotickets;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class App {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        String dbUrl = dotenv.get("DB_URL",
                "jdbc:mysql://localhost:3306/aeroticketsdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
        String environment = dotenv.get("APP_ENV", "development");
        String avKey = dotenv.get("AVIATIONSTACK_KEY");
        String adbKey = dotenv.get("AERODATABOX_KEY");

        System.out.println("\n==============================================");
        System.out.println("🚀 Iniciando Aerotickets Backend");
        System.out.println("🌎 Entorno: " + environment.toUpperCase());
        System.out.println("🗄️  Base de datos configurada: " + dbUrl);
        System.out.println("🔑 Clave AVIATIONSTACK_KEY: " + (avKey != null ? "✅ Detectada" : "❌ NO definida"));
        System.out.println("🔑 Clave AERODATABOX_KEY: " + (adbKey != null ? "✅ Detectada" : "❌ NO definida"));
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