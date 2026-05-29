const db = require('../config/db');

const bikeData = [
    // --- OKINAWA E1 (ENTRY-LEVEL VARIANT) ---
    {
        brand: "Okinawa",
        model: "E1X",
        category: "Entry-Level Scooter",
        variant: "E1X",
        powertrain: "1.5 kW BLDC hub motor",
        topSpeed: "55 kmph",
        battery: "1.9 kWh Lithium-ion (Swappable)",
        chargingTime: "3 - 4 hours",
        chassis: "12-inch alloys, Front & Rear disc brakes, Combi Braking (CBS)",
        storage: "12-litre under-seat boot",
        price: "₹55,000",
        status: "Active",
        features: "Instant battery swapping capability",
        smartTech: "Basic LED headlamps, Anti-theft wheel locking",
        description: "Entry-level variant tailored for instant battery swapping.",
        image: "https://placehold.co/400x250?text=Okinawa+E1X"
    },
    // --- OKINAWA E1+ (MID-RANGE VARIANT) ---
    {
        brand: "Okinawa",
        model: "E1+",
        category: "Mid-Range Scooter",
        variant: "E1+",
        powertrain: "1.8 kW BLDC hub motor",
        topSpeed: "60 kmph",
        battery: "1.9 kWh Lithium-ion (Swappable)",
        chargingTime: "3 - 4 hours",
        chassis: "12-inch alloys, Front & Rear disc brakes, Combi Braking (CBS)",
        storage: "12-litre under-seat boot",
        price: "₹1,20,134",
        status: "Active",
        features: "Full smart connectivity",
        smartTech: "Live tracking, Geofencing, Tow alerts, Battery health status",
        description: "Mid-range variant featuring full smart connectivity.",
        image: "https://placehold.co/400x250?text=Okinawa+E1+"
    },
    // --- OKINAWA E1 STD (PREMIUM VARIANT) ---
    {
        brand: "Okinawa",
        model: "E1 STD",
        category: "Premium Scooter",
        variant: "E1 STD",
        powertrain: "2.0 kW BLDC hub motor",
        topSpeed: "65 kmph",
        battery: "2.0 kWh Lithium-ion (Swappable)",
        chargingTime: "3 - 4 hours",
        chassis: "12-inch alloys, Front & Rear disc brakes, Combi Braking (CBS)",
        storage: "12-litre under-seat boot",
        price: "₹1,22,699",
        status: "Active",
        features: "Extended range and cruise control",
        smartTech: "Live tracking, Geofencing, Tow alerts, LED projector headlamps",
        description: "Premium variant offering extended range and cruise control.",
        image: "https://placehold.co/400x250?text=Okinawa+E1+STD"
    },
    // --- OKINAWA E1 LE (LIMITED EDITION) ---
    {
        brand: "Okinawa",
        model: "E1 LE",
        category: "Limited Edition Scooter",
        variant: "E1 LE",
        powertrain: "2.2 kW BLDC hub motor",
        topSpeed: "65 kmph",
        battery: "2.0 kWh Lithium-ion (Swappable)",
        chargingTime: "3 - 4 hours",
        chassis: "12-inch alloys, Front & Rear disc brakes, Combi Braking (CBS)",
        storage: "12-litre under-seat boot",
        price: "₹1,25,615 – ₹1,30,323",
        status: "Active",
        features: "Custom premium finishes",
        smartTech: "Live tracking, Geofencing, Tow alerts, LED projector headlamps, Cruise control",
        description: "Limited Edition with custom premium finishes.",
        image: "https://placehold.co/400x250?text=Okinawa+E1+LE"
    },
    // --- SHARED SPECIFICATIONS ACROSS ALL VARIANTS ---
    {
        brand: "Okinawa",
        model: "E1 (Shared Specs)",
        category: "Smart Features",
        ridingModes: "Eco, Power, Reverse, Drag Mode (walk-assit)",
        security: "Anti-theft wheel locking, Geofencing, Tow alerts",
        digitalSuite: "Live tracking, Battery health status, LED projector headlamps",
        chargingOption: "Standard home outlets",
        price: "N/A",
        status: "Active",
        description: "Shared smart and mechanical features across all E1 variants.",
        image: "https://placehold.co/400x250?text=Okinawa+E1+Features"
    }
];

function parsePrice(priceStr) {
    if (!priceStr || priceStr === "N/A") return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('–')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Okinawa bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.battery) featureArr.push("Battery: " + bike.battery);
            if (bike.chargingTime) featureArr.push("Charge: " + bike.chargingTime);
            if (bike.ridingModes) featureArr.push("Modes: " + bike.ridingModes);
            if (bike.smartTech) featureArr.push("Tech: " + bike.smartTech);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.powertrain || "Electric";
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
        console.log("\\nSuccessfully seeded " + count + " Okinawa bikes.");
    } catch (e) {
        console.error("Error seeding Okinawa bikes:", e);
    }
}

seedData();
