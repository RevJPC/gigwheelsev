# Deploy backend to production
Write-Host "Deploying backend to production..." -ForegroundColor Green

# This will update the Lambda functions in your existing Amplify backend
npx ampx sandbox deploy --name production

Write-Host "`nBackend deployed! Now sync your vehicles to see battery data." -ForegroundColor Green
