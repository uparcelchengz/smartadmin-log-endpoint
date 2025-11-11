# 🚀 Quick Setup Guide

## Step 1: MongoDB Atlas (Free Tier)

1. **Create Account**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. **Create Cluster**: 
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select a region close to you
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `webhookuser` (or your choice)
   - Password: Generate a strong password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" as driver
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Step 2: Configure Your Project

1. **Edit `.env.local`**:
   ```bash
   # Open in VS Code
   code .env.local
   ```

2. **Add your MongoDB URI**:
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `<cluster>` with your cluster name (from connection string)
   - Add database name: `webhook-logs`
   
   Example:
   ```env
   MONGODB_URI=mongodb+srv://webhookuser:MyP@ssw0rd@cluster0.abc123.mongodb.net/webhook-logs?retryWrites=true&w=majority
   ```

3. **Optional: Set Webhook Secret** (recommended):
   ```env
   WEBHOOK_SECRET=your-random-secret-key-here-make-it-long-and-random
   ```

## Step 3: Test Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Visit [http://localhost:3000](http://localhost:3000)

4. **Test webhook endpoint** (open new terminal):
   ```bash
   curl -X POST http://localhost:3000/api/webhook -H "Content-Type: application/json" -d "{\"test\": \"hello world\"}"
   ```

5. **Refresh your browser** - You should see the log appear!

## Step 4: Deploy to Vercel (Free)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add webhook logger"
   git push
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add Environment Variables:
     - Key: `MONGODB_URI` → Value: (paste your connection string)
     - Key: `WEBHOOK_SECRET` → Value: (your secret key)
   - Click "Deploy"

3. **Get your URL**: After deployment, you'll get a URL like:
   ```
   https://your-project.vercel.app
   ```

## Step 5: Use Your Webhook

Your webhook endpoint is now live at:
```
https://your-project.vercel.app/api/webhook
```

### Test it:
```bash
curl -X POST https://your-project.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret-key-here" \
  -d '{"message": "Hello from my other project!"}'
```

### View logs:
Visit: `https://your-project.vercel.app`

## Integration Examples

### JavaScript/Node.js
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

### Python
```python
import requests

requests.post('https://your-project.vercel.app/api/webhook', 
  json={'event': 'test', 'data': {'key': 'value'}},
  headers={'x-webhook-secret': 'your-secret-key'}
)
```

### GitHub Webhook
1. Go to your repo → Settings → Webhooks
2. Add webhook URL: `https://your-project.vercel.app/api/webhook`
3. Content type: `application/json`
4. Secret: (your webhook secret)
5. Select events to trigger

## Troubleshooting

### "Failed to connect to MongoDB"
- Check your connection string is correct
- Verify username/password are correct
- Ensure IP whitelist includes `0.0.0.0/0` in MongoDB Atlas
- Check database user has read/write permissions

### "Unauthorized" error
- Make sure you're sending the `x-webhook-secret` header
- Verify the secret matches what's in your `.env.local` or Vercel environment variables

### Logs not appearing
- Check browser console for errors (F12)
- Verify MongoDB connection is working
- Try refreshing the page or clicking "Refresh Logs"

## Free Tier Limits

- **MongoDB Atlas**: 512 MB storage (~500,000 small log entries)
- **Vercel**: 
  - 100 GB bandwidth/month
  - Unlimited deployments
  - 10 second max function duration

## Next Steps

- Add authentication to the dashboard
- Set up log retention/cleanup (auto-delete old logs)
- Add filtering and search functionality
- Export logs to CSV/JSON
- Add webhook retry logic
- Set up email notifications for specific events

Enjoy your free webhook logger! 🎉
