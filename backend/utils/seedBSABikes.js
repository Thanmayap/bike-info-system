const db = require('../config/db');

const bikeData = [
    // --- BSA GOLD STAR 650 (THE MODERN-CLASSIC ICON) ---
    {
        brand: "BSA",
        model: "Gold Star 650",
        category: "Modern-Classic",
        engine: "652 cc, liquid-cooled, single-cylinder, DOHC, 4-valve",
        power: "45.6 bhp @ 6,500 rpm",
        torque: "55 Nm @ 4,000 rpm",
        transmission: "5-speed gearbox",
        fuelTank: "12 litres",
        mileage: "~25 kmpl",
        price: "₹2,99,000 – ₹3,45,000",
        status: "Active",
        features: "Traditional teardrop fuel tank, analogue twin-pod instrumentation, flat bench seat, extensive chrome premium detailing",
        description: "The modern-classic icon with premium chrome finish.",
        image: "https://placehold.co/400x250?text=BSA+Gold+Star+650"
    },
    {
        brand: "BSA",
        model: "Gold Star 650 (Legacy Edition)",
        category: "Modern-Classic",
        engine: "652 cc, liquid-cooled, single-cylinder, DOHC, 4-valve",
        power: "45.6 bhp @ 6,500 rpm",
        torque: "55 Nm @ 4,000 rpm",
        transmission: "5-speed gearbox",
        fuelTank: "12 litres",
        mileage: "~25 kmpl",
        price: "₹2,99,000 – ₹3,45,000",
        status: "Active",
        features: "41mm telescopic front forks, 5-step preload-adjustable rear twin shocks, Brembo brakes with dual-channel ABS, Premium Pirelli Phantom Sportscomp tyres",
        description: "Legacy Edition features premium chrome finish.",
        image: "https://placehold.co/400x250?text=BSA+Gold+Star+Legacy"
    },

    // --- BSA SCRAMBLER 650 (THE RUGGED TRAIL EXPLORER) ---
    {
        brand: "BSA",
        model: "Scrambler 650",
        category: "Scrambler",
        engine: "652 cc, liquid-cooled, single-cylinder (shared platform)",
        power: "45.6 bhp",
        torque: "55 Nm (low-end)",
        transmission: "5-speed gearbox",
        fuelTank: "12 litres",
        mileage: "~25 kmpl",
        price: "₹3,25,000 – ₹3,41,000",
        status: "Active",
        features: "Longer-travel suspension setup, Block-pattern dual-purpose knobby tyres, Raised exhaust canisters, Engine bash plate, Headlight grille",
        description: "Rugged trail explorer with aggressive trail ergonomics.",
        image: "https://placehold.co/400x250?text=BSA+Scrambler+650"
    },
    {
        brand: "BSA",
        model: "Scrambler 650 Trail", // Modified slightly to differentiate from the one above
        category: "Scrambler",
        engine: "652 cc, liquid-cooled, single-cylinder (shared platform)",
        power: "45.6 bhp",
        torque: "55 Nm (low-end)",
        transmission: "5-speed gearbox",
        fuelTank: "12 litres",
        mileage: "~25 kmpl",
        price: "₹3,25,000 – ₹3,41,000",
        status: "Active",
        features: "High ground clearance, Wide off-road braced handlebars, Minimalist chopped fenders",
        description: "Aggressive trail-focused design.",
        image: "https://placehold.co/400x250?text=BSA+Scrambler+650+Trail"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('–')[0].trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.split(' ')[0].replace(/,/g, '')) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding BSA bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 2; // Retro/Classic/Scrambler -> 2 (Cruiser)
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.fuelTank) featureArr.push("Tank: " + bike.fuelTank);
            if (bike.mileage) featureArr.push("Mileage: " + bike.mileage);
            featureArr.push(bike.features);
            let combinedFeatures = featureArr.join(" | ");
            if (combinedFeatures.length > 255) {
               combinedFeatures = combinedFeatures.substring(0, 252) + "...";
            }
            
            const power = bike.power;
            const torque = bike.torque;
            const transmission = bike.transmission.includes("5-speed") ? "5-Speed" : "Manual";
            const finalDesc = "[" + bike.status + "] " + bike.description;

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, torque, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        power, torque, combinedFeatures, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " BSA bikes.");
    } catch (e) {
        console.error("Error seeding BSA bikes:", e);
    }
}

seedData();
