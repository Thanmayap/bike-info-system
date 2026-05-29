const db = require('../config/db');

const bikeData = [
    // --- CROSSFIRE 500 SERIES (MID-CAPACITY NEO-RETRO) ---
    {
        brand: "Crossfire",
        model: "Crossfire 500 X",
        category: "Mid-Capacity Neo-Retro",
        engine: "486 cc, liquid-cooled, parallel-twin",
        power: "46.9 bhp @ 8,500 rpm",
        torque: "43 Nm",
        transmission: "6-speed gearbox",
        fuelTank: "13.5 litres",
        mileage: "~25 kmpl",
        price: "₹4,74,100 – ₹5,06,565",
        status: "Active",
        features: "Street-focused retro roadster with Pirelli MT60 tyres, flat seat, and low-slung license plate mount",
        description: "Street-focused retro roadster with premium components.",
        image: "https://placehold.co/400x250?text=Crossfire+500X"
    },
    {
        brand: "Crossfire",
        model: "Crossfire 500 XC",
        category: "Mid-Capacity Neo-Retro",
        engine: "486 cc, liquid-cooled, parallel-twin",
        power: "46.9 bhp @ 8,500 rpm",
        torque: "43 Nm",
        transmission: "6-speed gearbox",
        fuelTank: "13.5 litres",
        mileage: "~25 kmpl",
        price: "₹3,99,000 – ₹5,19,000",
        status: "Active",
        features: "Off-road biased scrambler featuring spoked wheels (19-inch front), raised front mudguard, rubber tank pads, and a skid plate",
        description: "Off-road biased scrambler with adventure capabilities.",
        image: "https://placehold.co/400x250?text=Crossfire+500XC"
    },
    // --- CROMWELL 1200 SERIES (HEAVYWEIGHT CLASSICS) ---
    {
        brand: "Cromwell",
        model: "Cromwell 1200",
        category: "Heavyweight Classics",
        engine: "1,222 cc, liquid-cooled, parallel-twin",
        power: "81.8 bhp @ 6,550 rpm",
        torque: "108 Nm",
        transmission: "6-speed gearbox with slipper clutch",
        fuelTank: "16 litres",
        mileage: "~21.7 kmpl",
        price: "₹7,83,000 – ₹8,37,863",
        status: "Active",
        features: "Traditional British-style luxury roadster with classic round headlights, relaxed ergonomics, and a premium leather bench seat",
        description: "Traditional British-style luxury roadster.",
        image: "https://placehold.co/400x250?text=Cromwell+1200"
    },
    {
        brand: "Cromwell",
        model: "Cromwell 1200 X",
        category: "Heavyweight Classics",
        engine: "1,222 cc, liquid-cooled, parallel-twin",
        power: "81.8 bhp @ 6,550 rpm",
        torque: "108 Nm",
        transmission: "6-speed gearbox with slipper clutch",
        fuelTank: "16 litres",
        mileage: "~21.7 kmpl",
        price: "₹9,10,600 – ₹9,74,000",
        status: "Active",
        features: "Rugged scrambler version with blocked tread tyres, metal headlight grille, fork gaiters, and aggressively carved ergonomics",
        description: "Rugged scrambler version with aggressive styling.",
        image: "https://placehold.co/400x250?text=Cromwell+1200X"
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
        
        console.log("Seeding Brixton/Crossfire/Cromwell bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 2; // Retro/Classic -> 2 (Cruiser)
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
            const transmission = bike.transmission.includes("6-speed") ? "6-Speed" : "Manual";
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
        console.log("\\nSuccessfully seeded " + count + " bikes.");
    } catch (e) {
        console.error("Error seeding bikes:", e);
    }
}

seedData();
