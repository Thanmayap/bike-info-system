const db = require('../config/db');

const bikeData = [
    // --- ULTRAVIOLETTE SHOCKWAVE (ENTRY ADVENTURE) ---
    {
        brand: "Ultraviolette",
        model: "Shockwave",
        category: "Entry Adventure / Off-Road",
        price: "From ₹1,75,000",
        topSpeed: "110+ kmph",
        claimedRange: "165 km / charge",
        battery: "Lightweight Modular",
        status: "Active",
        description: "Entry-level adventure electric bike for off-road enthusiasts.",
        image: "https://placehold.co/400x250?text=Ultraviolette+Shockwave"
    },
    // --- ULTRAVIOLETTE X47 CROSSOVER (ADVANCED SPORTS) ---
    {
        brand: "Ultraviolette",
        model: "X47 Crossover",
        category: "Advanced Sports Tourer",
        price: "₹2,49,000 – ₹4,59,000",
        topSpeed: "145 kmph",
        claimedRange: "211 - 323 km",
        battery: "7.0 - 10.3 kWh",
        status: "Active",
        description: "Advanced sports tourer with multiple battery options.",
        image: "https://placehold.co/400x250?text=Ultraviolette+X47"
    },
    // --- ULTRAVIOLETTE F77 MACH 2 (PREMIUM SPORTBIKE) ---
    {
        brand: "Ultraviolette",
        model: "F77 Mach 2",
        category: "Premium Electric Sportbike",
        price: "₹2,99,000 – ₹3,99,000",
        topSpeed: "155 kmph",
        claimedRange: "211 - 323 km",
        battery: "7.1 - 10.3 kWh",
        status: "Active",
        description: "Premium electric sportbike with high performance.",
        image: "https://placehold.co/400x250?text=Ultraviolette+F77+Mach2"
    },
    // --- ULTRAVIOLETTE F77 SUPER (STREET TRACK) ---
    {
        brand: "Ultraviolette",
        model: "F77 Super",
        category: "StreetTrack-Inspired Naked Sport",
        price: "₹2,99,000 – ₹3,99,000",
        topSpeed: "155 kmph",
        claimedRange: "211 - 323 km",
        battery: "7.1 - 10.3 kWh",
        status: "Active",
        description: "StreetTrack-inspired naked sport electric bike.",
        image: "https://placehold.co/400x250?text=Ultraviolette+F77+Super"
    },
    // --- ULTRAVIOLETTE TESSERACT (HIGH-SPEED SCOOTER) ---
    {
        brand: "Ultraviolette",
        model: "Tesseract",
        category: "High-Speed Performance Scooter",
        price: "From ₹1,45,000",
        topSpeed: "100+ kmph",
        claimedRange: "Macro-Urban",
        battery: "Performance Fixed",
        status: "Active",
        description: "High-speed performance scooter for urban commuting.",
        image: "https://placehold.co/400x250?text=Ultraviolette+Tesseract"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,|From/g, '').split('–')[0].split('-')[0].trim();
    return parseFloat(cleanStr) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Ultraviolette bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 5; // Electric
            const price = parsePrice(bike.price);
            const engine_cc = 0; 
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.claimedRange) featureArr.push("Range: " + bike.claimedRange.replace(' / charge', ''));
            if (bike.topSpeed) featureArr.push("Speed: " + bike.topSpeed.replace('+', ''));
            if (bike.battery) featureArr.push("Battery: " + bike.battery);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = "Electric";
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
        console.log("\\nSuccessfully seeded " + count + " Ultraviolette bikes.");
    } catch (e) {
        console.error("Error seeding Ultraviolette bikes:", e);
    }
}

seedData();
