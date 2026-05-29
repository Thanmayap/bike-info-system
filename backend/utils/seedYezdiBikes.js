const db = require('../config/db');

const bikeData = [
    // --- YEZDI ROADSTER (CLASSIC RETRO CRUISER) ---
    {
        brand: "Yezdi",
        model: "Roadster",
        category: "Classic Retro Cruiser",
        price: "₹1.94 - ₹2.11 Lakh",
        topSpeed: "120 kmph",
        claimedMileage: "30 kmpl",
        seatHeight: "790 mm",
        status: "Active",
        description: "Classic retro cruiser with authentic bobber styling.",
        image: "https://placehold.co/400x250?text=Yezdi+Roadster"
    },
    // --- YEZDI SCRAMBLER 350 (OFF-ROAD URBAN SCRAMBLER) ---
    {
        brand: "Yezdi",
        model: "Scrambler 350",
        category: "Off-Road Urban Scrambler",
        price: "₹1.99 - ₹2.09 Lakh",
        topSpeed: "125 kmph",
        claimedMileage: "30 kmpl",
        seatHeight: "813 mm",
        status: "Active",
        description: "Off-road urban scrambler with aggressive stance.",
        image: "https://placehold.co/400x250?text=Yezdi+Scrambler+350"
    },
    // --- YEZDI ADVENTURE (LONG-TRAVEL OFF-ROAD TOURER) ---
    {
        brand: "Yezdi",
        model: "Adventure",
        category: "Long-Travel Off-Road Tourer",
        price: "₹1.98 - ₹2.27 Lakh",
        topSpeed: "130 kmph",
        claimedMileage: "35 kmpl",
        seatHeight: "815 mm",
        status: "Active",
        description: "Long-travel off-road tourer for adventure seekers.",
        image: "https://placehold.co/400x250?text=Yezdi+Adventure"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let cleanStr = priceStr.replace(/₹|,|From/g, '').split('-')[0].trim();
    let isLakh = priceStr.toLowerCase().includes('lakh');
    if (isLakh) {
        cleanStr = cleanStr.replace(/lakh/i, '').trim();
    }
    let val = parseFloat(cleanStr) || 0;
    if (isLakh) {
        val *= 100000;
    }
    return val;
}

function parseCategory(catStr) {
    catStr = catStr.toLowerCase();
    if (catStr.includes('electric')) return 5;
    if (catStr.includes('scooter')) return 4;
    if (catStr.includes('adventure') || catStr.includes('tourer')) return 3;
    if (catStr.includes('retro') || catStr.includes('cruiser') || catStr.includes('scrambler') || catStr.includes('classic')) return 2;
    return 1; // Sport/Naked default
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Yezdi bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = 334; // All modern Yezdis are around 334cc
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedMileage) featureArr.push("Mileage: " + bike.claimedMileage);
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            if (bike.seatHeight) featureArr.push("Seat: " + bike.seatHeight);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = "N/A";
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
                console.log("Inserted " + bike.brand + " " + bike.model + " (Parsed Price: " + price + ")");
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " Yezdi bikes.");
    } catch (e) {
        console.error("Error seeding Yezdi bikes:", e);
    }
}

seedData();
