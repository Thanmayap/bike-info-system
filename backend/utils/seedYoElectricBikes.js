const db = require('../config/db');

const bikeData = [
    // --- YO ELECTRON DX (LOW-SPEED COMMUTER) ---
    {
        brand: "Yo Electric",
        model: "Electron DX",
        category: "Low-Speed Commuter",
        price: "From ₹56,000",
        topSpeed: "25 kmph",
        claimedRange: "60 km / charge",
        motor: "250W BLDC Hub",
        status: "Active",
        description: "Entry-level commuter for daily use.",
        image: "https://placehold.co/400x250?text=Yo+Electron+DX"
    },
    // --- YO EDGE DX (LOW-SPEED SMART) ---
    {
        brand: "Yo Electric",
        model: "Edge DX",
        category: "Low-Speed Smart",
        price: "From ₹62,000",
        topSpeed: "25 kmph",
        claimedRange: "60 km / charge",
        motor: "250W BLDC Hub",
        status: "Active",
        description: "Smart low-speed scooter with connectivity features.",
        image: "https://placehold.co/400x250?text=Yo+Edge+DX"
    },
    // --- YO DRIFT DX (LOW-SPEED EXECUTIVE) ---
    {
        brand: "Yo Electric",
        model: "Drift DX",
        category: "Low-Speed Executive",
        price: "From ₹65,000",
        topSpeed: "25 kmph",
        claimedRange: "60 km / charge",
        motor: "250W BLDC Hub",
        status: "Active",
        description: "Executive low-speed scooter for professional use.",
        image: "https://placehold.co/400x250?text=Yo+Drift+DX"
    },
    // --- YO DRIFT DX PLUS (LOW-SPEED EXTENDED) ---
    {
        brand: "Yo Electric",
        model: "Drift DX Plus",
        category: "Low-Speed Extended",
        price: "From ₹70,000",
        topSpeed: "25 kmph",
        claimedRange: "70 - 75 km",
        motor: "250W BLDC Hub",
        status: "Active",
        description: "Extended range variant with higher battery capacity.",
        image: "https://placehold.co/400x250?text=Yo+Drift+DX+Plus"
    },
    // --- YO TRUST DRIFT HX (HIGH-SPEED FLAGSHIP) ---
    {
        brand: "Yo Electric",
        model: "Trust Drift HX",
        category: "High-Speed Flagship",
        price: "From ₹1,50,000",
        topSpeed: "55 - 60 kmph",
        claimedRange: "80 - 100 km",
        motor: "1.2 kW to 1.5 kW",
        status: "Active",
        description: "High-speed flagship with powerful motor.",
        image: "https://placehold.co/400x250?text=Yo+Trust+Drift+HX"
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
        
        console.log("Seeding Yo Electric bikes...");
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
        console.log("\\nSuccessfully seeded " + count + " Yo Electric bikes.");
    } catch (e) {
        console.error("Error seeding Yo Electric bikes:", e);
    }
}

seedData();
