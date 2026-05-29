const db = require('../config/db');

const bikeData = [
    // --- KINETIC GREEN E LUNA (ELECTRIC MOPED / UTILITY) ---
    {
        brand: "Kinetic Green",
        model: "E Luna",
        category: "Electric Moped / Utility",
        price: "₹69,990 – ₹84,590",
        topSpeed: "50 kmph",
        claimedRange: "110 km",
        battery: "2.0 kWh LFP",
        motor: "1.2 kW",
        status: "Active",
        description: "Electric moped for utility and daily commutes.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+E+Luna"
    },
    // --- KINETIC GREEN ZOOM (ENTRY-LEVEL URBAN SCOOTER) ---
    {
        brand: "Kinetic Green",
        model: "Zoom",
        category: "Entry-Level Urban Scooter",
        price: "From ₹71,531",
        topSpeed: "40 kmph",
        claimedRange: "100 km",
        battery: "1.4 kWh Li-ion",
        motor: "250W BLDC",
        status: "Active",
        description: "Entry-level urban scooter for easy commuting.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+Zoom"
    },
    // --- KINETIC GREEN ZING (SMART CITY COMMUTER) ---
    {
        brand: "Kinetic Green",
        model: "Zing",
        category: "Smart City Commuter",
        price: "₹71,990 – ₹75,990",
        topSpeed: "45 kmph",
        claimedRange: "100 km",
        battery: "1.7 kWh Li-ion",
        motor: "1.2 kW Hub",
        status: "Active",
        description: "Smart city commuter with modern features.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+Zing"
    },
    // --- KINETIC GREEN ZULU (HIGH-UTILITY FAMILY SCOOTER) ---
    {
        brand: "Kinetic Green",
        model: "Zulu",
        category: "High-Utility Family Scooter",
        price: "From ₹79,990",
        topSpeed: "60 kmph",
        claimedRange: "104 km",
        battery: "2.1 kWh Li-ion",
        motor: "2.1 kW",
        status: "Active",
        description: "High-utility family scooter with good performance.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+Zulu"
    },
    // --- KINETIC GREEN FLEX (HIGH-SPEED PREMIUM SCOOTER) ---
    {
        brand: "Kinetic Green",
        model: "Flex",
        category: "High-Speed Premium Scooter",
        price: "From ₹1,09,874",
        topSpeed: "72 kmph",
        claimedRange: "120 km",
        battery: "3.1 kWh Lithium",
        motor: "3.0 kW",
        status: "Active",
        description: "High-speed premium scooter with long range.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+Flex"
    },
    // --- KINETIC DX STANDARD (RETRO-MODERN PREMIUM EV) ---
    {
        brand: "Kinetic Green",
        model: "DX Standard",
        category: "Retro-Modern Premium EV",
        price: "From ₹1,11,499",
        topSpeed: "80 kmph",
        claimedRange: "102 km",
        battery: "Range-X LFP",
        motor: "Mid-Drive",
        status: "Active",
        description: "Retro-modern premium electric vehicle.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+DX+Standard"
    },
    // --- KINETIC DX PLUS (FLAGSHIP SMART SCOOTER) ---
    {
        brand: "Kinetic Green",
        model: "DX Plus",
        category: "Flagship Smart Scooter",
        price: "From ₹1,17,000",
        topSpeed: "80 kmph",
        claimedRange: "115 km",
        battery: "Range-X LFP",
        motor: "Premium Tech",
        status: "Active",
        description: "Flagship smart scooter with advanced features.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+DX+Plus"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').split('–')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Kinetic Green bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.battery) featureArr.push("Battery: " + bike.battery);
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange);
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed);
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
        console.log("\\nSuccessfully seeded " + count + " Kinetic Green bikes.");
    } catch (e) {
        console.error("Error seeding Kinetic Green bikes:", e);
    }
}

seedData();
