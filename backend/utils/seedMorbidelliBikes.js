const db = require('../config/db');

const bikeData = [
    // --- MORBIDELLI RETRO STREET (STR) (NEO-RETRO ROADSTER) ---
    {
        brand: "Morbidelli",
        model: "Retro Street (STR)",
        category: "Neo-Retro Roadster / Street",
        price: "From ₹4,29,000",
        engine: "649 cc Liquid-Cooled Parallel-Twin",
        power: "55.7 PS",
        torque: "54 Nm",
        status: "Active",
        description: "Neo-retro roadster with classic Italian styling.",
        image: "https://placehold.co/400x250?text=Morbidelli+STR"
    },
    // --- MORBIDELLI SCRAMBLER (SCR) (RUGGED URBAN SCRAMBLER) ---
    {
        brand: "Morbidelli",
        model: "Scrambler (SCR)",
        category: "Rugged Urban Scrambler",
        price: "From ₹4,40,000",
        engine: "649 cc Liquid-Cooled Parallel-Twin",
        power: "55.7 PS",
        torque: "54 Nm",
        status: "Active",
        description: "Rugged urban scrambler with adventure-ready styling.",
        image: "https://placehold.co/400x250?text=Morbidelli+SCR"
    },
    // --- X-CAPE 650 STANDARD (URBAN ADVENTURE TOURER) ---
    {
        brand: "Morbidelli",
        model: "X-Cape 650 Standard",
        category: "Urban Adventure Tourer",
        price: "From ₹6,30,000",
        engine: "649 cc Liquid-Cooled Parallel-Twin",
        power: "60.8 PS",
        torque: "54 Nm",
        status: "Active",
        description: "Urban adventure tourer for city and highway journeys.",
        image: "https://placehold.co/400x250?text=X-Cape+650+Standard"
    },
    // --- X-CAPE 650X (OFF-ROAD ADVENTURE TOURER) ---
    {
        brand: "Morbidelli",
        model: "X-Cape 650X",
        category: "Off-Road Adventure Tourer",
        price: "From ₹6,69,986",
        engine: "649 cc Liquid-Cooled Parallel-Twin",
        power: "60.8 PS",
        torque: "54 Nm",
        status: "Active",
        description: "Off-road adventure tourer with enhanced capability.",
        image: "https://placehold.co/400x250?text=X-Cape+650X"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.split(' ')[0]) || 0;
}

function parseCategory(catName) {
    if (catName.includes("Adventure")) return 3; // Adventure
    if (catName.includes("Scrambler")) return 2; // Retro/Cruiser
    return 1; // Sport/Naked
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Morbidelli bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category); 
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine); 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            const power = bike.power || "N/A";
            const torque = bike.torque || "N/A";
            const transmission = "6-Speed";
            const finalDesc = "[" + bike.status + "] " + bike.description;
            
            let combinedFeatures = "Torque: " + torque;

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, torque, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        power, torque, combinedFeatures, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " Morbidelli bikes.");
    } catch (e) {
        console.error("Error seeding Morbidelli bikes:", e);
    }
}

seedData();
