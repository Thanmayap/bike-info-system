const https = require('https');
const db = require('../config/db');

function searchImage(query) {
    // We add specific terms to ensure high quality right-side-view images like Bikewale uses
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query + " motorcycle right side view")}&form=HDRSC3`;
    return new Promise((resolve) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        }, (res) => {
            let html = '';
            res.on('data', (chunk) => { html += chunk; });
            res.on('end', () => {
                const match = html.match(/murl&quot;:&quot;(.*?)&quot;/);
                if (match && match[1]) {
                    // Fix HTML entities
                    let imgUrl = match[1].replace(/&amp;/g, '&');
                    resolve(imgUrl);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => {
            resolve(null);
        });
    });
}

async function updatePlaceholderImages() {
    try {
        const sqliteDb = await db.getDbInstance();
        console.log("Fetching bikes with placeholder images...");
        
        const bikes = await sqliteDb.all(
            "SELECT id, brand, model FROM bikes WHERE image LIKE '%placehold.co%' OR image LIKE '%Coming+Soon%' OR image LIKE '%Discontinued%'"
        );
        
        console.log(`Found ${bikes.length} bikes needing image updates.`);
        let count = 0;

        for (const bike of bikes) {
            const query = `${bike.brand} ${bike.model}`;
            const imgUrl = await searchImage(query);
            
            if (imgUrl) {
                await sqliteDb.run("UPDATE bikes SET image = ? WHERE id = ?", [imgUrl, bike.id]);
                console.log(`[SUCCESS] Updated ${query} -> ${imgUrl}`);
                count++;
            } else {
                console.log(`[FAILED] Could not find image for ${query}`);
            }
            
            // Wait 500ms to avoid rate limits
            await new Promise(r => setTimeout(r, 500));
        }
        
        console.log(`\nCompleted! Successfully updated images for ${count} bikes.`);
    } catch (e) {
        console.error("Error updating images:", e);
    }
}

updatePlaceholderImages();
