const db = require('../config/db');

const bikeData = [
    // --- NORTON ATLAS (MIDDLEWEIGHT ADVENTURE TOURER) ---
    {
        brand: "Norton",
        model: "Atlas",
        category: "Middleweight Adventure Tourer",
        price: "₹5.00 - ₹7.00 Lakhs",
        launchStatus: "Launching Mid-2026",
        engine: "585 cc Parallel-Twin",
        keyFeatures: "Long-travel suspension, dual disc brakes",
        status: "Upcoming",
        description: "Middleweight adventure tourer with rugged capability.",
        image: "https://placehold.co/400x250?text=Norton+Atlas"
    },
    // --- NORTON ATLAS GT (STREET-FOCUSED SCRAMBLER) ---
    {
        brand: "Norton",
        model: "Atlas GT",
        category: "Street-Focused Scrambler",
        price: "₹5.00 - ₹6.00 Lakhs",
        launchStatus: "Launching Mid-2026",
        engine: "585 cc Parallel-Twin",
        keyFeatures: "Cast alloys, sharper urban geometry",
        status: "Upcoming",
        description: "Street-focused scrambler with urban geometry.",
        image: "https://placehold.co/400x250?text=Norton+Atlas+GT"
    },
    // --- NORTON MANX (RETRO-MODERN CAFÉ SUPERBIKE) ---
    {
        brand: "Norton",
        model: "Manx",
        category: "Retro-Modern Café Superbike",
        price: "₹20.00 - ₹22.00 Lakhs",
        launchStatus: "Upcoming",
        engine: "V4 High-Performance",
        keyFeatures: "Classic aerodynamic fairing, premium electronics",
        status: "Upcoming",
        description: "Retro-modern café superbike with classic styling.",
        image: "https://placehold.co/400x250?text=Norton+Manx"
    },
    // --- NORTON MANX R (FLAGSHIP TRACK-FOCUSED SUPERBIKE) ---
    {
        brand: "Norton",
        model: "Manx R",
        category: "Flagship Track-Focused Superbike",
        price: "₹24.00 - ₹26.00 Lakhs",
        launchStatus: "Launching Mid-2026",
        engine: "V4 High-Performance",
        keyFeatures: "Electronic Marzocchi suspension, slide control",
        status: "Upcoming",
        description: "Flagship track-focused superbike with advanced electronics.",
        image: "https://placehold.co/400x250?text=Norton+Manx+R"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    
    // Check for "Lakhs"
    if (priceStr.includes("Lakh")) {
        const match = priceStr.match(/₹?([0-9.]+)/);
        if (match && match[1]) {
            return parseFloat(match[1]) * 100000;
        }
    }
    
    const cleanStr = priceStr.replace(/₹|,|From/g, '').split('-')[0].trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    if (engineStr.includes("V4")) return 1200; // approximation since they just say V4 High-Performance
    return parseFloat(engineStr.split(' ')[0]) || 0;
}

function parseCategory(catName) {
    if (catName.includes("Adventure")) return 3; // Adventure
    if (catName.includes("Superbike")) return 1; // Sport
    return 2; // Scrambler/Retro
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Norton bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category); 
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine); 
            const is_featured = 0; // Upcoming, so maybe not featured or active
            
            const power = "N/A";
            const transmission = "6-Speed";
            const finalDesc = "[" + bike.status + "] " + bike.description;
            
            let combinedFeatures = "";
            if (bike.launchStatus) combinedFeatures += "Launch: " + bike.launchStatus + " | ";
            if (bike.keyFeatures) combinedFeatures += "Tech: " + bike.keyFeatures;
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }

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
        console.log("\\nSuccessfully seeded " + count + " Norton bikes.");
    } catch (e) {
        console.error("Error seeding Norton bikes:", e);
    }
}

seedData();
