const db = require('../config/db');

const bikeData = [
    // --- INDIAN SCOUT SIXTY BOBBER ---
    {
        brand: "Indian",
        model: "Scout Sixty Bobber",
        category: "Cruiser / Bobber",
        engine: "999 cc",
        transmission: "5-Speed Manual",
        price: "From ₹12,99,000",
        status: "Active",
        description: "Entry-level bobber with classic styling.",
        image: "https://placehold.co/400x250?text=Indian+Scout+Sixty+Bobber"
    },
    // --- INDIAN SCOUT BOBBER ---
    {
        brand: "Indian",
        model: "Scout Bobber",
        category: "Cruiser / Bobber",
        engine: "1250 cc",
        transmission: "6-Speed Manual",
        price: "From ₹13,99,000",
        status: "Active",
        description: "Standard bobber with higher displacement.",
        image: "https://placehold.co/400x250?text=Indian+Scout+Bobber"
    },
    // --- INDIAN 101 SCOUT ---
    {
        brand: "Indian",
        model: "101 Scout",
        category: "Cruiser",
        engine: "1250 cc",
        power: "112.54 bhp peak power",
        price: "From ₹17,08,855",
        status: "Active",
        description: "High-performance cruiser with 101 HP.",
        image: "https://placehold.co/400x250?text=Indian+101+Scout"
    },
    // --- INDIAN FTR 1200 / STANDARD ---
    {
        brand: "Indian",
        model: "FTR 1200 / Standard",
        category: "Tracker / Naked",
        engine: "1203 cc",
        price: "From ₹17,83,000",
        status: "Active",
        features: "Street-focused flat tracker",
        description: "Flat tracker with aggressive street styling.",
        image: "https://placehold.co/400x250?text=Indian+FTR+1200"
    },
    // --- INDIAN FTR RALLY ---
    {
        brand: "Indian",
        model: "FTR Rally",
        category: "Tracker / Naked",
        engine: "1203 cc",
        price: "From ₹21,82,000",
        status: "Active",
        features: "Wire-spoked wheels / Offroad tires",
        description: "Off-road focused flat tracker.",
        image: "https://placehold.co/400x250?text=Indian+FTR+Rally"
    },
    // --- INDIAN CHIEF DARK HORSE ---
    {
        brand: "Indian",
        model: "Chief Dark Horse",
        category: "Premium Cruiser",
        engine: "1890 cc",
        price: "From ₹21,59,000",
        status: "Active",
        features: "Thunderstroke 116 V-Twin",
        description: "Premium cruiser with iconic Thunderstroke engine.",
        image: "https://placehold.co/400x250?text=Indian+Chief+Dark+Horse"
    },
    // --- INDIAN CHIEF BOBBER DARK HORSE ---
    {
        brand: "Indian",
        model: "Chief Bobber Dark Horse",
        category: "Premium Cruiser",
        engine: "1890 cc",
        price: "From ₹22,86,943",
        status: "Active",
        features: "Mini-apes handlebars",
        description: "Bobber style with mini-apes handlebars.",
        image: "https://placehold.co/400x250?text=Indian+Chief+Bobber+Dark+Horse"
    },
    // --- INDIAN SUPER CHIEF LIMITED ---
    {
        brand: "Indian",
        model: "Super Chief Limited",
        category: "Highway Cruiser",
        engine: "1890 cc",
        price: "From ₹24,38,944",
        status: "Active",
        features: "Quick-release windshield / Saddlebags",
        description: "Highway cruiser with touring amenities.",
        image: "https://placehold.co/400x250?text=Indian+Super+Chief+Limited"
    },
    // --- INDIAN SPRINGFIELD DARK HORSE ---
    {
        brand: "Indian",
        model: "Springfield Dark Horse",
        category: "Bagger",
        engine: "1890 cc",
        price: "From ₹29,56,494",
        status: "Active",
        features: "Slammed remote-locking hard bags",
        description: "Bagger with premium luggage system.",
        image: "https://placehold.co/400x250?text=Indian+Springfield+Dark+Horse"
    },
    // --- INDIAN CHIEFTAIN LIMITED ---
    {
        brand: "Indian",
        model: "Chieftain Limited",
        category: "Bagger",
        engine: "1890 cc",
        price: "From ₹34,26,000",
        status: "Active",
        features: "Ride Command infotainment screen",
        description: "Bagger with advanced infotainment.",
        image: "https://placehold.co/400x250?text=Indian+Chieftain+Limited"
    },
    // --- INDIAN CHALLENGER DARK HORSE ---
    {
        brand: "Indian",
        model: "Challenger Dark Horse",
        category: "Touring",
        engine: "1768 cc",
        price: "From ₹37,97,000",
        status: "Active",
        features: "PowerPlus liquid-cooled V-twin",
        description: "Premium touring with liquid-cooled engine.",
        image: "https://placehold.co/400x250?text=Indian+Challenger+Dark+Horse"
    },
    // --- INDIAN ROADMASTER LIMITED ---
    {
        brand: "Indian",
        model: "Roadmaster Limited",
        category: "Luxury Touring",
        engine: "1890 cc",
        price: "From ₹48,22,000",
        status: "Active",
        features: "Heated seats / 140L storage capacity",
        description: "Luxury touring with maximum comfort.",
        image: "https://placehold.co/400x250?text=Indian+Roadmaster+Limited"
    },
    // --- INDIAN ROADMASTER ELITE ---
    {
        brand: "Indian",
        model: "Roadmaster Elite",
        category: "Ultra-Luxury Touring",
        engine: "1890 cc",
        price: "Up to ₹71,82,000",
        status: "Active",
        features: "Custom limited-edition hand paint",
        description: "Ultra-luxury limited edition touring.",
        image: "https://placehold.co/400x250?text=Indian+Roadmaster+Elite"
    }
];

function parseCategory(catName) {
    if (catName.includes("Tracker") || catName.includes("Naked")) return 1; // Sport/Naked
    return 2; // Default Cruiser/Bagger/Touring
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From|Up to/g, '').trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.split(' ')[0]) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Indian bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.features) featureArr.push(bike.features);
            let combinedFeatures = featureArr.join(" | ");
            
            const power = bike.power;
            const transmission = bike.transmission || "6-Speed";
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
        console.log("\\nSuccessfully seeded " + count + " Indian bikes.");
    } catch (e) {
        console.error("Error seeding Indian bikes:", e);
    }
}

seedData();
