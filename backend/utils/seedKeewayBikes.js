const db = require('../config/db');

const bikeData = [
    // --- KEEWAY SR125 (NEO-RETRO COMMUTER) ---
    {
        brand: "Keeway",
        model: "SR125",
        category: "Neo-Retro Commuter",
        price: "From ₹1,18,000",
        engine: "125 cc",
        power: "9.56 bhp",
        torque: "8.2 Nm",
        status: "Active",
        description: "Neo-retro commuter for everyday use.",
        image: "https://placehold.co/400x250?text=Keeway+SR+125"
    },
    // --- KEEWAY SR 250 (LIGHT RETRO ROADSTER) ---
    {
        brand: "Keeway",
        model: "SR 250",
        category: "Light Retro Roadster",
        price: "From ₹1,46,000",
        engine: "223 cc",
        power: "15.8 bhp",
        torque: "16.0 Nm",
        status: "Active",
        description: "Light retro roadster with classic styling.",
        image: "https://placehold.co/400x250?text=Keeway+SR+250"
    },
    // --- KEEWAY K300 SF (NAKED STREETFIGHTER) ---
    {
        brand: "Keeway",
        model: "K300 SF",
        category: "Naked Streetfighter",
        price: "From ₹1,57,000",
        engine: "292 cc",
        power: "20.5 bhp",
        torque: "25.0 Nm",
        status: "Active",
        description: "Aggressive naked streetfighter.",
        image: "https://placehold.co/400x250?text=Keeway+K300+SF"
    },
    // --- KEEWAY RR 300 (AERODYNAMIC SPORTBIKE) ---
    {
        brand: "Keeway",
        model: "RR 300",
        category: "Aerodynamic Sportbike",
        price: "From ₹1,85,000",
        engine: "292 cc",
        power: "27.5 bhp",
        torque: "25.0 Nm",
        status: "Active",
        description: "Aerodynamic sportbike for high performance.",
        image: "https://placehold.co/400x250?text=Keeway+RR+300"
    },
    // --- KEEWAY K-LIGHT 250 VV-TWIN ---
    {
        brand: "Keeway",
        model: "K-Light 250 VV-Twin",
        category: "Urban Cruiser",
        price: "From ₹2,50,000",
        engine: "249 cc",
        power: "18.4 bhp",
        torque: "19.0 Nm",
        status: "Active",
        description: "VV-Twin urban cruiser with premium styling.",
        image: "https://placehold.co/400x250?text=Keeway+K-Light+250"
    },
    // --- KEEWAY VIESTE 300 (MODERNI MAXI-SCOOTER) ---
    {
        brand: "Keeway",
        model: "Vieste 300",
        category: "Modern Maxi-Scooter",
        price: "From ₹3,02,000",
        engine: "278 cc",
        power: "18.4 bhp",
        torque: "22.0 Nm",
        status: "Active",
        description: "Modern maxi-scooter for premium commuting.",
        image: "https://placehold.co/400x250?text=Keeway+Vieste+300"
    },
    // --- KEEWAY SIXTIES 300I (RETRO-CLASSIC SCOOTER) ---
    {
        brand: "Keeway",
        model: "Sixties 300i",
        category: "Retro-Classic Scooter",
        price: "From ₹3,07,000",
        engine: "278 cc",
        power: "18.4 bhp",
        torque: "22.0 Nm",
        status: "Active",
        description: "Retro-classic scooter with vintage design.",
        image: "https://placehold.co/400x250?text=Keeway+Sixties+300i"
    },
    // --- KEEWAY V302C (PREMIUM BOBBER CRUISER) ---
    {
        brand: "Keeway",
        model: "V302C",
        category: "Premium Bobber Cruiser",
        price: "From ₹4,07,000",
        engine: "298 cc",
        power: "29.1 bhp",
        torque: "26.5 Nm",
        status: "Active",
        description: "Premium bobber cruiser with aggressive styling.",
        image: "https://placehold.co/400x250?text=Keeway+V302C"
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
    if (catName.includes("Sportbike") || catName.includes("Streetfighter")) return 1;
    return 2; // Default to Cruiser/Retro for the rest
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Keeway bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category); 
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine); 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            const power = bike.power || "N/A";
            const torque = bike.torque || "N/A";
            const transmission = bike.category.includes("Scooter") ? "Automatic" : "Manual";
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
        console.log("\\nSuccessfully seeded " + count + " Keeway bikes.");
    } catch (e) {
        console.error("Error seeding Keeway bikes:", e);
    }
}

seedData();
