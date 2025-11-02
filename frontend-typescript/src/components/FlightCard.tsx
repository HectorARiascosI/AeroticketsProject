import React from "react";
import { Flight } from "../services/flightService";
import { statusColors, statusLabel } from "../utils/flightColors";
import { motion } from "framer-motion";

export const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  const color = statusColors[flight.status || "SCHEDULED"] || "bg-gray-300";
  const departure = new Date(flight.departureAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const arrival = new Date(flight.arrivalAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      layout
      className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-gray-800">
          {flight.airline} {flight.flightNumber}
        </h2>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${color}`}>
          {statusLabel(flight.status || "SCHEDULED")}
        </span>
      </div>

      <div className="grid grid-cols-3 text-center text-sm">
        <div>
          <p className="text-gray-500">Origen</p>
          <p className="font-semibold">{flight.origin}</p>
        </div>
        <div>
          <p className="text-gray-500">{departure}</p>
          <p className="text-gray-400">→</p>
          <p className="text-gray-500">{arrival}</p>
        </div>
        <div>
          <p className="text-gray-500">Destino</p>
          <p className="font-semibold">{flight.destination}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 mt-3 text-xs text-gray-500">
        <p>Terminal: {flight.terminal || "-"}</p>
        <p>Puerta: {flight.gate || "-"}</p>
        <p>Cinta: {flight.baggageBelt || "-"}</p>
      </div>

      {flight.delayMinutes && (
        <p className="text-yellow-600 text-xs mt-2">
          Retraso de {flight.delayMinutes} min
        </p>
      )}
    </motion.div>
  );
};