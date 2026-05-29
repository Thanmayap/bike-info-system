const db = require('../config/db');

const bikeData = [
    // --- LECTRIC XP LITE 2.0 (ULTRA-LIGHTWEIGHT) ---
    {
        brand: "Lectric",
        model: "XP Lite 2.0",
        category: "Ultra-Lightweight Folding",
        price: "₹66,000 approx",
        motorPower: "300W (819W Peak)",
        claimedRange: "45 - 80 miles",
        keyFeature: "Ultra-lightweight (49 lbs)",
        status: "Active",
        description: "Ultra-lightweight folding e-bike for easy portability.",
        image: "https://placehold.co/400x250?text=Lectric+XP+Lite"
    },
    // --- LECTRIC XP 4.0 (FLAGSHIP STANDARD) ---
    {
        brand: "Lectric",
        model: "XP 4.0",
        category: "Flagship Folding",
        price: "₹83,000 approx",
        motorPower: "500W (1092W Peak)",
        claimedRange: "50 - 85 miles",
        keyFeature: "Flagship standard folding model",
        status: "Active",
        description: "Flagship standard folding model with premium features.",
        image: "https://placehold.co/400x250?text=Lectric+XP+4.0"
    },
    // --- LECTRIC XPEAK (ALL-TERRAIN FAT TIRE) ---
    {
        brand: "Lectric",
        model: "XPeak",
        category: "All-Terrain Fat Tire",
        price: "₹1,16,000 approx",
        motorPower: "750W (1310W Peak)",
        claimedRange: "55 miles",
        keyFeature: "All-terrain Fat Tire e-Bike",
        status: "Active",
        description: "All-terrain fat tire e-bike for rough roads.",
        image: "https://placehold.co/400x250?text=Lectric+XPeak"
    },
    // --- LECTRIC ONE (PINION SMART.SHIFT) ---
    {
        brand: "Lectric",
        model: "ONE",
        category: "Premium Smart Gearbox",
        price: "₹1,41,000 approx",
        motorPower: "750W (Stealth M24)",
        claimedRange: "60 - 100 miles",
        keyFeature: "Pinion Smart.Shift gearbox",
        status: "Active",
        description: "Premium e-bike with Pinion Smart.Shift gearbox.",
        image: "https://placehold.co/400x250?text=Lectric+ONE"
    },
    // --- LECTRIC XP TRIKE (LOW-STEP FOLDING TRICYCLE) ---
    {
        brand: "Lectric",
        model: "XP Trike",
        category: "Folding Electric Tricycle",
        price: "₹1,24,500 approx",
        motorPower: "500W (1092W Peak)",
        claimedRange: "60 miles",
        keyFeature: "Low-step folding electric tricycle",
        status: "Active",
        description: "Low-step folding electric tricycle for stability.",
        image: "https://placehold.co/400x250?text=Lectric+XP+Trike"
    },
    // --- LECTRIC XPEDITION (HEAVY-DUTY CARGO) ---
    {
        brand: "Lectric",
        model: "XPedition",
        category: "Heavy-Duty Cargo",
        price: "₹1,16,000 approx",
        motorPower: "750W (1310W Peak)",
        claimedRange: "75 - 150 miles",
        keyFeature: "Heavy-duty dual-battery cargo bike",
        status: "Active",
        description: "Heavy-duty dual-battery cargo bike for carrying loads.",
        image: "https://placehold.co/400x250?text=Lectric+XPedition"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|approx/g, '').trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Lectric bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange);
            if (bike.keyFeature) featureArr.push(bike.keyFeature);
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
        console.log("\\nSuccessfully seeded " + count + " Lectric bikes.");
    } catch (e) {
        console.error("Error seeding Lectric bikes:", e);
    }
}

seedData();
