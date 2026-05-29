const db = require('../config/db');

const bikeData = [
    // --- VIDA DIRT.E K3 (MICRO-UTILITY) ---
    {
        brand: "VIDA",
        model: "Dirt.E K3",
        category: "Micro-Utility Scooter",
        price: "₹69,990",
        topSpeed: "25 kmph",
        certifiedRange: "360 Wh Lithium",
        battery: "360 Wh Lithium",
        motor: "Dedicated Hub Motor",
        status: "Active",
        description: "Micro-utility scooter for light delivery.",
        image: "https://placehold.co/400x250?text=VIDA+Dirt+E+K3"
    },
    // --- VIDA VX2 GO (ENTRY) ---
    {
        brand: "VIDA",
        model: "VX2 Go",
        category: "Entry Scooter",
        price: "₹74,000",
        topSpeed: "70 kmph",
        certifiedRange: "92 km / charge",
        battery: "2.2 kWh Removable",
        motor: "1.8 kW BLDC Hub",
        status: "Active",
        description: "Entry-level electric scooter for daily commuting.",
        image: "https://placehold.co/400x250?text=VIDA+VX2+Go"
    },
    // --- VIDA VX2 PLUS (EXTENDED RANGE) ---
    {
        brand: "VIDA",
        model: "VX2 Plus",
        category: "Extended Range Scooter",
        price: "₹98,790",
        topSpeed: "80 kmph",
        certifiedRange: "142 km / charge",
        battery: "Dual Portable Lithium",
        motor: "2.5 kW Optimized Hub",
        status: "Active",
        description: "Extended range with dual portable batteries.",
        image: "https://placehold.co/400x250?text=VIDA+VX2+Plus"
    },
    // --- VIDA Z SERIES (MODULAR) ---
    {
        brand: "VIDA",
        model: "Z Series",
        category: "Modular High-Density",
        price: "₹1,00,000",
        topSpeed: "90 kmph",
        certifiedRange: "150 km / charge",
        battery: "Modular High-Density",
        motor: "6.0 kW Structural PMSM",
        status: "Active",
        description: "Modular high-density electric scooter.",
        image: "https://placehold.co/400x250?text=VIDA+Z+Series"
    },
    // --- VIDA V2 PLUS (PREMIUM) ---
    {
        brand: "VIDA",
        model: "V2 Plus",
        category: "Premium Scooter",
        price: "₹1,20,300",
        topSpeed: "85 kmph",
        certifiedRange: "143 km / charge",
        battery: "3.44 kWh (Dual Packs)",
        motor: "6.0 kW High-Torque PMSM",
        status: "Active",
        description: "Premium electric scooter with high-torque motor.",
        image: "https://placehold.co/400x250?text=VIDA+V2+Plus"
    },
    // --- VIDA V2 PRO (FLAGSHIP) ---
    {
        brand: "VIDA",
        model: "V2 Pro",
        category: "Flagship Scooter",
        price: "₹1,30,990",
        topSpeed: "90 kmph",
        certifiedRange: "165 km / charge",
        battery: "3.94 kWh (Dual Packs)",
        motor: "6.0 kW High-Torque PMSM",
        status: "Active",
        description: "Flagship electric scooter with maximum range.",
        image: "https://placehold.co/400x250?text=VIDA+V2+Pro"
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
        
        console.log("Seeding VIDA bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.certifiedRange) featureArr.push("Range: " + bike.certifiedRange.replace(' / charge', ''));
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
        console.log("\\nSuccessfully seeded " + count + " VIDA bikes.");
    } catch (e) {
        console.error("Error seeding VIDA bikes:", e);
    }
}

seedData();
