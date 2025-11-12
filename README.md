# 🪝 Webhook Logger with MongoDBThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

> A **100% free** webhook endpoint service with beautiful web dashboard. Receive webhooks from any service and view them in real-time!

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-Free%20Tier-green?logo=mongodb)](https://www.mongodb.com/cloud/atlas) [![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)


## Getting Started

First, run the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```

## ✨ Features

- 🔗 **Webhook Endpoint**: Receive POST/GET requests from any servicepnpm dev

- 📊 **Beautiful Dashboard**: View all webhook logs in real-time# or

- 💾 **MongoDB Storage**: All logs saved securely (free tier)bun dev

- 🔄 **Auto-refresh**: Optional 5-second auto-refresh```

- 🔍 **Detailed View**: See full headers, body, query params, IP, user agent

- 🎨 **Dark Mode**: Beautiful dark/light mode supportOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- 🔐 **Security**: Optional webhook secret authentication

- 🚀 **Free Hosting**: Deploy to Vercel free tierYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- 📱 **Responsive**: Works on desktop, tablet, and mobile

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📸 Screenshot

## Learn More

Your dashboard will look like this:

- Clean, modern interface with statsTo learn more about Next.js, take a look at the following resources:

- Table view of all webhook logs

- Click any log to see full details- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- One-click webhook URL copying- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



## 🚀 Quick StartYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



### 1️⃣ Clone & Install## Deploy on Vercel



```bashThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

git clone https://github.com/uparcelchengz/smartadmin-log-endpoint.git

cd smartadmin-log-endpointCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

npm install
```

### 2️⃣ Configure MongoDB

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a cluster (M0 Free tier)
3. Get your connection string
4. Create `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webhook-logs
WEBHOOK_SECRET=your-secret-key-here
```

### 3️⃣ Run Locally

```bash
npm run dev
```

Visit **http://localhost:3000** to see your dashboard! 🎉

### 4️⃣ Test It

Run the test script:

```powershell
.\test-webhook.ps1
```

Or manually:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "data": {"test": true}}'
```

### 5️⃣ Deploy (Optional)

Deploy to Vercel for free:

```bash
git push origin main
# Then import on vercel.com
```

**Detailed guides:**
- 📖 [**QUICKSTART.md**](QUICKSTART.md) - Fast 5-minute setup
- 🔧 [**SETUP.md**](SETUP.md) - Complete setup guide
- 🚀 [**DEPLOYMENT.md**](DEPLOYMENT.md) - Deploy to production
- 🧪 [**TESTING.md**](TESTING.md) - Testing examples

## 📚 Documentation

| File | Description |
|------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | ⚡ 5-minute setup guide |
| [SETUP.md](SETUP.md) | 📖 Complete setup instructions |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 🚀 Deploy to Vercel/Netlify |
| [TESTING.md](TESTING.md) | 🧪 Testing examples & scripts |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 📋 Full project overview |

## 🎯 Usage

### Webhook Endpoint

After deployment, your webhook endpoint is:

```
https://your-project.vercel.app/api/webhook
```

### Send Webhooks

**JavaScript:**
```javascript
fetch('https://your-project.vercel.app/api/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-webhook-secret': 'your-secret'
  },
  body: JSON.stringify({ event: 'test', data: { foo: 'bar' } })
});
```

**Python:**
```python
import requests
requests.post(
  'https://your-project.vercel.app/api/webhook',
  json={'event': 'test', 'data': {'foo': 'bar'}},
  headers={'x-webhook-secret': 'your-secret'}
)
```

**cURL:**
```bash
curl -X POST https://your-project.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret" \
  -d '{"event": "test", "data": {"foo": "bar"}}'
```

### View Logs

Open your dashboard URL in any browser!

## 🏗️ Architecture

```
Next.js 16 (App Router)
├── API Routes
│   ├── POST /api/webhook  → Receive webhooks
│   ├── GET /api/webhook   → Test endpoint
│   ├── GET /api/logs      → Fetch logs
│   └── DELETE /api/logs   → Clear logs
├── Dashboard (/)
│   └── Real-time log viewer
└── MongoDB Atlas
    └── logs collection
```

## 🔐 Security

1. **Webhook Secret** (Recommended):
   - Set `WEBHOOK_SECRET` in environment variables
   - Include in requests: `x-webhook-secret: your-secret`
   - Or as Bearer token: `Authorization: Bearer your-secret`

2. **Environment Variables**:
   - Never commit `.env.local` (already in .gitignore ✅)
   - Add them in Vercel dashboard for production

## 💰 Cost

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **MongoDB Atlas** | M0 Free | $0/mo | 512 MB storage (~500k logs) |
| **Vercel** | Hobby | $0/mo | 100 GB bandwidth, unlimited deploys |
| **Domain** | Optional | ~$12/yr | Custom domain (optional) |

**Total: $0/month** 🎉

## 🛠️ Tech Stack

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Vercel](https://vercel.com/)** - Hosting platform

## 📦 API Reference

### POST /api/webhook

Receive and log a webhook.

**Headers:**
- `Content-Type: application/json`
- `x-webhook-secret: your-secret` (optional)

**Body:** Any JSON

**Response:**
```json
{
  "success": true,
  "message": "Webhook received and logged",
  "id": "507f1f77bcf86cd799439011"
}
```

### GET /api/logs

Fetch webhook logs.

**Query Parameters:**
- `limit` (default: 50) - Number of logs to return
- `skip` (default: 0) - Number of logs to skip

**Response:**
```json
{
  "logs": [...],
  "total": 123,
  "limit": 50,
  "skip": 0
}
```

### DELETE /api/logs

Delete logs.

**Query Parameters:**
- `id` (optional) - Delete specific log by ID
- No parameters - Delete all logs

## 🎓 Use Cases

- 🔍 **Webhook Debugging** - See exactly what GitHub/Stripe/etc. sends
- 📊 **Event Monitoring** - Track events from your services
- 🧪 **Integration Testing** - Test webhook integrations safely
- 📝 **Notification Logging** - Save notifications from various services
- 🔔 **Alert Tracking** - Monitor alerts from monitoring tools

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

Need help? Check these resources:

1. **[QUICKSTART.md](QUICKSTART.md)** - Fast setup guide
2. **[SETUP.md](SETUP.md)** - Detailed instructions
3. **Issues** - Open an issue on GitHub
4. **MongoDB Docs** - [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
5. **Vercel Docs** - [Vercel Documentation](https://vercel.com/docs)

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Made with ❤️ using Next.js, MongoDB, and TypeScript**

**Current Status**: Ready to deploy! 🚀
