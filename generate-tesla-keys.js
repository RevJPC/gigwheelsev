// Script to generate Tesla Fleet API key pair
const crypto = require('crypto');
const fs = require('fs');

console.log('Generating Tesla Fleet API key pair...\n');

// Generate EC key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Save private key
fs.writeFileSync('tesla-private-key.pem', privateKey);
console.log('✓ Private key saved to: tesla-private-key.pem');

// Save public key
fs.writeFileSync('tesla-public-key.pem', publicKey);
console.log('✓ Public key saved to: tesla-public-key.pem');

// Copy public key to the .well-known directory
const publicKeyPath = 'public/.well-known/appspecific/com.tesla.3p.public-key.pem';
fs.mkdirSync('public/.well-known/appspecific', { recursive: true });
fs.writeFileSync(publicKeyPath, publicKey);
console.log('✓ Public key copied to:', publicKeyPath);

console.log('\n✅ Key pair generated successfully!');
console.log('\n⚠️  IMPORTANT: Keep tesla-private-key.pem SECRET - never commit it to git!');
console.log('📝 The public key will be accessible at: https://gigwheelev.com/.well-known/appspecific/com.tesla.3p.public-key.pem');
