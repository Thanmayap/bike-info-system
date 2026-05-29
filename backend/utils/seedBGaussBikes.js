const db = require('../config/db');

const bikeData = [
    // --- BGauss OoWah (The All-Rounder Commuter) ---
    {
        brand: "BGauss",
        model: "OoWah",
        category: "All-Rounder Commuter",
        engine: "2.4 kW Peak / 1.5 kW Continuous PMSM Hub Motor",
        battery: "2.3 kWh Lithium-ion Removable Battery",
        range: "145 km ARAI Certified Range",
        charging: "0–80% in 4 hours 5 minutes via 500W charger",
        topSpeed: "60 kmph",
        gradeability: "14° Gradeability slope climbing capacity",
        weight: "97 kg Kerb Weight",
        waterWading: "300 mm Water Wading Limit",
        suspension: "Telescopic Front Suspension",
        smartTech: "CAN-enabled digital console, Distance-to-Empty tracker, Limphome mode",
        price: "₹94,990 onwards",
        status: "Active",
        description: "The all-rounder commuter with excellent range.",
        image: "https://placehold.co/400x250?text=BGauss+OoWah"
    },
    // --- BGauss BG C12 / Max C12 (The Spacious Family Cruiser) ---
    {
        brand: "BGauss",
        model: "BG C12",
        category: "Spacious Family Cruiser",
        engine: "2.5 kW Peak PMSM Hub Motor with LFP cell configuration",
        battery: "2.7 kWh CAN-Enabled Fixed Battery",
        range: "123 km Certified Range",
        charging: "Full charge in 6 hours 15 minutes to 6 hours 30 minutes",
        topSpeed: "60 kmph",
        acceleration: "0–40 kmph sprint in 8.5 seconds",
        weight: "N/A",
        chassis: "Long family-length seat, Heavy-duty Tubular Chassis",
        smartTech: "23L Massive Under-seat Storage, Roll-over crash detection, Child protection safety mode",
        price: "₹1,07,740 onwards",
        status: "Active",
        description: "The spacious family cruiser with massive storage.",
        image: "https://placehold.co/400x250?text=BGauss+BG+C12"
    },
    // --- BGauss RUV 350 (The Flagship All-Metal Rider) ---
    {
        brand: "BGauss",
        model: "RUV 350",
        category: "Flagship All-Metal Rider",
        engine: "3.5 kW Peak High-Performance Hub Motor",
        battery: "3.0 kWh Advanced Inbuilt Pack",
        range: "145 km Real-world Range",
        charging: "Fast-charger support from 2 hours 35 minutes onwards",
        topSpeed: "75 kmph",
        gradeability: "Dual-rider heavy-load gradeability",
        wheels: "16-inch Large Alloy Wheels",
        groundClearance: "160 mm High Ground Clearance",
        body: "100% Metal Body Panels",
        suspension: "5-Step adjustable Nitrox Gas suspension",
        smartTech: "Cruise control, smartphone app tracking telemetry",
        price: "₹1,43,990 onwards",
        status: "Active",
        description: "The flagship all-metal rider with premium features.",
        image: "https://placehold.co/400x250?text=BGauss+RUV+350"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('onwards')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding BGauss bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // 5 is Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.range) featureArr.push("Range: " + bike.range.replace(' km Real-world Range', ' km').replace(' km Certified Range', ' km').replace(' km ARAI Certified Range', ' km'));
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            if (bike.smartTech) featureArr.push("Tech: " + bike.smartTech);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.engine; // Store the electric motor details here
            
            const finalDesc = "[" + bike.status + "] " + bike.description;
            const transmission = "Automatic";

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        power, combinedFeatures, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " BGauss bikes.");
    } catch (e) {
        console.error("Error seeding BGauss bikes:", e);
    }
}

seedData();
