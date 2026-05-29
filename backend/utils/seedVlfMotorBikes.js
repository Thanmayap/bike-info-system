const db = require('../config/db');

const bikeData = [
    // --- VLF TENNIS 150 (ELECTRIC) ---
    {
        brand: "VLF Motor",
        model: "Tennis 150",
        category: "Electric Scooter",
        engine: "1.5 kW Motor / Lithium-Ion",
        price: "From ₹1,00,038",
        topSpeed: "65 kmph",
        claimedRange: "130 km per charge",
        status: "Active",
        description: "Electric scooter for urban commuting.",
        image: "https://placehold.co/400x250?text=VLF+Tennis+150"
    },
    // --- VLF MOBSTER 135 (PETROL BS6) ---
    {
        brand: "VLF Motor",
        model: "Mobster 135",
        category: "Petrol Scooter",
        engine: "125 cc BS6 Petrol Engine",
        price: "From ₹1,30,000",
        topSpeed: "95 kmph",
        claimedMileage: "41 kmpl average",
        status: "Active",
        description: "Petrol scooter with fuel-efficient BS6 engine.",
        image: "https://placehold.co/400x250?text=VLF+Mobster+135"
    },
    // --- VLF MOBSTER 180 (PETROL UPCOMING) ---
    {
        brand: "VLF Motor",
        model: "Mobster 180",
        category: "Petrol Scooter (Upcoming)",
        engine: "180 cc Petrol (Upcoming Dec 2026)",
        price: "₹1,70,000 (Expected)",
        topSpeed: "110 kmph",
        claimedMileage: "35 kmpl average",
        status: "Upcoming",
        description: "Upcoming high-capacity petrol scooter.",
        image: "https://placehold.co/400x250?text=VLF+Mobster+180"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From|\(Expected\)/ig, '').split('-')[0].trim();
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
        
        console.log("Seeding VLF Motor bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const isElectric = bike.category.toLowerCase().includes('electric') || bike.engine.toLowerCase().includes('motor');
            const category_id = isElectric ? 5 : 4; // 5 = Electric, 4 = Scooter
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine); 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange.replace(' per charge', ''));
            if (bike.claimedMileage) featureArr.push("Mileage: " + bike.claimedMileage);
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
            if (bike.engine) featureArr.push(bike.engine);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = isElectric ? "Electric" : "Petrol";
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
        console.log("\\nSuccessfully seeded " + count + " VLF Motor bikes.");
    } catch (e) {
        console.error("Error seeding VLF Motor bikes:", e);
    }
}

seedData();
