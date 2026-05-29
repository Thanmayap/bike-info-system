const db = require('../config/db');

const bikeData = [
    // --- QUANTUM ENERGY MILAN (RETRO URBAN) ---
    {
        brand: "Quantum Energy",
        model: "Milan",
        category: "Retro Urban Commuter",
        price: "From ₹89,000",
        topSpeed: "60 kmph",
        claimedRange: "100 km / charge",
        motor: "1.5 kW BLDC Hub",
        status: "Active",
        description: "Retro urban commuter with classic styling.",
        image: "https://placehold.co/400x250?text=Quantum+Energy+Milan"
    },
    // --- QUANTUM ENERGY PLASMA SR (DAILY MASS) ---
    {
        brand: "Quantum Energy",
        model: "Plasma SR",
        category: "Daily Mass Commuter",
        price: "From ₹89,999",
        topSpeed: "60 kmph",
        claimedRange: "115 - 125 km",
        motor: "1.5 kW BLDC Hub",
        status: "Active",
        description: "Daily mass commuter with extended range.",
        image: "https://placehold.co/400x250?text=Quantum+Energy+Plasma+SR"
    },
    // --- QUANTUM ENERGY PLASMA X (PREMIUM URBAN) ---
    {
        brand: "Quantum Energy",
        model: "Plasma X",
        category: "Premium Urban Commuter",
        price: "From ₹99,999",
        topSpeed: "65 kmph",
        claimedRange: "120 km / charge",
        motor: "1.5 kW BLDC Hub",
        status: "Active",
        description: "Premium urban commuter with advanced features.",
        image: "https://placehold.co/400x250?text=Quantum+Energy+Plasma+X"
    },
    // --- QUANTUM ENERGY BIZNESS X (COMMERCIAL UTILITY) ---
    {
        brand: "Quantum Energy",
        model: "Bziness X",
        category: "B2B Commercial Utility",
        price: "From ₹95,000",
        topSpeed: "60 kmph",
        claimedRange: "105 km / charge",
        motor: "1.5 kW BLDC Hub",
        status: "Active",
        description: "B2B commercial utility for small businesses.",
        image: "https://placehold.co/400x250?text=Quantum+Energy+Bziness+X"
    },
    // --- QUANTUM ENERGY BIZNESS XP (HEAVY-DUTY FLEET) ---
    {
        brand: "Quantum Energy",
        model: "Bziness XP",
        category: "Heavy-Duty Fleet Delivery",
        price: "From ₹99,999",
        topSpeed: "55 kmph",
        claimedRange: "135 km / charge",
        motor: "1.5 kW BLDC Hub",
        status: "Active",
        description: "Heavy-duty fleet delivery solution.",
        image: "https://placehold.co/400x250?text=Quantum+Energy+Bziness+XP"
    },
    // --- QUANTUM ENERGY BIZNESS EMO (ULTRA-FAST CARGO) ---
    {
        brand: "Quantum Energy",
        model: "Bziness EMO",
        category: "Ultra-Fast Charge Cargo",
        price: "From ₹1,05,000",
        topSpeed: "50 kmph",
        claimedRange: "80 km / swap",
        motor: "2.5 kW Peak Hub",
        status: "Active",
        description: "Ultra-fast charge cargo with battery swapping.",
        image: "https://placehold.co/400x250?text=Quantum+Energy+Bziness+EMO"
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
        
        console.log("Seeding Quantum Energy bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange.replace(' / charge', '').replace(' / swap', ''));
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            if (bike.motor) featureArr.push("Motor: " + bike.motor);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.motor || "Electric";
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
        console.log("\\nSuccessfully seeded " + count + " Quantum Energy bikes.");
    } catch (e) {
        console.error("Error seeding Quantum Energy bikes:", e);
    }
}

seedData();
