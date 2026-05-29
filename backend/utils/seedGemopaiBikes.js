const db = require('../config/db');

const bikeData = [
    // --- GEMOPAI MISO (ENTRY-LEVEL) ---
    {
        brand: "Gemopai",
        model: "Miso",
        category: "Entry-Level Scooter",
        price: "₹44,000",
        topSpeed: "25 kmph",
        realWorldRange: "75 km",
        batteryCapacity: "1.4 kWh (Li-ion)",
        motorPower: "250W BLDC Hub",
        status: "Active",
        description: "Entry-level electric scooter for basic commuting.",
        image: "https://placehold.co/400x250?text=Gemopai+Miso"
    },
    // --- GEMOPAI RYDER (STANDARD COMMUTER) ---
    {
        brand: "Gemopai",
        model: "Ryder",
        category: "Standard Commuter",
        price: "₹70,850",
        topSpeed: "25 kmph",
        realWorldRange: "90 km",
        batteryCapacity: "1.4 kWh (Li-ion)",
        motorPower: "250W BLDC Hub",
        status: "Active",
        description: "Standard commuter with extended range.",
        image: "https://placehold.co/400x250?text=Gemopai+Ryder"
    },
    // --- GEMOPAI RYDER SUPERMAX (PERFORMANCE) ---
    {
        brand: "Gemopai",
        model: "Ryder SuperMax",
        category: "Performance Scooter",
        price: "₹79,999",
        topSpeed: "60 kmph",
        realWorldRange: "100 km",
        batteryCapacity: "1.8 kWh (Li-ion)",
        motorPower: "1600W BLDC Hub",
        status: "Active",
        description: "High-performance scooter with increased speed and range.",
        image: "https://placehold.co/400x250?text=Gemopai+Ryder+SuperMax"
    },
    // --- GEMOPAI ASTRID LITE (PREMIUM) ---
    {
        brand: "Gemopai",
        model: "Astrid Lite",
        category: "Premium Scooter",
        price: "₹92,290 – ₹1,11,195",
        topSpeed: "70 kmph",
        realWorldRange: "90 – 200 km",
        batteryCapacity: "1.7 – 2.88 kWh (Li-ion)",
        motorPower: "2400W BLDC Hub",
        status: "Active",
        description: "Premium scooter with long-range capability.",
        image: "https://placehold.co/400x250?text=Gemopai+Astrid+Lite"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('–')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Gemopai bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.batteryCapacity) featureArr.push("Battery: " + bike.batteryCapacity);
            if (bike.realWorldRange) featureArr.push("Range: " + bike.realWorldRange);
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.motorPower || "Electric";
            const transmission = "Automatic";
            const finalDesc = "[" + bike.status + "] " + bike.description;

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
        console.log("\\nSuccessfully seeded " + count + " Gemopai bikes.");
    } catch (e) {
        console.error("Error seeding Gemopai bikes:", e);
    }
}

seedData();
