const db = require('../config/db');

const bikeData = [
    // --- SPORTS & TRACK (SUPERBIKES) ---
    {
        brand: "BMW",
        model: "G 310 RR",
        category: "Sports & Track",
        engine: "312.12 cc",
        power: "33.5 bhp",
        mileage: "30.3 kmpl",
        price: "₹2.85 L",
        status: "Active",
        features: "TVS co-developed entry sportbike",
        description: "Entry-level sportbike for beginners.",
        image: "https://placehold.co/400x250?text=BMW+G+310+RR"
    },
    {
        brand: "BMW",
        model: "S 1000 RR",
        category: "Sports & Track",
        engine: "999 cc",
        power: "206.5 bhp",
        mileage: "N/A",
        price: "₹23.25 L",
        status: "Active",
        features: "Race Pro electronics, Dynamic track benchmark",
        description: "Ultimate track weapon.",
        image: "https://placehold.co/400x250?text=BMW+S+1000+RR"
    },
    {
        brand: "BMW",
        model: "M 1000 R",
        category: "Sports & Track",
        engine: "999 cc",
        power: "209 bhp",
        mileage: "N/A",
        price: "₹33.50 L",
        status: "Active",
        features: "Hyper-naked, Carbon parts, Ultimate street fighter",
        description: "Ultimate hyper-naked street fighter.",
        image: "https://placehold.co/400x250?text=BMW+M+1000+R"
    },
    {
        brand: "BMW",
        model: "M 1000 RR",
        category: "Sports & Track",
        engine: "999 cc",
        power: "209 bhp",
        mileage: "N/A",
        price: "₹49.00 L",
        status: "Active",
        features: "WSBK-spec track machine, Carbon wings, Elite racing",
        description: "Elite track weapon with carbon aero.",
        image: "https://placehold.co/400x250?text=BMW+M+1000+RR"
    },
    {
        brand: "BMW",
        model: "M 1000 XR",
        category: "Sports & Track",
        engine: "999 cc",
        power: "201 bhp",
        mileage: "N/A",
        price: "₹48.63 L",
        status: "Active",
        features: "Extreme crossover, High-riding sports tourer",
        description: "High-riding sports tourer.",
        image: "https://placehold.co/400x250?text=BMW+M+1000+XR"
    },
    // --- ADVENTURE TOURERS (GS SERIES) ---
    {
        brand: "BMW",
        model: "G 310 GS",
        category: "Adventure Tourers",
        engine: "313 cc",
        power: "34 bhp",
        mileage: "N/A",
        price: "₹3.30 L",
        status: "Active",
        features: "Light everyday tourer, Beginner friendly adventure",
        description: "Beginner-friendly adventure bike.",
        image: "https://placehold.co/400x250?text=BMW+G+310+GS"
    },
    {
        brand: "BMW",
        model: "F 450 GS",
        category: "Adventure Tourers",
        engine: "420 cc",
        power: "48 bhp",
        mileage: "N/A",
        price: "₹4.70 L",
        status: "Active",
        features: "Twin-cylinder, Lightweight A2-class mid-size trail bike",
        description: "A2-friendly mid-size trail bike.",
        image: "https://placehold.co/400x250?text=BMW+F+450+GS"
    },
    {
        brand: "BMW",
        model: "F 900 GS",
        category: "Adventure Tourers",
        engine: "895 cc",
        power: "103.2 bhp",
        mileage: "N/A",
        price: "₹15.50 L",
        status: "Active",
        features: "Parallel-twin, Hardcore slim off-road specialist",
        description: "Hardcore off-road specialist.",
        image: "https://placehold.co/400x250?text=BMW+F+900+GS"
    },
    {
        brand: "BMW",
        model: "F 900 GSA",
        category: "Adventure Tourers",
        engine: "895 cc",
        power: "103.2 bhp",
        mileage: "N/A",
        price: "₹16.99 L",
        status: "Active",
        features: "Long range, Large tank, Heavy rugged touring",
        description: "Long-range adventure tourer.",
        image: "https://placehold.co/400x250?text=BMW+F+900+GSA"
    },
    {
        brand: "BMW",
        model: "R 1300 GS",
        category: "Adventure Tourers",
        engine: "1300 cc",
        power: "145 bhp",
        mileage: "N/A",
        price: "₹23.25 L",
        status: "Active",
        features: "ShiftCam Boxer engine, Flagship global explorer",
        description: "Flagship adventure explorer.",
        image: "https://placehold.co/400x250?text=BMW+R+1300+GS"
    },
    {
        brand: "BMW",
        model: "R 1300 GSA",
        category: "Adventure Tourers",
        engine: "1300 cc",
        power: "145 bhp",
        mileage: "N/A",
        price: "₹25.75 L",
        status: "Active",
        features: "Massively protected body, Ultra-distance setup",
        description: "Ultra-distance adventure tourer.",
        image: "https://placehold.co/400x250?text=BMW+R+1300+GSA"
    },
    // --- ROADSTER, HERITAGE & CRUISERS ---
    {
        brand: "BMW",
        model: "G 310 R",
        category: "Roadster",
        engine: "313 cc",
        power: "34 bhp",
        mileage: "N/A",
        price: "₹2.90 L",
        status: "Active",
        features: "Lightweight street roadster, Agile urban commuter",
        description: "Agile urban commuter.",
        image: "https://placehold.co/400x250?text=BMW+G+310+R"
    },
    {
        brand: "BMW",
        model: "R 12",
        category: "Roadster",
        engine: "1170 cc",
        power: "93.7 bhp",
        mileage: "N/A",
        price: "₹22.00 L",
        status: "Active",
        features: "Air-cooled Boxer, Classic cruiser with Rock/Roll modes",
        description: "Classic air-cooled cruiser.",
        image: "https://placehold.co/400x250?text=BMW+R+12"
    },
    {
        brand: "BMW",
        model: "R 12 nineT",
        category: "Roadster",
        engine: "1170 cc",
        power: "109 bhp",
        mileage: "N/A",
        price: "₹23.00 L",
        status: "Active",
        features: "Premium retro naked roadster, Analogue dials",
        description: "Premium retro naked roadster.",
        image: "https://placehold.co/400x250?text=BMW+R+12+nineT"
    },
    {
        brand: "BMW",
        model: "R 18 Standard",
        category: "Cruiser",
        engine: "1802 cc",
        power: "91 bhp",
        mileage: "N/A",
        price: "₹22.45 L",
        status: "Active",
        features: "158Nm torque, Massive cruiser, Retro styling",
        description: "Massive retro cruiser.",
        image: "https://placehold.co/400x250?text=BMW+R+18+Standard"
    },
    {
        brand: "BMW",
        model: "R 18 Transcontinental",
        category: "Cruiser",
        engine: "1802 cc",
        power: "91 bhp",
        mileage: "N/A",
        price: "₹34.73 L",
        status: "Active",
        features: "Full touring fairing, Marshall sound, Heavy highway",
        description: "Full touring cruiser.",
        image: "https://placehold.co/400x250?text=BMW+R+18+Trans"
    },
    // --- URBAN MOBILITY & SCOOTERS ---
    {
        brand: "BMW",
        model: "CE 02",
        category: "Urban Mobility",
        engine: "Electric",
        power: "15 bhp",
        mileage: "108 km range",
        topSpeed: "95 kmph",
        price: "₹4.50 L",
        status: "Active",
        features: "Electric, Youthful urban moped",
        description: "Youthful electric urban moped.",
        image: "https://placehold.co/400x250?text=BMW+CE+02"
    },
    {
        brand: "BMW",
        model: "C 400 GT",
        category: "Scooter",
        engine: "350 cc",
        power: "33.5 bhp",
        mileage: "N/A",
        topSpeed: "N/A",
        price: "₹10.99 L",
        status: "Active",
        features: "Single-cylinder, Premium petrol maxi-scooter",
        description: "Premium petrol maxi-scooter.",
        image: "https://placehold.co/400x250?text=BMW+C+400+GT"
    },
    {
        brand: "BMW",
        model: "CE 04",
        category: "Scooter",
        engine: "Electric",
        power: "42 bhp",
        mileage: "130 km range",
        topSpeed: "120 kmph",
        price: "₹15.25 L",
        status: "Active",
        features: "Electric, Futuristic flagship",
        description: "Futuristic electric flagship.",
        image: "https://placehold.co/400x250?text=BMW+CE+04"
    }
];

function parseCategory(bike) {
    if (bike.engine === "Electric") return 5;
    if (bike.category.includes("Adventure")) return 4;
    if (bike.category.includes("Cruiser")) return 2;
    if (bike.category.includes("Scooter") || bike.category.includes("Mobility")) return 3;
    return 1; // Default Sport/Roadster
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').trim().toUpperCase();
    if (cleanStr.includes('L')) {
        return parseFloat(cleanStr) * 100000;
    }
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr || engineStr === "Electric") return 0;
    return parseFloat(engineStr.replace(/[^\d.]/g, '')) || 0;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding BMW bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            const finalDesc = "[" + bike.status + "] " + bike.description;
            const transmission = bike.engine === "Electric" || bike.category.includes("Scooter") ? "Automatic" : "6-Speed";

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, power, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        bike.power, bike.features, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " BMW bikes.");
    } catch (e) {
        console.error("Error seeding BMW bikes:", e);
    }
}

seedData();
