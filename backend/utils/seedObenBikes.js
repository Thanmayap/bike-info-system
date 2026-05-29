const db = require('../config/db');

const bikeData = [
    // --- OBEN RORR EZ (2.6 KWH) (BASE VARIANT) ---
    {
        brand: "Oben",
        model: "Rorr EZ (2.6 kWh)",
        category: "Urban Electric Bike",
        price: "From ₹99,992",
        topSpeed: "95 kmph",
        claimedRange: "110 km / charge",
        battery: "2.6 kWh LFP (Fixed)",
        motor: "7.5 kW Mid-Drive",
        status: "Active",
        description: "Base urban variant with compact battery.",
        image: "https://placehold.co/400x250?text=Oben+Rorr+EZ+2.6"
    },
    // --- OBEN RORR EVO (PREMIUM PERFORMANCE) ---
    {
        brand: "Oben",
        model: "Rorr EVO",
        category: "Premium Performance",
        price: "From ₹1,24,999",
        topSpeed: "110 kmph",
        claimedRange: "180 km / charge",
        battery: "3.4 kWh LFP (Fixed)",
        motor: "9.0 kW Mid-Drive",
        status: "Active",
        description: "Premium performance variant with highest speed.",
        image: "https://placehold.co/400x250?text=Oben+Rorr+EVO"
    },
    // --- OBEN RORR EZ (3.4 KWH) (EXTENDED RANGE) ---
    {
        brand: "Oben",
        model: "Rorr EZ (3.4 kWh)",
        category: "Extended Range",
        price: "From ₹1,19,992",
        topSpeed: "95 kmph",
        claimedRange: "140 km / charge",
        battery: "3.4 kWh LFP (Fixed)",
        motor: "7.5 kW Mid-Drive",
        status: "Active",
        description: "Extended range variant with mid-size battery.",
        image: "https://placehold.co/400x250?text=Oben+Rorr+EZ+3.4"
    },
    // --- OBEN RORR EZ (4.4 KWH) (LONG RANGE) ---
    {
        brand: "Oben",
        model: "Rorr EZ (4.4 kWh)",
        category: "Long Range",
        price: "From ₹1,29,992",
        topSpeed: "95 kmph",
        claimedRange: "175 km / charge",
        battery: "4.4 kWh LFP (Fixed)",
        motor: "7.5 kW Mid-Drive",
        status: "Active",
        description: "Long range variant with large battery pack.",
        image: "https://placehold.co/400x250?text=Oben+Rorr+EZ+4.4"
    },
    // --- OBEN RORR EZ SIGMA (SMART VARIANT) ---
    {
        brand: "Oben",
        model: "Rorr EZ Sigma",
        category: "Smart Electric Bike",
        price: "From ₹1,16,499",
        topSpeed: "95 kmph",
        claimedRange: "175 km / charge",
        battery: "4.4 kWh LFP (Fixed)",
        motor: "7.5 kW Mid-Drive",
        status: "Active",
        description: "Smart variant with advanced connectivity.",
        image: "https://placehold.co/400x250?text=Oben+Rorr+EZ+Sigma"
    },
    // --- OBEN RORR (STANDARD) (FLAGSHIP) ---
    {
        brand: "Oben",
        model: "Rorr (Standard)",
        category: "Flagship Standard",
        price: "From ₹1,49,999",
        topSpeed: "100 kmph",
        claimedRange: "187 km / charge",
        battery: "4.4 kWh LFP (Fixed)",
        motor: "8.0 kW Mid-Drive",
        status: "Active",
        description: "Flagship standard variant with maximum range.",
        image: "https://placehold.co/400x250?text=Oben+Rorr+Standard"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Oben bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange.replace(' / charge', ''));
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
        console.log("\\nSuccessfully seeded " + count + " Oben bikes.");
    } catch (e) {
        console.error("Error seeding Oben bikes:", e);
    }
}

seedData();
