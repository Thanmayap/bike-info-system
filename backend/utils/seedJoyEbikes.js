const db = require('../config/db');

const bikeData = [
    // --- JOY E-BIKE GEN NEXT NANU (LOW-SPEED COMMUTER) ---
    {
        brand: "Joy e-bike",
        model: "Gen Next Nanu",
        category: "Low-Speed Commuter",
        price: "₹53,999",
        topSpeed: "25 kmph",
        realWorldRange: "70 km",
        battery: "1.44 kWh Lithium",
        motor: "250W BLDC",
        status: "Active",
        description: "Low-speed commuter for everyday use.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Gen+Next+Nanu"
    },
    // --- JOY E-BIKE WOLF (LOW-SPEED COMMUTER) ---
    {
        brand: "Joy e-bike",
        model: "Wolf",
        category: "Low-Speed Commuter",
        price: "₹54,999",
        topSpeed: "25 kmph",
        realWorldRange: "60 - 65 km",
        battery: "1.44 kWh Lithium",
        motor: "250W BLDC",
        status: "Active",
        description: "Basic low-speed commuter.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Wolf"
    },
    // --- JOY E-BIKE GEN NXT / ECO (LOW-SPEED SMART) ---
    {
        brand: "Joy e-bike",
        model: "Gen Nxt / Eco",
        category: "Low-Speed Smart",
        price: "₹60,827",
        topSpeed: "25 kmph",
        realWorldRange: "90 km",
        battery: "1.44 kWh Lithium",
        motor: "250W BLDC",
        status: "Active",
        description: "Smart low-speed scooter with extended range.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Gen+Nxt"
    },
    // --- JOY E-BIKE GLOB (LOW-SPEED SLEEK) ---
    {
        brand: "Joy e-bike",
        model: "Glob",
        category: "Low-Speed Sleek",
        price: "₹70,000",
        topSpeed: "25 kmph",
        realWorldRange: "60 km",
        battery: "1.44 kWh NMC",
        motor: "250W BLDC",
        status: "Active",
        description: "Sleek design low-speed commuter.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Glob"
    },
    // --- JOY E-BIKE GEN NEXT NANU PLUS (HIGH-SPEED COMMUTER) ---
    {
        brand: "Joy e-bike",
        model: "Gen Next Nanu Plus",
        category: "High-Speed Commuter",
        price: "₹85,000",
        topSpeed: "55 kmph",
        realWorldRange: "88 km",
        battery: "2.1 kWh Lithium",
        motor: "1.5 kW Hub",
        status: "Active",
        description: "High-speed commuter with better performance.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Nanu+Plus"
    },
    // --- JOY E-BIKE WOLF PLUS (HIGH-SPEED URBAN) ---
    {
        brand: "Joy e-bike",
        model: "Wolf Plus",
        category: "High-Speed Urban",
        price: "₹1,16,000",
        topSpeed: "55 kmph",
        realWorldRange: "90 km",
        battery: "2.1 kWh Lithium",
        motor: "1.5 kW Hub",
        status: "Active",
        description: "High-speed urban commuter.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Wolf+Plus"
    },
    // --- JOY E-BIKE MIHOS (FLAGSHIP SMART SCOOTER) ---
    {
        brand: "Joy e-bike",
        model: "Mihos",
        category: "Flagship Smart Scooter",
        price: "₹1,12,997",
        topSpeed: "70 kmph",
        realWorldRange: "130 km",
        battery: "2.88 kWh Ferro-Phosphate",
        motor: "1.5 kW",
        status: "Active",
        description: "Flagship smart scooter with premium features.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Mihos"
    },
    // --- JOY E-BIKE HURRICANE (HIGH-PERFORMANCE BIKE) ---
    {
        brand: "Joy e-bike",
        model: "Hurricane",
        category: "High-Performance Bike",
        price: "₹2,33,000",
        topSpeed: "90 kmph",
        realWorldRange: "80 km",
        battery: "3.5 kWh Lithium",
        motor: "5.0 kW DC Motor",
        status: "Active",
        description: "High-performance electric bike.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Hurricane"
    },
    // --- JOY E-BIKE BEAST (FLAGSHIP NAKED SPORTBIKE) ---
    {
        brand: "Joy e-bike",
        model: "Beast",
        category: "Flagship Naked Sportbike",
        price: "₹2,42,000",
        topSpeed: "90 kmph",
        realWorldRange: "110 km",
        battery: "4.3 kWh Lithium",
        motor: "5.0 kW DC Motor",
        status: "Active",
        description: "Flagship naked sportbike with maximum range.",
        image: "https://placehold.co/400x250?text=Joy+e-bike+Beast"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('-')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Joy e-bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.battery) featureArr.push("Battery: " + bike.battery);
            if (bike.realWorldRange) featureArr.push("Range: " + bike.realWorldRange);
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
        console.log("\\nSuccessfully seeded " + count + " Joy e-bikes.");
    } catch (e) {
        console.error("Error seeding Joy e-bikes:", e);
    }
}

seedData();
