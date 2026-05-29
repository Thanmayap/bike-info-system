const db = require('../config/db');

const bikeData = [
    // --- NAKED (DUKE) SERIES (Active) ---
    {
        brand: "KTM",
        model: "Duke 125",
        category: "Naked (Duke)",
        engine: "124.7 cc",
        price: "₹1,80,000 – ₹1,85,000",
        status: "Active",
        features: "Entry-level naked bike with premium trellis frame",
        description: "The entry point to the KTM world.",
        image: "https://placehold.co/400x250?text=KTM+Duke+125"
    },
    {
        brand: "KTM",
        model: "Duke 200",
        category: "Naked (Duke)",
        engine: "199.5 cc",
        price: "₹1,98,000 – ₹2,03,000",
        status: "Active",
        features: "Aggressive streetfighter with raw high-RPM power",
        description: "Pure street performance for beginners.",
        image: "https://placehold.co/400x250?text=KTM+Duke+200"
    },
    {
        brand: "KTM",
        model: "Duke 250",
        category: "Naked (Duke)",
        engine: "249.1 cc",
        price: "₹2,41,000 – ₹2,46,000",
        status: "Active",
        features: "Smooth quarter-litre commuter with LED headlight",
        description: "Balanced city shredder.",
        image: "https://placehold.co/400x250?text=KTM+Duke+250"
    },
    {
        brand: "KTM",
        model: "Duke 390",
        category: "Naked (Duke)",
        engine: "398.7 cc",
        price: "₹3,13,000 – ₹3,18,000",
        status: "Active",
        features: "Corner rocket with launch control and TFT screen",
        description: "The corner carving king.",
        image: "https://placehold.co/400x250?text=KTM+Duke+390"
    },
    // --- SUPERSPORT (RC) SERIES (Active) ---
    {
        brand: "KTM",
        model: "RC 125",
        category: "Supersport (RC)",
        engine: "124.7 cc",
        price: "₹1,90,000 – ₹1,95,000",
        status: "Active",
        features: "Track-ready aero body for beginners",
        description: "Track DNA in a small package.",
        image: "https://placehold.co/400x250?text=KTM+RC+125"
    },
    {
        brand: "KTM",
        model: "RC 200",
        category: "Supersport (RC)",
        engine: "199.5 cc",
        price: "₹2,15,000 – ₹2,20,000",
        status: "Active",
        features: "Aggressive riding posture with dual-channel ABS",
        description: "Sporty ergonomics for the streets.",
        image: "https://placehold.co/400x250?text=KTM+RC+200"
    },
    {
        brand: "KTM",
        model: "RC 390",
        category: "Supersport (RC)",
        engine: "373.3 cc",
        price: "₹3,18,000 – ₹3,23,000",
        status: "Active",
        features: "Quickshifter and traction control for track days",
        description: "Race-spec supersport ready for the track.",
        image: "https://placehold.co/400x250?text=KTM+RC+390"
    },
    // --- ADVENTURE SERIES (Active) ---
    {
        brand: "KTM",
        model: "Adventure 250",
        category: "Adventure",
        engine: "248.8 cc",
        price: "₹2,48,000 – ₹2,53,000",
        status: "Active",
        features: "Long-travel suspension for budget touring",
        description: "Entry-level adventure tourer.",
        image: "https://placehold.co/400x250?text=KTM+Adv+250"
    },
    {
        brand: "KTM",
        model: "Adventure 390",
        category: "Adventure",
        engine: "373.2 cc",
        price: "₹3,40,000 – ₹3,65,000",
        status: "Active",
        features: "Cornering ABS and spoked wheels for off-roading",
        description: "The ultimate travel enduro.",
        image: "https://placehold.co/400x250?text=KTM+Adv+390"
    },
    // --- BIG BIKE ---
    {
        brand: "KTM",
        model: "Duke 790 / 890",
        category: "Big Bike",
        engine: "~889 cc",
        price: "₹8,50,000 – ₹9,00,000",
        status: "Active",
        features: "Twin-cylinder heavyweight scalpel with extreme torque",
        description: "Massive power for experienced riders.",
        image: "https://placehold.co/400x250?text=KTM+Duke+890"
    },
    // --- UPCOMING MODELS ---
    {
        brand: "KTM",
        model: "2026 Duke 125 Gen-3",
        category: "Naked (Duke)",
        engine: "124.7 cc",
        price: "₹1,88,000 – ₹1,93,000 (Est.)",
        status: "Upcoming",
        features: "New frame design and offset rear mono-shock",
        description: "Next generation entry-level Duke.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "KTM",
        model: "New-Gen RC 390",
        category: "Supersport (RC)",
        engine: "~399 cc",
        price: "₹3,25,000 – ₹3,35,000 (Est.)",
        status: "Upcoming",
        features: "Bigger engine from Duke 390 with a new look",
        description: "Updated RC platform.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "KTM",
        model: "Adventure 390 Enduro",
        category: "Adventure",
        engine: "~399 cc",
        price: "₹3,60,000 – ₹3,70,000 (Est.)",
        status: "Upcoming",
        features: "Slimmer, hardcore off-road focused body layout",
        description: "Hardcore off-road machine.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    // --- DISCONTINUED MODELS ---
    {
        brand: "KTM",
        model: "Duke 790",
        category: "Naked (Duke)",
        engine: "799.0 cc",
        price: "₹8,64,000 (Last Known)",
        status: "Discontinued",
        features: "Original twin-cylinder 'Scalpel' replaced by 890",
        description: "The original big duke scalpel.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "KTM",
        model: "RC 250",
        category: "Supersport (RC)",
        engine: "248.8 cc",
        price: "₹2,10,000 (Last Known)",
        status: "Discontinued",
        features: "Trimmed down from global markets to focus on RC200",
        description: "Discontinued compact RC.",
        image: "https://placehold.co/400x250?text=Discontinued"
    }
];

function parseCategory(catName) {
    if (catName.includes("Adventure")) return 4;
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
        
        console.log("Seeding KTM bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const mileage = parseMileage(bike.mileage);
            const is_featured = bike.status === "Active" ? 1 : 0;
            const finalDesc = "[" + bike.status + "] " + bike.description;
            
            const weight = bike.weight ? parseFloat(bike.weight.replace(/[^\d.]/g, '')) : null;
            const transmission = bike.transmission || "6-Speed"; // Default KTMs are 6-Speed usually

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
        console.log("\\nSuccessfully seeded " + count + " KTM bikes.");
    } catch (e) {
        console.error("Error seeding KTM bikes:", e);
    }
}

seedData();
