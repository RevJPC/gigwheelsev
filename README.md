# GigWheels EV

Premium Electric Vehicle Fleet Management Platform

## Features

- **Multi-tier Authentication**
  - Guest/Public view (coming soon page)
  - Customer portal (reservations, payment history)
  - Employee portal (fleet tracking, vehicle status)
  - Admin portal (full system control)

- **Tesla Fleet Integration** (Coming Soon)
  - Real-time vehicle tracking
  - Battery and charging monitoring
  - Fleet map visualization
  - Vehicle management

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- AWS Amplify (planned for auth and hosting)
- Tesla Fleet API (planned)

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Build

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment to AWS via Amplify or S3 + CloudFront.

## Project Structure

```
app/
  ├── page.tsx           # Public landing page (coming soon)
  ├── customer/          # Customer portal
  ├── employee/          # Employee dashboard
  ├── admin/             # Admin dashboard
  └── api/               # API routes
components/              # Reusable components
lib/                     # Utilities and helpers
```

## Roadmap

### Phase 1: Foundation ✅
- [x] Coming soon page
- [x] Basic routing structure
- [x] Tailwind CSS setup

### Phase 2: Authentication (Next)
- [ ] AWS Amplify integration
- [ ] Cognito user pools
- [ ] Role-based access control (guest/customer/employee/admin)
- [ ] Login/signup flows

### Phase 3: Tesla Integration
- [ ] Tesla Fleet API setup
- [ ] Vehicle data fetching
- [ ] Live fleet map
- [ ] Battery/charging monitoring

### Phase 4: Admin Features
- [ ] User management interface
- [ ] Vehicle management (add/remove/pricing)
- [ ] Permission controls

## License

Private - All Rights Reserved
