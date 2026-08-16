const http = require('http');

const pagesToTest = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/status',
  '/admin/dashboard',
  '/ngo/dashboard',
  '/ngo/requirements/new',
  '/ngo/projects/proj-dlc',
  '/ngo/reviews',
  '/ngo/notifications',
  '/ngo/status',
  '/corporate/dashboard',
  '/corporate/tenders/new',
  '/corporate/tenders/tender-101',
  '/corporate/projects/proj-dlc',
  '/corporate/reports/proj-1025',
  '/corporate/reviews',
  '/corporate/notifications',
  '/corporate/status',
  '/business/dashboard',
  '/business/tenders/tender-101/quotation',
  '/business/projects/proj-dlc/fulfillment',
  '/business/reviews',
  '/business/notifications',
  '/business/status',
];

function checkPage(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          path: url,
          status: res.statusCode,
          ok: res.statusCode === 200,
          length: data.length,
          hasError: data.includes('500 Internal Server Error') || data.includes('Application error')
        });
      });
    }).on('error', (err) => {
      resolve({ path: url, status: 'ERROR', ok: false, error: err.message });
    });
  });
}

async function runRouteTests() {
  console.log('--- UI ROUTE & RENDERING TEST SUITE ---');
  const port = process.env.PORT || 3001;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Testing against ${baseUrl}...`);
  let failed = 0;

  for (const p of pagesToTest) {
    const res = await checkPage(baseUrl + p);
    if (res.ok && !res.hasError) {
      console.log(`[PASS] ${p} -> Status ${res.status} (${res.length} bytes)`);
    } else {
      console.error(`[FAIL] ${p} -> Status ${res.status} ${res.error || ''}`);
      failed++;
    }
  }

  if (failed === 0) {
    console.log('🎉 ALL UI PAGES RENDERED SUCCESSFULLY WITH STATUS 200 OK!');
  } else {
    console.error(`❌ ${failed} pages failed.`);
    process.exit(1);
  }
}

runRouteTests();
