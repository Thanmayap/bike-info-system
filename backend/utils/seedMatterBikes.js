const db = require('../config/db');

const bikeData = [
    // --- MATTER AERA 5000 (BASE TRIM) ---
    {
        brand: "Matter",
        model: "AERA 5000",
        category: "Electric Motorcycle",
        price: "From ₹1,83,308",
        topSpeed: "105 kmph",
        claimedRange: "172 km / charge",
        keyFeatures: "Base trim, 7\" non-touch smart digital dash, Bluetooth",
        techDifference: "Standard connectivity features",
        status: "Active",
        description: "Base variant of the AERA 5000 with essential features.",
        image: "https://placehold.co/400x250?text=Matter+AERA+5000"
    },
    // --- MATTER AERA 5000+ (FLAGSHIP TRIM) ---
    {
        brand: "Matter",
        model: "AERA 5000+",
        category: "Electric Motorcycle",
        price: "From ₹1,93,826",
        topSpeed: "105 kmph",
        claimedRange: "172 km / charge",
        keyFeatures: "Flagship trim, 7\" Capacitive Touchscreen, advanced telematics",
        techDifference: "Advanced touchscreen and telematics",
        status: "Active",
        description: "Flagship variant with capacitive touchscreen and advanced telematics.",
        image: "https://placehold.co/400x250?text=Matter+AERA+5000+"
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
        
        console.log("Seeding Matter bikes...");
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
            if (bike.keyFeatures) featureArr.push("Tech: " + bike.keyFeatures);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = "Electric";
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
        console.log("\\nSuccessfully seeded " + count + " Matter bikes.");
    } catch (e) {
        console.error("Error seeding Matter bikes:", e);
    }
}

seedData();
