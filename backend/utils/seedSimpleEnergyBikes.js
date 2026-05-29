const db = require('../config/db');

const bikeData = [
    // --- SIMPLE DOT ONE (ENTRY-LEVEL) ---
    {
        brand: "Simple Energy",
        model: "Dot One",
        category: "Electric Scooter",
        price: "From ₹1,40,499",
        topSpeed: "105 kmph",
        claimedRange: "151 km",
        battery: "3.7 kWh (Fixed)",
        motor: "4.5 kW / 8.5 kW",
        status: "Active",
        description: "Entry-level electric scooter with fixed battery.",
        image: "https://placehold.co/400x250?text=Simple+Dot+One"
    },
    // --- SIMPLE ONE S GEN 2 (EXTENDED RANGE) ---
    {
        brand: "Simple Energy",
        model: "One S Gen 2",
        category: "Electric Scooter",
        price: "From ₹1,61,218",
        topSpeed: "90 kmph",
        claimedRange: "190 km",
        battery: "4.5 kWh (Hybrid)",
        motor: "4.5 kW / 6.4 kW",
        status: "Active",
        description: "Extended range with hybrid battery technology.",
        image: "https://placehold.co/400x250?text=Simple+One+S+Gen2"
    },
    // --- SIMPLE ONE GEN 2 (LONG RANGE) ---
    {
        brand: "Simple Energy",
        model: "One Gen 2",
        category: "Electric Scooter",
        price: "From ₹1,83,992",
        topSpeed: "115 kmph",
        claimedRange: "265 km",
        battery: "5.0 kWh (Hybrid)",
        motor: "4.5 kW / 8.8 kW",
        status: "Active",
        description: "Long-range electric scooter with high capacity battery.",
        image: "https://placehold.co/400x250?text=Simple+One+Gen2"
    },
    // --- SIMPLE ULTRA (HEAVY-DUTY) ---
    {
        brand: "Simple Energy",
        model: "Ultra",
        category: "Heavy-Duty Electric",
        price: "From ₹2,34,999",
        topSpeed: "115 kmph",
        claimedRange: "400 km",
        battery: "Heavy-Duty Hybrid",
        motor: "4.5 kW / 8.8 kW",
        status: "Active",
        description: "Heavy-duty electric scooter with maximum range.",
        image: "https://placehold.co/400x250?text=Simple+Ultra"
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
        
        console.log("Seeding Simple Energy bikes...");
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
        console.log("\\nSuccessfully seeded " + count + " Simple Energy bikes.");
    } catch (e) {
        console.error("Error seeding Simple Energy bikes:", e);
    }
}

seedData();
