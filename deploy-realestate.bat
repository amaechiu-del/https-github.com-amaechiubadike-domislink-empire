@echo off
echo Building Real Estate App for Cloudflare Pages...

cd apps\realestate

echo Installing dependencies...
npm install --no-package-lock

echo Building app...
npm run build

echo Build complete! Files are in the 'out' directory.
echo.
echo To deploy to Cloudflare Pages:
echo 1. Go to https://dash.cloudflare.com/pages
echo 2. Create new project
echo 3. Upload the 'out' folder
echo 4. Set custom domain: realestate.domislink.com
echo.
pause