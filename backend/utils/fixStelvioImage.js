const db = require('../config/db');

async function fixStelvio() {
    try {
        const sqliteDb = await db.getDbInstance();
        await sqliteDb.run(
            `UPDATE bikes SET image = ? WHERE model LIKE '%Stelvio%'`,
            ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/158655/stelvio-right-side-view.jpeg?isig=0&q=80']
        );
        console.log('Successfully updated the image for Moto Guzzi Stelvio!');
    } catch (e) {
        console.error('Error:', e);
    }
}

fixStelvio();
