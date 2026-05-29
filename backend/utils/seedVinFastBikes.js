const db = require('../config/db');

const bikeData = [
    // --- VINFOST EVO / EVO 200 (ENTRY) ---
    {
        brand: "VinFast",
        model: "Evo / Evo 200",
        category: "Entry Electric Scooter",
        price: "From ₹75,000*",
        status: "Confirmed",
        topSpeed: "70 kmph",
        claimedRange: "165 km / charge",
        battery: "2.4 kWh LFP",
        motor: "2.25 kW In-hub",
        description: "Entry-level electric scooter for city commuting.",
        image: "https://placehold.co/400x250?text=VinFast+Evo"
    },
    // --- VINFOST FELIZ II / KLARA (MID-LEVEL) ---
    {
        brand: "VinFast",
        model: "Feliz II / Klara",
        category: "Mid-Level Scooter",
        price: "From ₹95,000*",
        status: "Confirmed",
        topSpeed: "80 kmph",
        claimedRange: "130 km / charge",
        battery: "3.0 kWh LFP",
        motor: "2.80 kW In-hub",
        description: "Mid-level electric scooter with improved range.",
        image: "https://placehold.co/400x250?text=VinFast+Feliz"
    },
    // --- VINFOST VERO X (EXTENDED OPTIONS) ---
    {
        brand: "VinFast",
        model: "Vero X",
        category: "Extended Options Scooter",
        price: "₹1,00,000+",
        status: "Evaluated",
        topSpeed: "70 kmph",
        claimedRange: "134 - 262 km",
        battery: "Dual Removable Opt.",
        motor: "2.25 kW",
        description: "Extended range options with dual removable batteries.",
        image: "https://placehold.co/400x250?text=VinFast+Vero+X"
    },
    // --- VINFOST VIPER (PERFORMANCE) ---
    {
        brand: "VinFast",
        model: "Viper",
        category: "Performance Scooter",
        price: "From ₹1,15,000*",
        status: "Confirmed",
        topSpeed: "85 kmph",
        claimedRange: "156 km / charge",
        battery: "4.8 kWh LFP",
        motor: "3.00 kW In-hub",
        description: "Performance-oriented electric scooter.",
        image: "https://placehold.co/400x250?text=VinFast+Viper"
    },
    // --- VINFOST VENTO S (PREMIUM EVALUATED) ---
    {
        brand: "VinFast",
        model: "Vento S",
        category: "Premium Evaluated",
        price: "₹1,30,000+",
        status: "Evaluated",
        topSpeed: "89 kmph",
        claimedRange: "160 km / charge",
        battery: "3.5 kWh LFP",
        motor: "5.20 kW Swingarm",
        description: "Premium evaluated scooter with swingarm motor.",
        image: "https://placehold.co/400x250?text=VinFast+Vento+S"
    },
    // --- VINFOST THEON S (PREMIUM FLAGSHIP) ---
    {
        brand: "VinFast",
        model: "Theon S",
        category: "Premium Flagship",
        price: "₹2,00,000+",
        status: "Premium Flagship",
        topSpeed: "99 kmph",
        claimedRange: "150 km / charge",
        battery: "3.5 kWh LFP",
        motor: "7.10 kW Mid-Drive",
        description: "Premium flagship with mid-drive motor for maximum performance.",
        image: "https://placehold.co/400x250?text=VinFast+Theon+S"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From|\*|\+/g, '').split('-')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding VinFast bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Confirmed" || bike.status === "Premium Flagship" || bike.status === "Active" ? 1 : 0;
            
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
        console.log("\\nSuccessfully seeded " + count + " VinFast bikes.");
    } catch (e) {
        console.error("Error seeding VinFast bikes:", e);
    }
}

seedData();
