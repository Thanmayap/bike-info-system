const db = require('../config/db');

const bikeData = [
    // --- MODERN RETRO (Active) ---
    {
        brand: "Kawasaki",
        model: "W175",
        category: "Modern Retro",
        engine: "177 cc",
        price: "₹1,15,000 – ₹1,25,000",
        status: "Active",
        features: "Simplistic air-cooled retro design, very lightweight",
        description: "Simple retro commuter for beginners.",
        image: "https://placehold.co/400x250?text=Kawasaki+W175"
    },
    // --- OFF-ROAD / TRAIL (Active) ---
    {
        brand: "Kawasaki",
        model: "KLX230",
        category: "Off-Road / Trail",
        engine: "233 cc",
        price: "₹1,84,000",
        status: "Active",
        features: "High ground clearance dual-purpose trail machine",
        description: "Trail ready dual-purpose bike.",
        image: "https://placehold.co/400x250?text=Kawasaki+KLX230"
    },
    // --- SUPERSPORT (Active) ---
    {
        brand: "Kawasaki",
        model: "Ninja 300",
        category: "Supersport",
        engine: "296 cc",
        price: "₹3,17,000",
        status: "Active",
        features: "Proven parallel-twin entry-level sports performer",
        description: "Entry-level sports bike legend.",
        image: "https://placehold.co/400x250?text=Kawasaki+Ninja+300"
    },
    {
        brand: "Kawasaki",
        model: "Ninja 500",
        category: "Supersport",
        engine: "451 cc",
        price: "₹5,65,976",
        status: "Active",
        features: "Sharp lightweight trellis frame, balanced performance",
        description: "Updated supersport performer.",
        image: "https://placehold.co/400x250?text=Kawasaki+Ninja+500"
    },
    // --- CRUISER (Active) ---
    {
        brand: "Kawasaki",
        model: "Eliminator",
        category: "Cruiser",
        engine: "451 cc",
        price: "₹6,16,000",
        status: "Active",
        features: "Low-slung cruiser posture with accessible power delivery",
        description: "Modern cruiser classic.",
        image: "https://placehold.co/400x250?text=Kawasaki+Eliminator"
    },
    {
        brand: "Kawasaki",
        model: "Vulcan S",
        category: "Cruiser",
        engine: "649 cc",
        price: "₹8,13,000",
        status: "Active",
        features: "Ergo-fit adjustability feature for customizable seat height",
        description: "Adjustable cruiser comfort.",
        image: "https://placehold.co/400x250?text=Kawasaki+Vulcan+S"
    },
    // --- ADVENTURE (Active) ---
    {
        brand: "Kawasaki",
        model: "Versys-X 300",
        category: "Adventure",
        engine: "296 cc",
        price: "₹3,49,000",
        status: "Active",
        features: "Compact long-distance tourer with any-road chassis",
        description: "Compact adventure tourer.",
        image: "https://placehold.co/400x250?text=Kawasaki+Versys-X+300"
    },
    {
        brand: "Kawasaki",
        model: "Versys 650",
        category: "Adventure",
        engine: "649 cc",
        price: "₹8,63,000",
        status: "Active",
        features: "Long-travel inverted front forks for smooth touring",
        description: "Versatile adventure tourer.",
        image: "https://placehold.co/400x250?text=Kawasaki+Versys+650"
    },
    {
        brand: "Kawasaki",
        model: "Versys 1100",
        category: "Tourer",
        engine: "1099 cc",
        price: "₹13,89,000",
        status: "Active",
        features: "Flagship adventure layout with enhanced touring comfort",
        description: "Grand touring adventure.",
        image: "https://placehold.co/400x250?text=Kawasaki+Versys+1100"
    },
    // --- STREET NAKED (Active) ---
    {
        brand: "Kawasaki",
        model: "Z650",
        category: "Street Naked",
        engine: "649 cc",
        price: "₹7,25,960",
        status: "Active",
        features: "Sugar-naked Sugomi styling, midweight daily commuter",
        description: "Mid-weight naked street fighter.",
        image: "https://placehold.co/400x250?text=Kawasaki+Z650"
    },
    // --- NEO-RETRO (Active) ---
    {
        brand: "Kawasaki",
        model: "Z650RS",
        category: "Neo-Retro",
        engine: "649 cc",
        price: "₹7,69,000 – ₹7,83,000",
        status: "Active",
        features: "Vintage multi-spoke look combined with modern 650 twin",
        description: "Retro-styled modern classic.",
        image: "https://placehold.co/400x250?text=Kawasaki+Z650RS"
    },
    // --- SPORTS TOURER (Active) ---
    {
        brand: "Kawasaki",
        model: "Ninja 650",
        category: "Sports Tourer",
        engine: "649 cc",
        price: "₹7,77,000 – ₹7,91,000",
        status: "Active",
        features: "Practical clip-on setup optimized for sports touring",
        description: "Practical sports tourer.",
        image: "https://placehold.co/400x250?text=Kawasaki+Ninja+650"
    },
    {
        brand: "Kawasaki",
        model: "Ninja 1100SX",
        category: "Sports Tourer",
        engine: "1099 cc",
        price: "₹14,42,000",
        status: "Active",
        features: "High premium electronic cruise control luxury tourer",
        description: "Luxury sport touring.",
        image: "https://placehold.co/400x250?text=Kawasaki+Ninja+1100SX"
    },
    // --- INLINE-4 NAKED (Active) ---
    {
        brand: "Kawasaki",
        model: "Z900",
        category: "Inline-4 Naked",
        engine: "948 cc",
        price: "₹9,99,000",
        status: "Active",
        features: "Dominating inline-four exhaust note with traction control",
        description: "Dominant street naked.",
        image: "https://placehold.co/400x250?text=Kawasaki+Z900"
    },
    // --- SUPERSPORT (Active) ---
    {
        brand: "Kawasaki",
        model: "Ninja ZX-6R",
        category: "Supersport",
        engine: "636 cc",
        price: "₹12,48,948",
        status: "Active",
        features: "High-revving scream track tool, track-ready electronics",
        description: "Track-focused supersport.",
        image: "https://placehold.co/400x250?text=Kawasaki+Ninja+ZX-6R"
    },
    // --- SUPER NAKED (Active) ---
    {
        brand: "Kawasaki",
        model: "Z1100",
        category: "Super Naked",
        engine: "1099 cc",
        price: "₹12,79,000",
        status: "Active",
        features: "Heavyweight aggressive streetfighter with massive torque",
        description: "Aggressive street fighter.",
        image: "https://placehold.co/400x250?text=Kawasaki+Z1100"
    },
    // --- SUPERBIKE (Active) ---
    {
        brand: "Kawasaki",
        model: "Ninja ZX-10R",
        category: "Superbike",
        engine: "998 cc",
        price: "₹20,79,000",
        status: "Active",
        features: "WSBK racing DNA flagship, Launch Control Mode",
        description: "World superbike champion.",
        image: "https://placehold.co/400x250?text=Kawasaki+Ninja+ZX-10R"
    },
    // --- HYPER NAKED (Active) ---
    {
        brand: "Kawasaki",
        model: "Z H2",
        category: "Hyper Naked",
        engine: "998 cc",
        price: "₹25,85,000",
        status: "Active",
        features: "Supercharged street naked with ferocious acceleration",
        description: "Supercharged beast.",
        image: "https://placehold.co/400x250?text=Kawasaki+ZH2"
    },
    // --- HYPERBIKE (Active) ---
    {
        brand: "Kawasaki",
        model: "Ninja H2 SX SE",
        category: "Hyperbike",
        engine: "998 cc",
        price: "₹36,27,783",
        status: "Active",
        features: "Supercharged sport tourer, electronic suspension tech",
        description: "Supercharged tourer.",
        image: "https://placehold.co/400x250?text=Kawasaki+Ninja+H2+SX+SE"
    },
    // --- UPCOMING ---
    {
        brand: "Kawasaki",
        model: "W230",
        category: "Modern Retro",
        engine: "233 cc",
        price: "₹1,50,000 (Estimated)",
        status: "Upcoming",
        features: "Mid-size single-cylinder vintage classic commuter",
        description: "Vintage classic upcoming.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "Kawasaki",
        model: "Z400",
        category: "Street Naked",
        engine: "399 cc",
        price: "₹3,90,000 – ₹4,38,000",
        status: "Upcoming",
        features: "Parallel-twin naked platform designed for entry riders",
        description: "Entry-level naked sport.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "Kawasaki",
        model: "Z500",
        category: "Naked Bike",
        engine: "451 cc",
        price: "₹5,10,000 (Estimated)",
        status: "Upcoming",
        features: "Aggressive naked variant powered by the Ninja 500 base",
        description: "Aggressive naked update.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "Kawasaki",
        model: "KLE500",
        category: "Adventure",
        engine: "~451 cc",
        price: "₹6,50,000 (Estimated)",
        status: "Upcoming",
        features: "Multi-purpose midweight dual adventure tourer concept",
        description: "Adventure concept.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    // --- DISCONTINUED ---
    {
        brand: "Kawasaki",
        model: "Z800",
        category: "Inline-4 Naked",
        engine: "806 cc",
        price: "₹7,68,000 (Last Known)",
        status: "Discontinued",
        features: "Heavyweight raw streetfighter replaced by the Z900",
        description: "Old street fighter.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Kawasaki",
        model: "Ninja 1000",
        category: "Sports Tourer",
        engine: "1043 cc",
        price: "₹11,40,000 (Last Known)",
        status: "Discontinued",
        features: "Iconic sport tourer upgraded to the 1100SX platform",
        description: "Legacy sport tourer.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Kawasaki",
        model: "Versys 1000",
        category: "Adventure",
        engine: "1043 cc",
        price: "₹13,17,000 (Last Known)",
        status: "Discontinued",
        features: "Grand adventure variant, replaced by the Versys 1100",
        description: "Old adventure tourer.",
        image: "https://placehold.co/400x250?text=Discontinued"
    }
];

function parseCategory(catName) {
    if (catName.includes("Adventure") || catName.includes("Tourer") || catName.includes("Trail") || catName.includes("Off-Road")) return 4;
    if (catName.includes("Retro") || catName.includes("Cruiser")) return 2;
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

async function seedData() {
    try {
        const sqliteDb = await db.getDbInstance();
        
        console.log("Seeding Kawasaki bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const is_featured = bike.status === "Active" ? 1 : 0;
            const finalDesc = "[" + bike.status + "] " + bike.description;
            
            const transmission = "6-Speed";

            const existing = await sqliteDb.get("SELECT id FROM bikes WHERE brand=? AND model=?", [bike.brand, bike.model]);
            if (!existing) {
                await sqliteDb.run(
                    "INSERT INTO bikes (brand, model, category_id, price, engine_cc, transmission, features, description, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        bike.brand, bike.model, category_id, price, engine_cc, transmission, 
                        bike.features, finalDesc, bike.image, is_featured
                    ]
                );
                count++;
                console.log("Inserted " + bike.brand + " " + bike.model);
            } else {
                console.log("Skipping " + bike.brand + " " + bike.model + " (already exists)");
            }
        }
        console.log("\\nSuccessfully seeded " + count + " Kawasaki bikes.");
    } catch (e) {
        console.error("Error seeding Kawasaki bikes:", e);
    }
}

seedData();
