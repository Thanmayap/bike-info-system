const db = require('../config/db');

const bikeData = [
    // --- HUSQVARNA VITPILEN 250 (NEO-RETRO CAFE RACER / ROADSTER) ---
    {
        brand: "Husqvarna",
        model: "Vitpilen 250",
        category: "Neo-Retro Cafe Racer / Roadster",
        price: "₹2,19,000",
        engine: "249.07 cc",
        peakPower: "31 PS @ 9,250 rpm",
        claimedMileage: "31 kmpl",
        status: "Active",
        description: "Neo-retro cafe racer with sharp styling.",
        image: "https://placehold.co/400x250?text=Husqvarna+Vitpilen+250"
    },
    // --- HUSQVARNA SVARTPILEN 401 (RUGGED URBAN SCRAMBLER) ---
    {
        brand: "Husqvarna",
        model: "Svartpilen 401",
        category: "Rugged Urban Scrambler",
        price: "₹2,92,000",
        engine: "398.63 cc",
        peakPower: "46 PS @ 9,000 rpm",
        claimedMileage: "29 kmpl",
        status: "Active",
        description: "Rugged urban scrambler with adventure-ready styling.",
        image: "https://placehold.co/400x250?text=Husqvarna+Svartpilen+401"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.split(' ')[0]) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Husqvarna bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 1; // Naked/Cafe Racer
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedMileage) featureArr.push("Mileage: " + bike.claimedMileage);
            let combinedFeatures = featureArr.join(" | ");
            
            const power = bike.peakPower;
            const transmission = "6-Speed";
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
        console.log("\\nSuccessfully seeded " + count + " Husqvarna bikes.");
    } catch (e) {
        console.error("Error seeding Husqvarna bikes:", e);
    }
}

seedData();
