# Test Scripts for Webhook Logger

## Test 1: Basic POST Request
```bash
curl -X POST http://localhost:3000/api/webhook `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Hello from test!\", \"timestamp\": \"2024-01-01T00:00:00Z\"}'
```

## Test 2: With Webhook Secret (if configured)
```bash
curl -X POST http://localhost:3000/api/webhook `
  -H "Content-Type: application/json" `
  -H "x-webhook-secret: your-secret-key-here" `
  -d '{\"event\": \"user.created\", \"data\": {\"userId\": 123, \"email\": \"test@example.com\"}}'
```

## Test 3: Complex Payload
```bash
curl -X POST http://localhost:3000/api/webhook `
  -H "Content-Type: application/json" `
  -d '{\"event\": \"payment.success\", \"data\": {\"orderId\": \"ORD-123\", \"amount\": 99.99, \"currency\": \"USD\", \"customer\": {\"name\": \"John Doe\", \"email\": \"john@example.com\"}}}'
```

## Test 4: GET Request (also logs)
```bash
curl http://localhost:3000/api/webhook?test=123
```

## Test 5: Fetch Logs via API
```bash
curl http://localhost:3000/api/logs?limit=10
```

## PowerShell Test (Windows)
```powershell
# Test POST with JSON
Invoke-RestMethod -Uri "http://localhost:3000/api/webhook" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"message": "Hello from PowerShell!", "data": {"key": "value"}}'

# Test with secret
Invoke-RestMethod -Uri "http://localhost:3000/api/webhook" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{"x-webhook-secret" = "your-secret-key"} `
  -Body '{"event": "test", "data": {"foo": "bar"}}'
```

## JavaScript/Node.js Test
```javascript
// test-webhook.js
const testWebhook = async () => {
  const response = await fetch('http://localhost:3000/api/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': 'your-secret-key' // if using secret
    },
    body: JSON.stringify({
      event: 'test.event',
      timestamp: new Date().toISOString(),
      data: {
        message: 'Test from Node.js',
        userId: 456
      }
    })
  });
  
  const result = await response.json();
  console.log('Response:', result);
};

testWebhook();
```

## Python Test
```python
# test_webhook.py
import requests
import json
from datetime import datetime

url = 'http://localhost:3000/api/webhook'
headers = {
    'Content-Type': 'application/json',
    'x-webhook-secret': 'your-secret-key'  # if using secret
}
data = {
    'event': 'test.event',
    'timestamp': datetime.now().isoformat(),
    'data': {
        'message': 'Test from Python',
        'userId': 789
    }
}

response = requests.post(url, headers=headers, json=data)
print('Response:', response.json())
```

## Expected Response
```json
{
  "success": true,
  "message": "Webhook received and logged",
  "id": "507f1f77bcf86cd799439011"
}
```

## View Logs
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:3000/api/logs

## Production Testing
Replace `http://localhost:3000` with your Vercel deployment URL:
```bash
curl -X POST https://your-project.vercel.app/api/webhook `
  -H "Content-Type: application/json" `
  -H "x-webhook-secret: your-secret-key" `
  -d '{\"message\": \"Production test!\"}'
```
