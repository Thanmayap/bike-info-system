const db = require('../config/db');

const bikeData = [
    // --- EVOLET PONY (THE LIGHTWEIGHT BUDGET COMMUTER) ---
    {
        brand: "Evolet",
        model: "Pony",
        category: "Budget Commuter",
        motor: "250 W BLDC Hub Motor",
        battery: "VRLA (Lead-Acid) or 48V/26Ah Lithium-ion",
        range: "90–110 km Certified Range",
        topSpeed: "25 kmph",
        chargingTime: "3–4 hours (Lithium) / 5–6 hours (VRLA)",
        kerbWeight: "76 kg",
        price: "₹59,999 onwards",
        status: "Active",
        features: "Digital colored TFT console, E-ABS (Electronic Anti-lock Braking System), mobile app tracking telemetry",
        description: "Lightweight budget commuter with no license required.",
        image: "https://placehold.co/400x250?text=Evolet+Pony"
    },
    // --- EVOLET DERBY (THE PREMIUM COMMUTER) ---
    {
        brand: "Evolet",
        model: "Derby",
        category: "Premium Commuter",
        motor: "250 W BLDC Motor with LFP cell configuration",
        battery: "48V LFP Lithium-ion",
        range: "90–110 km Range",
        topSpeed: "25 kmph",
        chargingTime: "3–4 hours via Auto-Cut smart micro charger",
        groundClearance: "180 mm",
        price: "₹71,399 – ₹78,999",
        status: "Active",
        features: "Dual disc brakes, electronic central locking, large storage bay, 10-inch tubeless tyres",
        description: "Premium commuter with enhanced features.",
        image: "https://placehold.co/400x250?text=Evolet+Derby"
    },
    // --- EVOLET POLO (THE SLEEK URBAN CRUISER) ---
    {
        brand: "Evolet",
        model: "Polo",
        category: "Sleek Urban Cruiser",
        motor: "250 W BLDC Motor",
        battery: "Removable Lithium-ion tech layout",
        range: "90–100 km Range",
        topSpeed: "25 kmph",
        chargingTime: "3–4 hours (Lithium) / 5–6 hours (EZ variant)",
        price: "₹51,999 – ₹69,999",
        status: "Active",
        features: "USB charging port, modern aerodynamic styling, regenerative braking capabilities",
        description: "Sleek urban cruiser with modern design.",
        image: "https://placehold.co/400x250?text=Evolet+Polo"
    },
    // --- EVOLET DHANNO (THE HIGH-LOAD UTILITY SCOOTER) ---
    {
        brand: "Evolet",
        model: "Dhanno",
        category: "High-Load Utility Scooter",
        motor: "High-torque variant",
        battery: "Lithium-ion standard configuration",
        range: "80–100 km Range per charge",
        topSpeed: "25 kmph",
        chargingTime: "3–4 hours",
        unladenWeight: "80 kg",
        price: "₹84,999 onwards",
        status: "Active",
        features: "Strengthened dual rear shocks, extended footboard, luggage holding utility frames",
        description: "High-load utility scooter for heavy city loading.",
        image: "https://placehold.co/400x250?text=Evolet+Dhanno"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('onwards')[0].split('–')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Evolet bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0;
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.battery) featureArr.push("Battery: " + bike.battery);
            if (bike.range) featureArr.push("Range: " + bike.range.replace(' Certified Range', '').replace(' Range per charge', '').replace(' Range', ''));
            if (bike.chargingTime) featureArr.push("Charge: " + bike.chargingTime);
            featureArr.push(bike.features);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.motor;
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
        console.log("\\nSuccessfully seeded " + count + " Evolet bikes.");
    } catch (e) {
        console.error("Error seeding Evolet bikes:", e);
    }
}

seedData();
