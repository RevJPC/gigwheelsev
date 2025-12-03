const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

// Check for arguments
const clientId = process.argv[2];
if (!clientId) {
    console.error('Please provide your Tesla Client ID as an argument.');
    console.error('Usage: node register-app.js <CLIENT_ID>');
    process.exit(1);
}

// Configuration
const DOMAIN = 'https://gigwheelsev.com';
const REGIONS = [
    'fleet-api.prd.na.vn.cloud.tesla.com',
    'fleet-api.prd.eu.vn.cloud.tesla.com',
    'fleet-api.prd.cn.vn.cloud.tesla.com'
];

// 1. Load Private Key
let privateKey;
try {
    privateKey = fs.readFileSync('tesla-private-key.pem', 'utf8');
} catch (e) {
    console.error('Error reading tesla-private-key.pem. Make sure you generated keys first.');
    process.exit(1);
}

// 2. Load JWT Library
let jwt;
try {
    jwt = require('jsonwebtoken');
} catch (e) {
    console.error('Missing dependency: jsonwebtoken');
    console.error('Please run: npm install jsonwebtoken');
    process.exit(1);
}

// 3. Verify keys locally first
try {
    const localPublicKey = fs.readFileSync('tesla-public-key.pem', 'utf8');
    const dummyToken = jwt.sign({ test: 1 }, privateKey, { algorithm: 'ES256' });
    jwt.verify(dummyToken, localPublicKey);
    console.log('✅ Key pair valid.');
} catch (e) {
    console.error('❌ Key pair invalid:', e.message);
    process.exit(1);
}

// 4. Register in all regions
async function registerInRegion(region) {
    console.log(`\n🌐 Registering in region: ${region}...`);

    const token = jwt.sign(
        {
            iss: clientId,
            aud: `https://${region}`,
            iat: Math.floor(Date.now() / 1000) - 60, // Backdate 60s for clock skew
            exp: Math.floor(Date.now() / 1000) + 300 // 5 minutes
        },
        privateKey,
        {
            algorithm: 'ES256',
            header: { typ: 'JWT', alg: 'ES256' }
        }
    );

    const postData = JSON.stringify({ domain: DOMAIN });
    const options = {
        hostname: region,
        port: 443,
        path: '/api/1/partner_accounts',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Length': postData.length,
            'User-Agent': 'GigWheelsEV/1.0'
        }
    };

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ SUCCESS in ${region}`);
                } else {
                    console.log(`❌ FAILED in ${region}: ${res.statusCode}`);
                    try {
                        const json = JSON.parse(data);
                        console.log(JSON.stringify(json, null, 2));
                    } catch (e) {
                        console.log(data);
                    }
                }
                resolve();
            });
        });
        req.on('error', e => {
            console.error(`Error in ${region}:`, e.message);
            resolve();
        });
        req.write(postData);
        req.end();
    });
}

(async () => {
    for (const region of REGIONS) {
        await registerInRegion(region);
    }
    console.log('\n🏁 Registration attempts complete.');
})();
