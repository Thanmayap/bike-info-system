const db = require('../config/db');

const bikeData = [
    // --- QJ MOTOR SRC 250 (CLASSIC RETRO ROADSTER) ---
    {
        brand: "QJ Motor",
        model: "SRC 250",
        category: "Classic Retro Roadster",
        price: "From ₹1,37,000",
        engine: "249 cc, Parallel-Twin Liquid-Cooled",
        power: "17.4 bhp",
        torque: "17.0 Nm",
        status: "Active",
        description: "Classic retro roadster with timeless styling.",
        image: "https://placehold.co/400x250?text=QJ+Motor+SRC+250"
    },
    // --- QJ MOTOR SRC 500 (NEO-RETRO HIGH-CAPACITY CRUISER) ---
    {
        brand: "QJ Motor",
        model: "SRC 500",
        category: "Neo-Retro High-Capacity Cruiser",
        price: "From ₹2,10,000",
        engine: "480 cc, Air-Cooled Single-Cylinder",
        power: "25.5 bhp",
        torque: "36.0 Nm",
        status: "Active",
        description: "Neo-retro high-capacity cruiser with robust engine.",
        image: "https://placehold.co/400x250?text=QJ+Motor+SRC+500"
    },
    // --- QJ MOTOR SRV 300 (MODERN V-TWIN URBAN CRUISER) ---
    {
        brand: "QJ Motor",
        model: "SRV 300",
        category: "Modern V-Twin Urban Cruiser",
        price: "From ₹3,29,000",
        engine: "296 cc, Liquid-Cooled V-Twin",
        power: "30.3 bhp",
        torque: "26.0 Nm",
        status: "Active",
        description: "Modern V-twin urban cruiser with aggressive styling.",
        image: "https://placehold.co/400x250?text=QJ+Motor+SRV+300"
    },
    // --- QJ MOTOR SRK 400 (FLAGSHIP NAKED STREETFIGHTER) ---
    {
        brand: "QJ Motor",
        model: "SRK 400",
        category: "Flagship Naked Streetfighter",
        price: "From ₹3,99,000",
        engine: "400 cc, Parallel-Twin Liquid-Cooled",
        power: "40.9 bhp",
        torque: "37.0 Nm",
        status: "Active",
        description: "Flagship naked streetfighter with high performance.",
        image: "https://placehold.co/400x250?text=QJ+Motor+SRK+400"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').split('-')[0].trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    const match = engineStr.match(/(\d+(?:\.\d+)?)\s*cc/i);
    return match ? parseFloat(match[1]) : 0;
}

function parseCategory(catStr) {
    catStr = catStr.toLowerCase();
    if (catStr.includes('electric')) return 5;
    if (catStr.includes('scooter')) return 4;
    if (catStr.includes('adventure')) return 3;
    if (catStr.includes('retro') || catStr.includes('cruiser') || catStr.includes('classic')) return 2;
    return 1; // Sport/Naked default
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding QJ Motor bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine); 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.engine) featureArr.push(bike.engine);
            if (bike.power) featureArr.push("Power: " + bike.power);
            if (bike.torque) featureArr.push("Torque: " + bike.torque);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.power || "N/A";
            const transmission = "Manual/Geared";
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
        console.log("\\nSuccessfully seeded " + count + " QJ Motor bikes.");
    } catch (e) {
        console.error("Error seeding QJ Motor bikes:", e);
    }
}

seedData();
