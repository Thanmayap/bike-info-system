const db = require('../config/db');

const bikeData = [
    // --- STREET NAKED (Active) ---
    {
        brand: "Suzuki",
        model: "Gixxer 155",
        category: "Street Naked",
        engine: "155 cc",
        price: "₹1,27,000 – ₹1,30,000",
        status: "Active",
        features: "Sharp LED cluster, torquey everyday urban commuter",
        description: "Daily commute hero with sharp looks.",
        image: "https://placehold.co/400x250?text=Suzuki+Gixxer+155"
    },
    {
        brand: "Suzuki",
        model: "Gixxer 250",
        category: "Street Naked",
        engine: "249 cc",
        price: "₹1,82,000 – ₹1,85,000",
        status: "Active",
        features: "Twin-outlet exhaust canister, oil-cooled motor",
        description: "Quarter litre naked street fighter.",
        image: "https://placehold.co/400x250?text=Suzuki+Gixxer+250"
    },
    // --- SUPERSPORT (Active) ---
    {
        brand: "Suzuki",
        model: "Gixxer SF",
        category: "Supersport",
        engine: "155 cc",
        price: "₹1,35,000 – ₹1,37,604",
        status: "Active",
        features: "Entry aerodynamically faired sport replica styling",
        description: "Fully faired entry-level sports bike.",
        image: "https://placehold.co/400x250?text=Suzuki+Gixxer+SF"
    },
    {
        brand: "Suzuki",
        model: "Gixxer SF 250",
        category: "Supersport",
        engine: "249 cc",
        price: "₹1,90,000 – ₹1,92,254",
        status: "Active",
        features: "Quarter-litre sports tourer, clip-on handlebars",
        description: "Sporty quarter-litre tourer.",
        image: "https://placehold.co/400x250?text=Suzuki+Gixxer+SF+250"
    },
    // --- ADVENTURE (Active) ---
    {
        brand: "Suzuki",
        model: "V-Strom SX",
        category: "Adventure",
        engine: "249 cc",
        price: "₹1,98,000 – ₹2,15,184",
        status: "Active",
        features: "Rugged high ground clearance beak design tourer",
        description: "Adventure-ready urban explorer.",
        image: "https://placehold.co/400x250?text=Suzuki+V-Strom+SX"
    },
    // --- PREMIUM MIDDLE (Active) ---
    {
        brand: "Suzuki",
        model: "GSX-8R",
        category: "Premium Middle",
        engine: "776 cc",
        price: "₹9,25,000 – ₹9,50,000",
        status: "Active",
        features: "Parallel-twin sports platform, fully fairing cowl",
        description: "Mid-weight fully faired sports bike.",
        image: "https://placehold.co/400x250?text=Suzuki+GSX-8R"
    },
    {
        brand: "Suzuki",
        model: "V-Strom 800 DE",
        category: "Premium Middle",
        engine: "776 cc",
        price: "₹10,30,000 – ₹10,50,000",
        status: "Active",
        features: "Hardcore off-roader with long travel showa suspension",
        description: "Adventure focused mid-weight tourer.",
        image: "https://placehold.co/400x250?text=Suzuki+V-Strom+800DE"
    },
    // --- HYPERBIKE (Active) ---
    {
        brand: "Suzuki",
        model: "Hayabusa",
        category: "Hyperbike",
        engine: "1340 cc",
        price: "₹18,06,885 – ₹18,50,000",
        status: "Active",
        features: "The iconic ultimate land-missile ultimate sport",
        description: "The legendary speed icon.",
        image: "https://placehold.co/400x250?text=Suzuki+Hayabusa"
    },
    // --- UPCOMING ---
    {
        brand: "Suzuki",
        model: "GSX-8S",
        category: "Street Naked",
        engine: "~776 cc",
        price: "₹10,00,000 (Expected)",
        status: "Upcoming",
        features: "Stripped down aggressive middleweight streetfighter",
        description: "Aggressive naked streetfighter.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    // --- DISCONTINUED ---
    {
        brand: "Suzuki",
        model: "Intruder 150",
        category: "Cruiser",
        engine: "155 cc",
        price: "₹1,30,136 (Last Known)",
        status: "Discontinued",
        features: "Modern cruiser style layout with low seating profile",
        description: "Modern cruiser classic.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Suzuki",
        model: "Hayate EP",
        category: "Commuter",
        engine: "113 cc",
        price: "₹54,000 (Last Known)",
        status: "Discontinued",
        features: "Budget fuel-efficient daily utility commuter",
        description: "Basic utility commuter.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Suzuki",
        model: "GSX-S750",
        category: "Premium Naked",
        engine: "749 cc",
        price: "₹7,46,000 (Last Known)",
        status: "Discontinued",
        features: "Smooth inline-four engine with predator styling",
        description: "Inline-four street naked.",
        image: "https://placehold.co/400x250?text=Discontinued"
    },
    {
        brand: "Suzuki",
        model: "GSX-R1000R",
        category: "Premium Liter",
        engine: "999.8 cc",
        price: "₹19,81,000 (Last Known)",
        status: "Discontinued",
        features: "Legendary flagship track supersport with VVT tech",
        description: "Track legend.",
        image: "https://placehold.co/400x250?text=Discontinued"
    }
];

function parseCategory(catName) {
    if (catName.includes("Adventure")) return 4;
    if (catName.includes("Cruiser")) return 2;
    if (catName.includes("Commuter")) return 3;
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
        
        console.log("Seeding Suzuki bikes...");
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
        console.log("\\nSuccessfully seeded " + count + " Suzuki bikes.");
    } catch (e) {
        console.error("Error seeding Suzuki bikes:", e);
    }
}

seedData();
