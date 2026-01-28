# 🚀 Cloudflare Pages Deployment Guide

## Quick Deploy Steps

### Option 1: Direct Build & Deploy (Recommended)

1. **Build the app locally:**
```bash
cd apps/realestate
npm run build
```

2. **Install Wrangler CLI:**
```bash
npm install -g wrangler
```

3. **Login to Cloudflare:**
```bash
wrangler login
```

4. **Deploy to Cloudflare Pages:**
```bash
wrangler pages deploy .next --project-name=domislink-realestate
```

### Option 2: GitHub Integration (Automatic)

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Real estate app with advanced templates"
git push origin main
```

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages**
   - Click **Create a project**
   - Connect your GitHub repository
   - Select **domislink-empire** repository

3. **Configure Build Settings:**
   - **Project name:** `domislink-realestate`
   - **Production branch:** `main`
   - **Build command:** `cd apps/realestate && npm run build`
   - **Build output directory:** `apps/realestate/.next`
   - **Root directory:** `/` (leave empty)

4. **Environment Variables:**
   Add these in Cloudflare Pages settings:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

### Option 3: Static Export (HTML/CSS/JS)

If you want pure static files:

1. **Update next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

2. **Build static files:**
```bash
npm run build
```

3. **Upload the `out` folder to Cloudflare Pages**

## 🌐 Custom Domain Setup

1. **Add your domain in Cloudflare Pages:**
   - Go to your project → Custom domains
   - Add `realestate.domislink.com`

2. **Update DNS records:**
   ```
   Type: CNAME
   Name: realestate
   Target: domislink-realestate.pages.dev
   ```

## 📁 What Gets Deployed

Your deployment will include:
- ✅ 4 Advanced Ad Templates
- ✅ Real Estate MVP functionality
- ✅ Search & filtering
- ✅ Price alerts system
- ✅ Community explorer
- ✅ Responsive design

## 🔧 Troubleshooting

**Build fails?**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Environment variables not working?**
- Check variable names in Cloudflare dashboard
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding variables

## 📊 Performance

Cloudflare Pages provides:
- ⚡ Global CDN (300+ locations)
- 🔒 Automatic HTTPS
- 📈 Built-in analytics
- 🚀 Edge functions support
- 💰 Free tier (generous limits)

## 🎯 Next Steps

After deployment:
1. Test all 4 templates
2. Verify search functionality
3. Test price alerts
4. Configure custom domain
5. Set up analytics

Your real estate app will be live at:
`https://domislink-realestate.pages.dev`

## 📞 Support

Need help? Check:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

🚀 **Ready to deploy? Run the commands above!**