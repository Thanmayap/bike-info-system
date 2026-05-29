const db = require('../config/db');

const bikeData = [
    // --- SCRAMBLER (Active) ---
    {
        brand: "Benelli",
        model: "Leoncino 500",
        category: "Scrambler",
        engine: "500 cc",
        price: "₹4,99,000 – ₹5,60,000",
        status: "Active",
        features: "Classic Italian styling, parallel-twin engine note",
        description: "Italian classic scrambler.",
        image: "https://placehold.co/400x250?text=Benelli+Leoncino+500"
    },
    // --- URBAN CRUISER (Active) ---
    {
        brand: "Benelli",
        model: "502C",
        category: "Urban Cruiser",
        engine: "500 cc",
        price: "₹5,25,000 – ₹5,80,000",
        status: "Active",
        features: "Aggressive low-slung stance, forward footpegs",
        description: "Modern urban cruiser.",
        image: "https://placehold.co/400x250?text=Benelli+502C"
    },
    // --- ADVENTURE (Active) ---
    {
        brand: "Benelli",
        model: "TRK 502",
        category: "Adventure",
        engine: "500 cc",
        price: "₹6,30,000 – ₹6,62,000",
        status: "Active",
        features: "Massive touring fairing, touring-focused road tyres",
        description: "Touring-focused adventure.",
        image: "https://placehold.co/400x250?text=Benelli+TRK+502"
    },
    {
        brand: "Benelli",
        model: "TRK 502X",
        category: "Adventure",
        engine: "500 cc",
        price: "₹7,14,000 – ₹7,56,000",
        status: "Active",
        features: "Hardcore dual-purpose offroader, wire-spoke wheels",
        description: "Hardcore adventure tourer.",
        image: "https://placehold.co/400x250?text=Benelli+TRK+502X"
    },
    // --- UPCOMING ---
    {
        brand: "Benelli",
        model: "302S",
        category: "Street Naked",
        engine: "~300 cc",
        price: "₹3,30,000 – ₹3,80,000 (Est.)",
        status: "Upcoming",
        features: "Entry-level parallel-twin naked commuter",
        description: "Upcoming naked entry.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "Benelli",
        model: "TNT 600i",
        category: "Inline-4 Naked",
        engine: "~600 cc",
        price: "₹6,30,000 – ₹6,50,000 (Est.)",
        status: "Upcoming",
        features: "Highly anticipated 4-cylinder look under-seat exhaust",
        description: "Upcoming inline-four naked.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "Benelli",
        model: "752S",
        category: "Street Naked",
        engine: "~752 cc",
        price: "₹6,00,000 – ₹7,00,000 (Est.)",
        status: "Upcoming",
        features: "Middleweight streetfighter targeting the 700cc class",
        description: "Upcoming streetfighter.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    // --- DISCONTINUED ---
    {
        brand: "Benelli",
        model: "Imperiale 400",
        category: "Modern Classic",
        engine: "374 cc",
        price: "₹1,80,000 (Last Known)",
        status: "Discontinued",
        features: "Vintage single-cylinder long-stroke retro platform",
        description: "Retro classic discontinued.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Benelli",
        model: "TRK 251",
        category: "Adventure",
        engine: "249 cc",
        price: "₹2,89,000 (Last Known)",
        status: "Discontinued",
        features: "Lightweight single-cylinder entry adventure touring bike",
        description: "Entry adventure discontinued.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Benelli",
        model: "TNT 600 GT",
        category: "Inline-4 Naked",
        engine: "600 cc",
        price: "₹6,61,000 (Last Known)",
        status: "Discontinued",
        features: "Heavyweight tourer based on the older inline-4 frame",
        description: "Old touring naked.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Benelli",
        model: "TNT 25",
        category: "Street Naked",
        engine: "249 cc",
        price: "₹1,80,000 (Last Known)",
        status: "Discontinued",
        features: "Early quarter-litre entry-level street naked package",
        description: "Early entry naked.",
        image: "https://placehold.co/400x250?text=Discontinued"
    }
];

function parseCategory(catName) {
    if (catName.includes("Adventure")) return 4;
    if (catName.includes("Cruiser") || catName.includes("Scrambler") || catName.includes("Classic")) return 2;
    return 1; // Default Sport/Naked
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('–')[0].trim().split(' ')[0];
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.replace(/[^\d.]/g, '')) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Benelli bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            const finalDesc = "[" + bike.status + "] " + bike.description;
            const transmission = "6-Speed";

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        bike.features, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " Benelli bikes.");
    } catch (e) {
        console.error("Error seeding Benelli bikes:", e);
    }
}

seedData();
