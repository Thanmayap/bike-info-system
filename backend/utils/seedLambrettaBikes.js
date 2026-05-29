const db = require('../config/db');

const bikeData = [
    // --- LAMBRETTA V125 (CLASSIC SCOOTER) ---
    {
        brand: "Lambretta",
        model: "V125",
        category: "Classic Scooter",
        price: "₹73,750 – ₹1,00,000",
        engine: "124.7 cc, Air-Cooled Single",
        topSpeed: "95 kmph",
        power: "10.19 PS",
        torque: "9.2 Nm",
        status: "Active",
        description: "Classic Italian scooter with retro styling.",
        image: "https://placehold.co/400x250?text=Lambretta+V125"
    },
    // --- LAMBRETTA V200 (PREMIUM SCOOTER) ---
    {
        brand: "Lambretta",
        model: "V200",
        category: "Premium Scooter",
        price: "₹92,188 – ₹1,20,000",
        engine: "169 cc, Air-Cooled Single",
        topSpeed: "100 kmph",
        power: "12.1 PS",
        torque: "12.5 Nm",
        status: "Active",
        description: "Premium scooter with higher displacement.",
        image: "https://placehold.co/400x250?text=Lambretta+V200"
    },
    // --- LAMBRETTA G-SPECIAL EV (ELECTRIC SCOOTER) ---
    {
        brand: "Lambretta",
        model: "G-Special EV",
        category: "Electric Scooter",
        price: "₹1,25,000",
        engine: "Electric Motor / 1.8 kWh Battery",
        topSpeed: "90 kmph",
        claimedRange: "120 km Range per single charge",
        status: "Active",
        description: "Electric scooter with modern connectivity.",
        image: "https://placehold.co/400x250?text=Lambretta+G-Special+EV"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('–')[0].trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr || engineStr.includes("Electric")) return 0;
    return parseFloat(engineStr.split(' ')[0]) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Lambretta bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = bike.category.includes("Electric") ? 5 : 2; // 5 for EV, 2 for retro/classic ICE scooters
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange.replace(' Range per single charge', ''));
            if (bike.torque) featureArr.push("Torque: " + bike.torque);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.power || "Electric";
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
        console.log("\\nSuccessfully seeded " + count + " Lambretta bikes.");
    } catch (e) {
        console.error("Error seeding Lambretta bikes:", e);
    }
}

seedData();
