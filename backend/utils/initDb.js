const fs = require('fs');
const path = require('path');

async function initDb() {
  const db = require('../config/db');
  const { updateBikeImages } = require('./updateBikeImages');
  const sqliteDb = await db.getDbInstance();

  // Check if tables exist
  const row = await sqliteDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
  
  if (!row) {
    console.log('Initializing SQLite database...');
    
    // SQLite compatible schema
    const schema = `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        avatar VARCHAR(255),
        role VARCHAR(10) DEFAULT 'user',
        reset_otp VARCHAR(10),
        reset_otp_expires DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS otp_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        identifier VARCHAR(150) NOT NULL UNIQUE,
        otp_code VARCHAR(10) NOT NULL,
        expires_at DATETIME NOT NULL,
        purpose VARCHAR(20) NOT NULL
      );

      CREATE TABLE bike_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(80) NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE bikes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand VARCHAR(80) NOT NULL,
        model VARCHAR(120) NOT NULL,
        category_id INTEGER,
        price DECIMAL(12,2) NOT NULL,
        mileage DECIMAL(6,2),
        engine_cc INTEGER,
        power VARCHAR(40),
        torque VARCHAR(40),
        top_speed INTEGER,
        weight INTEGER,
        fuel_capacity DECIMAL(5,2),
        transmission VARCHAR(40),
        features TEXT,
        description TEXT,
        image VARCHAR(255),
        gallery TEXT,
        is_featured TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES bike_categories(id) ON DELETE SET NULL
      );

      CREATE TABLE bike_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bike_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE comparisons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        bike_ids VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        bike_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, bike_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
      );

      CREATE TABLE recently_viewed (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        bike_id INTEGER NOT NULL,
        viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
      );
    `;

    // Execute schema creation
    const statements = schema.split(';').filter(s => s.trim().length > 0);
    for (let stmt of statements) {
      await sqliteDb.run(stmt);
    }

    // Seed admin
    await sqliteDb.run(`
      INSERT INTO users (name, email, password, role) VALUES
      ('Admin', 'admin@bikes.com', '$2b$10$vQqQ4kP1Y3H8xS9jZ8E0K.4f0kLZ8Q1Yw9hO5oZ6Y8Y9X0YqY5Z6m', 'admin')
    `);

    // Seed categories
    await sqliteDb.run(`
      INSERT INTO bike_categories (name, description) VALUES
      ('Sport',    'High-performance sport bikes'),
      ('Cruiser',  'Comfortable long-distance cruisers'),
      ('Commuter', 'Daily commute, fuel efficient'),
      ('Adventure','Off-road & touring'),
      ('Electric', 'Electric two-wheelers')
    `);

    // Seed original 6 bikes
    await sqliteDb.run(`
      INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, top_speed, fuel_capacity, transmission, features, description, image, is_featured)
      VALUES
      ('Yamaha',  'YZF R15 V4',     1, 185000, 40.0, 155, '18.4 bhp @ 10000 rpm', '14.2 Nm', 145, 11.0, '6-Speed', 'ABS,Quick Shifter,LED Lights', 'Track-focused supersport with deltabox frame.', '/uploads/r15.jpg', 1),
      ('Royal Enfield','Classic 350',2, 195000, 35.0, 349, '20.2 bhp @ 6100 rpm',  '27 Nm',   120, 13.0, '5-Speed', 'ABS,Tripper Navigation',         'Iconic retro cruiser with thumping engine.',   '/uploads/classic350.jpg', 1),
      ('Honda',   'Shine 125',      3, 85000,  55.0, 124, '10.7 bhp @ 7500 rpm',  '11 Nm',   100, 10.5, '5-Speed', 'CBS,Silent Start',                'Best-selling 125cc commuter.',                  '/uploads/shine.jpg', 0),
      ('KTM',     'Duke 390',       1, 320000, 28.0, 373, '43 bhp @ 9000 rpm',    '37 Nm',   170, 13.4, '6-Speed', 'TFT Display,Quick Shifter,ABS',  'Naked street performance machine.',             '/uploads/duke390.jpg', 1),
      ('Bajaj',   'Pulsar NS200',   1, 165000, 35.0, 199, '24.5 bhp @ 9750 rpm',  '18.5 Nm', 136, 12.0, '6-Speed', 'ABS,Perimeter Frame',             'Aggressive streetfighter at value pricing.',    '/uploads/ns200.jpg', 0),
      ('Ola',     'S1 Pro',         5, 140000, 195.0,0,   '11 bhp peak',          '58 Nm',   116, 0,    'Automatic','Hyper Mode,Cruise Control,App',  'Flagship electric scooter, 195 km range.',      '/uploads/s1pro.jpg', 1)
    `);

    // Seed 40 Hero Bikes
    const heroBikes = [
      ["Hero", "Splendor Plus", 3, 75000, 60.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 124, 9.8, "4-Speed", "i3S Technology", "Reliable commuter with timeless design.", "/uploads/splendor_plus.jpg", 1],
      ["Hero", "Splendor Plus Xtec", 3, 83000, 58.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 127, 9.8, "4-Speed", "i3S, Fuel Injection,LED DRL", "Tech-enabled commuter with modern features.", "/uploads/splendor_xtec.jpg", 1],
      ["Hero", "Splendor Plus Xtec 2.0", 3, 86000, 57.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 127, 9.8, "4-Speed", "i3S, Fuel Injection,LED DRL,USB Charging", "Updated version of popular Xtec variant.", "/uploads/splendor_xtec2.jpg", 1],
      ["Hero", "HF Deluxe", 3, 58000, 62.0, 97.2, "6.9 bhp @ 8000 rpm", "7.7 Nm", 112, 9.8, "4-Speed", "i3S Technology", "Budget-friendly commuter motorcycle.", "/uploads/hf_deluxe.jpg", 1],
      ["Hero", "HF 100", 3, 61000, 65.0, 97.2, "6.9 bhp @ 8000 rpm", "7.7 Nm", 115, 9.8, "4-Speed", "i3S Technology", "Fuel-efficient entry-level commuter.", "/uploads/hf_100.jpg", 1],
      ["Hero", "CD 100", 3, 50000, 70.0, 97.0, "6.5 bhp @ 7500 rpm", "7.4 Nm", 110, 10.5, "4-Speed", "Kick Start", "Classic commuter motorcycle.", "/uploads/cd_100.jpg", 0],
      ["Hero", "CD 100 SS", 3, 52000, 70.0, 97.0, "6.5 bhp @ 7500 rpm", "7.4 Nm", 110, 10.5, "4-Speed", "Kick Start", "Standard variant of CD 100.", "/uploads/cd_100_ss.jpg", 0],
      ["Hero", "CD Dawn", 3, 52000, 70.0, 97.0, "6.5 bhp @ 7500 rpm", "7.4 Nm", 112, 10.5, "4-Speed", "Kick Start", "Morning starter special edition.", "/uploads/cd_dawn.jpg", 0],
      ["Hero", "CD Deluxe", 3, 55000, 68.0, 97.0, "6.5 bhp @ 7500 rpm", "7.4 Nm", 112, 10.5, "4-Speed", "Kick Start", "Deluxe version of CD 100.", "/uploads/cd_deluxe.jpg", 0],
      ["Hero", "Joy", 3, 45000, 55.0, 87.8, "5.6 bhp @ 7000 rpm", "5.5 Nm", 90, 9.0, "4-Speed", "Self Start", "Economical city runabout.", "/uploads/joy.jpg", 0],
      ["Hero", "Sleek", 3, 48000, 55.0, 87.8, "5.6 bhp @ 7000 rpm", "5.5 Nm", 92, 9.0, "4-Speed", "Self Start", "Sleek looking commuter.", "/uploads/sleek.jpg", 0],
      ["Hero", "Street", 3, 50000, 52.0, 97.2, "6.9 bhp @ 8000 rpm", "7.7 Nm", 95, 9.0, "4-Speed", "Self Start", "Street-style commuter.", "/uploads/street.jpg", 0],
      ["Hero", "Passion Plus", 3, 70000, 55.0, 110.0, "8.0 bhp @ 7500 rpm", "8.5 Nm", 115, 10.0, "4-Speed", "i3S Technology", "Popular 110cc commuter bike.", "/uploads/passion_plus.jpg", 1],
      ["Hero", "Passion Pro", 3, 65000, 55.0, 110.0, "8.5 bhp @ 7500 rpm", "9.0 Nm", 115, 10.0, "4-Speed", "Self Start", "Pro version of Passion.", "/uploads/passion_pro.jpg", 0],
      ["Hero", "Passion XPro", 3, 72000, 55.0, 110.0, "8.5 bhp @ 7500 rpm", "9.0 Nm", 118, 10.0, "4-Speed", "i3S, Alloy Wheels", "XPro variant with alloy wheels.", "/uploads/passion_xpro.jpg", 0],
      ["Hero", "Splendor Pro", 3, 60000, 60.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 120, 9.8, "4-Speed", "Kick Start", "Professional edition Splendor.", "/uploads/splendor_pro.jpg", 0],
      ["Hero", "Splendor NXG", 3, 65000, 60.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 122, 9.8, "4-Speed", "Alloy Wheels", "Next-generation Splendor.", "/uploads/splendor_nxg.jpg", 0],
      ["Hero", "Super Splendor", 3, 86000, 55.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 125, 11.5, "5-Speed", "i3S, Fuel Injection", "125cc commuter with enhanced power.", "/uploads/super_splendor.jpg", 1],
      ["Hero", "Super Splendor Xtec", 3, 91000, 54.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 127, 11.5, "5-Speed", "i3S, Fuel Injection,LED DRL", "Tech-loaded Super Splendor.", "/uploads/super_splendor_xtec.jpg", 1],
      ["Hero", "Glamour", 3, 85000, 55.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 122, 11.5, "5-Speed", "i3S, Fuel Injection", "Stylish 125cc commuter.", "/uploads/glamour.jpg", 1],
      ["Hero", "Glamour Xtec", 3, 90000, 54.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 124, 11.5, "5-Speed", "i3S, Fuel Injection,LED DRL", "Premium 125cc with tech features.", "/uploads/glamour_xtec.jpg", 1],
      ["Hero", "Ignitor", 3, 75000, 55.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 118, 11.5, "5-Speed", "Alloy Wheels", "Discontinued 125cc commuter.", "/uploads/ignitor.jpg", 0],
      ["Hero", "Glamour Fi", 3, 80000, 55.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 120, 11.5, "5-Speed", "Fuel Injection", "Fuel-injected Glamour variant.", "/uploads/glamour_fi.jpg", 0],
      ["Hero", "Xtreme 125R", 1, 110000, 50.0, 124.7, "11.4 bhp @ 9250 rpm", "10.6 Nm", 120, 10.5, "5-Speed", "Single-channel ABS,LED Headlamp", "Sporty 125cc naked bike.", "/uploads/xtreme_125r.jpg", 1],
      ["Hero", "Ambition 135", 3, 55000, 50.0, 135.0, "9.0 bhp @ 7500 rpm", "11.0 Nm", 115, 11.0, "4-Speed", "Kick Start", "Discontinued 135cc commuter.", "/uploads/ambition.jpg", 0],
      ["Hero", "Achiever 150", 3, 65000, 50.0, 149.0, "13.0 bhp @ 8500 rpm", "12.5 Nm", 135, 11.0, "5-Speed", "Alloy Wheels", "Discontinued 150cc commuter.", "/uploads/achiever.jpg", 0],
      ["Hero", "Xtreme 160R", 1, 145000, 45.0, 163.0, "16.0 bhp @ 8000 rpm", "14.5 Nm", 139, 12.0, "5-Speed", "Single-channel ABS,LED Headlamp", "Performance naked bike.", "/uploads/xtreme_160r.jpg", 1],
      ["Hero", "Xtreme 160R 4V", 1, 155000, 44.0, 163.0, "17.3 bhp @ 8500 rpm", "16.5 Nm", 141, 12.0, "6-Speed", "Dual-channel ABS,LED Headlamp,USD Forks", "Premium variant with 4-valve engine.", "/uploads/xtreme_160r_4v.jpg", 1],
      ["Hero", "CBZ", 1, 55000, 45.0, 150.0, "13.0 bhp @ 8500 rpm", "12.5 Nm", 135, 11.0, "5-Speed", "Kick Start", "Classic 150cc bike (Discontinued).", "/uploads/cbz.jpg", 0],
      ["Hero", "CBZ Star", 1, 60000, 45.0, 150.0, "13.0 bhp @ 8500 rpm", "12.5 Nm", 137, 11.0, "5-Speed", "Self Start", "Star variant of CBZ.", "/uploads/cbz_star.jpg", 0],
      ["Hero", "CBZ Xtreme", 1, 85000, 45.0, 150.0, "13.4 bhp @ 8500 rpm", "12.5 Nm", 140, 11.0, "5-Speed", "Disc Brake", "Xtreme sports version.", "/uploads/cbz_xtreme.jpg", 0],
      ["Hero", "Hunk", 1, 95000, 45.0, 150.0, "13.4 bhp @ 8500 rpm", "12.5 Nm", 145, 12.0, "5-Speed", "Disc Brake,Alloy Wheels", "Street-fighter styling.", "/uploads/hunk.jpg", 0],
      ["Hero", "Impulse", 4, 75000, 40.0, 149.0, "13.0 bhp @ 8500 rpm", "12.5 Nm", 140, 11.5, "5-Speed", "Wire-spoke Wheels", "Adventure-style motorcycle.", "/uploads/impulse.jpg", 0],
      ["Hero", "Xpulse 200 4V", 4, 138000, 35.0, 199.6, "18.9 bhp @ 8500 rpm", "18.5 Nm", 152, 13.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Long Travel Suspension", "Adventure touring bike.", "/uploads/xpulse_200.jpg", 1],
      ["Hero", "Xpulse 210", 4, 148000, 35.0, 210.0, "20.0 bhp @ 8500 rpm", "20.0 Nm", 155, 13.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Long Travel Suspension", "Updated XPulse with more power.", "/uploads/xpulse_210.jpg", 1],
      ["Hero", "Karizma XMR", 1, 190000, 35.0, 223.0, "20.0 bhp @ 8500 rpm", "20.5 Nm", 160, 11.5, "6-Speed", "Dual-channel ABS,LED Headlamp,Slipper Clutch", "Sporty faired motorcycle.", "/uploads/karizma_xmr.jpg", 1],
      ["Hero", "Karizma R", 1, 95000, 35.0, 223.0, "19.0 bhp @ 8000 rpm", "20.0 Nm", 155, 11.5, "5-Speed", "Disc Brake", "Discontinued Karizma variant.", "/uploads/karizma_r.jpg", 0],
      ["Hero", "Karizma ZMR", 1, 105000, 35.0, 223.0, "19.0 bhp @ 8000 rpm", "20.0 Nm", 157, 11.5, "5-Speed", "Disc Brake,Self Start", "ZMR variant of Karizma.", "/uploads/karizma_zmr.jpg", 0],
      ["Hero", "Xtreme 250R", 1, 175000, 35.0, 250.0, "25.0 bhp @ 9000 rpm", "22.0 Nm", 165, 12.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Slipper Clutch", "Powerful 250cc naked sportbike.", "/uploads/xtreme_250r.jpg", 1],
      ["Hero", "Mavrick 440", 2, 199000, 35.0, 443.0, "27.0 bhp @ 6000 rpm", "32.0 Nm", 185, 11.5, "6-Speed", "Dual-channel ABS,LED Headlamp,USB Charging", "Royal roadster motorcycle.", "/uploads/mavrick_440.jpg", 1]
    ];

    for (const bike of heroBikes) {
      await sqliteDb.run(
        'INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, weight, fuel_capacity, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        bike
      );
    }

    console.log('Database initialized successfully with seeded data.');
  } else {
    // Migration: ensure otp_verifications table exists
    try {
      await sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS otp_verifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          identifier VARCHAR(150) NOT NULL UNIQUE,
          otp_code VARCHAR(10) NOT NULL,
          expires_at DATETIME NOT NULL,
          purpose VARCHAR(20) NOT NULL
        )
      `);
      console.log('Created/verified otp_verifications table.');
    } catch (e) {
      console.error('Failed to create otp_verifications table:', e);
    }

    // Migration: ensure weight column exists (older DBs may not have it)
    try {
      await sqliteDb.run('ALTER TABLE bikes ADD COLUMN weight INTEGER');
      console.log('Added weight column to bikes table.');
    } catch (e) { /* already exists, ignore */ }

    // Migration: seed Hero bikes if missing
    const heroCheck = await sqliteDb.get("SELECT id FROM bikes WHERE brand='Hero' LIMIT 1");
    if (!heroCheck) {
      console.log('Seeding Hero bikes...');
      const heroBikes = [
        ["Hero", "Splendor Plus", 3, 75000, 60.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 124, 9.8, "4-Speed", "i3S Technology", "Reliable commuter with timeless design.", "/uploads/splendor_plus.jpg", 1],
        ["Hero", "Splendor Plus Xtec", 3, 83000, 58.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 127, 9.8, "4-Speed", "i3S, Fuel Injection,LED DRL", "Tech-enabled commuter with modern features.", "/uploads/splendor_xtec.jpg", 1],
        ["Hero", "Splendor Plus Xtec 2.0", 3, 86000, 57.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 127, 9.8, "4-Speed", "i3S, Fuel Injection,LED DRL,USB Charging", "Updated version of popular Xtec variant.", "/uploads/splendor_xtec2.jpg", 1],
        ["Hero", "HF Deluxe", 3, 58000, 62.0, 97.2, "6.9 bhp @ 8000 rpm", "7.7 Nm", 112, 9.8, "4-Speed", "i3S Technology", "Budget-friendly commuter motorcycle.", "/uploads/hf_deluxe.jpg", 1],
        ["Hero", "HF 100", 3, 61000, 65.0, 97.2, "6.9 bhp @ 8000 rpm", "7.7 Nm", 115, 9.8, "4-Speed", "i3S Technology", "Fuel-efficient entry-level commuter.", "/uploads/hf_100.jpg", 1],
        ["Hero", "CD 100", 3, 50000, 70.0, 97.0, "6.5 bhp @ 7500 rpm", "7.4 Nm", 110, 10.5, "4-Speed", "Kick Start", "Classic commuter motorcycle.", "/uploads/cd_100.jpg", 0],
        ["Hero", "CD 100 SS", 3, 52000, 70.0, 97.0, "6.5 bhp @ 7500 rpm", "7.4 Nm", 110, 10.5, "4-Speed", "Kick Start", "Standard variant of CD 100.", "/uploads/cd_100_ss.jpg", 0],
        ["Hero", "CD Dawn", 3, 52000, 70.0, 97.0, "6.5 bhp @ 7500 rpm", "7.4 Nm", 112, 10.5, "4-Speed", "Kick Start", "Morning starter special edition.", "/uploads/cd_dawn.jpg", 0],
        ["Hero", "CD Deluxe", 3, 55000, 68.0, 97.0, "6.5 bhp @ 7500 rpm", "7.4 Nm", 112, 10.5, "4-Speed", "Kick Start", "Deluxe version of CD 100.", "/uploads/cd_deluxe.jpg", 0],
        ["Hero", "Joy", 3, 45000, 55.0, 87.8, "5.6 bhp @ 7000 rpm", "5.5 Nm", 90, 9.0, "4-Speed", "Self Start", "Economical city runabout.", "/uploads/joy.jpg", 0],
        ["Hero", "Sleek", 3, 48000, 55.0, 87.8, "5.6 bhp @ 7000 rpm", "5.5 Nm", 92, 9.0, "4-Speed", "Self Start", "Sleek looking commuter.", "/uploads/sleek.jpg", 0],
        ["Hero", "Street", 3, 50000, 52.0, 97.2, "6.9 bhp @ 8000 rpm", "7.7 Nm", 95, 9.0, "4-Speed", "Self Start", "Street-style commuter.", "/uploads/street.jpg", 0],
        ["Hero", "Passion Plus", 3, 70000, 55.0, 110.0, "8.0 bhp @ 7500 rpm", "8.5 Nm", 115, 10.0, "4-Speed", "i3S Technology", "Popular 110cc commuter bike.", "/uploads/passion_plus.jpg", 1],
        ["Hero", "Passion Pro", 3, 65000, 55.0, 110.0, "8.5 bhp @ 7500 rpm", "9.0 Nm", 115, 10.0, "4-Speed", "Self Start", "Pro version of Passion.", "/uploads/passion_pro.jpg", 0],
        ["Hero", "Passion XPro", 3, 72000, 55.0, 110.0, "8.5 bhp @ 7500 rpm", "9.0 Nm", 118, 10.0, "4-Speed", "i3S, Alloy Wheels", "XPro variant with alloy wheels.", "/uploads/passion_xpro.jpg", 0],
        ["Hero", "Splendor Pro", 3, 60000, 60.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 120, 9.8, "4-Speed", "Kick Start", "Professional edition Splendor.", "/uploads/splendor_pro.jpg", 0],
        ["Hero", "Splendor NXG", 3, 65000, 60.0, 97.2, "7.15 bhp @ 8000 rpm", "8.05 Nm", 122, 9.8, "4-Speed", "Alloy Wheels", "Next-generation Splendor.", "/uploads/splendor_nxg.jpg", 0],
        ["Hero", "Super Splendor", 3, 86000, 55.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 125, 11.5, "5-Speed", "i3S, Fuel Injection", "125cc commuter with enhanced power.", "/uploads/super_splendor.jpg", 1],
        ["Hero", "Super Splendor Xtec", 3, 91000, 54.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 127, 11.5, "5-Speed", "i3S, Fuel Injection,LED DRL", "Tech-loaded Super Splendor.", "/uploads/super_splendor_xtec.jpg", 1],
        ["Hero", "Glamour", 3, 85000, 55.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 122, 11.5, "5-Speed", "i3S, Fuel Injection", "Stylish 125cc commuter.", "/uploads/glamour.jpg", 1],
        ["Hero", "Glamour Xtec", 3, 90000, 54.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 124, 11.5, "5-Speed", "i3S, Fuel Injection,LED DRL", "Premium 125cc with tech features.", "/uploads/glamour_xtec.jpg", 1],
        ["Hero", "Ignitor", 3, 75000, 55.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 118, 11.5, "5-Speed", "Alloy Wheels", "Discontinued 125cc commuter.", "/uploads/ignitor.jpg", 0],
        ["Hero", "Glamour Fi", 3, 80000, 55.0, 124.7, "10.7 bhp @ 7750 rpm", "10.6 Nm", 120, 11.5, "5-Speed", "Fuel Injection", "Fuel-injected Glamour variant.", "/uploads/glamour_fi.jpg", 0],
        ["Hero", "Xtreme 125R", 1, 110000, 50.0, 124.7, "11.4 bhp @ 9250 rpm", "10.6 Nm", 120, 10.5, "5-Speed", "Single-channel ABS,LED Headlamp", "Sporty 125cc naked bike.", "/uploads/xtreme_125r.jpg", 1],
        ["Hero", "Ambition 135", 3, 55000, 50.0, 135.0, "9.0 bhp @ 7500 rpm", "11.0 Nm", 115, 11.0, "4-Speed", "Kick Start", "Discontinued 135cc commuter.", "/uploads/ambition.jpg", 0],
        ["Hero", "Achiever 150", 3, 65000, 50.0, 149.0, "13.0 bhp @ 8500 rpm", "12.5 Nm", 135, 11.0, "5-Speed", "Alloy Wheels", "Discontinued 150cc commuter.", "/uploads/achiever.jpg", 0],
        ["Hero", "Xtreme 160R", 1, 145000, 45.0, 163.0, "16.0 bhp @ 8000 rpm", "14.5 Nm", 139, 12.0, "5-Speed", "Single-channel ABS,LED Headlamp", "Performance naked bike.", "/uploads/xtreme_160r.jpg", 1],
        ["Hero", "Xtreme 160R 4V", 1, 155000, 44.0, 163.0, "17.3 bhp @ 8500 rpm", "16.5 Nm", 141, 12.0, "6-Speed", "Dual-channel ABS,LED Headlamp,USD Forks", "Premium variant with 4-valve engine.", "/uploads/xtreme_160r_4v.jpg", 1],
        ["Hero", "CBZ", 1, 55000, 45.0, 150.0, "13.0 bhp @ 8500 rpm", "12.5 Nm", 135, 11.0, "5-Speed", "Kick Start", "Classic 150cc bike (Discontinued).", "/uploads/cbz.jpg", 0],
        ["Hero", "CBZ Star", 1, 60000, 45.0, 150.0, "13.0 bhp @ 8500 rpm", "12.5 Nm", 137, 11.0, "5-Speed", "Self Start", "Star variant of CBZ.", "/uploads/cbz_star.jpg", 0],
        ["Hero", "CBZ Xtreme", 1, 85000, 45.0, 150.0, "13.4 bhp @ 8500 rpm", "12.5 Nm", 140, 11.0, "5-Speed", "Disc Brake", "Xtreme sports version.", "/uploads/cbz_xtreme.jpg", 0],
        ["Hero", "Hunk", 1, 95000, 45.0, 150.0, "13.4 bhp @ 8500 rpm", "12.5 Nm", 145, 12.0, "5-Speed", "Disc Brake,Alloy Wheels", "Street-fighter styling.", "/uploads/hunk.jpg", 0],
        ["Hero", "Impulse", 4, 75000, 40.0, 149.0, "13.0 bhp @ 8500 rpm", "12.5 Nm", 140, 11.5, "5-Speed", "Wire-spoke Wheels", "Adventure-style motorcycle.", "/uploads/impulse.jpg", 0],
        ["Hero", "Xpulse 200 4V", 4, 138000, 35.0, 199.6, "18.9 bhp @ 8500 rpm", "18.5 Nm", 152, 13.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Long Travel Suspension", "Adventure touring bike.", "/uploads/xpulse_200.jpg", 1],
        ["Hero", "Xpulse 210", 4, 148000, 35.0, 210.0, "20.0 bhp @ 8500 rpm", "20.0 Nm", 155, 13.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Long Travel Suspension", "Updated XPulse with more power.", "/uploads/xpulse_210.jpg", 1],
        ["Hero", "Karizma XMR", 1, 190000, 35.0, 223.0, "20.0 bhp @ 8500 rpm", "20.5 Nm", 160, 11.5, "6-Speed", "Dual-channel ABS,LED Headlamp,Slipper Clutch", "Sporty faired motorcycle.", "/uploads/karizma_xmr.jpg", 1],
        ["Hero", "Karizma R", 1, 95000, 35.0, 223.0, "19.0 bhp @ 8000 rpm", "20.0 Nm", 155, 11.5, "5-Speed", "Disc Brake", "Discontinued Karizma variant.", "/uploads/karizma_r.jpg", 0],
        ["Hero", "Karizma ZMR", 1, 105000, 35.0, 223.0, "19.0 bhp @ 8000 rpm", "20.0 Nm", 157, 11.5, "5-Speed", "Disc Brake,Self Start", "ZMR variant of Karizma.", "/uploads/karizma_zmr.jpg", 0],
        ["Hero", "Xtreme 250R", 1, 175000, 35.0, 250.0, "25.0 bhp @ 9000 rpm", "22.0 Nm", 165, 12.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Slipper Clutch", "Powerful 250cc naked sportbike.", "/uploads/xtreme_250r.jpg", 1],
        ["Hero", "Mavrick 440", 2, 199000, 35.0, 443.0, "27.0 bhp @ 6000 rpm", "32.0 Nm", 185, 11.5, "6-Speed", "Dual-channel ABS,LED Headlamp,USB Charging", "Royal roadster motorcycle.", "/uploads/mavrick_440.jpg", 1]
      ];
      for (const bike of heroBikes) {
        await sqliteDb.run(
          'INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, weight, fuel_capacity, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          bike
        );
      }
      console.log('Hero bikes seeded successfully.');
    } else {
      console.log('Database already initialized.');
    }

    // Migration: seed TVS bikes if missing
    const tvsCheck = await sqliteDb.get("SELECT id FROM bikes WHERE brand='TVS' LIMIT 1");
    if (!tvsCheck) {
      console.log('Seeding TVS bikes...');
      const tvsBikes = [
        // 100cc-110cc Commuter
        ["TVS", "Sport", 3, 58000, 65.0, 109.7, "7.4 bhp @ 7500 rpm", "8.3 Nm", 108, 10.0, "4-Speed", "i3S Technology,Eco Mode,Kick Start", "Economical commuter bike with reliable performance.", "https://www.teamtvs.com/images/hero/home/tvs-sport.png", 1],
        ["TVS", "TVS Radeon", 3, 62000, 62.0, 109.7, "7.4 bhp @ 7500 rpm", "8.3 Nm", 113, 10.0, "4-Speed", "i3S Technology,Eco Mode,Kick Start", "Value-for-money commuter motorcycle.", "https://ik.imagekit.io/bikewale/bikewale/n/cw/ec/130591/tvs-radeon-right-side-view.jpg", 1],
        // 110cc Commuter
        ["TVS", "Star City Plus", 3, 75000, 60.0, 109.7, "7.4 bhp @ 7500 rpm", "8.3 Nm", 113, 10.0, "4-Speed", "Eco Mode,LED Headlamp,Semi-Digital Instrument Cluster", "Premium 110cc commuter with modern features.", "https://imgd.aeplcdn.com/1280x720/n/cw/ec/41298/tvs-star-city-right-side-view.jpeg", 1],
        ["TVS", "Victor", 3, 45000, 60.0, 109.7, "7.4 bhp @ 7500 rpm", "8.3 Nm", 108, 10.0, "4-Speed", "Kick Start", "Discontinued budget commuter.", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/TVS_Victor_motorcycle.jpg/320px-TVS_Victor_motorcycle.jpg", 0],
        ["TVS", "TVS Centra", 3, 40000, 65.0, 97.2, "6.5 bhp @ 7500 rpm", "7.5 Nm", 100, 9.0, "4-Speed", "Kick Start", "Legacy commuter bike (Discontinued).", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        // 125cc Premium Commuter
        ["TVS", "Raider 125", 3, 95000, 55.0, 124.8, "11.5 bhp @ 8000 rpm", "11.2 Nm", 125, 10.0, "5-Speed", "LED DRL,Hazard Lights,USB Charging,SmartXonnect", "Smart 125cc commuter with connected features.", "https://www.tvsmotor.com/tvs-raider/images/tvs-raider-right-side-view.jpg", 1],
        // 125cc Discontinued
        ["TVS", "Flame", 3, 55000, 55.0, 124.6, "9.5 bhp @ 7500 rpm", "10.2 Nm", 115, 10.0, "4-Speed", "Disc Brake", "Discontinued 125cc commuter bike.", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        ["TVS", "Phoenix 125", 3, 60000, 55.0, 124.6, "10.0 bhp @ 7500 rpm", "10.5 Nm", 118, 10.0, "4-Speed", "LED Headlamp,Disc Brake", "Discontinued premium 125cc.", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        // 150cc-160cc Performance
        ["TVS", "Apache RTR 160", 1, 125000, 50.0, 159.7, "16.5 bhp @ 9000 rpm", "14.2 Nm", 138, 12.0, "5-Speed", "LED DRL,Slipper Clutch,Single-channel ABS", "Entry-level performance bike.", "https://imgd-ct.aeplcdn.com/1280x720/n/cw/ec/102657/apache-rtr-160-4v-right-side-view.jpeg", 1],
        ["TVS", "Apache RTR 160 4V", 1, 140000, 48.0, 163.0, "17.3 bhp @ 9000 rpm", "16.5 Nm", 142, 12.0, "6-Speed", "LED DRL,Slipper Clutch,Dual-channel ABS,USD Forks", "Premium 160cc with 4-valve engine.", "https://www.tvsmotor.com/tvs-apache/images/tvs-apache-rtr-160-4v-right-side-view.png", 1],
        // 180cc Performance
        ["TVS", "Apache RTR 180", 1, 135000, 45.0, 177.4, "17.3 bhp @ 9000 rpm", "15.5 Nm", 141, 12.0, "5-Speed", "LED DRL,Slipper Clutch,Single-channel ABS", "Performance-oriented sport bike.", "https://imgd.aeplcdn.com/1280x720/n/cw/ec/23279/apache-rtr-180-right-side-view.jpeg", 1],
        // 200cc Performance
        ["TVS", "Apache RTR 200 4V", 1, 160000, 40.0, 197.75, "20.0 bhp @ 9000 rpm", "18.0 Nm", 152, 12.0, "6-Speed", "LED DRL,Slipper Clutch,Dual-channel ABS,USD Forks,Bluetooth", "Top-spec 200cc performance bike.", "https://www.tvsmotor.com/tvs-apache/images/tvs-apache-rtr-200-4v-right-side-view.png", 1],
        // 225cc Neo-Retro Cruiser
        ["TVS", "Ronin", 2, 175000, 40.0, 225.0, "20.4 bhp @ 9000 rpm", "19.5 Nm", 159, 12.0, "6-Speed", "LED DRL,Dual-channel ABS,USD Forks,Walk Assist", "Neo-retro cruiser motorcycle.", "https://www.tvsmotor.com/tvs-ronin/images/tvs-ronin-right-side-view.png", 1],
        // 310cc Sports
        ["TVS", "Apache RTR 310", 1, 225000, 35.0, 312.2, "33.2 bhp @ 9500 rpm", "28.5 Nm", 167, 13.0, "6-Speed", "LED DRL,Dual-channel ABS,USD Forks,Riding Modes,Bluetooth", "Streetfighter with advanced tech.", "https://www.tvsmotor.com/tvs-apache/images/tvs-apache-rtr-310-right-side-view.png", 1],
        ["TVS", "Apache RTX 300", 4, 210000, 35.0, 312.2, "33.2 bhp @ 9500 rpm", "28.5 Nm", 175, 13.0, "6-Speed", "LED DRL,Dual-channel ABS,Wire-spoke Wheels,Adventure Kit", "Adventure-touring motorcycle.", "https://www.tvsmotor.com/tvs-apache/images/tvs-apache-rtx-300-right-side-view.png", 1],
        // 312cc Track/Sports
        ["TVS", "Apache RR 310", 1, 250000, 33.0, 312.2, "33.2 bhp @ 9500 rpm", "28.5 Nm", 165, 13.0, "6-Speed", "LED DRL,Dual-channel ABS,Full-Faired Body,Aero Design", "Full-faired supersport bike.", "https://www.tvsmotor.com/tvs-apache/images/tvs-apache-rr-310-right-side-view.png", 1],
        // Legacy Sports (Discontinued)
        ["TVS", "Suzuki Shogun", 1, 45000, 50.0, 125.0, "10.5 bhp @ 8000 rpm", "10.0 Nm", 118, 10.5, "4-Speed", "Disc Brake", "Legacy street bike (Discontinued).", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        ["TVS", "Suzuki Samurai", 3, 42000, 55.0, 100.0, "7.5 bhp @ 7500 rpm", "7.5 Nm", 105, 10.0, "4-Speed", "Drum Brake", "Legacy commuter (Discontinued).", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        ["TVS", "Suzuki Fiero", 1, 50000, 45.0, 150.0, "14.0 bhp @ 8500 rpm", "12.5 Nm", 132, 12.0, "5-Speed", "Disc Brake", "Legacy sports bike (Discontinued).", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        // Moped
        ["TVS", "XL 100 Comfort", 3, 40000, 70.0, 99.7, "5.5 bhp @ 6000 rpm", "6.5 Nm", 75, 5.0, "4-Speed", "Heavy Duty Chassis,Kick Start", "Heavy duty utility moped.", "https://www.tvsmotor.com/tvs-xl/images/tvs-xl100-right-side-view.png", 1],
        ["TVS", "XL 100 Heavy Duty", 3, 42000, 70.0, 99.7, "5.5 bhp @ 6000 rpm", "6.5 Nm", 80, 5.5, "4-Speed", "Heavy Duty Chassis,Reinforced Frame", "Extra heavy duty moped.", "https://www.tvsmotor.com/tvs-xl/images/tvs-xl100-heavy-duty-right-side-view.png", 1],
        ["TVS", "XL Super", 3, 35000, 75.0, 99.7, "5.0 bhp @ 6000 rpm", "6.0 Nm", 70, 5.0, "4-Speed", "Kick Start", "Classic moped (Discontinued).", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        ["TVS", "XL Champ", 3, 38000, 75.0, 99.7, "5.0 bhp @ 6000 rpm", "6.0 Nm", 72, 5.0, "4-Speed", "Kick Start", "Champion moped variant.", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        // Scooters
        ["TVS", "Scooty Pep+", 3, 65000, 58.0, 87.8, "5.8 bhp @ 7500 rpm", "6.5 Nm", 92, 4.5, "CVT", "Compact Design,LED Headlamp,Eco Mode", "Compact urban scooter.", "https://www.tvsmotor.com/tvs-scooty/images/tvs-scooty-pep-plus-right-side-view.png", 1],
        ["TVS", "Scooty Zest 110", 3, 70000, 55.0, 109.7, "7.8 bhp @ 7500 rpm", "8.0 Nm", 95, 4.5, "CVT", "LED Headlamp,Eco Mode,USB Charging", "Premium compact scooter.", "https://www.tvsmotor.com/tvs-scooty/images/tvs-scooty-zest-110-right-side-view.png", 1],
        ["TVS", "Jupiter 110", 3, 76000, 55.0, 109.7, "7.8 bhp @ 7500 rpm", "8.0 Nm", 108, 5.0, "CVT", "LED Headlamp,External Fuel Lid,Eco Mode", "Family-friendly scooter.", "https://www.tvsmotor.com/tvs-jupiter/images/tvs-jupiter-right-side-view.png", 1],
        ["TVS", "Jupiter 125", 3, 85000, 52.0, 124.0, "9.5 bhp @ 7500 rpm", "10.5 Nm", 110, 5.0, "CVT", "LED Headlamp,External Fuel Lid,SmartXonnect", "Premium family scooter.", "https://www.tvsmotor.com/tvs-jupiter/images/tvs-jupiter-125-right-side-view.png", 1],
        ["TVS", "Ntorq 125 Race Edition", 1, 98000, 50.0, 124.8, "11.5 bhp @ 8500 rpm", "11.2 Nm", 118, 5.0, "CVT", "Race Decals,Bluetooth,LED Headlamp,Digital Console", "Performance scooter with tech.", "https://www.tvsmotor.com/tvs-ntorq/images/tvs-ntorq-125-race-xp-right-side-view.png", 1],
        ["TVS", "Ntorq 125 XT", 1, 105000, 48.0, 124.8, "11.5 bhp @ 8500 rpm", "11.2 Nm", 120, 5.0, "CVT", "GPS Navigation,Bluetooth,LED Headlamp,Alloy Wheels", "Top-spec Ntorq variant.", "https://www.tvsmotor.com/tvs-ntorq/images/tvs-ntorq-125-xt-right-side-view.png", 1],
        ["TVS", "Wego", 3, 55000, 50.0, 109.7, "7.8 bhp @ 7500 rpm", "8.0 Nm", 105, 5.0, "CVT", "Disc Brake", "Discontinued family scooter.", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        ["TVS", "Scooty Streak", 3, 50000, 55.0, 87.8, "5.8 bhp @ 7500 rpm", "6.5 Nm", 90, 4.5, "CVT", "Compact Design", "Discontinued compact scooter.", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        ["TVS", "TVS Stile", 3, 52000, 55.0, 109.7, "7.8 bhp @ 7500 rpm", "8.0 Nm", 98, 5.0, "CVT", "Disc Brake,Alloy Wheels", "Discontinued Stile scooter.", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", 0],
        // Electric
        ["TVS", "iQube Standard", 5, 99000, 0, 0, "5.5 kW peak", "140 Nm", 118, 0, "Automatic", "LED Headlamp,SmartXonnect,Regenerative Braking", "Affordable electric scooter.", "https://www.tvsmotor.com/tvs-iqube/images/tvs-iqube-right-side-view.png", 1],
        ["TVS", "iQube S", 5, 115000, 0, 0, "7.5 kW peak", "140 Nm", 118, 0, "Automatic", "LED Headlamp,SmartXonnect,Regenerative Braking,Bluetooth", "Mid-range electric scooter.", "https://www.tvsmotor.com/tvs-iqube/images/tvs-iqube-s-right-side-view.png", 1],
        ["TVS", "iQube ST", 5, 135000, 0, 0, "11.0 kW peak", "140 Nm", 118, 0, "Automatic", "LED Headlamp,SmartXonnect,Regenerative Braking,Navigation", "Long-range premium electric scooter.", "https://www.tvsmotor.com/tvs-iqube/images/tvs-iqube-st-right-side-view.png", 1]
      ];

      for (const bike of tvsBikes) {
        await sqliteDb.run(
          'INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, weight, fuel_capacity, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          bike
        );
      }
      console.log('TVS bikes seeded successfully.');
    }

    // Migration: seed Yamaha bikes if missing
    const yamahaCheck = await sqliteDb.get("SELECT id FROM bikes WHERE brand='Yamaha' AND model='FZ-Fi Version 3.0' LIMIT 1");
    if (!yamahaCheck) {
      console.log('Seeding Yamaha bikes...');
      const yamahaBikes = [
        // 149cc Commuter (Active)
        ["Yamaha", "FZ-Fi Version 3.0", 3, 110000, 45.0, 149.0, "12.9 bhp @ 8000 rpm", "13.3 Nm", 135, 12.0, "5-Speed", "Single-channel ABS,LED Headlamp,Digital Console", "India's first FZ with FI technology.", "/uploads/yamaha_fz_fi_v3.jpg", 1],
        ["Yamaha", "FZS-Fi Version 3.0", 3, 120000, 45.0, 149.0, "12.9 bhp @ 8000 rpm", "13.3 Nm", 137, 12.0, "5-Speed", "Single-channel ABS,LED Headlamp,Digital Console,Alloy Wheels", "Sportier version of FZ-Fi.", "/uploads/yamaha_fzs_fi_v3.jpg", 1],
        ["Yamaha", "FZS-Fi Version 4.0 DLX", 3, 135000, 44.0, 149.0, "13.2 bhp @ 8000 rpm", "13.5 Nm", 139, 12.0, "5-Speed", "Dual-channel ABS,LED Headlamp,USD Forks,Quick Shifter", "Deluxe variant with premium features.", "/uploads/yamaha_fzs_v4_dlx.jpg", 1],
        ["Yamaha", "FZ Rave", 3, 118000, 45.0, 149.0, "12.9 bhp @ 8000 rpm", "13.3 Nm", 136, 12.0, "5-Speed", "LED Headlamp,Digital Console,Rave Graphics", "Special edition with bold graphics.", "/uploads/yamaha_fz_rave.jpg", 1],
        ["Yamaha", "FZ-S Fi Hybrid", 3, 125000, 50.0, 149.0, "12.9 bhp @ 8000 rpm", "13.3 Nm", 138, 12.0, "5-Speed", "Hybrid Technology,LED Headlamp,Eco Mode", "Fuel-efficient hybrid version.", "/uploads/yamaha_fz_s_fi_hybrid.jpg", 1],
        ["Yamaha", "FZ-X", 3, 125000, 45.0, 149.0, "12.9 bhp @ 8000 rpm", "13.3 Nm", 137, 12.0, "5-Speed", "Single-channel ABS,LED Headlamp,Digital Console,USB Charging", "Retro-styled urban commuter.", "/uploads/yamaha_fz_x.jpg", 1],
        ["Yamaha", "FZ-X Hybrid", 3, 135000, 50.0, 149.0, "12.9 bhp @ 8000 rpm", "13.3 Nm", 140, 12.0, "5-Speed", "Hybrid Technology,LED Headlamp,Retro Styling", "Retro commuter with hybrid tech.", "/uploads/yamaha_fz_x_hybrid.jpg", 1],
        // 155cc Naked Streetfighter (Active)
        ["Yamaha", "MT-15 Version 2.0", 1, 170000, 40.0, 155.0, "18.4 bhp @ 10000 rpm", "14.2 Nm", 141, 11.0, "6-Speed", "Dual-channel ABS,LED Headlamp,USD Forks,Quick Shifter,VVA", "Streetfighter with aggressive styling.", "/uploads/yamaha_mt15_v2.jpg", 1],
        // 155cc Supersport (Active)
        ["Yamaha", "YZF-R15S V3", 1, 175000, 40.0, 155.0, "18.4 bhp @ 10000 rpm", "14.2 Nm", 142, 11.0, "6-Speed", "Single-channel ABS,LED Headlamp,Deltabox Frame", "Unibody supersport bike.", "/uploads/yamaha_yzf_r15s_v3.jpg", 1],
        ["Yamaha", "YZF-R15 V4", 1, 185000, 40.0, 155.0, "18.4 bhp @ 10000 rpm", "14.2 Nm", 145, 11.0, "6-Speed", "Dual-channel ABS,Quick Shifter,LED Lights,Deltabox Frame", "Premium supersport with advanced tech.", "/uploads/yamaha_yzf_r15_v4.jpg", 1],
        ["Yamaha", "YZF-R15M", 1, 195000, 40.0, 155.0, "18.4 bhp @ 10000 rpm", "14.2 Nm", 147, 11.0, "6-Speed", "Dual-channel ABS,Quick Shifter,LED Lights,Deltabox Frame,Metal Monkey", "Premium variant with quickshifter.", "/uploads/yamaha_yzf_r15m.jpg", 1],
        // 155cc Neo-Retro (Active)
        ["Yamaha", "XSR 155", 1, 175000, 40.0, 155.0, "18.4 bhp @ 10000 rpm", "14.2 Nm", 144, 11.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Classic Styling,Alloy Wheels", "Neo-retro classic styling.", "/uploads/yamaha_xsr_155.jpg", 1],
        // 321cc Twin-Cylinder (Active)
        ["Yamaha", "MT-03", 1, 350000, 30.0, 321.0, "41.0 bhp @ 10750 rpm", "29.5 Nm", 167, 14.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Slipper Clutch,Riding Modes", "Twin-cylinder streetfighter.", "/uploads/yamaha_mt03.jpg", 1],
        ["Yamaha", "YZF-R3", 1, 380000, 30.0, 321.0, "41.0 bhp @ 10750 rpm", "29.5 Nm", 168, 14.0, "6-Speed", "Dual-channel ABS,LED Headlamp,Full-Faired Body", "Twin-cylinder sport bike.", "/uploads/yamaha_yzf_r3.jpg", 1],
        // Legacy 2-Stroke (Discontinued)
        ["Yamaha", "RX 100", 1, 25000, 50.0, 98.0, "11.0 bhp @ 7500 rpm", "10.5 Nm", 115, 12.0, "5-Speed", "2-Stroke,Powervalve", "Legendary 2-stroke icon.", "/uploads/yamaha_rx_100.jpg", 0],
        ["Yamaha", "RX 135", 1, 35000, 45.0, 135.0, "14.0 bhp @ 8500 rpm", "13.5 Nm", 125, 12.0, "5-Speed", "2-Stroke,Powervalve", "Powerful 2-stroke legacy bike.", "/uploads/yamaha_rx_135.jpg", 0],
        ["Yamaha", "RX-G", 1, 40000, 45.0, 135.0, "14.5 bhp @ 8500 rpm", "13.5 Nm", 130, 12.0, "5-Speed", "2-Stroke,Graphics Kit", "Premium RX variant.", "/uploads/yamaha_rx_g.jpg", 0],
        ["Yamaha", "RD 350", 1, 80000, 25.0, 347.0, "39.0 bhp @ 9500 rpm", "32.0 Nm", 145, 18.0, "6-Speed", "2-Stroke,Twin Cylinder", "Legendary twin 2-stroke.", "/uploads/yamaha_rd_350.jpg", 0],
        // 106cc Commuter (Discontinued)
        ["Yamaha", "Crux", 3, 45000, 55.0, 106.0, "7.5 bhp @ 7500 rpm", "8.0 Nm", 118, 10.0, "4-Speed", "Kick Start", "Reliable 106cc commuter.", "/uploads/yamaha_crux.jpg", 0],
        ["Yamaha", "Crux R", 3, 50000, 55.0, 106.0, "7.5 bhp @ 7500 rpm", "8.0 Nm", 120, 10.0, "4-Speed", "Alloy Wheels,Sporty Graphics", "Sporty variant of Crux.", "/uploads/yamaha_crux_r.jpg", 0],
        ["Yamaha", "Libero", 3, 40000, 60.0, 106.0, "7.0 bhp @ 7500 rpm", "7.5 Nm", 115, 10.0, "4-Speed", "Kick Start", "Budget 106cc commuter.", "/uploads/yamaha_libero.jpg", 0],
        ["Yamaha", "Libero G5", 3, 45000, 60.0, 106.0, "7.0 bhp @ 7500 rpm", "7.5 Nm", 117, 10.0, "4-Speed", "Updated Styling", "Updated Libero model.", "/uploads/yamaha_libero_g5.jpg", 0],
        // Legacy Cruiser (Discontinued)
        ["Yamaha", "YBX 125", 2, 50000, 45.0, 124.0, "10.0 bhp @ 8000 rpm", "10.5 Nm", 125, 10.0, "4-Speed", "Cruiser Styling", "Legacy cruiser bike.", "/uploads/yamaha_ybx_125.jpg", 0],
        ["Yamaha", "Enticer 125", 2, 52000, 45.0, 124.0, "10.0 bhp @ 8000 rpm", "10.5 Nm", 127, 10.0, "4-Speed", "Cruiser Styling", "Enticer cruiser variant.", "/uploads/yamaha_enticer_125.jpg", 0],
        // 125cc Commuter (Discontinued)
        ["Yamaha", "Gladiator 125", 3, 55000, 50.0, 125.0, "10.5 bhp @ 8000 rpm", "10.4 Nm", 125, 10.0, "5-Speed", "Disc Brake", "125cc street bike.", "/uploads/yamaha_gladiator_125.jpg", 0],
        ["Yamaha", "SS 125", 3, 58000, 50.0, 125.0, "10.5 bhp @ 8000 rpm", "10.4 Nm", 128, 10.0, "5-Speed", "Alloy Wheels", "Sport-style 125cc.", "/uploads/yamaha_ss_125.jpg", 0],
        ["Yamaha", "Saluto 125", 3, 65000, 50.0, 125.0, "10.5 bhp @ 8000 rpm", "10.4 Nm", 130, 10.0, "5-Speed", "LED DRL,Digital Console", "Premium 125cc commuter.", "/uploads/yamaha_saluto_125.jpg", 0],
        // 153cc Commuter (Discontinued)
        ["Yamaha", "SZ-R", 3, 75000, 45.0, 153.0, "12.0 bhp @ 7500 rpm", "12.5 Nm", 135, 10.0, "5-Speed", "Disc Brake", "Budget performance bike.", "/uploads/yamaha_sz_r.jpg", 0],
        ["Yamaha", "SZ-RR", 3, 80000, 45.0, 153.0, "12.0 bhp @ 7500 rpm", "12.5 Nm", 138, 10.0, "5-Speed", "Alloy Wheels,Updated Graphics", "Updated SZ variant.", "/uploads/yamaha_sz_rr.jpg", 0],
        // 153cc Streetfighters (Discontinued)
        ["Yamaha", "FZ16", 1, 85000, 45.0, 153.0, "14.0 bhp @ 7500 rpm", "14.0 Nm", 140, 12.0, "5-Speed", "Disc Brake", "First-gen FZ streetfighter.", "/uploads/yamaha_fz16.jpg", 0],
        ["Yamaha", "FZ-S V1", 1, 90000, 45.0, 153.0, "14.0 bhp @ 7500 rpm", "14.0 Nm", 142, 12.0, "5-Speed", "Alloy Wheels,Muscular Styling", "Sporty FZ variant.", "/uploads/yamaha_fz_s_v1.jpg", 0],
        ["Yamaha", "FZ-S V2", 1, 95000, 45.0, 153.0, "14.0 bhp @ 7500 rpm", "14.0 Nm", 144, 12.0, "5-Speed", "ABS,LED Headlamp", "Updated FZ-S version.", "/uploads/yamaha_fz_s_v2.jpg", 0],
        ["Yamaha", "Fazer 150", 1, 90000, 45.0, 153.0, "14.0 bhp @ 7500 rpm", "14.0 Nm", 142, 12.0, "5-Speed", "Semi-Faired Body", "Semi-faired version.", "/uploads/yamaha_fazer_150.jpg", 0],
        ["Yamaha", "Fazer V2", 1, 95000, 45.0, 153.0, "14.0 bhp @ 7500 rpm", "14.0 Nm", 145, 12.0, "5-Speed", "Semi-Faired,ABS", "Updated Fazer.", "/uploads/yamaha_fazer_v2.jpg", 0],
        // 249cc Quarter-Litre (Discontinued)
        ["Yamaha", "FZ25", 1, 130000, 35.0, 249.0, "20.5 bhp @ 8000 rpm", "20.5 Nm", 155, 12.0, "5-Speed", "ABS,LED Headlamp", "Quarter-litre streetfighter.", "/uploads/yamaha_fz25.jpg", 0],
        ["Yamaha", "Fazer 25", 1, 135000, 35.0, 249.0, "20.5 bhp @ 8000 rpm", "20.5 Nm", 158, 12.0, "5-Speed", "ABS,Semi-Faired", "Semi-faired 250cc.", "/uploads/yamaha_fazer_25.jpg", 0],
        // 998cc Superbike (Import)
        ["Yamaha", "YZF-R1", 1, 2500000, 20.0, 998.0, "197.0 bhp @ 13500 rpm", "112.0 Nm", 205, 17.0, "6-Speed", "TCS,Quick Shifter,Riding Modes", "Flagship superbike.", "/uploads/yamaha_yzf_r1.jpg", 0],
        // Scooters (Active)
        ["Yamaha", "Fascino 125 Fi Hybrid", 3, 85000, 50.0, 125.0, "8.0 bhp @ 7500 rpm", "10.4 Nm", 99, 5.2, "CVT", "Hybrid Technology,LED Headlamp,Retro Style", "Retro-style hybrid scooter.", "/uploads/yamaha_fascino_125_hybrid.jpg", 1],
        ["Yamaha", "New Fascino 125 Fi", 3, 90000, 50.0, 125.0, "8.0 bhp @ 7500 rpm", "10.4 Nm", 101, 5.2, "CVT", "LED Headlamp,Smart Key,Retro Style", "Refreshed retro-style scooter.", "/uploads/yamaha_new_fascino_125_fi.jpg", 1],
        ["Yamaha", "RayZR 125 Fi Hybrid", 3, 85000, 50.0, 125.0, "8.0 bhp @ 7500 rpm", "10.4 Nm", 97, 5.2, "CVT", "Hybrid Technology,LED Headlamp,Sporty Design", "Sporty hybrid scooter.", "/uploads/yamaha_rayzr_125_hybrid.jpg", 1],
        ["Yamaha", "RayZR Street Rally 125 Fi", 3, 95000, 48.0, 125.0, "8.0 bhp @ 7500 rpm", "10.4 Nm", 100, 5.2, "CVT", "Hybrid Technology,LED Headlamp,Rally Styling", "Rally-styled sporty scooter.", "/uploads/yamaha_rayzr_street_rally.jpg", 1],
        ["Yamaha", "Aerox 155 Version S", 1, 145000, 40.0, 155.0, "14.8 bhp @ 8000 rpm", "13.9 Nm", 125, 5.5, "CVT", "LED Headlamp,VVA,Y-Connect,Maxi Scooter", "Performance maxi-scooter.", "/uploads/yamaha_aerox_155.jpg", 1]
      ];

      for (const bike of yamahaBikes) {
        await sqliteDb.run(
          'INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, weight, fuel_capacity, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          bike
        );
      }
      console.log('Yamaha bikes seeded successfully.');
    }

    // Migration: seed Royal Enfield bikes if missing
    const reCheck = await sqliteDb.get("SELECT id FROM bikes WHERE brand='Royal Enfield' AND model='Hunter 350' LIMIT 1");
    if (!reCheck) {
      console.log('Seeding Royal Enfield bikes...');
      const reBikes = [
        // --- 350cc ---
        ["Royal Enfield", "Hunter 350",          1, 149000, 35.0, 349, "20.2 bhp @ 6100 rpm", "27 Nm", 177, 13.0, "5-Speed", "Dual-Channel ABS,LED DRL,Tripper Navigation",          "Urban streetfighter with a punchy 350cc engine.",                      "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/hunter-350/overview/hunter-350-dapper-ash.png", 1],
        ["Royal Enfield", "Meteor 350",          2, 210000, 35.0, 349, "20.2 bhp @ 6100 rpm", "27 Nm", 191, 15.0, "5-Speed", "LED Headlamp,USB Charger,Tripper Navigation",          "Easy cruiser designed for relaxed highway touring.",                    "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/meteor-350/overview/meteor-350-fireball-red.png", 1],
        ["Royal Enfield", "Bullet 350",          2, 185000, 35.0, 349, "20.2 bhp @ 6100 rpm", "27 Nm", 195, 13.5, "5-Speed", "Kick Start Option,Analog Console,ABS",                 "The heritage standard icon with a thump.",                             "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/bullet-350/overview/bullet-350-black-gold.png", 1],
        ["Royal Enfield", "Classic 350 (Chrome)", 2, 198000, 35.0, 349, "20.2 bhp @ 6100 rpm", "27 Nm", 195, 13.5, "5-Speed", "Alloy Wheels,Spoked Option,ABS,Chrome Accents",   "Traditional styling offering a vintage riding experience.",             "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/classic-350/overview/classic-350-chrome-black.png", 0],
        // --- 450cc ---
        ["Royal Enfield", "Himalayan 450",       4, 265000, 32.0, 452, "40 bhp @ 8000 rpm",   "40 Nm", 196, 17.0, "6-Speed", "Ride-by-Wire,LCD Console,Dual-Channel ABS,Switchable ABS", "The ultimate adventure tourer for off-road & mountains.",         "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/himalayan-450/overview/himalayan-450-kaza-brown.png", 1],
        ["Royal Enfield", "Guerrilla 450",       1, 205000, 32.0, 452, "40 bhp @ 8000 rpm",   "40 Nm", 185, 11.0, "6-Speed", "LED Lights,Dual-Channel ABS,Ride-by-Wire,Riding Modes",  "High-performance naked roadster with 450cc Sherpa engine.",            "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/guerrilla-450/overview/guerrilla-450-drifter-blue.png", 1],
        ["Royal Enfield", "Scram 440",           4, 215000, 32.0, 441, "24.8 bhp @ 6500 rpm", "36 Nm", 185, 13.5, "5-Speed", "Front Disc,Rear Disc,LED Headlamp,Dual-Channel ABS",   "Urban scrambler for rugged daily city riding.",                        "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/scram-411/overview/scram-411-urban-storm.png", 0],
        // --- 650cc ---
        ["Royal Enfield", "Interceptor 650",     2, 290000, 28.0, 648, "47 bhp @ 7150 rpm",   "52 Nm", 202, 13.7, "6-Speed", "Dual-Channel ABS,Slipper Clutch,LED Lights",            "Retro roadster for balanced highway cruising.",                        "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/interceptor-650/overview/interceptor-650-mark2-chrome-silver.png", 1],
        ["Royal Enfield", "Continental GT 650",  1, 315000, 28.0, 648, "47 bhp @ 7150 rpm",   "52 Nm", 198, 12.5, "6-Speed", "Clip-on Handlebars,Dual-Channel ABS,Slipper Clutch",   "Aggressive café racer with sporty riding stance.",                     "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/continental-gt-650/overview/continental-gt-650-mr-clean.png", 1],
        ["Royal Enfield", "Super Meteor 650",    2, 360000, 25.0, 648, "47 bhp @ 7150 rpm",   "52 Nm", 241, 15.5, "6-Speed", "Tripper Navigation,LED Cluster,Dual-Channel ABS,USB",   "Premium cruiser for low-slung long-distance touring.",                 "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/super-meteor-650/overview/super-meteor-650-astral-black.png", 1],
        ["Royal Enfield", "Bear 650",            4, 335000, 25.0, 648, "47 bhp @ 7150 rpm",   "52 Nm", 214, 13.7, "6-Speed", "Off-road Tyres,High Ground Clearance,Dual-Channel ABS", "Off-road scrambler with long-travel suspension.",                      "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/bear-650/overview/bear-650-grizzly.png", 1],
        // --- Electric ---
        ["Royal Enfield", "Flying Flea C6",      5, 450000, 80.0, 0,   "11.7 bhp",            "40 Nm", 120, 0,    "Single-Speed", "Removable Battery,LED Lights,Digital Console,Regen Braking", "Lightweight futuristic electric urban motorcycle.",           "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/flying-flea/overview/flying-flea-c6.png", 1],
        ["Royal Enfield", "Flying Flea S6",      5, 480000, 80.0, 0,   "13.4 bhp",            "40 Nm", 125, 0,    "Single-Speed", "Removable Battery,LED Lights,Performance Mode,Regen Braking", "Sport variant of the Flying Flea with enhanced performance.", "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/flying-flea/overview/flying-flea-s6.png", 1],
      ];

      for (const bike of reBikes) {
        await sqliteDb.run(
          'INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, weight, fuel_capacity, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          bike
        );
      }
      console.log('Royal Enfield bikes seeded successfully.');
    }

    // Migration: seed Honda bikes if missing
    const hondaCheck = await sqliteDb.get("SELECT id FROM bikes WHERE brand='Honda' AND model='Activa (110)' LIMIT 1");
    if (!hondaCheck) {
      console.log('Seeding Honda bikes...');
      const hondaBikes = [
        ["Honda", "Activa (110)", 3, 78166, 51.5, 110, "7.73 bhp @ 8000 rpm", "8.90 Nm @ 5500 rpm", 105, 5.3, "Automatic", "ESP Technology, LED Headlamp, External Fuel Lid", "India's highest selling family scooter.", null, 1],
        ["Honda", "Dio (110)", 3, 74298, 49.0, 110, "7.6 bhp @ 8000 rpm", "9.0 Nm @ 4750 rpm", 105, 5.3, "Automatic", "LED Headlamp, Sporty Graphics, External Fuel Lid", "Sporty and youthful 110cc scooter.", null, 1],
        ["Honda", "Activa 125", 3, 92529, 47.0, 124, "8.18 bhp @ 6500 rpm", "10.3 Nm @ 5000 rpm", 110, 5.3, "Automatic", "Idling Stop System, LED Headlamp, Digital Dash", "Premium 125cc family scooter.", null, 1],
        ["Honda", "Dio 125", 3, 93289, 47.0, 124, "8.18 bhp @ 6250 rpm", "10.3 Nm @ 5000 rpm", 110, 5.3, "Automatic", "Smart Key, LED Headlamp, Sporty Exhaust Muffler", "Aggressive and stylish 125cc scooter.", null, 1],
        ["Honda", "Activa e", 5, 119909, 102.0, 0, "6 kW peak", "22 Nm", 115, 0, "Automatic", "Removable Batteries, LED Lights, Riding Modes", "Honda's first electric scooter for India.", null, 1],
        ["Honda", "QC1", 5, 90486, 80.0, 0, "1.8 kW peak", "12 Nm", 100, 0, "Automatic", "Compact Design, Removable Battery, Digital Cluster", "Compact electric scooter for urban commuting.", null, 0],
        ["Honda", "Shine 100", 3, 65717, 60.0, 99, "7.28 bhp @ 7500 rpm", "8.05 Nm @ 5000 rpm", 99, 9.0, "4-Speed", "Side Stand Engine Cut-off, Alloy Wheels", "Highly reliable and affordable 100cc commuter.", null, 1],
        ["Honda", "Livo", 3, 80752, 65.0, 110, "8.67 bhp @ 7500 rpm", "9.30 Nm @ 5500 rpm", 113, 9.0, "4-Speed", "Silent Start with ACG, Disc Brake, Tubeless Tyres", "Stylish 110cc commuter bike.", null, 0],
        ["Honda", "SP 125", 3, 89406, 63.0, 124, "10.72 bhp @ 7500 rpm", "10.9 Nm @ 6000 rpm", 116, 11.0, "5-Speed", "LED Headlamp, Fully Digital Instrument Cluster", "Premium and sporty 125cc commuter.", null, 1],
        ["Honda", "CB 125 Hornet", 3, 115065, 48.0, 124, "11.2 bhp @ 8500 rpm", "11.0 Nm @ 6500 rpm", 118, 12.0, "5-Speed", "Aggressive Tank Shrouds, LED Tail Light", "Sporty 125cc commuter for youth.", null, 0],
        ["Honda", "Unicorn", 3, 113613, 50.0, 163, "12.7 bhp @ 7500 rpm", "14.0 Nm @ 5500 rpm", 140, 13.0, "5-Speed", "Mono Suspension, Chrome Accents, Tubeless Tyres", "Smooth and reliable 160cc executive commuter.", null, 1],
        ["Honda", "SP 160", 3, 116270, 50.0, 163, "13.27 bhp @ 7500 rpm", "14.58 Nm @ 5500 rpm", 141, 12.0, "5-Speed", "LED Headlamp, Digital Meter, Hazard Switch", "Sporty executive 160cc motorcycle.", null, 1],
        ["Honda", "Hornet 2.0", 1, 147864, 45.0, 184, "17.03 bhp @ 8500 rpm", "16.1 Nm @ 6000 rpm", 142, 12.0, "5-Speed", "USD Front Forks, Petal Disc Brakes, Gear Position Indicator", "Naked streetfighter styling with premium handling.", null, 1]
      ];
      for (const bike of hondaBikes) {
        await sqliteDb.run(
          'INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, weight, fuel_capacity, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          bike
        );
      }
      console.log('Honda bikes seeded successfully.');
    }

    // Migration: set top_speed for all bikes with NULL top_speed
    const nullSpeedCheck = await sqliteDb.get("SELECT id FROM bikes WHERE top_speed IS NULL LIMIT 1");
    if (nullSpeedCheck) {
      console.log('Setting top speeds based on engine CC...');
      await sqliteDb.run(`
        UPDATE bikes SET top_speed = CASE
          WHEN engine_cc = 0 AND power LIKE '%5.5%'  THEN 80
          WHEN engine_cc = 0 AND power LIKE '%7.5%'  THEN 100
          WHEN engine_cc = 0 AND power LIKE '%11%'   THEN 116
          WHEN engine_cc = 0                         THEN 90
          WHEN engine_cc > 0   AND engine_cc <= 90   THEN 75
          WHEN engine_cc > 90  AND engine_cc <= 100  THEN 90
          WHEN engine_cc > 100 AND engine_cc <= 112  THEN 95
          WHEN engine_cc > 112 AND engine_cc <= 115  THEN 100
          WHEN engine_cc > 115 AND engine_cc <= 126  THEN 105
          WHEN engine_cc > 126 AND engine_cc <= 140  THEN 110
          WHEN engine_cc > 140 AND engine_cc <= 155 AND power LIKE '%18%' THEN 145
          WHEN engine_cc > 140 AND engine_cc <= 155 AND power LIKE '%14%' THEN 122
          WHEN engine_cc > 140 AND engine_cc <= 155 AND power LIKE '%13%' THEN 118
          WHEN engine_cc > 140 AND engine_cc <= 155 AND power LIKE '%12%' THEN 115
          WHEN engine_cc > 140 AND engine_cc <= 155 AND power LIKE '%11%' THEN 130
          WHEN engine_cc > 140 AND engine_cc <= 155              THEN 120
          WHEN engine_cc > 155 AND engine_cc <= 165 AND power LIKE '%17%' THEN 132
          WHEN engine_cc > 155 AND engine_cc <= 165 AND power LIKE '%16%' THEN 128
          WHEN engine_cc > 155 AND engine_cc <= 165              THEN 125
          WHEN engine_cc > 165 AND engine_cc <= 185              THEN 130
          WHEN engine_cc > 185 AND engine_cc <= 200 AND power LIKE '%20%' THEN 135
          WHEN engine_cc > 185 AND engine_cc <= 200              THEN 130
          WHEN engine_cc > 200 AND engine_cc <= 230 AND power LIKE '%20%' THEN 140
          WHEN engine_cc > 200 AND engine_cc <= 230              THEN 138
          WHEN engine_cc > 230 AND engine_cc <= 255              THEN 148
          WHEN engine_cc > 255 AND engine_cc <= 315 AND power LIKE '%33%' THEN 168
          WHEN engine_cc > 255 AND engine_cc <= 315              THEN 155
          WHEN engine_cc > 315 AND engine_cc <= 360 AND power LIKE '%41%' THEN 178
          WHEN engine_cc > 315 AND engine_cc <= 360 AND power LIKE '%20%' THEN 120
          WHEN engine_cc > 315 AND engine_cc <= 360              THEN 130
          WHEN engine_cc > 360 AND engine_cc <= 400              THEN 170
          WHEN engine_cc > 400 AND engine_cc <= 500              THEN 148
          WHEN engine_cc > 500                                   THEN 280
          ELSE 100
        END
        WHERE top_speed IS NULL
      `);
      const updated = await sqliteDb.get("SELECT COUNT(*) as cnt FROM bikes WHERE top_speed IS NOT NULL");
      console.log('Top speeds set for', updated.cnt, 'bikes.');
    }

    // Always run image + color update migration
    await updateBikeImages();
  }
}

module.exports = { initDb };


