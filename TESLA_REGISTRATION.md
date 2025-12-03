# Tesla Fleet API Registration - Next Steps

## 1. Generate Keys

Run these commands in your project directory:

```powershell
# Generate private key (keep this SECRET - never commit to git!)
openssl ecparam -name prime256v1 -genkey -noout -out tesla-private-key.pem

# Generate public key
openssl ec -in tesla-private-key.pem -pubout -out tesla-public-key.pem

# Copy public key to the correct location
Copy-Item tesla-public-key.pem public\.well-known\appspecific\com.tesla.3p.public-key.pem
```

## 2. Update Tesla Developer App

1. Go to https://developer.tesla.com/
2. Open your application
3. Update **Redirect URI** to: `https://gigwheelsev.com/admin/settings/callback`
4. Save changes

## 3. Deploy to Production

Deploy your app to `gigwheelsev.com` - the public key will be accessible at:
```
https://gigwheelsev.com/.well-known/appspecific/com.tesla.3p.public-key.pem
```

## 4. Generate Partner Authentication Token

After deployment, you'll need to generate a JWT signed with your private key. Here's a Node.js script to do that:

```javascript
// generate-partner-token.js
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('tesla-private-key.pem');

const token = jwt.sign(
  {
    iss: 'your-client-id',  // Replace with your Tesla Client ID
    aud: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
  },
  privateKey,
  {
    algorithm: 'ES256',
    expiresIn: '5m'
  }
);

console.log('Partner Token:', token);
```

Run: `node generate-partner-token.js`

## 5. Update Lambda Function

Update `amplify/functions/tesla-register/handler.ts` to use the partner token in the Authorization header instead of the regular access token.

## 6. Complete Registration

Once deployed, go to `https://gigwheelsev.com/admin/settings` and click "Register Account".

---

**IMPORTANT**: Add `tesla-private-key.pem` to your `.gitignore` to keep it secure!
