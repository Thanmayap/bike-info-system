const http = require('http');
const fs = require('fs');
const path = require('path');
const pool = require('./backend/config/db');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(urlPath, method, body = null, token = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${urlPath}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'User-Agent': 'Node Test Upload Auditor',
        ...headers
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    
    req.on('error', (err) => reject(err));
    
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function run() {
  console.log('=== STARTING BACKEND CUSTOM UPLOAD ENDPOINT AUDIT ===');
  
  const testEmail = 'test.rider@example.com';
  const testPassword = 'Password123!';
  let token = null;
  
  try {
    // 1. Get Authentication Token
    console.log('\n[STEP 1] Logging in with seeded credentials...');
    const loginPayload = JSON.stringify({ email: testEmail, password: testPassword });
    const loginRes = await request('/auth/login', 'POST', loginPayload, null, {
      'Content-Type': 'application/json'
    });
    
    console.log(`Status: ${loginRes.status}. Token received: ${!!loginRes.body.token}`);
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error('Authentication failed');
    }
    token = loginRes.body.token;
    
    // 2. Perform Custom Avatar Upload
    console.log('\n[STEP 2] Preparing multipart form-data payload...');
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const filename = 'test-rider-avatar.png';
    
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="avatar"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n`;
    const footer = `\r\n--${boundary}--\r\n`;
    const fileContent = Buffer.from('mock-png-image-binary-data');
    
    const multipartBody = Buffer.concat([
      Buffer.from(header),
      fileContent,
      Buffer.from(footer)
    ]);
    
    console.log('[STEP 3] Dispatching POST upload-avatar request...');
    const uploadRes = await request('/users/upload-avatar', 'POST', multipartBody, token, {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length
    });
    
    console.log(`Upload Status: ${uploadRes.status}`);
    console.log('Response Body:', uploadRes.body);
    
    if (uploadRes.status !== 200 || !uploadRes.body.ok || !uploadRes.body.avatar) {
      throw new Error('Image upload failed');
    }
    
    const avatarPath = uploadRes.body.avatar;
    console.log(`Avatar successfully saved at: ${avatarPath}`);
    
    // 3. Verify file exists on disk
    const diskPath = path.join(__dirname, 'backend', avatarPath);
    console.log(`\n[STEP 4] Verifying physical file existence on disk at: ${diskPath}`);
    if (!fs.existsSync(diskPath)) {
      throw new Error('File does not exist on disk!');
    }
    console.log('SUCCESS: Physical file verified on disk!');
    
    // 4. Verify database update
    console.log('\n[STEP 5] Querying SQLite database for the test user...');
    const [rows] = await pool.query('SELECT avatar, name FROM users WHERE email = ?', [testEmail]);
    if (!rows || rows.length === 0) {
      throw new Error('User not found in database!');
    }
    console.log('Database returned:', rows[0]);
    if (rows[0].avatar !== avatarPath) {
      throw new Error(`Database avatar path mismatch! Expected "${avatarPath}", got "${rows[0].avatar}"`);
    }
    console.log('SUCCESS: Database record matches correctly!');
    
    console.log('\n======================================================');
    console.log('  SUCCESS: CUSTOM PROFILE PICTURE UPLOAD FLOW FULLY VERIFIED!');
    console.log('======================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n!!! AUDIT FAILED !!!');
    console.error(error);
    process.exit(1);
  }
}

run();
