const db = require('../config/db');

const bikeData = [
    // --- NUMEROS N-FIRST MAX (BASE URBAN TRIM) ---
    {
        brand: "Numeros",
        model: "n-First Max",
        category: "Urban Commuter",
        price: "₹74,299",
        topSpeed: "55 kmph",
        claimedRange: "91 km / charge",
        motor: "1.8 kW mid-mount motor",
        status: "Active",
        description: "Base urban trim for daily commuting.",
        image: "https://placehold.co/400x250?text=Numeros+n-First+Max"
    },
    // --- NUMEROS N-FIRST I-MAX (EXTENDED RANGE COMMUTER) ---
    {
        brand: "Numeros",
        model: "n-First i-Max",
        category: "Extended Range Commuter",
        price: "₹77,943",
        topSpeed: "55 kmph",
        claimedRange: "109 km / charge",
        motor: "2.5 kW mid-motor",
        status: "Active",
        description: "Extended range commuter with higher motor power.",
        image: "https://placehold.co/400x250?text=Numeros+n-First+i-Max"
    },
    // --- NUMEROS N-FIRST I-MAX + (PREMIUM VARIANT) ---
    {
        brand: "Numeros",
        model: "n-First i-Max +",
        category: "Premium Smart",
        price: "₹84,999",
        topSpeed: "55 kmph",
        claimedRange: "109 km / charge",
        motor: "2.5 kW mid-motor",
        features: "Full smart digital telematics",
        status: "Active",
        description: "Premium variant with full smart digital telematics.",
        image: "https://placehold.co/400x250?text=Numeros+n-First+i-Max+Plus"
    },
    // --- NUMEROS DIPLOS PRO (HEAVY-DUTY COMMERCIAL) ---
    {
        brand: "Numeros",
        model: "Diplos Pro",
        category: "Heavy-Duty Commercial",
        price: "₹1,07,000",
        topSpeed: "70 kmph",
        claimedRange: "140 km / charge",
        motor: "Entry commercial platform",
        status: "Active",
        description: "Entry heavy-duty commercial/passenger platform.",
        image: "https://placehold.co/400x250?text=Numeros+Diplos+Pro"
    },
    // --- NUMEROS DIPLOS MAX (DUAL REMOVABLE BATTERY) ---
    {
        brand: "Numeros",
        model: "Diplos Max",
        category: "Premium Commercial",
        price: "₹1,12,499",
        topSpeed: "70 kmph",
        claimedRange: "140 km / charge",
        battery: "Dual removable LFP battery pack (3.7 kWh)",
        status: "Active",
        description: "Dual removable LFP battery pack setup for extended use.",
        image: "https://placehold.co/400x250?text=Numeros+Diplos+Max"
    },
    // --- NUMEROS DIPLOS MAX PLUS (FLAGSHIP LONG-RANGE) ---
    {
        brand: "Numeros",
        model: "Diplos Max Plus",
        category: "Flagship Fleet",
        price: "₹1,14,999",
        topSpeed: "70 kmph",
        claimedRange: "156 km / charge",
        motor: "2.89 kW peak motor",
        status: "Active",
        description: "Flagship long-range fleet variant with maximum range.",
        image: "https://placehold.co/400x250?text=Numeros+Diplos+Max+Plus"
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
        
        console.log("Seeding Numeros bikes...");
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
            if (bike.features) featureArr.push("Features: " + bike.features);
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
        console.log("\\nSuccessfully seeded " + count + " Numeros bikes.");
    } catch (e) {
        console.error("Error seeding Numeros bikes:", e);
    }
}

seedData();
