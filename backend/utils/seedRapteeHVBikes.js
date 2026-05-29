const db = require('../config/db');

const bikeData = [
    // --- RAPTEE.HV T30 STANDARD (PERFORMANCE MOTORCYCLE) ---
    {
        brand: "Raptee.HV",
        model: "T30 Standard",
        category: "Performance Motorcycle",
        price: "From ₹2,39,000",
        topSpeed: "135 kmph",
        realWorldRange: "200 km per charge",
        acceleration: "3.5 seconds (0-60 kmph)",
        status: "Active",
        description: "High-performance electric motorcycle with rapid acceleration.",
        image: "https://placehold.co/400x250?text=Raptee+HV+T30"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').split('-')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Raptee.HV bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.realWorldRange) featureArr.push("Range: " + bike.realWorldRange.replace(' per charge', ''));
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            if (bike.acceleration) featureArr.push("0-60: " + bike.acceleration.replace(' seconds (0-60 kmph)', 's'));
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = "Electric";
            const transmission = "Manual/Geared"; // Often performance e-bikes don't have gears, but categorizing it as manual for UI if preferred, or Automatic. Let's use Automatic for EV default.
            const finalDesc = "[" + bike.status + "] " + bike.description;

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, "Automatic", 
                        power, combinedFeatures, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " Raptee.HV bikes.");
    } catch (e) {
        console.error("Error seeding Raptee.HV bikes:", e);
    }
}

seedData();
