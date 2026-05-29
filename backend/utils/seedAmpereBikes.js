const db = require('../config/db');

const bikeData = [
    // --- LOW-SPEED SCOOTY (Active) ---
    {
        brand: "Ampere",
        model: "Reo 80 / Li Plus",
        category: "Low-Speed Scooty",
        engine: "250 W",
        power: "250 W",
        range: "70–80 km",
        topSpeed: "25 km/h",
        price: "₹59,900",
        status: "Active",
        features: "70–80 km range | 25 km/h max (No license needed)",
        description: "Entry-level low-speed electric scooty.",
        image: "https://placehold.co/400x250?text=Ampere+Reo+80"
    },
    // --- FAMILY SCOOTER (Active) ---
    {
        brand: "Ampere",
        model: "Magnus Neo",
        category: "Family Scooter",
        engine: "2.4 kW peak",
        power: "2.4 kW",
        range: "118 km",
        topSpeed: "65 km/h",
        price: "₹83,499 – ₹86,999",
        status: "Active",
        features: "118 km range | 65 km/h top speed",
        description: "Family-oriented electric scooter.",
        image: "https://placehold.co/400x250?text=Ampere+Magnus+Neo"
    },
    {
        brand: "Ampere",
        model: "Magnus Grand",
        category: "Family Scooter",
        engine: "2.1 kW",
        power: "2.1 kW",
        range: "118 km",
        topSpeed: "55 km/h",
        price: "₹89,999",
        status: "Active",
        features: "118 km range | 55 km/h top speed",
        description: "Grand family commuter.",
        image: "https://placehold.co/400x250?text=Ampere+Magnus+Grand"
    },
    // --- PERFORMANCE SCOOTY (Active) ---
    {
        brand: "Ampere",
        model: "Magnus G Max",
        category: "Performance Scooty",
        engine: "2.5 kW",
        power: "2.5 kW",
        range: "110 km",
        topSpeed: "68 km/h",
        price: "₹97,999",
        status: "Active",
        features: "110 km range | 68 km/h top speed",
        description: "Performance-focused electric scooty.",
        image: "https://placehold.co/400x250?text=Ampere+Magnus+G+Max"
    },
    // --- PREMIUM SCOOTER (Active) ---
    {
        brand: "Ampere",
        model: "Nexus EX / ST",
        category: "Premium Scooter",
        engine: "4.0 kW",
        power: "4.0 kW",
        range: "100–136 km",
        topSpeed: "93 km/h",
        price: "₹1,19,999 – ₹1,30,000",
        status: "Active",
        features: "100–136 km range | 93 km/h top speed",
        description: "Premium long-range electric scooter.",
        image: "https://placehold.co/400x250?text=Ampere+Nexus"
    },
    // --- ELECTRIC BIKE (Upcoming) ---
    {
        brand: "Ampere",
        model: "Xyber",
        category: "Electric Bike",
        engine: "10.0 kW peak",
        power: "10.0 kW",
        range: "150 km",
        topSpeed: "N/A",
        price: "₹1,40,000 – ₹1,60,000 (Est.)",
        status: "Upcoming",
        features: "150 km range | Next-gen smart naked electric bike",
        description: "Next-generation smart electric bike.",
        image: "https://placehold.co/400x250?text=Ampere+Xyber"
    },
    // --- B2B DELIVERY (Upcoming) ---
    {
        brand: "Ampere",
        model: "Xpress",
        category: "B2B Delivery",
        engine: "~3.0 kW",
        power: "3.0 kW",
        range: "N/A",
        topSpeed: "N/A",
        price: "₹95,000 (Estimated)",
        status: "Upcoming",
        features: "Heavy-duty cargo utility frame, dual swappable batteries",
        description: "Commercial delivery solution.",
        image: "https://placehold.co/400x250?text=Ampere+Xpress"
    },
    // --- DISCONTINUED ---
    {
        brand: "Ampere",
        model: "Primus",
        category: "Premium Scooter",
        engine: "4.4 kW",
        power: "4.4 kW",
        range: "N/A",
        topSpeed: "N/A",
        price: "₹1,46,000 (Last Known)",
        status: "Discontinued",
        features: "Phased out to integrate the newly styled Nexus line",
        description: "Old premium scooter.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Ampere",
        model: "Reo Elite",
        category: "Budget Scooter",
        engine: "250 W",
        power: "250 W",
        range: "N/A",
        topSpeed: "N/A",
        price: "₹62,989 (Last Known)",
        status: "Discontinued",
        features: "Lead-acid battery platform replaced by Li Plus",
        description: "Old budget scooty.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Ampere",
        model: "Zeal EX",
        category: "Entry Scooter",
        engine: "1.2 kW",
        power: "1.2 kW",
        range: "N/A",
        topSpeed: "N/A",
        price: "₹75,900 (Last Known)",
        status: "Discontinued",
        features: "Older Generation powertrain trimmed to clear segment overlap",
        description: "Old entry-level scooter.",
        image: "https://placehold.co/400x250?text=Discontinued"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('–')[0].trim().split(' ')[0];
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Ampere bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // 5 is Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; // Electric vehicles don't have CC
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Combine features with power/range for better display
            let combinedFeatures = bike.features;
            
            const finalDesc = "[" + bike.status + "] " + bike.description;
            const transmission = "Automatic";

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        bike.power, combinedFeatures, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " Ampere bikes.");
    } catch (e) {
        console.error("Error seeding Ampere bikes:", e);
    }
}

seedData();
