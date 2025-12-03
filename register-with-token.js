const https = require('https');

// This script uses your regular OAuth access token to register
// Get your access token from the database first

const accessToken = process.argv[2];
if (!accessToken) {
    console.error('Please provide your Tesla access token as an argument.');
    console.error('You can get this from your database TeslaIntegration table.');
    console.error('Usage: node register-with-token.js <ACCESS_TOKEN>');
    process.exit(1);
}

const DOMAIN = 'https://gigwheelsev.com';
const REGION = 'fleet-api.prd.na.vn.cloud.tesla.com';

const postData = JSON.stringify({ domain: DOMAIN });

const options = {
    hostname: REGION,
    port: 443,
    path: '/api/1/partner_accounts',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Length': postData.length,
        'User-Agent': 'GigWheelsEV/1.0'
    }
};

console.log(`Attempting registration with OAuth token...`);

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('\nResponse Status:', res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log('Response Body:', JSON.stringify(json, null, 2));

            if (res.statusCode === 200 || res.statusCode === 201) {
                console.log('\n✅ SUCCESS! Account registered.');
            } else {
                console.log('\n❌ REGISTRATION FAILED.');
            }
        } catch (e) {
            console.log('Response Body:', data);
        }
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.write(postData);
req.end();
