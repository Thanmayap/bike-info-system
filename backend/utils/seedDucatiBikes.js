const db = require('../config/db');

const bikeData = [
    // --- SCRAMBLER ICON ---
    {
        brand: "Ducati",
        model: "Scrambler Icon",
        category: "Scrambler",
        engine: "803 cc L-Twin",
        peakPower: "73.0 bhp",
        kerbWeight: "185 kg",
        primaryApplication: "Lifestyle / City Commute",
        price: "₹10,39,000",
        status: "Active",
        description: "Classic scrambler for lifestyle and city commute.",
        image: "https://placehold.co/400x250?text=Ducati+Scrambler+Icon"
    },
    // --- MONSTER ---
    {
        brand: "Ducati",
        model: "Monster",
        category: "Naked",
        engine: "937 cc L-Twin",
        peakPower: "111.0 bhp",
        kerbWeight: "188 kg",
        primaryApplication: "Premium Everyday Naked",
        price: "₹13,15,000",
        status: "Active",
        description: "Premium everyday naked bike with aggressive styling.",
        image: "https://placehold.co/400x250?text=Ducati+Monster"
    },
    // --- DESERTX ---
    {
        brand: "Ducati",
        model: "DesertX",
        category: "Adventure",
        engine: "937 cc L-Twin",
        peakPower: "110.0 bhp",
        kerbWeight: "223 kg",
        primaryApplication: "Hardcore Off-Road Trails",
        price: "₹18,33,000",
        status: "Active",
        description: "Hardcore off-road adventure tourer.",
        image: "https://placehold.co/400x250?text=Ducati+DesertX"
    },
    // --- PANIGALE V2 ---
    {
        brand: "Ducati",
        model: "Panigale V2",
        category: "Supersport",
        engine: "955 cc V-Twin",
        peakPower: "155.0 bhp",
        kerbWeight: "200 kg",
        primaryApplication: "Precision Track Riding",
        price: "₹20,68,000",
        status: "Active",
        description: "Precision track riding supersport.",
        image: "https://placehold.co/400x250?text=Ducati+Panigale+V2"
    },
    // --- MULTISTRADA V4 ---
    {
        brand: "Ducati",
        model: "Multistrada V4",
        category: "Adventure Tourer",
        engine: "1158 cc V4",
        peakPower: "170.0 bhp",
        kerbWeight: "240 kg",
        primaryApplication: "Transcontinental Touring",
        price: "₹21,48,000",
        status: "Active",
        description: "Transcontinental touring adventure.",
        image: "https://placehold.co/400x250?text=Ducati+Multistrada+V4"
    },
    // --- DIAVEL V4 ---
    {
        brand: "Ducati",
        model: "Diavel V4",
        category: "Cruiser",
        engine: "1158 cc V4",
        peakPower: "168.0 bhp",
        kerbWeight: "236 kg",
        primaryApplication: "Muscle Cruiser Touring",
        price: "₹25,91,000",
        status: "Active",
        description: "Muscle cruiser for touring.",
        image: "https://placehold.co/400x250?text=Ducati+Diavel+V4"
    },
    // --- PANIGALE V4 ---
    {
        brand: "Ducati",
        model: "Panigale V4",
        category: "Superbike",
        engine: "1103 cc V4",
        peakPower: "215.5 bhp",
        kerbWeight: "198 kg",
        primaryApplication: "MotoGP-Class Superbike",
        price: "₹27,73,000",
        status: "Active",
        description: "MotoGP-class ultimate superbike.",
        image: "https://placehold.co/400x250?text=Ducati+Panigale+V4"
    }
];

function parseCategory(catName) {
    if (catName.includes("Adventure")) return 4;
    if (catName.includes("Cruiser") || catName.includes("Scrambler")) return 2;
    return 1; // Default Sport/Naked/Superbike
}

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
        
        console.log("Seeding Ducati bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category); 
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.kerbWeight) featureArr.push("Weight: " + bike.kerbWeight);
            if (bike.primaryApplication) featureArr.push("Application: " + bike.primaryApplication);
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
        console.log("\\nSuccessfully seeded " + count + " Ducati bikes.");
    } catch (e) {
        console.error("Error seeding Ducati bikes:", e);
    }
}

seedData();
