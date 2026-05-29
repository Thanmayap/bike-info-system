const db = require('../config/db');

const bikeData = [
    // --- JAWA 42 (THE ENTRY URBAN ROADSTER) ---
    {
        brand: "Jawa",
        model: "42",
        category: "Entry Urban Roadster",
        engine: "294.7 cc Liquid-Cooled Single-Cylinder DOHC",
        power: "21.1 bhp @ 7,500 rpm",
        torque: "26.8 Nm @ 6,000 rpm",
        transmission: "6-speed gearbox",
        fuelTank: "13.2 litres",
        mileage: "~32 kmpl",
        price: "₹1,72,942 onwards",
        status: "Active",
        features: "Dual cradle frame, Conventional telescopic front forks, Dual-channel ABS with disc brakes",
        smartTech: "Offset digital-analogue single pod console, Signature dual exhaust pipes, Flat urban street ergonomics",
        description: "Entry urban roadster with classic Jawa styling.",
        image: "https://placehold.co/400x250?text=Jawa+42"
    },
    // --- JAWA 350 (THE AUTHENTIC HERITAGE ICON) ---
    {
        brand: "Jawa",
        model: "350",
        category: "Heritage Icon",
        engine: "334 cc Liquid-Cooled Single-Cylinder DOHC",
        power: "22.2 bhp @ 7,000 rpm",
        torque: "28.1 Nm @ 5,000 rpm",
        transmission: "6-speed gearbox with assist & slipper clutch",
        fuelTank: "13.2 litres",
        mileage: "N/A",
        price: "₹1,98,950 onwards",
        status: "Active",
        features: "Lengthened dual-cradle chassis, Deeply valanced chrome fenders, 178mm high ground clearance",
        smartTech: "Classic tank-integrated analogue speedometer, Period-correct full chrome styling, Low-end torque tuning",
        description: "Authentic heritage icon with vintage design.",
        image: "https://placehold.co/400x250?text=Jawa+350"
    },
    // --- JAWA 42 FJ (THE PREMIUM NEO-CLASSIC ROADSTER) ---
    {
        brand: "Jawa",
        model: "42 FJ",
        category: "Premium Neo-Classic Roadster",
        engine: "334 cc Liquid-Cooled Alpha Single-Cylinder",
        power: "28.7 bhp @ 7,500 rpm",
        torque: "29.6 Nm @ 6,000 rpm",
        transmission: "6-speed gearbox with slip-and-assist",
        fuelTank: "14 litres",
        mileage: "N/A",
        price: "₹1,99,142 onwards",
        status: "Active",
        features: "Beefier 41mm front telescopic forks, Upgraded multi-spoke alloy wheels, Tubeless tyres",
        smartTech: "Fully digital off-set instrument cluster, First-in-segment all-LED lighting, Aggressive street stance",
        description: "Premium neo-classic roadster with modern features.",
        image: "https://placehold.co/400x250?text=Jawa+42+FJ"
    },
    // --- JAWA 42 BOBBER (THE NEO-CUSTOM FACTORY CRUISER) ---
    {
        brand: "Jawa",
        model: "42 Bobber",
        category: "Neo-Custom Factory Cruiser",
        engine: "334 cc Liquid-Cooled Single-Cylinder",
        power: "29.5 bhp @ 7,500 rpm",
        torque: "32.7 Nm @ 5,500 rpm",
        transmission: "6-speed gearbox",
        fuelTank: "12.5 litres",
        mileage: "N/A",
        price: "₹2,06,500 onwards",
        status: "Active",
        features: "Hidden rear monoshock setup, 2-way adjustable floating single seat, Wide drag handlebars",
        smartTech: "Negative LCD digital console, All-LED illumination, Choice of wire-spoke or alloy wheels",
        description: "Neo-custom factory cruiser with aggressive styling.",
        image: "https://placehold.co/400x250?text=Jawa+42+Bobber"
    },
    // --- JAWA PERAK (THE DARK STEALTH BOBBER) ---
    {
        brand: "Jawa",
        model: "Perak",
        category: "Dark Stealth Bobber",
        engine: "334 cc Liquid-Cooled Single-Cylinder",
        power: "29.5 bhp @ 7,500 rpm",
        torque: "30.0 Nm @ 5,500 rpm",
        transmission: "6-speed gearbox",
        fuelTank: "14 litres",
        mileage: "N/A",
        price: "₹2,13,187 onwards",
        status: "Active",
        features: "Cantilevered floating single-tan leather seat, Rigid hardtail look frame with hidden monoshock",
        smartTech: "Stripped-down matte black styling, Slash-cut dual exhaust pipes, Bar-end rearview mirrors",
        description: "Dark stealth bobber with premium custom looks.",
        image: "https://placehold.co/400x250?text=Jawa+Perak"
    }
];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('onwards')[0].trim();
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.split(' ')[0].replace(/,/g, '')) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Jawa bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = 2; // Retro/Classic/Bobber -> 2 (Cruiser)
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            
            // Build a comprehensive features string
            let featureArr = [];
            if (bike.fuelTank && bike.fuelTank !== "N/A") featureArr.push("Tank: " + bike.fuelTank);
            if (bike.mileage && bike.mileage !== "N/A") featureArr.push("Mileage: " + bike.mileage);
            featureArr.push(bike.features);
            if (bike.smartTech) featureArr.push("Tech: " + bike.smartTech);
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
        console.log("\\nSuccessfully seeded " + count + " Jawa bikes.");
    } catch (e) {
        console.error("Error seeding Jawa bikes:", e);
    }
}

seedData();
