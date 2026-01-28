#!/bin/bash

echo "🔧 Fixing DomisLink Empire Errors..."

# 1. Replace package.json
echo "📦 Fixing package.json..."
cp package-fixed.json package.json

# 2. Install dependencies
echo "📥 Installing dependencies..."
npm install

# 3. Create missing directories
echo "📁 Creating missing directories..."
mkdir -p apps/hub/src/app
mkdir -p apps/realestate/src/app
mkdir -p apps/tickets/src/app
mkdir -p apps/flightmonitor/src/app
mkdir -p apps/teachmaster/src/app
mkdir -p apps/admin/src/app

# 4. Create package.json for each app
echo "📋 Creating app package.json files..."

# Hub app
cat > apps/hub/package.json << 'EOF'
{
  "name": "hub",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@domislink/geolocation": "*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
EOF

# TeachMaster app
cat > apps/teachmaster/package.json << 'EOF'
{
  "name": "teachmaster",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@domislink/geolocation": "*",
    "@domislink/ai-services": "*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Tickets app
cat > apps/tickets/package.json << 'EOF'
{
  "name": "tickets",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@domislink/geolocation": "*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
EOF

# 5. Create package.json for packages
echo "📦 Creating package package.json files..."

cat > packages/geolocation/package.json << 'EOF'
{
  "name": "@domislink/geolocation",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF

cat > packages/ai-services/package.json << 'EOF'
{
  "name": "@domislink/ai-services",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "next": "14.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF

# 6. Create basic app pages
echo "🏠 Creating basic app pages..."

# Hub page
cat > apps/hub/src/app/page.tsx << 'EOF'
import GlobalHubLinker from '../components/GlobalHubLinker'

export default function HubPage() {
  return <GlobalHubLinker />
}
EOF

# TeachMaster page
cat > apps/teachmaster/src/app/page.tsx << 'EOF'
import GlobalTeachMasterLinker from '../components/GlobalTeachMasterLinker'

export default function TeachMasterPage() {
  return <GlobalTeachMasterLinker />
}
EOF

# Tickets page
cat > apps/tickets/src/app/page.tsx << 'EOF'
import GlobalDynamicWingsHeader from '../components/GlobalDynamicWingsHeader'

export default function TicketsPage() {
  return (
    <div>
      <GlobalDynamicWingsHeader />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Flight Search Coming Soon</h2>
      </div>
    </div>
  )
}
EOF

# 7. Create layout files
echo "🎨 Creating layout files..."

cat > apps/hub/src/app/layout.tsx << 'EOF'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

cp apps/hub/src/app/layout.tsx apps/teachmaster/src/app/layout.tsx
cp apps/hub/src/app/layout.tsx apps/tickets/src/app/layout.tsx

# 8. Fix imports in components
echo "🔧 Fixing component imports..."

# Fix GlobalHubLinker import
sed -i "s/import GeolocationDataManager from '@domislink\/geolocation'/import { GeolocationDataManager } from '@domislink\/geolocation'/g" apps/hub/src/components/GlobalHubLinker.tsx

# Fix GlobalTeachMasterLinker import
sed -i "s/import GeolocationDataManager from '@domislink\/geolocation'/import { GeolocationDataManager } from '@domislink\/geolocation'/g" apps/teachmaster/src/components/GlobalTeachMasterLinker.tsx

# Fix GlobalDynamicWingsHeader import
sed -i "s/import GeolocationDataManager from '@domislink\/geolocation'/import { GeolocationDataManager } from '@domislink\/geolocation'/g" apps/tickets/src/components/GlobalDynamicWingsHeader.tsx

echo "✅ All errors fixed! Run 'npm run dev' to start development."