const db = require('../config/db');

const bikeData = [
    // --- OKINAWA R30 (ENTRY-LEVEL) ---
    {
        brand: "Okinawa",
        model: "R30",
        category: "Entry-Level Scooter",
        price: "₹61,998",
        topSpeed: "25 kmph",
        claimedRange: "60 km / charge",
        battery: "1.34 kWh (Li-ion)",
        motor: "250W BLDC Hub",
        status: "Active",
        description: "Entry-level electric scooter for basic commuting.",
        image: "https://placehold.co/400x250?text=Okinawa+R30"
    },
    // --- OKINAWA LITE (BASIC COMMUTER) ---
    {
        brand: "Okinawa",
        model: "Lite",
        category: "Basic Commuter",
        price: "₹69,093",
        topSpeed: "25 kmph",
        claimedRange: "60 km / charge",
        battery: "1.25 kWh (Li-ion)",
        motor: "250W Waterproof",
        status: "Active",
        description: "Basic commuter with waterproof motor.",
        image: "https://placehold.co/400x250?text=Okinawa+Lite"
    },
    // --- OKINAWA RIDGE+ (GPS VARIANT) ---
    {
        brand: "Okinawa",
        model: "Ridge+ (GPS)",
        category: "Smart GPS Scooter",
        price: "₹90,549",
        topSpeed: "45 kmph",
        claimedRange: "84 km / charge",
        battery: "1.75 kWh (Li-ion)",
        motor: "800W BLDC Hub",
        status: "Active",
        description: "GPS-enabled smart commuter.",
        image: "https://placehold.co/400x250?text=Okinawa+Ridge+GPS"
    },
    // --- OKINAWA PRAISEPRO (PERFORMANCE) ---
    {
        brand: "Okinawa",
        model: "PraisePro",
        category: "Performance Scooter",
        price: "₹84,443",
        topSpeed: "56 kmph",
        claimedRange: "81 km / charge",
        battery: "2.0 kWh (Li-ion)",
        motor: "2.5 kW Peak BLDC",
        status: "Active",
        description: "Performance-oriented electric scooter.",
        image: "https://placehold.co/400x250?text=Okinawa+PraisePro"
    },
    // --- OKINAWA RIDGE 100 (LONG RANGE) ---
    {
        brand: "Okinawa",
        model: "Ridge 100",
        category: "Long Range Scooter",
        price: "₹1,15,311",
        topSpeed: "45 kmph",
        claimedRange: "149 km / charge",
        battery: "3.12 kWh (Li-ion)",
        motor: "800W BLDC Hub",
        status: "Active",
        description: "Long range commuter with extended battery.",
        image: "https://placehold.co/400x250?text=Okinawa+Ridge+100"
    },
    // --- OKINAWA DUAL 100 (DUAL BATTERY) ---
    {
        brand: "Okinawa",
        model: "Dual 100",
        category: "Dual Battery Scooter",
        price: "₹1,19,085",
        topSpeed: "60 kmph",
        claimedRange: "129 km / charge",
        battery: "3.12 kWh (Li-ion)",
        motor: "3.0 kW Peak Motor",
        status: "Active",
        description: "Dual battery variant for extended range.",
        image: "https://placehold.co/400x250?text=Okinawa+Dual+100"
    },
    // --- OKINAWA IPRAISE+ (PREMIUM CONNECTIVITY) ---
    {
        brand: "Okinawa",
        model: "iPraise+",
        category: "Premium Connectivity",
        price: "₹1,22,955",
        topSpeed: "58 kmph",
        claimedRange: "137 km / charge",
        battery: "3.3 kWh (Li-ion)",
        motor: "2.7 kW BLDC Hub",
        status: "Active",
        description: "Premium scooter with advanced connectivity.",
        image: "https://placehold.co/400x250?text=Okinawa+iPraise+"
    },
    // --- OKINAWA OKHI-90 (FLAGSHIP) ---
    {
        brand: "Okinawa",
        model: "Okhi-90",
        category: "Flagship High-Speed",
        price: "₹1,49,991",
        topSpeed: "90 kmph",
        claimedRange: "160 km / charge",
        battery: "3.6 kWh (Li-ion)",
        motor: "3.8 kW Mid-Drive",
        status: "Active",
        description: "Flagship high-speed electric scooter.",
        image: "https://placehold.co/400x250?text=Okinawa+Okhi+90"
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
        
        console.log("Seeding Updated Okinawa bikes...");
        let count = 0;
        
        // Remove old Okinawa records to apply the update cleanly
        await sqliteDb.run("DELETE FROM bikes WHERE brand='Okinawa'");
        console.log("Cleared old Okinawa data.");

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
        console.log("\\nSuccessfully seeded " + count + " updated Okinawa bikes.");
    } catch (e) {
        console.error("Error seeding updated Okinawa bikes:", e);
    }
}

seedData();
