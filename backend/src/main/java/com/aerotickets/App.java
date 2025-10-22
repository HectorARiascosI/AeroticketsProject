package com.aerotickets;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 🚀 Clase principal del backend Aerotickets.
 * 
 * Carga las variables desde el archivo .env y muestra información
 * del entorno antes de iniciar el servidor.
 * 
 * Ejemplo de archivo .env:
 * 
 *   DB_URL=jdbc:mysql://localhost:3306/aerotickets
 *   APP_ENV=development
 *   AVIATIONSTACK_KEY=3e2a61b61e6251d4c2e52129ab33222a
 *   AERODATABOX_KEY=f72a5546b2mshc8bcad4125081a3p1d988bjsn8c50150fc566
 */
@SpringBootApplication
public class App {

    public static void main(String[] args) {

        // ✅ Cargar variables desde el archivo .env si existe
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // ✅ Registrar todas las variables .env como propiedades del sistema
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        // ✅ Obtener valores importantes con valores por defecto
        String dbUrl = dotenv.get("DB_URL", "jdbc:mysql://localhost:3306/aerotickets");
        String environment = dotenv.get("APP_ENV", "development");
        String aviationKey = dotenv.get("AVIATIONSTACK_KEY", "NO_KEY_FOUND");
        String aeroKey = dotenv.get("AERODATABOX_KEY", "NO_KEY_FOUND");

        // ✅ Mostrar banner de inicio
        System.out.println("\n==============================================");
        System.out.println("🚀 Iniciando Aerotickets Backend");
        System.out.println("🌎 Entorno: " + environment.toUpperCase());
        System.out.println("🗄️  Base de datos configurada: " + dbUrl);
        System.out.println("🔑 Clave AVIATIONSTACK_KEY: " + (aviationKey.equals("NO_KEY_FOUND") ? "❌ No definida" : "✅ Detectada"));
        System.out.println("🔑 Clave AERODATABOX_KEY: " + (aeroKey.equals("NO_KEY_FOUND") ? "❌ No definida" : "✅ Detectada"));
        System.out.println("==============================================\n");

        // ✅ Validar claves críticas antes de arrancar
        if (aviationKey.equals("NO_KEY_FOUND") || aeroKey.equals("NO_KEY_FOUND")) {
            System.err.println("⚠️  ERROR: Faltan una o más claves API necesarias en el archivo .env");
            System.err.println("➡️  Debes definir AVIATIONSTACK_KEY y AERODATABOX_KEY antes de iniciar el backend.");
            System.exit(1);
        }

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