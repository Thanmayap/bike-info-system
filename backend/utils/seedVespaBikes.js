const db = require('../config/db');

const bikeData = [
    // --- VESPA ZX 125 (ENTRY) ---
    {
        brand: "Vespa",
        model: "ZX 125",
        category: "Scooter",
        price: "From ₹1,13,482",
        engine: "124.45 cc",
        peakPower: "9.77 PS @ 7,500 rpm",
        peakTorque: "10.10 Nm @ 5,600 rpm",
        status: "Active",
        description: "Entry-level Vespa with modern styling.",
        image: "https://placehold.co/400x250?text=Vespa+ZX+125"
    },
    // --- VESPA 125 (STANDARD/VXL/SXL) ---
    {
        brand: "Vespa",
        model: "125 (Standard/VXL/SXL)",
        category: "Scooter",
        price: "From ₹1,25,679",
        engine: "124.45 cc",
        peakPower: "9.51 PS @ 7,100 rpm",
        peakTorque: "10.10 Nm @ 5,600 rpm",
        status: "Active",
        description: "Classic Vespa with premium finishes.",
        image: "https://placehold.co/400x250?text=Vespa+125"
    },
    // --- VESPA S 125 / S TECH ---
    {
        brand: "Vespa",
        model: "S 125 / S Tech",
        category: "Scooter",
        price: "From ₹1,29,439",
        engine: "124.45 cc",
        peakPower: "9.51 PS @ 7,100 rpm",
        peakTorque: "10.10 Nm @ 5,600 rpm",
        status: "Active",
        description: "Sporty Vespa with tech features.",
        image: "https://placehold.co/400x250?text=Vespa+S+125"
    },
    // --- VESPA 150 (VXL/SXL/ELEGANTE) ---
    {
        brand: "Vespa",
        model: "150 (VXL/SXL/Elegante)",
        category: "Scooter",
        price: "From ₹1,39,526",
        engine: "149.50 cc",
        peakPower: "11.42 PS @ 7,500 rpm",
        peakTorque: "11.66 Nm @ 6,100 rpm",
        status: "Active",
        description: "Premium 150cc Vespa with elegant styling.",
        image: "https://placehold.co/400x250?text=Vespa+150"
    },
    // --- VESPA S 150 / S TECH ---
    {
        brand: "Vespa",
        model: "S 150 / S Tech",
        category: "Scooter",
        price: "From ₹1,45,424",
        engine: "149.50 cc",
        peakPower: "11.42 PS @ 7,500 rpm",
        peakTorque: "11.66 Nm @ 6,100 rpm",
        status: "Active",
        description: "Sporty 150cc Vespa with advanced features.",
        image: "https://placehold.co/400x250?text=Vespa+S+150"
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

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Vespa bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 4; // Scooter
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine); 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.engine) featureArr.push(bike.engine);
            if (bike.peakPower) featureArr.push("Power: " + bike.peakPower.split('@')[0].trim());
            if (bike.peakTorque) featureArr.push("Torque: " + bike.peakTorque.split('@')[0].trim());
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.peakPower ? bike.peakPower.split('@')[0].trim() : "N/A";
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
        console.log("\\nSuccessfully seeded " + count + " Vespa bikes.");
    } catch (e) {
        console.error("Error seeding Vespa bikes:", e);
    }
}

seedData();
