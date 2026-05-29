const db = require('../config/db');

const bikeData = [
    // --- KINETIC GREEN E LUNA (ELECTRIC UTILITY MOPED) ---
    {
        brand: "Kinetic Green",
        model: "E Luna",
        category: "Electric Utility Moped",
        price: "₹69,990 – ₹84,590",
        topSpeed: "50 kmph",
        claimedRange: "110 - 120 km",
        battery: "2.0 kWh LFP",
        motor: "1.2 kW",
        status: "Active",
        description: "Electric utility moped for heavy-duty use.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+E+Luna"
    },
    // --- KINETIC GREEN ZOOM (ENTRY URBAN COMMUTER) ---
    {
        brand: "Kinetic Green",
        model: "Zoom",
        category: "Entry Urban Commuter",
        price: "From ₹71,531",
        topSpeed: "40 kmph",
        claimedRange: "100 km",
        battery: "1.4 kWh Li-ion",
        motor: "250W BLDC",
        status: "Active",
        description: "Entry-level urban commuter.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+Zoom"
    },
    // --- KINETIC GREEN ZING (SMART CITY SCOOTER) ---
    {
        brand: "Kinetic Green",
        model: "Zing",
        category: "Smart City Scooter",
        price: "₹71,990 – ₹75,990",
        topSpeed: "45 kmph",
        claimedRange: "100 km",
        battery: "1.7 kWh Li-ion",
        motor: "1.2 kW Hub",
        status: "Active",
        description: "Smart city scooter with modern features.",
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
        battery: "2.27 kWh Li-ion",
        motor: "2.1 kW",
        status: "Active",
        description: "High-utility family scooter.",
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
        battery: "3.0 kWh Lithium",
        motor: "3.0 kW",
        status: "Active",
        description: "High-speed premium scooter.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+Flex"
    },
    // --- KINETIC GREEN DX (RETRO-MODERN PREMIUM EV) ---
    {
        brand: "Kinetic Green",
        model: "DX",
        category: "Retro-Modern Premium EV",
        price: "₹1,11,499 – ₹1,17,000",
        topSpeed: "90 kmph",
        claimedRange: "116 km",
        battery: "2.5 kWh LFP",
        motor: "Mid-Drive",
        status: "Active",
        description: "Retro-modern premium electric vehicle.",
        image: "https://placehold.co/400x250?text=Kinetic+Green+DX"
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
        
        console.log("Seeding Updated Kinetic Green bikes...");
        let count = 0;
        
        // Remove old Kinetic Green records to apply the update cleanly
        await sqliteDb.run("DELETE FROM bikes WHERE brand='Kinetic Green'");
        console.log("Cleared old Kinetic Green data.");

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

            await sqliteDb.run(
                "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                    power, combinedFeatures, finalDesc, bike.image, is_featured
                ]
            );
            count++;
            console.log("Inserted " + bike.brand + " " + bike.model);
        }
        console.log("\\nSuccessfully seeded " + count + " updated Kinetic Green bikes.");
    } catch (e) {
        console.error("Error seeding updated Kinetic Green bikes:", e);
    }
}

seedData();
