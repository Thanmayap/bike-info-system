const db = require('../config/db');

const bikeData = [
    // --- FAMILY SCOOTER (Active) ---
    {
        brand: "Ather",
        model: "Rizta S",
        category: "Family Scooter",
        engine: "2.9 kWh",
        power: "2.9 kWh",
        range: "105 km",
        topSpeed: "80 km/h",
        price: "₹1,14,000 – ₹1,17,499",
        status: "Active",
        features: "105 km true range | 80 km/h top speed",
        description: "Family-friendly electric scooter.",
        image: "https://placehold.co/400x250?text=Ather+Rizta+S"
    },
    {
        brand: "Ather",
        model: "Rizta Z 2.9",
        category: "Family Scooter",
        engine: "2.9 kWh",
        power: "2.9 kWh",
        range: "105 km",
        topSpeed: "80 km/h",
        price: "₹1,34,000",
        status: "Active",
        features: "105 km true range | 80 km/h top speed, backrest",
        description: "Premium family scooter with comfort.",
        image: "https://placehold.co/400x250?text=Ather+Rizta+Z"
    },
    {
        brand: "Ather",
        model: "Rizta Z 3.7",
        category: "Family Scooter",
        engine: "3.7 kWh",
        power: "3.7 kWh",
        range: "125 km",
        topSpeed: "80 km/h",
        price: "₹1,54,000",
        status: "Active",
        features: "125 km true range | 80 km/h top speed, deep storage",
        description: "Long-range family scooter.",
        image: "https://placehold.co/400x250?text=Ather+Rizta+Z+3.7"
    },
    // --- SPORT COMMUTER (Active) ---
    {
        brand: "Ather",
        model: "450S",
        category: "Sport Commuter",
        engine: "2.9 kWh",
        power: "2.9 kWh",
        range: "90 km",
        topSpeed: "90 km/h",
        price: "₹1,23,889 – ₹1,25,422",
        status: "Active",
        features: "90 km true range | 90 km/h speed, DeepView display",
        description: "Sporty city commuter.",
        image: "https://placehold.co/400x250?text=Ather+450S"
    },
    // --- PERFORMANCE EV (Active) ---
    {
        brand: "Ather",
        model: "450X 2.9",
        category: "Performance EV",
        engine: "2.9 kWh",
        power: "2.9 kWh",
        range: "111 km",
        topSpeed: "90 km/h",
        price: "₹1,31,999 – ₹1,48,499",
        status: "Active",
        features: "111 km true range | 90 km/h speed, TFT touch console",
        description: "High-performance electric scooter.",
        image: "https://placehold.co/400x250?text=Ather+450X"
    },
    {
        brand: "Ather",
        model: "450X 3.7",
        category: "Performance EV",
        engine: "3.7 kWh",
        power: "3.7 kWh",
        range: "115 km",
        topSpeed: "90 km/h",
        price: "₹1,50,546 – ₹1,60,036",
        status: "Active",
        features: "115 km true range | 90 km/h speed, Google Maps layout",
        description: "Premium performance EV with navigation.",
        image: "https://placehold.co/400x250?text=Ather+450X+3.7"
    },
    // --- FLAGSHIP TRACK (Active) ---
    {
        brand: "Ather",
        model: "450 Apex",
        category: "Flagship Track",
        engine: "3.7 kWh",
        power: "3.7 kWh",
        range: "110 km",
        topSpeed: "100 km/h",
        price: "₹1,85,000 – ₹1,90,412",
        status: "Active",
        features: "110 km true range | 100 km/h max speed, Warp+ mode",
        description: "Top-of-the-line performance scooter.",
        image: "https://placehold.co/400x250?text=Ather+450+Apex"
    },
    // --- MASS MARKET EV (Upcoming) ---
    {
        brand: "Ather",
        model: "EL Scooter",
        category: "Mass Market EV",
        engine: "~2.2 kWh",
        power: "~2.2 kWh",
        range: "N/A",
        topSpeed: "N/A",
        price: "₹90,000 – ₹1,00,000 (Est.)",
        status: "Upcoming",
        features: "Budget entry-level variant built for urban utility",
        description: "Upcoming budget electric scooter.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    // --- DISCONTINUED ---
    {
        brand: "Ather",
        model: "450 / 450 Plus",
        category: "Gen-1 Sport",
        engine: "2.4 kWh",
        power: "2.4 kWh",
        range: "N/A",
        topSpeed: "N/A",
        price: "₹1,13,000 (Last Known)",
        status: "Discontinued",
        features: "First generation baseline architecture performance launch",
        description: "Original Ather generation.",
        image: "https://placehold.co/400x250?text=Discontinued"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('–')[0].trim().split(' ')[0];
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Ather bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // 5 is Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            let combinedFeatures = bike.features;
            
            const finalDesc = "[" + bike.status + "] " + bike.description;
            const transmission = "Automatic";

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        bike.power, combinedFeatures, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " Ather bikes.");
    } catch (e) {
        console.error("Error seeding Ather bikes:", e);
    }
}

seedData();
