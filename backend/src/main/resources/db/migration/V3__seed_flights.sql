INSERT INTO flights (airline, origin, destination, departure_at, arrive_at, total_seats, price, version)
VALUES
('Avianca', 'BOG', 'MDE', NOW() + INTERVAL 1 DAY, NOW() + INTERVAL 1 DAY + INTERVAL 1 HOUR, 150, 250000, 0),
('LATAM',   'MDE', 'CLO', NOW() + INTERVAL 2 DAY, NOW() + INTERVAL 2 DAY + INTERVAL 1 HOUR, 120, 180000, 0),
('Viva',    'CLO', 'BOG', NOW() + INTERVAL 3 DAY, NOW() + INTERVAL 3 DAY + INTERVAL 1 HOUR, 100, 150000, 0);