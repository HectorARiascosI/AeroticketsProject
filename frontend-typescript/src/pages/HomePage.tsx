import { useEffect, useState } from "react";
import { getVuelos } from "../services/vuelosService";

export default function HomePage() {
  const [vuelos, setVuelos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVuelos();
        setVuelos(data);
      } catch (error) {
        console.error("Error al obtener vuelos:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        ✈️ Lista de Vuelos
      </h1>

      {vuelos.length === 0 ? (
        <p className="text-gray-600 text-center">No hay vuelos disponibles</p>
      ) : (
        <ul className="space-y-4">
          {vuelos.map((vuelo) => (
            <li key={vuelo.id} className="p-4 bg-gray-100 rounded-lg shadow">
              <p>
                <strong>Origen:</strong> {vuelo.origen}
              </p>
              <p>
                <strong>Destino:</strong> {vuelo.destino}
              </p>
              <p>
                <strong>Fecha:</strong> {vuelo.fecha}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}