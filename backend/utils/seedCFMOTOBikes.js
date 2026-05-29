const db = require('../config/db');

const bikeData = [
    // --- CFMOTO 300NK (THE AGGRESSIVE URBAN COMMUTER) ---
    {
        brand: "CFMOTO",
        model: "300NK",
        category: "Aggressive Urban Commuter",
        engine: "292.4 cc Liquid-Cooled Single-Cylinder DOHC",
        power: "27.5 bhp @ 8,750 rpm",
        torque: "25 Nm @ 7,000 rpm",
        transmission: "6-speed constant mesh gearbox",
        fuelTank: "12.5 litres",
        mileage: "~30 kmpl",
        price: "₹2,29,000 onwards",
        status: "Active",
        features: "Lightweight trellis frame, Upside Down (USD) front forks, Continental dual-channel ABS",
        smartTech: "5-inch TFT color display, Switchable Eco & Sport riding modes, Premium all-LED lighting system",
        description: "Aggressive urban commuter with sporty performance.",
        image: "https://placehold.co/400x250?text=CFMOTO+300NK"
    },
    // --- CFMOTO 650NK (THE MIDDLEWEIGHT STREET PUNCHER) ---
    {
        brand: "CFMOTO",
        model: "650NK",
        category: "Middleweight Street Puncher",
        engine: "649.3 cc Liquid-Cooled Parallel-Twin DOHC",
        power: "60.3 bhp @ 8,750 rpm",
        torque: "56 Nm @ 7,000 rpm",
        transmission: "6-speed gearbox with slipper clutch",
        fuelTank: "17 litres",
        mileage: "~21 kmpl",
        price: "₹4,29,000 onwards",
        status: "Active",
        features: "High-tensile steel frame, KYB telescopic front forks, Dual front discs with J.Juan calipers",
        smartTech: "Minimalist digital instrument console, Advanced ECU engine maps, Ergonomic street-fighter stance",
        description: "Middleweight street puncher with aggressive styling.",
        image: "https://placehold.co/400x250?text=CFMOTO+650NK"
    },
    // --- CFMOTO 650MT (THE MULTI-TERRAIN ADVENTURE TOURER) ---
    {
        brand: "CFMOTO",
        model: "650MT",
        category: "Multi-Terrain Adventure Tourer",
        engine: "649.3 cc Parallel-Twin Platform (Touring Tuned)",
        power: "61.6 bhp @ 8,750 rpm",
        torque: "62 Nm @ 7,000 rpm",
        transmission: "6-speed gearbox",
        fuelTank: "18 litres",
        mileage: "~20 kmpl",
        price: "₹5,29,000 onwards",
        status: "Active",
        features: "Long-travel adjustable USD front suspension, Side crash guards, High-ground clearance multi-terrain tyres",
        smartTech: "Tall adjustable windscreen, Fully integrated luggage mounts, Consolidated digital trip meter",
        description: "Multi-terrain adventure tourer for long journeys.",
        image: "https://placehold.co/400x250?text=CFMOTO+650MT"
    },
    // --- CFMOTO 650GT (THE PREMIUM GRAND TOURER) ---
    {
        brand: "CFMOTO",
        model: "650GT",
        category: "Premium Grand Tourer",
        engine: "649.3 cc Parallel-Twin (Highway Optimized)",
        power: "61.6 bhp @ 8,750 rpm",
        torque: "58.5 Nm @ 7,000 rpm",
        transmission: "6-speed gearbox",
        fuelTank: "19 litres",
        mileage: "~21 kmpl",
        price: "₹5,59,000 onwards",
        status: "Active",
        features: "Low-slung 795mm seat height, Premium KYB conventional layout, Split LED auto-headlight configuration",
        smartTech: "Premium manually adjustable windscreen, USB charging ports, Full-color interactive TFT dashboard",
        description: "Premium grand tourer for highway cruising.",
        image: "https://placehold.co/400x250?text=CFMOTO+650GT"
    },
    // --- CFMOTO 450MT (THE ULTIMATE LIGHTWEIGHT ADV - UPCOMING) ---
    {
        brand: "CFMOTO",
        model: "450MT",
        category: "Ultimate Lightweight ADV",
        engine: "449.5 cc Parallel-Twin 270-degree Crank Engine",
        power: "44 bhp @ 8,500 rpm",
        torque: "44 Nm @ 6,250 rpm",
        transmission: "6-speed gearbox",
        fuelTank: "N/A",
        mileage: "N/A",
        price: "₹4,50,000 onwards (Est.)",
        status: "Upcoming",
        features: "21-inch Front & 18-inch Rear Spoked Wheels, 220mm High Ground Clearance, Fully adjustable KYB suspension",
        smartTech: "Switchable Bosch rear ABS & Traction Control, Over-the-air (OTA) update support, 5-inch curved TFT display",
        description: "Upcoming lightweight adventure tourer.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    }
];

function parseCategory(bike) {
    if (bike.model.includes("MT")) return 4; // Adventure
    if (bike.model.includes("GT") || bike.model.includes("NK")) return 1; // Sport/Tourer/Naked
    return 1;
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('onwards')[0].trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.split(' ')[0].replace(/,/g, '')) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding CFMOTO bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike); 
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.fuelTank && bike.fuelTank !== "N/A") featureArr.push("Tank: " + bike.fuelTank);
            if (bike.mileage && bike.mileage !== "N/A") featureArr.push("Mileage: " + bike.mileage);
            featureArr.push(bike.features);
            if (bike.smartTech) featureArr.push("Tech: " + bike.smartTech);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.power;
            const torque = bike.torque;
            const transmission = bike.transmission.includes("6-speed") ? "6-Speed" : "Manual";
            const finalDesc = "[" + bike.status + "] " + bike.description;

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, torque, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        power, torque, combinedFeatures, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " CFMOTO bikes.");
    } catch (e) {
        console.error("Error seeding CFMOTO bikes:", e);
    }
}

seedData();
