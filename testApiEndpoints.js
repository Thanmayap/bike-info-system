const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(urlPath, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${urlPath}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node Test Auditor'
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
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log('=== STARTING COMPLETE E2E BUTTON & BACKEND CAPABILITY AUDIT ===');
  
  const testEmail = 'test.rider@example.com';
  const testPassword = 'Password123!';
  let token = null;
  let bikeId = 1; // test against bike ID 1
  
  try {
    // 1. Test Login Button capability (Verify correct authentication handler)
    console.log('\n[TEST 1] Logging in with seeded credentials...');
    const loginRes = await request('/auth/login', 'POST', {
      email: testEmail,
      password: testPassword
    });
    console.log(`Status: ${loginRes.status}. Token received: ${!!loginRes.body.token}`);
    if (loginRes.status !== 200 || !loginRes.body.token) throw new Error('Login failed');
    token = loginRes.body.token;
    
    // 2. Test Profile View button capability (Me route check)
    console.log('\n[TEST 2] Fetching logged-in user profile details...');
    const meRes = await request('/users/me', 'GET', null, token);
    console.log(`Status: ${meRes.status}. User Name: ${meRes.body.name}, Role: ${meRes.body.role}`);
    if (meRes.status !== 200) throw new Error('Fetch profile failed');
    
    // 3. Test Update Profile & Avatar Preset Picker button capability
    console.log('\n[TEST 3] Updating profile (changing name, phone, and choosing Futuristic EV Avatar Badge "⚡")...');
    const updateRes = await request('/users/me', 'PUT', {
      name: 'Futuristic Rider',
      phone: '9876543210',
      avatar: '⚡'
    }, token);
    console.log(`Status: ${updateRes.status}. Response:`, updateRes.body);
    if (updateRes.status !== 200) throw new Error('Update profile failed');
    
    // 4. Test Fetch Updated Profile verification
    console.log('\n[TEST 4] Fetching profile again to verify updates...');
    const meUpdated = await request('/users/me', 'GET', null, token);
    console.log(`Status: ${meUpdated.status}. Updated Name: ${meUpdated.body.name}, Phone: ${meUpdated.body.phone}, Avatar Preset: ${meUpdated.body.avatar}`);
    if (meUpdated.body.avatar !== '⚡') throw new Error('Avatar select verification failed');
    
    // 5. Test Fetch All Bikes list / Search catalog button capability
    console.log('\n[TEST 5] Searching and listing bikes...');
    const searchRes = await request('/bikes', 'GET');
    console.log(`Status: ${searchRes.status}. Total Bikes Found: ${searchRes.body.length}`);
    if (searchRes.status !== 200) throw new Error('Search bikes failed');
    
    // 6. Test Bike Details card click / route capability
    console.log(`\n[TEST 6] Fetching specific details for Bike ID ${bikeId}...`);
    const detailsRes = await request(`/bikes/${bikeId}`, 'GET');
    console.log(`Status: ${detailsRes.status}. Model Name: ${detailsRes.body.model}, Price: ${detailsRes.body.price}`);
    if (detailsRes.status !== 200) throw new Error('Fetch bike details failed');
    
    // 7. Test Toggle Wishlist / Save Bike button capability
    console.log(`\n[TEST 7] Toggling wishlist to save Bike ID ${bikeId}...`);
    const saveRes = await request(`/users/wishlist/${bikeId}`, 'POST', null, token);
    console.log(`Status: ${saveRes.status}. Saved state returned:`, saveRes.body);
    if (saveRes.status !== 200) throw new Error('Toggle wishlist failed');
    
    // 8. Test View Wishlist button capability
    console.log('\n[TEST 8] Fetching saved wishlist list...');
    const wishlistRes = await request('/users/wishlist', 'GET', null, token);
    console.log(`Status: ${wishlistRes.status}. Total Saved Bikes: ${wishlistRes.body.length}`);
    if (wishlistRes.status !== 200) throw new Error('Wishlist fetch failed');
    
    // 9. Test Track Recent View (triggered automatically on details page open)
    console.log(`\n[TEST 9] Tracking recent view for Bike ID ${bikeId}...`);
    const trackRes = await request(`/users/recent/${bikeId}`, 'POST', null, token);
    console.log(`Status: ${trackRes.status}. Response:`, trackRes.body);
    if (trackRes.status !== 200) throw new Error('Track recent failed');
    
    // 10. Test Fetch Recently Viewed list capability
    console.log('\n[TEST 10] Fetching recently viewed list...');
    const recentRes = await request('/users/recent', 'GET', null, token);
    console.log(`Status: ${recentRes.status}. Total Recently Viewed: ${recentRes.body.length}`);
    if (recentRes.status !== 200) throw new Error('Fetch recent list failed');
    
    // 11. Test Dashboard Stats calculation capability
    console.log('\n[TEST 11] Fetching dashboard stats...');
    const statsRes = await request('/users/stats', 'GET', null, token);
    console.log(`Status: ${statsRes.status}. Stats returned:`, statsRes.body);
    if (statsRes.status !== 200) throw new Error('Fetch stats failed');
    
    // 12. Test Post Review button capability
    console.log(`\n[TEST 12] Posting user star rating & review for Bike ID ${bikeId}...`);
    const reviewRes = await request(`/reviews/bike/${bikeId}`, 'POST', {
      rating: 5,
      comment: 'Absolutely legendary experience. Highly recommended!'
    }, token);
    console.log(`Status: ${reviewRes.status}. Response:`, reviewRes.body);
    if (reviewRes.status !== 201 && reviewRes.status !== 200) throw new Error('Post review failed');
    
    // 13. Test Fetch Reviews button capability
    console.log(`\n[TEST 13] Fetching all reviews for Bike ID ${bikeId}...`);
    const getReviews = await request(`/reviews/bike/${bikeId}`, 'GET');
    console.log(`Status: ${getReviews.status}. Total reviews found: ${getReviews.body.length}`);
    if (getReviews.status !== 200) throw new Error('Fetch reviews failed');
    
    console.log('\n======================================================');
    console.log('  SUCCESS: ALL BUTTON & BACKEND CAPABILITIES VERIFIED!');
    console.log('======================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n!!! AUDIT FAILED !!!');
    console.error(error);
    process.exit(1);
  }
}

run();
