const db = require('../config/db');

const bikeData = [
    // --- MOTO GUZZI V7 STONE / SPECIAL / SPORT (RETRO RANGE) ---
    {
        brand: "Moto Guzzi",
        model: "V7 Stone / Special / Sport",
        category: "Retro Standard",
        price: "₹8,30,000 – ₹9,15,000",
        engine: "853 cc Air-Cooled V-Twin",
        power: "65 HP",
        torque: "73 Nm",
        msrpUSD: "$9,990 - $10,990",
        status: "Active",
        description: "Classic retro standard with timeless Italian styling.",
        image: "https://placehold.co/400x250?text=Moto+Guzzi+V7"
    },
    // --- MOTO GUZZI V85 ADVENTURE (ADVENTURE) ---
    {
        brand: "Moto Guzzi",
        model: "V85 Adventure",
        category: "Adventure",
        price: "₹10,30,000 – ₹11,95,000",
        engine: "853 cc Air-Cooled V-Twin",
        power: "80 HP",
        torque: "83 Nm",
        msrpUSD: "$12,390 - $14,390",
        status: "Active",
        description: "Adventure tourer with rugged capability.",
        image: "https://placehold.co/400x250?text=Moto+Guzzi+V85+Adventure"
    },
    // --- MOTO GUZZI V100 MANDELLO (PREMIUM SPORT) ---
    {
        brand: "Moto Guzzi",
        model: "V100 Mandello / Mandello S",
        category: "Premium Sport",
        price: "₹13,30,000 – ₹14,70,000",
        engine: "1,042 cc Liquid-Cooled V-Twin",
        power: "115 HP",
        torque: "105 Nm",
        msrpUSD: "$15,990 - $17,690",
        status: "Active",
        description: "Premium sport tourer with advanced technology.",
        image: "https://placehold.co/400x250?text=Moto+Guzzi+V100+Mandello"
    },
    // --- MOTO GUZZI STELVOI ADVENTURE (ADVENTURE TOURER) ---
    {
        brand: "Moto Guzzi",
        model: "Stelvio Adventure / PFF Radar Tech",
        category: "Adventure Tourer",
        price: "₹14,13,000 – ₹14,63,000",
        engine: "1,042 cc Liquid-Cooled V-Twin",
        power: "115 HP",
        torque: "105 Nm",
        msrpUSD: "$16,990 - $17,590",
        status: "Active",
        description: "Flagship adventure tourer with radar technology.",
        image: "https://placehold.co/400x250?text=Moto+Guzzi+Stelvio"
    },
    // --- MOTO GUZZI V9 CRUISER (CRUISER) ---
    {
        brand: "Moto Guzzi",
        model: "V9 Bobber / Roamer",
        category: "Cruiser",
        price: "₹13,60,000",
        engine: "853 cc Air-Cooled V-Twin",
        power: "65 HP",
        torque: "73 Nm",
        msrpUSD: "From $13,60,000 (Ex-India)",
        status: "Active",
        description: "Classic cruiser with bobber styling.",
        image: "https://placehold.co/400x250?text=Moto+Guzzi+V9"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').split('–')[0].trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.split(' ')[0].replace(/,/g, '')) || 0;
}

function parseCategory(catName) {
    if (catName.includes("Adventure")) return 3;
    if (catName.includes("Sport")) return 1;
    return 2; // Cruiser/Retro
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Moto Guzzi bikes...");
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
        console.log("\\nSuccessfully seeded " + count + " Moto Guzzi bikes.");
    } catch (e) {
        console.error("Error seeding Moto Guzzi bikes:", e);
    }
}

seedData();
