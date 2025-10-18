-- Asegura status válido por defecto si hay datos sucios
UPDATE reservations
SET status = 'ACTIVE'
WHERE status IS NULL OR status NOT IN ('ACTIVE','CANCELLED');

-- Ajusta longitud (si fuese necesario)
ALTER TABLE reservations MODIFY COLUMN status VARCHAR(20) NOT NULL;

-- Re-crear índices únicos con nombres estables (si no existen ya)
-- Nota: si ya existen, MySQL las ignorará o dará warning.

ALTER TABLE reservations
  ADD UNIQUE KEY uk_res_flight_seat_active (flight_id, seat_number, status);

ALTER TABLE reservations
  ADD UNIQUE KEY uk_res_flight_user_active (flight_id, user_id, status);