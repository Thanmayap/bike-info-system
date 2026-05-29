const db = require('../config/db');

const bikeData = [
    // --- iVOOMi S1 LITE (GRAPHENE) ---
    {
        brand: "iVOOMi",
        model: "S1 Lite (Graphene)",
        category: "Entry-Level Scooter",
        price: "₹54,999",
        topSpeed: "42 kmph",
        claimedRange: "75 km",
        batteryCapacity: "1.8 - 2.1 kWh",
        motorPower: "1.8 kW",
        status: "Active",
        description: "Entry-level graphene battery scooter for daily commute.",
        image: "https://placehold.co/400x250?text=iVOOMi+S1+Lite+Graphene"
    },
    // --- iVOOMi S1 LITE (LITHIUM-ION) ---
    {
        brand: "iVOOMi",
        model: "S1 Lite (Lithium-Ion)",
        category: "Standard Scooter",
        price: "₹64,999",
        topSpeed: "50 kmph",
        claimedRange: "85 km",
        batteryCapacity: "2.1 kWh",
        motorPower: "1.8 kW",
        status: "Active",
        description: "Standard lithium-ion commuter with better range.",
        image: "https://placehold.co/400x250?text=iVOOMi+S1+Lite+Li-ion"
    },
    // --- iVOOMi S1 2.0 ---
    {
        brand: "iVOOMi",
        model: "S1 2.0",
        category: "Upgraded Scooter",
        price: "₹74,999",
        topSpeed: "58 kmph",
        claimedRange: "110 km",
        batteryCapacity: "2.1 kWh",
        motorPower: "1.8 kW",
        status: "Active",
        description: "Upgraded version with extended range.",
        image: "https://placehold.co/400x250?text=iVOOMi+S1+2.0"
    },
    // --- iVOOMi S1 STANDARD ---
    {
        brand: "iVOOMi",
        model: "S1 Standard",
        category: "Standard Scooter",
        price: "₹79,999",
        topSpeed: "58 kmph",
        claimedRange: "110 km",
        batteryCapacity: "1.5 - 2.0 kWh",
        motorPower: "1.8 kW",
        status: "Active",
        description: "Standard model with multiple battery options.",
        image: "https://placehold.co/400x250?text=iVOOMi+S1+Standard"
    },
    // --- iVOOMi S1 LITE (TOP VARIANT) ---
    {
        brand: "iVOOMi",
        model: "S1 Lite (Top Variant)",
        category: "Premium Scooter",
        price: "₹84,999",
        topSpeed: "55 kmph",
        claimedRange: "180 km",
        batteryCapacity: "1.5 - 2.1 kWh",
        motorPower: "1.8 kW",
        status: "Active",
        description: "Top variant with longest range capability.",
        image: "https://placehold.co/400x250?text=iVOOMi+S1+Lite+Top"
    },
    // --- iVOOMi JEET X STANDARD ---
    {
        brand: "iVOOMi",
        model: "Jeet X Standard",
        category: "Performance Scooter",
        price: "₹84,999",
        topSpeed: "60 kmph",
        claimedRange: "100 km",
        batteryCapacity: "2.0 kWh (Single)",
        motorPower: "1.6 - 1.8 kW",
        status: "Active",
        description: "Performance-oriented standard variant.",
        image: "https://placehold.co/400x250?text=iVOOMi+Jeet+X+Standard"
    },
    // --- iVOOMi JEET X ZE (2.5 KWH) ---
    {
        brand: "iVOOMi",
        model: "Jeet X ZE (2.5 kWh)",
        category: "Premium Performance",
        price: "₹89,999",
        topSpeed: "65 kmph",
        claimedRange: "120 km",
        batteryCapacity: "2.5 kWh (Removable)",
        motorPower: "1.8 kW",
        status: "Active",
        description: "Premium variant with removable battery.",
        image: "https://placehold.co/400x250?text=iVOOMi+Jeet+X+ZE"
    },
    // --- iVOOMi JEET X ZE (3.0 KWH) ---
    {
        brand: "iVOOMi",
        model: "Jeet X ZE (3.0 kWh)",
        category: "High Performance",
        price: "₹1,04,999",
        topSpeed: "70 kmph",
        claimedRange: "170 km",
        batteryCapacity: "3.0 kWh (Dual)",
        motorPower: "1.8 kW",
        status: "Active",
        description: "High-performance dual battery variant.",
        image: "https://placehold.co/400x250?text=iVOOMi+Jeet+X+ZE+3.0"
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
        
        console.log("Seeding iVOOMi bikes...");
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
        console.log("\\nSuccessfully seeded " + count + " iVOOMi bikes.");
    } catch (e) {
        console.error("Error seeding iVOOMi bikes:", e);
    }
}

seedData();
