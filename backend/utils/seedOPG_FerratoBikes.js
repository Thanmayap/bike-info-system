const db = require('../config/db');

const bikeData = [
    // --- FERRATO DISRUPTOR (PREMIUM SPORTBIKE) ---
    {
        brand: "Ferrato",
        model: "Disruptor",
        category: "Premium Sportbike",
        price: "₹1,54,999",
        topSpeed: "95 kmph",
        claimedRange: "129 km",
        status: "Active",
        description: "Premium sportbike with aggressive styling.",
        image: "https://placehold.co/400x250?text=Ferrato+Disruptor"
    },
    // --- OPG MOTOFAAST (PREMIUM MAXI-SCOOTER) ---
    {
        brand: "OPG",
        model: "Motofaast",
        category: "Premium Maxi-Scooter",
        price: "₹1,33,999",
        topSpeed: "70 kmph",
        claimedRange: "110 - 130 km",
        status: "Active",
        description: "Premium maxi-scooter for long-distance commuting.",
        image: "https://placehold.co/400x250?text=OPG+Motofaast"
    },
    // --- OPG FAAST F4 (LONG-RANGE SMART SCOOTER) ---
    {
        brand: "OPG",
        model: "Faast F4",
        category: "Long-Range Smart Scooter",
        price: "₹1,09,999",
        topSpeed: "70 kmph",
        claimedRange: "140 - 160 km",
        status: "Active",
        description: "Long-range smart scooter with connectivity.",
        image: "https://placehold.co/400x250?text=OPG+Faast+F4"
    },
    // --- OPG FAAST F3 (MID-TIER SMART SCOOTER) ---
    {
        brand: "OPG",
        model: "Faast F3",
        category: "Mid-Tier Smart Scooter",
        price: "₹1,04,999",
        topSpeed: "70 kmph",
        claimedRange: "120 km",
        status: "Active",
        description: "Mid-tier smart scooter with essential features.",
        image: "https://placehold.co/400x250?text=OPG+Faast+F3"
    },
    // --- OPG FAAST F2T / F2B (URBAN COMMUTER) ---
    {
        brand: "OPG",
        model: "Faast F2T / F2B",
        category: "Urban Commuter Scooter",
        price: "₹89,999",
        topSpeed: "60 kmph",
        claimedRange: "80 - 85 km",
        status: "Active",
        description: "Urban commuter scooter for daily use.",
        image: "https://placehold.co/400x250?text=OPG+Faast+F2"
    },
    // --- OPG FAAST F2F (VALUE COMMUTER) ---
    {
        brand: "OPG",
        model: "Faast F2F",
        category: "Value Commuter Scooter",
        price: "₹79,999",
        topSpeed: "55 kmph",
        claimedRange: "75 - 80 km",
        status: "Active",
        description: "Value commuter for budget-conscious buyers.",
        image: "https://placehold.co/400x250?text=OPG+Faast+F2F"
    },
    // --- OPG DEFY 22 (MODERN CITY SCOOTER) ---
    {
        brand: "OPG",
        model: "Defy 22",
        category: "Modern City Scooter",
        price: "₹74,999",
        topSpeed: "50 kmph",
        claimedRange: "100 km",
        status: "Active",
        description: "Modern city scooter for urban mobility.",
        image: "https://placehold.co/400x250?text=OPG+Defy+22"
    },
    // --- OPG FREEDUM LI (LIGHTWEIGHT LITHIUM) ---
    {
        brand: "OPG",
        model: "Freedum LI",
        category: "Lightweight Lithium Entry",
        price: "₹69,999",
        topSpeed: "25 kmph",
        claimedRange: "60 km",
        status: "Active",
        description: "Lightweight lithium entry-level scooter.",
        image: "https://placehold.co/400x250?text=OPG+Freedum+LI"
    },
    // --- OPG FREEDUM LA (BUDGET LEAD-ACID) ---
    {
        brand: "OPG",
        model: "Freedum LA",
        category: "Budget Lead-Acid Entry",
        price: "₹49,999",
        topSpeed: "25 kmph",
        claimedRange: "50 km",
        status: "Active",
        description: "Budget lead-acid entry-level scooter.",
        image: "https://placehold.co/400x250?text=OPG+Freedum+LA"
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
        
        console.log("Seeding OPG & Ferrato bikes...");
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
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = "Electric";
            const transmission = bike.category.includes("Sportbike") ? "Manual/Geared" : "Automatic";
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
        console.log("\\nSuccessfully seeded " + count + " OPG & Ferrato bikes.");
    } catch (e) {
        console.error("Error seeding OPG & Ferrato bikes:", e);
    }
}

seedData();
