const https = require('https');

const partnerToken = process.argv[2];
if (!partnerToken) {
    console.error('Usage: node register-with-partner-token.js <PARTNER_TOKEN>');
    process.exit(1);
}

const DOMAIN = 'gigwheelsev.com';
const postData = JSON.stringify({ domain: DOMAIN });

const options = {
    hostname: 'fleet-api.prd.na.vn.cloud.tesla.com',
    port: 443,
    path: '/api/1/partner_accounts',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${partnerToken}`,
        'Content-Length': postData.length
    }
};

console.log(`Registering ${DOMAIN}...\n`);

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log('Response:', JSON.stringify(json, null, 2));
            if (res.statusCode === 200) {
                console.log('\n✅ REGISTRATION SUCCESSFUL!');
            }
        } catch (e) {
            console.log('Response:', data);
        }
    });
});

req.on('error', e => console.error('Error:', e));
req.write(postData);
req.end();
