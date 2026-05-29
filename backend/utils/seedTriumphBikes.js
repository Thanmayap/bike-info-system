const db = require('../config/db');

const bikeData = [
    // --- MODERN CLASSIC SERIES (Active) ---
    {
        brand: "Triumph",
        model: "Speed T4",
        category: "Modern Classic",
        engine: "398 cc",
        price: "₹1,93,000 – ₹1,95,000",
        status: "Active",
        features: "Most affordable entry roadster, high low-end torque",
        description: "Entry-level roadster with classic styling.",
        image: "https://placehold.co/400x250?text=Triumph+Speed+T4"
    },
    {
        brand: "Triumph",
        model: "Speed 400",
        category: "Modern Classic",
        engine: "398 cc",
        price: "₹2,33,000 – ₹2,39,000",
        status: "Active",
        features: "Class-leading finish, liquid-cooled engine",
        description: "Premium entry-level modern classic.",
        image: "https://placehold.co/400x250?text=Triumph+Speed+400"
    },
    {
        brand: "Triumph",
        model: "Scrambler 400 X",
        category: "Modern Classic",
        engine: "398 cc",
        price: "₹2,59,000 – ₹2,69,900",
        status: "Active",
        features: "Dual-purpose tyres, long-travel offroad suspension",
        description: "Urban explorer with off-road capability.",
        image: "https://placehold.co/400x250?text=Triumph+Scrambler+400X"
    },
    {
        brand: "Triumph",
        model: "Thruxton 400",
        category: "Modern Classic",
        engine: "398 cc",
        price: "₹2,66,000 – ₹2,76,000",
        status: "Active",
        features: "Aggressive cafe-racer fairing and clip-on bars",
        description: "Cafe racer style with modern performance.",
        image: "https://placehold.co/400x250?text=Triumph+Thruxton+400"
    },
    {
        brand: "Triumph",
        model: "Scrambler 400 XC",
        category: "Modern Classic",
        engine: "398 cc",
        price: "₹2,94,600 – ₹2,99,000",
        status: "Active",
        features: "Toughened chassis visual theme for heavier trails",
        description: "Enhanced off-road scrambler variant.",
        image: "https://placehold.co/400x250?text=Triumph+Scrambler+400XC"
    },
    {
        brand: "Triumph",
        model: "Speed Twin 900",
        category: "Modern Classic",
        engine: "900 cc",
        price: "₹8,49,000 – ₹8,70,000",
        status: "Active",
        features: "Retro design DNA, rich low-end parallel-twin note",
        description: "Classic roadster with modern torque.",
        image: "https://placehold.co/400x250?text=Triumph+Speed+Twin+900"
    },
    {
        brand: "Triumph",
        model: "Scrambler 900",
        category: "Modern Classic",
        engine: "900 cc",
        price: "₹10,45,000 – ₹10,75,000",
        status: "Active",
        features: "High-level twin exhaust system, ride-by-wire",
        description: "Iconic scrambler with high exhausts.",
        image: "https://placehold.co/400x250?text=Triumph+Scrambler+900"
    },
    {
        brand: "Triumph",
        model: "Bonneville T120",
        category: "Modern Classic",
        engine: "1200 cc",
        price: "₹11,39,000 – ₹11,99,000",
        status: "Active",
        features: "Premium chrome styling, torque-assist clutch",
        description: "The quintessential British classic.",
        image: "https://placehold.co/400x250?text=Triumph+Bonneville+T120"
    },
    {
        brand: "Triumph",
        model: "Bonneville Bobber",
        category: "Modern Classic",
        engine: "1200 cc",
        price: "₹12,25,000 – ₹13,52,000",
        status: "Active",
        features: "Floating single seat, authentic custom design",
        description: "Minimalist custom bobber style.",
        image: "https://placehold.co/400x250?text=Triumph+Bonneville+Bobber"
    },
    // --- ROADSTER / NAKED SERIES ---
    {
        brand: "Triumph",
        model: "Trident 660",
        category: "Roadster / Naked",
        engine: "660 cc",
        price: "₹8,25,000 – ₹8,99,000",
        status: "Active",
        features: "Most accessible triple-cylinder streetfighter",
        description: "Balanced performance naked bike.",
        image: "https://placehold.co/400x250?text=Triumph+Trident+660"
    },
    {
        brand: "Triumph",
        model: "Street Triple 765 R",
        category: "Roadster / Naked",
        engine: "765 cc",
        price: "₹10,17,000 – ₹10,86,000",
        status: "Active",
        features: "Sharp track handling, cornering ABS & traction",
        description: "The ultimate street fighter.",
        image: "https://placehold.co/400x250?text=Triumph+Street+Triple+765R"
    },
    {
        brand: "Triumph",
        model: "Street Triple 765 RS",
        category: "Roadster / Naked",
        engine: "765 cc",
        price: "₹12,07,000 – ₹13,22,800",
        status: "Active",
        features: "Top-spec Brembo Stylema brakes, Öhlins rear mono",
        description: "Track-focused high-performance variant.",
        image: "https://placehold.co/400x250?text=Triumph+Street+Triple+765RS"
    },
    // --- SUPERSPORT ---
    {
        brand: "Triumph",
        model: "Daytona 660",
        category: "Supersport",
        engine: "660 cc",
        price: "₹9,72,450 – ₹9,88,400",
        status: "Active",
        features: "Fully-faired sport tourer, sports triple engine",
        description: "Sport touring excellence.",
        image: "https://placehold.co/400x250?text=Triumph+Daytona+660"
    },
    // --- ADVENTURE SERIES ---
    {
        brand: "Triumph",
        model: "Tiger Sport 660",
        category: "Adventure",
        engine: "660 cc",
        price: "₹9,45,000 – ₹9,58,000",
        status: "Active",
        features: "Multi-purpose daily commuter, protective screen",
        description: "Versatile sports touring adventure.",
        image: "https://placehold.co/400x250?text=Triumph+Tiger+Sport+660"
    },
    {
        brand: "Triumph",
        model: "Tiger 900 Alpine",
        category: "Adventure",
        engine: "888 cc",
        price: "₹14,40,000 – ₹15,35,000",
        status: "Active",
        features: "Specialized road-biased long-distance tourer",
        description: "Road focused adventure tourer.",
        image: "https://placehold.co/400x250?text=Triumph+Tiger+900+Alpine"
    },
    {
        brand: "Triumph",
        model: "Tiger 1200 Rally Pro",
        category: "Adventure",
        engine: "1160 cc",
        price: "₹20,20,000 – ₹21,40,000",
        status: "Active",
        features: "Heavyweight global touring, semi-active suspension",
        description: "Ultimate long-distance tourer.",
        image: "https://placehold.co/400x250?text=Triumph+Tiger+1200+Rally+Pro"
    },
    // --- CRUISER / ROCKET ---
    {
        brand: "Triumph",
        model: "Rocket 3 R / GT",
        category: "Cruiser / Rocket",
        engine: "2458 cc",
        price: "₹24,00,000 – ₹24,67,000",
        status: "Active",
        features: "World's largest production bike engine torque",
        description: "Massive touring cruiser.",
        image: "https://placehold.co/400x250?text=Triumph+Rocket+3"
    },
    // --- UPCOMING MODELS ---
    {
        brand: "Triumph",
        model: "Tiger Sport 800",
        category: "Adventure",
        engine: "~800 cc",
        price: "₹11,50,000 – ₹12,00,000 (Est.)",
        status: "Upcoming",
        features: "New midweight sports-tourer triple engine configuration",
        description: "Upcoming mid-weight adventure bike.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "Triumph",
        model: "Bonneville 400",
        category: "Modern Classic",
        engine: "~398 cc",
        price: "₹2,60,000 – ₹2,80,000 (Est.)",
        status: "Upcoming",
        features: "Retro cruiser variant built on the 400cc engine base",
        description: "Classic cruiser style.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    // --- DISCONTINUED MODELS ---
    {
        brand: "Triumph",
        model: "Thruxton 900",
        category: "Modern Classic",
        engine: "865 cc",
        price: "₹7,20,000 (Last Known)",
        status: "Discontinued",
        features: "Traditional air-cooled cafe racer, upgraded to 1200cc",
        description: "Older generation cafe racer.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Triumph",
        model: "Street Triple 675",
        category: "Sports Naked",
        engine: "675 cc",
        price: "₹7,91,000 (Last Known)",
        status: "Discontinued",
        features: "Iconic raw triple engine platform, replaced by 765 series",
        description: "Legacy street fighter.",
        image: "https://placehold.co/400x250?text=Discontinued"
    }
];

function parseCategory(catName) {
    if (catName.includes("Adventure")) return 4;
    if (catName.includes("Classic") || catName.includes("Cruiser")) return 2;
    return 1; // Default Sport
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/₹|,/g, '').split('–')[0].trim().split(' ')[0];
    return parseFloat(cleanStr) || 0;
}

function parseEngine(engineStr) {
    if (!engineStr) return 0;
    return parseFloat(engineStr.replace(/[^\d.]/g, '')) || 0;
}

function parseMileage(milStr) {
    if (!milStr) return null;
    return parseFloat(milStr.replace(/[^\d.]/g, '')) || null;
}

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Triumph bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const mileage = parseMileage(bike.mileage);
            const is_featured = bike.status === "Active" ? 1 : 0;
            const finalDesc = "[" + bike.status + "] " + bike.description;
            
            const weight = bike.weight ? parseFloat(bike.weight.replace(/[^\d.]/g, '')) : null;
            const transmission = bike.transmission || "6-Speed";

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, mileage, engine_cc, power, torque, weight, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, mileage, engine_cc, 
                        bike.power || null, bike.torque || null, weight, transmission, 
                        bike.features, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " Triumph bikes.");
    } catch (e) {
        console.error("Error seeding Triumph bikes:", e);
    }
}

seedData();
