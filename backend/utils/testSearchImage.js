const https = require('https');

function searchImage(query) {
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
                // Bing images usually have something like murl&quot;:&quot;https://...&quot;
                const match = html.match(/murl&quot;:&quot;(.*?)&quot;/);
                if (match && match[1]) {
                    resolve(match[1]);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => {
            resolve(null);
        });
    });
}

searchImage("KTM Duke 125").then(res => console.log("KTM Duke 125:", res));
searchImage("Bajaj Pulsar N160").then(res => console.log("Bajaj Pulsar N160:", res));
searchImage("Triumph Speed 400").then(res => console.log("Triumph Speed 400:", res));
