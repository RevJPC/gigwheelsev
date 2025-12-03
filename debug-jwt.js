const fs = require('fs');
const jwt = require('jsonwebtoken');

// Debug script to inspect the JWT we're generating
const clientId = '0dc307d1-a1ac-4b23-a43c-75e63a5a84bc';
const privateKey = fs.readFileSync('tesla-private-key.pem', 'utf8');
const publicKey = fs.readFileSync('tesla-public-key.pem', 'utf8');

const token = jwt.sign(
    {
        iss: clientId,
        aud: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
        iat: Math.floor(Date.now() / 1000) - 60,
        exp: Math.floor(Date.now() / 1000) + 300
    },
    privateKey,
    {
        algorithm: 'ES256',
        header: { typ: 'JWT', alg: 'ES256' }
    }
);

console.log('Generated JWT:', token);
console.log('\nDecoded Header:', jwt.decode(token, { complete: true }).header);
console.log('\nDecoded Payload:', jwt.decode(token, { complete: true }).payload);

// Verify locally
try {
    jwt.verify(token, publicKey, { algorithms: ['ES256'] });
    console.log('\n✅ Local verification successful');
} catch (e) {
    console.log('\n❌ Local verification failed:', e.message);
}

// Check public key format
console.log('\nPublic Key:\n', publicKey);
