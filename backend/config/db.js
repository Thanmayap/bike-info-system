const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let dbInstance;

async function getDb() {
  if (!dbInstance) {
    let dbPath = path.join(__dirname, '../../database/database.sqlite');
    
    if (process.env.VERCEL) {
      const tempDbPath = path.join('/tmp', 'database.sqlite');
      if (!fs.existsSync(tempDbPath)) {
        try {
          fs.copyFileSync(dbPath, tempDbPath);
          console.log('Copied database.sqlite to /tmp for write access on Vercel');
        } catch (err) {
          console.error('Failed to copy database to /tmp:', err);
        }
      }
      dbPath = tempDbPath;
    } else {
      // Ensure the database directory exists
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
    }

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }
  return dbInstance;
}

const pool = {
  query: async (sql, params = []) => {
    const db = await getDb();
    
    // SQLite doesn't use true booleans but 0/1. mysql2 uses them depending on type mapping.
    // Replace MySQL specific syntax to make it somewhat compatible
    // For schema.sql, we handle that in initDb.js. For queries in controllers, they are mostly standard.
    
    const upperSql = sql.trim().toUpperCase();
    
    try {
      if (upperSql.startsWith('SELECT') || upperSql.startsWith('SHOW')) {
        const rows = await db.all(sql, params);
        return [rows, []];
      } else {
        const result = await db.run(sql, params);
        // For INSERT, result.lastID; for UPDATE/DELETE, result.changes
        return [{ insertId: result.lastID, affectedRows: result.changes }, []];
      }
    } catch (error) {
      console.error('DB Query Error:', error);
      throw error;
    }
  },
  execute: async (sql, params) => pool.query(sql, params),
  getDbInstance: getDb // exported in case we need direct access
};

module.exports = pool;
