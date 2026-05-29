const db = require('../config/db');

const bikeData = [
    // --- YAMAHA (Your Specific Request) ---
    {
        brand: "Yamaha",
        model: "YZF R15 V4 (New)",
        category: "Supersport",
        engine: "155 cc",
        price: "₹1,85,000",
        mileage: "45 kmpl",
        topSpeed: "115 kmph",
        transmission: "6-Speed",
        power: "18.4 bhp @ 10000 rpm",
        torque: "14.2 Nm @ 7500 rpm",
        weight: "145 kg",
        status: "Active",
        features: "ABS, Quick Shifter, LED Lights",
        description: "Track-focused supersport with deltabox frame.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Yamaha_YZF-R15_V4.jpg/640px-Yamaha_YZF-R15_V4.jpg"
    },
    // --- BAJAJ PULSAR CLASSIC SERIES ---
    {
        brand: "Bajaj",
        model: "Pulsar 125",
        category: "Pulsar Classic",
        engine: "124.4 cc",
        price: "₹89,910 – ₹94,451",
        mileage: "50 kmpl",
        status: "Active",
        features: "Iconic tank, highest mileage commuter",
        description: "The classic entry-level commuter.",
        image: "https://placehold.co/400x250?text=Pulsar+125"
    },
    {
        brand: "Bajaj",
        model: "Pulsar 150",
        category: "Pulsar Classic",
        engine: "149.5 cc",
        price: "₹1,10,810 – ₹1,15,000",
        status: "Active",
        features: "The original best-selling street commuter",
        description: "Reliable mid-range performer.",
        image: "https://placehold.co/400x250?text=Pulsar+150"
    },
    {
        brand: "Bajaj",
        model: "Pulsar 220F",
        category: "Pulsar Classic",
        engine: "220.0 cc",
        price: "₹1,28,000 – ₹1,32,721",
        status: "Active",
        features: "Semi-faired aerodynamic headlamp casing",
        description: "Semi-faired street power.",
        image: "https://placehold.co/400x250?text=Pulsar+220F"
    },
    // --- BAJAJ PULSAR N SERIES ---
    {
        brand: "Bajaj",
        model: "Pulsar N125",
        category: "Pulsar N Series",
        engine: "124.5 cc",
        price: "₹91,690 – ₹93,695",
        status: "Active",
        features: "Sharp urban design, digital LED console",
        description: "Modern naked street look.",
        image: "https://placehold.co/400x250?text=Pulsar+N125"
    },
    {
        brand: "Bajaj",
        model: "Pulsar N160",
        category: "Pulsar N Series",
        engine: "164.8 cc",
        price: "₹1,13,000 – ₹1,16,500",
        status: "Active",
        features: "Segment-first dual-channel ABS safety",
        description: "Safety focused urban commuter.",
        image: "https://placehold.co/400x250?text=Pulsar+N160"
    },
    {
        brand: "Bajaj",
        model: "Pulsar N250",
        category: "Pulsar N Series",
        engine: "249.1 cc",
        price: "₹1,33,000 – ₹1,37,290",
        status: "Active",
        features: "High torque output, slipper clutch tech",
        description: "High performance naked bike.",
        image: "https://placehold.co/400x250?text=Pulsar+N250"
    },
    // --- BAJAJ PULSAR NS SERIES ---
    {
        brand: "Bajaj",
        model: "Pulsar NS125",
        category: "Pulsar NS Series",
        engine: "124.4 cc",
        price: "₹92,180 – ₹98,400",
        status: "Active",
        features: "Rigid perimeter frame entry sports bike",
        description: "Entry-level sporty performance.",
        image: "https://placehold.co/400x250?text=Pulsar+NS125"
    },
    {
        brand: "Bajaj",
        model: "Pulsar NS160",
        category: "Pulsar NS Series",
        engine: "160.3 cc",
        price: "₹1,20,000 – ₹1,23,310",
        status: "Active",
        features: "Upside Down (USD) premium front forks",
        description: "Premium handling forks.",
        image: "https://placehold.co/400x250?text=Pulsar+NS160"
    },
    {
        brand: "Bajaj",
        model: "Pulsar NS200",
        category: "Pulsar NS Series",
        engine: "199.5 cc",
        price: "₹1,32,000 – ₹1,35,820",
        status: "Active",
        features: "Liquid-cooled triple-spark performance",
        description: "Potent quarter-litre fighter.",
        image: "https://placehold.co/400x250?text=Pulsar+NS200"
    },
    {
        brand: "Bajaj",
        model: "Pulsar NS400Z",
        category: "Pulsar NS Series",
        engine: "373.3 cc",
        price: "₹1,81,300 – ₹1,94,060",
        status: "Active",
        features: "Flagship naked, traction control, ride-by-wire",
        description: "The flagship beast.",
        image: "https://placehold.co/400x250?text=Pulsar+NS400Z"
    },
    // --- BAJAJ PULSAR RS SERIES ---
    {
        brand: "Bajaj",
        model: "Pulsar RS200",
        category: "Pulsar RS Series",
        engine: "199.5 cc",
        price: "₹1,71,000 – ₹1,75,940",
        status: "Active",
        features: "Fully-faired body, dual projector lamps",
        description: "Full faired supersport.",
        image: "https://placehold.co/400x250?text=Pulsar+RS200"
    },
    // --- BAJAJ CHETAK (EV) ---
    {
        brand: "Bajaj",
        model: "Chetak C25 / C30",
        category: "Scooter (EV)",
        engine: "3.1 kW",
        price: "₹96,535 – ₹1,09,950",
        status: "Active",
        features: "All-metal retro body electric scooter",
        description: "Premium electric retro.",
        image: "https://placehold.co/400x250?text=Chetak+EV"
    },
    {
        brand: "Bajaj",
        model: "Chetak C35 Premium",
        category: "Scooter (EV)",
        engine: "3.2 kW",
        price: "₹1,10,000 – ₹1,27,000",
        status: "Active",
        features: "Extended range model, digital display hub",
        description: "Long range electric.",
        image: "https://placehold.co/400x250?text=Chetak+Premium"
    },
    // --- UPCOMING MODELS ---
    {
        brand: "Bajaj",
        model: "Pulsar 125/150 Revamp",
        category: "Next-Gen",
        engine: "~150 cc",
        price: "₹95,000 – ₹1,15,000 (Est.)",
        status: "Upcoming",
        features: "Total frame overhaul & engine upgrade",
        description: "All new generation pulsar.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    {
        brand: "Bajaj",
        model: "Pulsar NS150",
        category: "Pulsar NS Series",
        engine: "~150 cc",
        price: "₹1,22,000 (Expected)",
        status: "Upcoming",
        features: "Naked sport framework for 150cc class",
        description: "Upcoming naked sport.",
        image: "https://placehold.co/400x250?text=Coming+Soon"
    },
    // --- DISCONTINUED MODELS ---
    {
        brand: "Bajaj",
        model: "Pulsar F250",
        category: "Pulsar F Series",
        engine: "249.1 cc",
        price: "₹1,40,000",
        status: "Discontinued",
        features: "Semi-faired sport",
        description: "Semi-faired quarter litre.",
        image: "https://placehold.co/400x250?text=Pulsar+F250"
    }
];

function parseCategory(catName) {
    if (catName.includes("EV")) return 5; // Electric
    if (catName.includes("Classic")) return 3; // Commuter
    return 1; // Default to Sport for Pulsar N, NS, RS, etc.
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
        
        console.log("Seeding new bikes...");
        let count = 0;

        for (const bike of bikeData) {
            const category_id = parseCategory(bike.category);
            const price = parsePrice(bike.price);
            const engine_cc = parseEngine(bike.engine);
            const mileage = parseMileage(bike.mileage);
            const is_featured = bike.status === "Active" ? 1 : 0;
            const finalDesc = "[" + bike.status + "] " + bike.description;
            
            // Defaulting weight, fuel, etc if missing
            const weight = bike.weight ? parseFloat(bike.weight.replace(/[^\d.]/g, '')) : null;
            const transmission = bike.transmission || "5-Speed";

            // Check if already exists
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
        console.log("\nSuccessfully seeded " + count + " bikes.");
    } catch (e) {
        console.error("Error seeding bikes:", e);
    }
}

seedData();
