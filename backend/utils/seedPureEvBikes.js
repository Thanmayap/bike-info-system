const db = require('../config/db');

const bikeData = [
    // --- PURE EV EPLUTO (ENTRY-LEVEL COMMUTER) ---
    {
        brand: "PURE EV",
        model: "Epluto",
        category: "Entry-Level Commuter Scooter",
        price: "From ₹59,999",
        topSpeed: "47 kmph",
        claimedRange: "85 km",
        battery: "1.8 kWh Lithium-Ion",
        status: "Active",
        description: "Entry-level commuter scooter for daily use.",
        image: "https://placehold.co/400x250?text=PURE+EV+Epluto"
    },
    // --- PURE EV ETRANCE NEO (SMART URBAN) ---
    {
        brand: "PURE EV",
        model: "ETrance Neo",
        category: "Smart Urban Scooter",
        price: "₹79,699 - ₹1,06,000",
        topSpeed: "60 kmph",
        claimedRange: "101 - 171 km",
        battery: "3.0 kWh Lithium-Ion",
        status: "Active",
        description: "Smart urban scooter with extended range.",
        image: "https://placehold.co/400x250?text=PURE+EV+ETrance+Neo"
    },
    // --- PURE EV EPLUTO 7G (RETRO-CLASSIC) ---
    {
        brand: "PURE EV",
        model: "Epluto 7G",
        category: "Retro-Classic Scooter",
        price: "₹80,799 - ₹97,499",
        topSpeed: "60 kmph",
        claimedRange: "90 - 151 km",
        battery: "2.4 kWh Lithium-Ion",
        status: "Active",
        description: "Retro-classic scooter with vintage styling.",
        image: "https://placehold.co/400x250?text=PURE+EV+Epluto+7G"
    },
    // --- PURE EV EPLUTO 7G MAX (FLAGSHIP LONG-RANGE) ---
    {
        brand: "PURE EV",
        model: "Epluto 7G Max",
        category: "Flagship Long-Range Scooter",
        price: "From ₹1,17,699",
        topSpeed: "72 kmph",
        claimedRange: "111 - 151 km",
        battery: "4.0 kWh Lithium-Ion",
        status: "Active",
        description: "Flagship long-range scooter with maximum capacity.",
        image: "https://placehold.co/400x250?text=PURE+EV+Epluto+7G+Max"
    },
    // --- PURE EV ECODRYFT (EVERYDAY COMMUTER) ---
    {
        brand: "PURE EV",
        model: "EcoDryft",
        category: "Everyday Commuter Motorcycle",
        price: "₹1,18,699 - ₹1,27,999",
        topSpeed: "75 kmph",
        claimedRange: "105 - 171 km",
        battery: "3.5 kWh Portable",
        status: "Active",
        description: "Everyday commuter motorcycle with portable battery.",
        image: "https://placehold.co/400x250?text=PURE+EV+EcoDryft"
    },
    // --- PURE EV ETRYST 350 (FLAGSHIP STREETBIKE) ---
    {
        brand: "PURE EV",
        model: "eTryst 350",
        category: "Flagship Electric Streetbike",
        price: "From ₹1,49,999",
        topSpeed: "80 kmph",
        claimedRange: "131 - 171 km",
        battery: "3.5 kWh Fixed Lithium",
        status: "Active",
        description: "Flagship electric streetbike with sporty performance.",
        image: "https://placehold.co/400x250?text=PURE+EV+eTryst+350"
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
        
        console.log("Seeding PURE EV bikes...");
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
            
            const power = "Electric";
            const transmission = bike.category.includes("Motorcycle") || bike.category.includes("Streetbike") ? "Manual/Geared" : "Automatic";
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
        console.log("\\nSuccessfully seeded " + count + " PURE EV bikes.");
    } catch (e) {
        console.error("Error seeding PURE EV bikes:", e);
    }
}

seedData();
