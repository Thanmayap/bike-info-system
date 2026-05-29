const db = require('../config/db');

const bikeData = [
    // --- HOP ELECTRIC LYF (URBAN E-SCOOTER) ---
    {
        brand: "Hop Electric",
        model: "LYF",
        category: "Urban E-Scooter",
        price: "₹74,999 – ₹90,000",
        topSpeed: "25 - 50 kmph",
        claimedRange: "70 - 125 km",
        batteryCapacity: "1.44 - 2.4 kWh Lithium-ion",
        status: "Active",
        description: "Urban E-Scooter for city commuting.",
        image: "https://placehold.co/400x250?text=Hop+Electric+LYF"
    },
    // --- HOP ELECTRIC LEO (COMMUTER E-SCOOTER) ---
    {
        brand: "Hop Electric",
        model: "LEO",
        category: "Commuter E-Scooter",
        price: "₹84,360 – ₹1,05,000",
        topSpeed: "25 - 60 kmph",
        claimedRange: "60 - 125 km",
        batteryCapacity: "1.44 - 2.0 kWh Lithium-ion",
        status: "Active",
        description: "Commuter E-Scooter with extended range.",
        image: "https://placehold.co/400x250?text=Hop+Electric+LEO"
    },
    // --- HOP ELECTRIC OXO (FLAGSHIP E-MOTORCYCLE) ---
    {
        brand: "Hop Electric",
        model: "OXO",
        category: "Flagship E-Motorcycle",
        price: "₹1,27,922 – ₹1,63,139",
        topSpeed: "88 - 95 kmph",
        claimedRange: "120 - 150 km",
        batteryCapacity: "3.75 kWh Lithium-ion (IP67)",
        status: "Active",
        description: "Flagship E-Motorcycle with high performance.",
        image: "https://placehold.co/400x250?text=Hop+Electric+OXO"
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
        
        console.log("Seeding Hop Electric bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.batteryCapacity) featureArr.push("Battery: " + bike.batteryCapacity);
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange);
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = "Electric";
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
        console.log("\\nSuccessfully seeded " + count + " Hop Electric bikes.");
    } catch (e) {
        console.error("Error seeding Hop Electric bikes:", e);
    }
}

seedData();
