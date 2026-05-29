const db = require('../config/db');

const bikeData = [
    // --- REVOLT RV1 (ENTRY-LEVEL) ---
    {
        brand: "Revolt",
        model: "RV1",
        category: "Entry-Level Electric",
        price: "₹94,990",
        topSpeed: "70 kmph",
        claimedRange: "100 km",
        battery: "2.2 kWh Li-ion",
        motor: "2.8 kW Mid-Drive",
        status: "Active",
        description: "Entry-level electric bike for daily commuting.",
        image: "https://placehold.co/400x250?text=Revolt+RV1"
    },
    // --- REVOLT RV1+ (EXTENDED RANGE) ---
    {
        brand: "Revolt",
        model: "RV1+",
        category: "Extended Range Electric",
        price: "₹1,04,990",
        topSpeed: "70 kmph",
        claimedRange: "160 km",
        battery: "3.24 kWh Li-ion",
        motor: "2.8 kW Mid-Drive",
        status: "Active",
        description: "Extended range variant with higher battery capacity.",
        image: "https://placehold.co/400x250?text=Revolt+RV1+Plus"
    },
    // --- REVOLT RV BLAZEX (PERFORMANCE) ---
    {
        brand: "Revolt",
        model: "RV BlazeX",
        category: "Performance Electric",
        price: "₹1,19,990",
        topSpeed: "85 kmph",
        claimedRange: "150 km",
        battery: "3.24 kWh Li-ion",
        motor: "3.0 kW Mid-Drive",
        status: "Active",
        description: "Performance-oriented electric bike.",
        image: "https://placehold.co/400x250?text=Revolt+RV+BlazeX"
    },
    // --- REVOLT RV400 BRZ (SPORT) ---
    {
        brand: "Revolt",
        model: "RV400 BRZ",
        category: "Sport Electric",
        price: "₹1,29,950",
        topSpeed: "85 kmph",
        claimedRange: "150 km",
        battery: "3.24 kWh Li-ion",
        motor: "3.0 kW Mid-Drive",
        status: "Active",
        description: "Sport variant with aggressive styling.",
        image: "https://placehold.co/400x250?text=Revolt+RV400+BRZ"
    },
    // --- REVOLT RV400 (FLAGSHIP) ---
    {
        brand: "Revolt",
        model: "RV400",
        category: "Flagship Electric",
        price: "₹1,39,950",
        topSpeed: "85 kmph",
        claimedRange: "150 km",
        battery: "3.24 kWh Li-ion",
        motor: "3.0 kW Mid-Drive (5kW Peak)",
        status: "Active",
        description: "Flagship model with peak power boost.",
        image: "https://placehold.co/400x250?text=Revolt+RV400"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').split('-')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Revolt bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange);
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            if (bike.battery) featureArr.push("Battery: " + bike.battery);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.motor || "Electric";
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
        console.log("\\nSuccessfully seeded " + count + " Revolt bikes.");
    } catch (e) {
        console.error("Error seeding Revolt bikes:", e);
    }
}

seedData();
