-- ============================================================
-- Bike Information System - MySQL Schema
-- ============================================================
DROP DATABASE IF EXISTS bike_info_system;
CREATE DATABASE bike_info_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bike_info_system;

-- 1. users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(255),
  role ENUM('user','admin') DEFAULT 'user',
  reset_otp VARCHAR(10),
  reset_otp_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. bike_categories
CREATE TABLE bike_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. bikes
CREATE TABLE bikes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(120) NOT NULL,
  category_id INT,
  price DECIMAL(12,2) NOT NULL,
  mileage DECIMAL(6,2),                    -- km/l
  engine_cc INT,                            -- engine capacity
  power VARCHAR(40),                        -- e.g. "22 bhp @ 8500 rpm"
  torque VARCHAR(40),
  top_speed INT,                            -- km/h
  fuel_capacity DECIMAL(5,2),
  transmission VARCHAR(40),
  features TEXT,                            -- comma-separated or JSON
  description TEXT,
  image VARCHAR(255),
  gallery TEXT,                             -- JSON array of image paths
  is_featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES bike_categories(id) ON DELETE SET NULL
);

-- 4. bike_reviews
CREATE TABLE bike_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bike_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. comparisons (history)
CREATE TABLE comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bike_ids VARCHAR(255) NOT NULL,           -- comma-separated ids
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. wishlist (saved bikes)
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bike_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_bike (user_id, bike_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
);

-- 7. recently_viewed
CREATE TABLE recently_viewed (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bike_id INT NOT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
);

-- ============================================================
-- Seed data
-- ============================================================

-- Default admin (password: Admin@123 — bcrypt hash)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@bikes.com',
 '$2b$10$vQqQ4kP1Y3H8xS9jZ8E0K.4f0kLZ8Q1Yw9hO5oZ6Y8Y9X0YqY5Z6m', 'admin');
-- Note: regenerate this hash on first run; see backend/utils/seedAdmin.js

INSERT INTO bike_categories (name, description) VALUES
('Sport',    'High-performance sport bikes'),
('Cruiser',  'Comfortable long-distance cruisers'),
('Commuter', 'Daily commute, fuel efficient'),
('Adventure','Off-road & touring'),
('Electric', 'Electric two-wheelers');

INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, top_speed, fuel_capacity, transmission, features, description, image, is_featured)
VALUES
( 'Yamaha',  'YZF R15 V4',     1, 185000, 40.0, 155, '18.4 bhp @ 10000 rpm', '14.2 Nm', 145, 11.0, '6-Speed', 'ABS,Quick Shifter,LED Lights', 'Track-focused supersport with deltabox frame.', '/uploads/r15.jpg', 1 ),
('Royal Enfield','Classic 350',2, 195000, 35.0, 349, '20.2 bhp @ 6100 rpm',  '27 Nm',   120, 13.0, '5-Speed', 'ABS,Tripper Navigation',         'Iconic retro cruiser with thumping engine.',   '/uploads/classic350.jpg', 1),
('Honda',   'Shine 125',      3, 85000,  55.0, 124, '10.7 bhp @ 7500 rpm',  '11 Nm',   100, 10.5, '5-Speed', 'CBS,Silent Start',                'Best-selling 125cc commuter.',                  '/uploads/shine.jpg', 0),
('KTM',     'Duke 390',       1, 320000, 28.0, 373, '43 bhp @ 9000 rpm',    '37 Nm',   170, 13.4, '6-Speed', 'TFT Display,Quick Shifter,ABS',  'Naked street performance machine.',             '/uploads/duke390.jpg', 1),
('Bajaj',   'Pulsar NS200',   1, 165000, 35.0, 199, '24.5 bhp @ 9750 rpm',  '18.5 Nm', 136, 12.0, '6-Speed', 'ABS,Perimeter Frame',             'Aggressive streetfighter at value pricing.',    '/uploads/ns200.jpg', 0),
('Ola',     'S1 Pro',         5, 140000, 195.0,0,   '11 bhp peak',          '58 Nm',   116, 0,    'Automatic','Hyper Mode,Cruise Control,App',  'Flagship electric scooter, 195 km range.',      '/uploads/s1pro.jpg', 1);
