// src/services/flightStream.ts
import { Flight } from "./flightService";

export type OnFlightUpdate = (flight: Flight) => void;

export class FlightStream {
  private source?: EventSource;

  connect(onUpdate: OnFlightUpdate) {
    if (this.source) return;

    this.source = new EventSource("http://localhost:8080/api/live/stream");

    this.source.onmessage = (event) => {
      try {
        const flight: Flight = JSON.parse(event.data);
        onUpdate(flight);
      } catch (err) {
        console.error("Error parsing flight update:", err);
      }
    };

    this.source.onerror = () => {
      console.warn("SSE connection lost. Reconnecting in 5s...");
      this.disconnect();
      setTimeout(() => this.connect(onUpdate), 5000);
    };
  }

  disconnect() {
    if (this.source) {
      this.source.close();
      this.source = undefined;
    }
  }
}