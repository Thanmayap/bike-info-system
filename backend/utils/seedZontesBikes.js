const db = require('../config/db');

const bikeData = [
    // --- ZONTES 350X (SPORTS TOURER) ---
    {
        brand: "Zontes",
        model: "350X",
        category: "Sports Tourer / Aerodynamic",
        price: "From ₹2,37,000",
        engine: "348 cc",
        claimedMileage: "36 - 40 kmpl",
        status: "Active",
        description: "Sports tourer with aerodynamic styling.",
        image: "https://placehold.co/400x250?text=Zontes+350X"
    },
    // --- ZONTES 350R (NAKED STREETFIGHTER) ---
    {
        brand: "Zontes",
        model: "350R",
        category: "Naked Streetfighter / Sports",
        price: "From ₹2,57,000",
        engine: "348 cc",
        claimedMileage: "40 kmpl",
        status: "Active",
        description: "Naked streetfighter with aggressive sports performance.",
        image: "https://placehold.co/400x250?text=Zontes+350R"
    },
    // --- ZONTES 350T (URBAN ADVENTURE) ---
    {
        brand: "Zontes",
        model: "350T",
        category: "Urban Adventure Tourer",
        price: "From ₹2,75,000",
        engine: "348 cc",
        claimedMileage: "23 kmpl",
        status: "Active",
        description: "Urban adventure tourer for city and highway commuting.",
        image: "https://placehold.co/400x250?text=Zontes+350T"
    },
    // --- ZONTES 350T ADV (OFF-ROAD ADVENTURE) ---
    {
        brand: "Zontes",
        model: "350T ADV",
        category: "Off-Road Adventure Tourer",
        price: "From ₹2,99,000",
        engine: "348 cc",
        claimedMileage: "23 kmpl",
        status: "Active",
        description: "Off-road adventure tourer with enhanced capability.",
        image: "https://placehold.co/400x250?text=Zontes+350T+ADV"
    },
    // --- ZONTES GK350 (NEO-RETRO CAFE RACER) ---
    {
        brand: "Zontes",
        model: "GK350",
        category: "Premium Neo-Retro Cafe Racer",
        price: "From ₹3,22,000",
        engine: "348 cc",
        claimedMileage: "31.25 kmpl",
        status: "Active",
        description: "Premium neo-retro cafe racer with classic styling.",
        image: "https://placehold.co/400x250?text=Zontes+GK350"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').split('-')[0].trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    const match = engineStr.match(/(\d+(?:\.\d+)?)\s*cc/i);
    return match ? parseFloat(match[1]) : 0;
}

function parseCategory(catStr) {
    catStr = catStr.toLowerCase();
    if (catStr.includes('electric')) return 5;
    if (catStr.includes('scooter')) return 4;
    if (catStr.includes('adventure') || catStr.includes('tourer')) return 3;
    if (catStr.includes('retro') || catStr.includes('cruiser') || catStr.includes('cafe racer')) return 2;
    return 1; // Sport/Naked default
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Zontes bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine); 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedMileage) featureArr.push("Mileage: " + bike.claimedMileage);
            if (bike.engine) featureArr.push(bike.engine);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = "N/A";
            const transmission = "Manual/Geared"; 
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
        console.log("\\nSuccessfully seeded " + count + " Zontes bikes.");
    } catch (e) {
        console.error("Error seeding Zontes bikes:", e);
    }
}

seedData();
