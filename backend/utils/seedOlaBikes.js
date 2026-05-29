const db = require('../config/db');

const bikeData = [
    // --- ROADSTER X SERIES (2.5 KWH) ---
    {
        brand: "Ola Electric",
        model: "Roadster X (2.5 kWh)",
        category: "Electric Motorcycle",
        price: "From ₹99,999",
        topSpeed: "118 kmph",
        claimedRange: "140 - 200 km",
        battery: "2.5 kWh",
        motor: "7 kW Peak Power",
        status: "Active",
        description: "Entry-level roadster with compact battery.",
        image: "https://placehold.co/400x250?text=Ola+Roadster+X+2.5"
    },
    // --- ROADSTER X SERIES (3.1/4.5 KWH) ---
    {
        brand: "Ola Electric",
        model: "Roadster X (3.1/4.5 kWh)",
        category: "Electric Motorcycle",
        price: "₹1,09,999 - ₹1,24,999",
        topSpeed: "125 kmph",
        claimedRange: "Up to 252 km",
        battery: "3.1 - 4.5 kWh",
        motor: "11 kW Power",
        status: "Active",
        description: "Extended range roadster variant.",
        image: "https://placehold.co/400x250?text=Ola+Roadster+X+3.1"
    },
    // --- ROADSTER SERIES (3.5 KWH) ---
    {
        brand: "Ola Electric",
        model: "Roadster (3.5 kWh)",
        category: "Electric Motorcycle",
        price: "From ₹1,04,999",
        topSpeed: "116 kmph",
        claimedRange: "151 km",
        battery: "3.5 kWh",
        motor: "13 kW Mid-Drive",
        status: "Active",
        description: "Standard roadster with mid-drive motor.",
        image: "https://placehold.co/400x250?text=Ola+Roadster+3.5"
    },
    // --- ROADSTER SERIES (4.5/6 KWH) ---
    {
        brand: "Ola Electric",
        model: "Roadster (4.5/6 kWh)",
        category: "Electric Motorcycle",
        price: "₹1,19,999 - ₹1,39,999",
        topSpeed: "126 kmph",
        claimedRange: "190 - 248 km",
        battery: "4.5 - 6.0 kWh",
        motor: "13 kW Mid-Drive",
        status: "Active",
        description: "Long-range roadster variant.",
        image: "https://placehold.co/400x250?text=Ola+Roadster+4.5"
    },
    // --- ROADSTER PRO (FLAGSHIP) ---
    {
        brand: "Ola Electric",
        model: "Roadster Pro",
        category: "Hyper Motorcycle",
        price: "From ₹1,99,999",
        topSpeed: "194 kmph",
        claimedRange: "316 - 579 km",
        battery: "8.0 - 16.0 kWh",
        motor: "52 kW Hyper-Motor",
        status: "Active",
        description: "Flagship hyper-motorcycle with massive range.",
        image: "https://placehold.co/400x250?text=Ola+Roadster+Pro"
    },
    // --- S1 Z (ENTRY-LEVEL SCOOTER) ---
    {
        brand: "Ola Electric",
        model: "S1 Z",
        category: "Electric Scooter",
        price: "From ₹59,999",
        topSpeed: "70 kmph",
        claimedRange: "146 km",
        battery: "3.0 kWh",
        motor: "3 kW Motor",
        status: "Active",
        description: "Entry-level electric scooter.",
        image: "https://placehold.co/400x250?text=Ola+S1+Z"
    },
    // --- S1 X (2.0 KWH) ---
    {
        brand: "Ola Electric",
        model: "S1 X (2.0 kWh)",
        category: "Electric Scooter",
        price: "From ₹84,999",
        topSpeed: "85 kmph",
        claimedRange: "91 - 108 km",
        battery: "2.0 kWh",
        motor: "5.5 kW Peak BLDC",
        status: "Active",
        description: "Standard S1 X variant.",
        image: "https://placehold.co/400x250?text=Ola+S1+X+2.0"
    },
    // --- S1 X (3.0/4.0 KWH) ---
    {
        brand: "Ola Electric",
        model: "S1 X (3.0/4.0 kWh)",
        category: "Electric Scooter",
        price: "From ₹89,957",
        topSpeed: "90 kmph",
        claimedRange: "150 - 242 km",
        battery: "3.0 - 4.0 kWh",
        motor: "5.5 kW Peak",
        status: "Active",
        description: "Extended range S1 X variant.",
        image: "https://placehold.co/400x250?text=Ola+S1+X+3.0"
    },
    // --- S1 AIR (PREMIUM SCOOTER) ---
    {
        brand: "Ola Electric",
        model: "S1 Air",
        category: "Premium Electric Scooter",
        price: "From ₹1,09,999",
        topSpeed: "95 kmph",
        claimedRange: "125 - 165 km",
        battery: "3.0 - 4.0 kWh",
        motor: "4.5 kW Hub Motor",
        status: "Active",
        description: "Premium commuter scooter.",
        image: "https://placehold.co/400x250?text=Ola+S1+Air"
    },
    // --- S1 PRO GEN 3 (FLAGSHIP SCOOTER) ---
    {
        brand: "Ola Electric",
        model: "S1 Pro Gen 3",
        category: "Flagship Electric Scooter",
        price: "From ₹1,24,999",
        topSpeed: "120 kmph",
        claimedRange: "195 km",
        battery: "4.0 kWh",
        motor: "13 kW Peak Power",
        status: "Active",
        description: "Flagship scooter with advanced features.",
        image: "https://placehold.co/400x250?text=Ola+S1+Pro+Gen3"
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
        
        console.log("Seeding Ola bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange);
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
        console.log("\\nSuccessfully seeded " + count + " Ola bikes.");
    } catch (e) {
        console.error("Error seeding Ola bikes:", e);
    }
}

seedData();
