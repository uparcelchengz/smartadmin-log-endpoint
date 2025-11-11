# 🚀 Deployment Guide

## Deploy to Vercel (Recommended - 100% Free)

### Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas connection string

### Step-by-Step Deployment

#### 1. Prepare Your Repository

```bash
# Make sure all files are committed
git add .
git commit -m "Add webhook logger with MongoDB"
git push origin main
```

#### 2. Deploy to Vercel

1. **Visit Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Import Project**: 
   - Click "Add New" → "Project"
   - Select your GitHub repository: `smartadmin-log-endpoint`
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/webhook-logs` |
   | `WEBHOOK_SECRET` | `your-secret-key-here` |

   ⚠️ **Important**: Add these to all environments (Production, Preview, Development)

6. **Deploy**: Click "Deploy" button

7. **Wait**: Deployment takes 1-2 minutes

8. **Success!** 🎉 You'll get a URL like: `https://your-project.vercel.app`

### Post-Deployment

#### Test Your Production Endpoint

```bash
# Test webhook endpoint
curl -X POST https://your-project.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret-key" \
  -d '{"message": "Production test!"}'

# View dashboard
# Open in browser: https://your-project.vercel.app
```

#### Custom Domain (Optional)

1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Vercel Free Tier Limits

- ✅ **Bandwidth**: 100 GB/month
- ✅ **Invocations**: 100,000/month
- ✅ **Deployments**: Unlimited
- ✅ **Build Time**: 6,000 minutes/month
- ✅ **Serverless Functions**: 12 per deployment
- ✅ **Function Duration**: 10 seconds max

**More than enough for webhook logging!**

---

## Alternative: Deploy to Netlify

### Step-by-Step

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login to Netlify

```bash
netlify login
```

#### 3. Initialize Netlify

```bash
netlify init
```

Follow prompts:
- Create new site
- Authorize with GitHub
- Build command: `npm run build`
- Publish directory: `.next`

#### 4. Add Environment Variables

```bash
netlify env:set MONGODB_URI "mongodb+srv://user:pass@cluster.mongodb.net/webhook-logs"
netlify env:set WEBHOOK_SECRET "your-secret-key"
```

#### 5. Deploy

```bash
netlify deploy --prod
```

### Netlify Free Tier Limits

- ✅ **Bandwidth**: 100 GB/month
- ✅ **Build Minutes**: 300/month
- ✅ **Concurrent Builds**: 1
- ✅ **Sites**: Unlimited
- ✅ **Serverless Functions**: 125,000/month

---

## Alternative: Deploy to Railway

Railway offers free trials and pay-as-you-go pricing.

### Step-by-Step

1. **Visit Railway**: https://railway.app
2. **Sign in** with GitHub
3. **New Project** → "Deploy from GitHub repo"
4. Select your repository
5. **Add Variables**:
   - `MONGODB_URI`
   - `WEBHOOK_SECRET`
6. Railway auto-detects Next.js and deploys

---

## Environment Variables Reference

All platforms need these environment variables:

```env
# Required: Your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/webhook-logs?retryWrites=true&w=majority

# Optional: Secret key for webhook authentication
WEBHOOK_SECRET=your-random-secret-key-make-it-long-and-random

# Optional: Node environment (auto-set by most platforms)
NODE_ENV=production
```

### How to Get MongoDB URI:

1. MongoDB Atlas → Database → Connect
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<username>` and `<password>`
5. Add database name: `/webhook-logs`

---

## Post-Deployment Checklist

- [ ] Website loads at your deployment URL
- [ ] Dashboard displays correctly
- [ ] Webhook URL is shown on dashboard
- [ ] Test webhook works (send POST request)
- [ ] Log appears on dashboard
- [ ] Environment variables are set correctly
- [ ] MongoDB connection is working
- [ ] Copied webhook URL for other projects

---

## Monitoring & Maintenance

### Vercel Dashboard

Monitor your deployment:
1. Go to https://vercel.com/dashboard
2. Select your project
3. View:
   - **Deployments**: All deployments and their status
   - **Analytics**: Traffic and performance
   - **Logs**: Runtime logs and errors
   - **Settings**: Environment variables and domain

### MongoDB Atlas Monitoring

Monitor your database:
1. Go to MongoDB Atlas → Database
2. Click your cluster
3. View:
   - **Metrics**: Database operations and performance
   - **Data**: Browse collections (logs collection)
   - **Alerts**: Set up alerts for issues

---

## Updating Your Deployment

### Method 1: Git Push (Automatic)

```bash
# Make changes to your code
git add .
git commit -m "Update webhook logger"
git push origin main

# Vercel automatically deploys the new version!
```

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Common Deployment Issues

### Issue: Build fails with "Cannot find module"

**Solution**: Make sure all dependencies are in `package.json`
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: "Failed to connect to MongoDB"

**Solution**: Check environment variables in Vercel dashboard
1. Go to Settings → Environment Variables
2. Verify `MONGODB_URI` is correct
3. Click "Redeploy" after updating

### Issue: 500 Internal Server Error

**Solution**: Check Vercel logs
1. Go to Vercel dashboard → Your project
2. Click on latest deployment
3. View "Functions" logs
4. Fix error in code, commit, push

### Issue: Webhook returns 401 Unauthorized

**Solution**: Check webhook secret
1. Verify `WEBHOOK_SECRET` in environment variables
2. Verify you're sending correct header: `x-webhook-secret`
3. Make sure secret matches in both places

---

## Security Best Practices

1. **Never commit `.env.local`** (already in .gitignore ✅)
2. **Use strong webhook secret** (20+ random characters)
3. **Rotate secrets periodically** (every 90 days)
4. **Enable MongoDB IP whitelist** (or use 0.0.0.0/0 for serverless)
5. **Monitor unusual activity** (check Vercel analytics)
6. **Set up alerts** (MongoDB Atlas alerts)

---

## Cost Breakdown (All Free!)

| Service | Plan | Cost | What You Get |
|---------|------|------|--------------|
| **Vercel** | Hobby | $0/mo | 100 GB bandwidth, unlimited deployments |
| **MongoDB Atlas** | M0 Free | $0/mo | 512 MB storage, shared cluster |
| **GitHub** | Free | $0/mo | Unlimited public/private repos |
| **Custom Domain** | Optional | $10-15/year | Your own domain name |

**Total**: $0/month (or ~$1/month if you add a custom domain)

---

## Success! 🎉

Your webhook logger is now deployed and accessible worldwide!

**Your URLs**:
- 🌐 Dashboard: `https://your-project.vercel.app`
- 📡 Webhook: `https://your-project.vercel.app/api/webhook`

**Next Steps**:
1. Update your other project to use this webhook URL
2. Monitor logs on the dashboard
3. Share the dashboard URL with your team (if needed)

---

**Need help?** Check the other documentation files:
- `QUICKSTART.md` - Fast setup guide
- `SETUP.md` - Detailed setup instructions
- `TESTING.md` - How to test webhooks
- `PROJECT_SUMMARY.md` - Complete project overview
