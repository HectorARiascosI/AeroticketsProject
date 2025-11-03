DROP DATABASE IF EXISTS aerotickets;
CREATE DATABASE aerotickets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aerotickets;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(120) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    role VARCHAR(32) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE flights (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    airline VARCHAR(120) NOT NULL,
    origin VARCHAR(8) NOT NULL,
    destination VARCHAR(8) NOT NULL,
    departure_at DATETIME(6) NOT NULL,
    arrive_at DATETIME(6) NOT NULL,
    total_seats INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    version INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE reservations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    flight_id BIGINT UNSIGNED NOT NULL,
    seat_number INT,
    status ENUM('ACTIVE','CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version INT DEFAULT 0,

    CONSTRAINT fk_res_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT fk_res_flight FOREIGN KEY (flight_id)
        REFERENCES flights(id) ON DELETE CASCADE,

    CONSTRAINT uk_res_flight_seat_active UNIQUE (flight_id, seat_number, status),
    CONSTRAINT uk_res_flight_user_active UNIQUE (flight_id, user_id, status),

    INDEX idx_res_user (user_id),
    INDEX idx_res_flight (flight_id),
    INDEX idx_res_status (status),
    INDEX idx_res_created_at (created_at)
) ENGINE=InnoDB;