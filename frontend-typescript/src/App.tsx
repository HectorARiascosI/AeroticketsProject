import React from 'react'
import { api } from './services/axios'

type Flight = {
  id: number
  airline: string
  origin: string
  destination: string
  departureAt: string
  arriveAt: string
  totalSeats: number
  price: number
}

export default function App() {
  const [flights, setFlights] = React.useState<Flight[]>([])
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    api.get<Flight[]>('/flights')
      .then(res => setFlights(res.data))
      .catch(e => setError(e?.response?.data?.message || e.message))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>Aerotickets</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {flights.map(f => (
          <li key={f.id}>
            {f.airline} — {f.origin} → {f.destination} — ${f.price}
          </li>
        ))}
      </ul>
      {!flights.length && !error && <p>No hay vuelos.</p>}
    </div>
  )
}