const db = require('../config/db');

const bikeData = [
    // --- ODYSSE RACER NEO (ENTRY-LEVEL URBAN SCOOTER) ---
    {
        brand: "Odysse",
        model: "Racer Neo",
        category: "Entry-Level Urban Scooter",
        price: "From ₹52,000",
        topSpeed: "45 kmph",
        claimedRange: "70 km / charge",
        battery: "1.92 kWh",
        motor: "1.5 kW BLDC",
        status: "Active",
        description: "Entry-level urban scooter for daily commute.",
        image: "https://placehold.co/400x250?text=Odysse+Racer+Neo"
    },
    // --- ODYSSE E2GO (LOW-SPEED COMMUTER) ---
    {
        brand: "Odysse",
        model: "E2Go",
        category: "Low-Speed Commuter",
        price: "From ₹71,100",
        topSpeed: "25 kmph",
        claimedRange: "60 - 70 km",
        battery: "1.26 kWh",
        motor: "250W BLDC Hub",
        status: "Active",
        description: "Low-speed basic commuter.",
        image: "https://placehold.co/400x250?text=Odysse+E2Go"
    },
    // --- ODYSSE ELECTRIC V2 (LONG-RANGE COMFORT) ---
    {
        brand: "Odysse",
        model: "Electric V2",
        category: "Long-Range Comfort Scooter",
        price: "From ₹77,250",
        topSpeed: "25 kmph",
        claimedRange: "75 - 150 km",
        battery: "2.6 kWh LFP",
        motor: "250W BLDC",
        status: "Active",
        description: "Long-range comfort scooter with LFP battery.",
        image: "https://placehold.co/400x250?text=Odysse+Electric+V2"
    },
    // --- ODYSSE SNAP (SMART COMMUTER) ---
    {
        brand: "Odysse",
        model: "Snap",
        category: "Smart Commuter Scooter",
        price: "From ₹79,999",
        topSpeed: "45 kmph",
        claimedRange: "85 km / charge",
        battery: "2.0 kWh Li-ion",
        motor: "1.8 kW BLDC",
        status: "Active",
        description: "Smart commuter with connectivity.",
        image: "https://placehold.co/400x250?text=Odysse+Snap"
    },
    // --- ODYSSE ELECTRIC HAWK (PREMIUM CONNECTIVITY) ---
    {
        brand: "Odysse",
        model: "Electric Hawk",
        category: "Premium Connectivity Scooter",
        price: "From ₹99,400",
        topSpeed: "45 kmph",
        claimedRange: "100 - 170 km",
        battery: "Dual-Battery Variant Avail",
        motor: "N/A",
        status: "Active",
        description: "Premium connectivity scooter with extended range.",
        image: "https://placehold.co/400x250?text=Odysse+Electric+Hawk"
    },
    // --- ODYSSE ELECTRIC TROT (HEAVY-DUTY DELIVERY) ---
    {
        brand: "Odysse",
        model: "Electric Trot",
        category: "Heavy-Duty B2B Delivery Loader",
        price: "From ₹99,999",
        topSpeed: "25 kmph",
        claimedRange: "75 km / charge",
        battery: "1.44 kWh",
        motor: "250W Micro-Load",
        status: "Active",
        description: "Heavy-duty B2B delivery loader.",
        image: "https://placehold.co/400x250?text=Odysse+Electric+Trot"
    },
    // --- ODYSSE VADER (FLAGSHIP GEARED E-MOTORCYCLE) ---
    {
        brand: "Odysse",
        model: "Vader",
        category: "Flagship Geared E-Motorcycle",
        price: "From ₹1,19,000",
        topSpeed: "85 kmph",
        claimedRange: "125 km / charge",
        battery: "3.7 kWh AIS-156",
        motor: "3.0 kW",
        status: "Active",
        description: "Flagship geared electric motorcycle.",
        image: "https://placehold.co/400x250?text=Odysse+Vader"
    },
    // --- ODYSSE EVOQIS (FULLY-FAIRED SPORT) ---
    {
        brand: "Odysse",
        model: "Evoqis",
        category: "Fully-Faired Sport Motorcycle",
        price: "From ₹1,66,000",
        topSpeed: "75 - 90 kmph",
        claimedRange: "140 km / charge",
        battery: "4.32 kWh",
        motor: "3.0 kW BLDC",
        status: "Active",
        description: "Fully-faired sport motorcycle for performance.",
        image: "https://placehold.co/400x250?text=Odysse+Evoqis"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Odysse bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange.replace(' / charge', ''));
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            if (bike.battery) featureArr.push("Battery: " + bike.battery);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.motor || "Electric";
            const transmission = bike.category.includes("Motorcycle") ? "Manual/Geared" : "Automatic";
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
        console.log("\\nSuccessfully seeded " + count + " Odysse bikes.");
    } catch (e) {
        console.error("Error seeding Odysse bikes:", e);
    }
}

seedData();
