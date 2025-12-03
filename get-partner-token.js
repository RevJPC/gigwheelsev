const https = require('https');

// Get partner token using OAuth2 client_credentials flow
const clientId = process.argv[2];
const clientSecret = process.argv[3];

if (!clientId || !clientSecret) {
    console.error('Usage: node get-partner-token.js <CLIENT_ID> <CLIENT_SECRET>');
    process.exit(1);
}

const postData = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    audience: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
    scope: 'openid vehicle_device_data vehicle_cmds vehicle_charging_cmds'
}).toString();

const options = {
    hostname: 'fleet-auth.prd.vn.cloud.tesla.com',
    port: 443,
    path: '/oauth2/v3/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
};

console.log('Getting partner token via OAuth2...\n');

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.access_token) {
                console.log('\n✅ SUCCESS! Partner Token:', json.access_token);
                console.log('\nNow use this token to register:');
                console.log(`node register-with-partner-token.js ${json.access_token}`);
            } else {
                console.log('\n❌ FAILED:', JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log('Response:', data);
        }
    });
});

req.on('error', e => console.error('Error:', e));
req.write(postData);
req.end();
