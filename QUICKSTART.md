# 🎯 Quick Start Guide

## What is this?

A **FREE webhook endpoint** that:
- ✅ Receives webhook POSTs from any service
- ✅ Saves them to MongoDB (free tier)
- ✅ Shows them on a beautiful web dashboard
- ✅ Costs $0/month to run

## 🚀 5-Minute Setup

### Step 1: Get MongoDB Connection String

1. Go to **MongoDB Atlas**: https://mongodb.com/cloud/atlas/register
2. Create free account → Create cluster (M0 Free)
3. Create database user (username + password)
4. Allow all IPs (Network Access → 0.0.0.0/0)
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/`

### Step 2: Configure Your Project

1. Open `.env.local` file
2. Paste your MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/webhook-logs
   WEBHOOK_SECRET=your-random-secret-key
   ```
3. Save the file

### Step 3: Test Locally

The server is already running! Visit:
- 🌐 **Dashboard**: http://localhost:3000
- 📡 **Webhook endpoint**: http://localhost:3000/api/webhook

Test it by running:
```powershell
.\test-webhook.ps1
```

### Step 4: Deploy (Optional)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Add webhook logger"
   git push
   ```

2. Deploy to Vercel:
   - Visit https://vercel.com
   - Import your GitHub repo
   - Add environment variables (MONGODB_URI, WEBHOOK_SECRET)
   - Click Deploy

Your webhook will be live at: `https://your-project.vercel.app/api/webhook`

## 📝 How to Use

### Send a webhook from your other project:

**JavaScript:**
```javascript
fetch('https://your-project.vercel.app/api/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-webhook-secret': 'your-secret-key'
  },
  body: JSON.stringify({
    event: 'user.signup',
    data: { userId: 123, email: 'user@example.com' }
  })
});
```

**Python:**
```python
import requests

requests.post(
    'https://your-project.vercel.app/api/webhook',
    json={'event': 'test', 'data': {'message': 'hello'}},
    headers={'x-webhook-secret': 'your-secret-key'}
)
```

**cURL:**
```bash
curl -X POST https://your-project.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret-key" \
  -d '{"event": "test", "data": {"message": "hello"}}'
```

### View logs:

Just open your dashboard URL in a browser!

## 📊 Dashboard Features

- **Real-time logs**: See all webhooks instantly
- **Auto-refresh**: Update every 5 seconds (toggle on/off)
- **Full details**: Click any log to see headers, body, IP, etc.
- **Stats**: Total logs, POST count, latest timestamp
- **Clear all**: Delete all logs with one click
- **Copy webhook URL**: One-click copy button

## 🎓 Common Use Cases

1. **Webhook Debugging**: See exactly what GitHub/Stripe/etc. sends
2. **Event Monitoring**: Track events from your other apps
3. **Integration Testing**: Test webhook integrations before going live
4. **Notification Logging**: Save notifications from various services

## ⚠️ Important Notes

1. **MongoDB URI**: Keep this secret! Never commit to GitHub
2. **Webhook Secret**: Optional but recommended for security
3. **Free Tiers**: 
   - MongoDB: 512 MB storage
   - Vercel: Unlimited deployments, 100 GB bandwidth/month

## 🆘 Troubleshooting

### "Failed to connect to MongoDB"
→ Check your connection string in `.env.local`
→ Verify username/password are correct
→ Ensure IP whitelist includes 0.0.0.0/0

### Webhook not showing up
→ Check browser console (F12) for errors
→ Click "Refresh Logs" button
→ Verify webhook is sending to correct URL

### "Unauthorized" error
→ Make sure you're sending `x-webhook-secret` header
→ Verify secret matches `.env.local` value

## 📚 Documentation

- **Full Setup**: See `SETUP.md`
- **Testing Examples**: See `TESTING.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Connection string added to `.env.local`
- [ ] Tested locally at http://localhost:3000
- [ ] Sent test webhook with `.\test-webhook.ps1`
- [ ] Deployed to Vercel (optional)
- [ ] Updated other project to use webhook URL

---

**Ready to go!** Your webhook logger is set up and ready to receive webhooks! 🎉

**Current Status**: 
- ✅ Server running at http://localhost:3000
- ⚠️ Configure MongoDB to start logging webhooks
