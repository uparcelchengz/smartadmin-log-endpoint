# Quick test webhook endpoint
Write-Host "Testing Webhook Endpoint..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Read webhook secret from .env.local if it exists
$webhookSecret = $null
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match 'WEBHOOK_SECRET=(.+)') {
        $webhookSecret = $matches[1].Trim()
        Write-Host "ℹ️  Found WEBHOOK_SECRET in .env.local" -ForegroundColor Cyan
        Write-Host ""
    }
}

# Prepare headers
$headers = @{
    "Content-Type" = "application/json"
}
if ($webhookSecret) {
    $headers["x-webhook-secret"] = $webhookSecret
}

# Test 1: Simple POST
Write-Host "Test 1: Simple POST request" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/webhook" `
        -Method Post `
        -Headers $headers `
        -Body '{"message": "Hello from PowerShell test!", "timestamp": "2024-01-01T00:00:00Z"}'
    
    Write-Host "✓ Success! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   💡 Tip: Check your WEBHOOK_SECRET in .env.local" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Test 2: Complex payload
Write-Host "Test 2: Complex payload" -ForegroundColor Yellow
try {
    $payload = @{
        event = "user.signup"
        timestamp = (Get-Date).ToString("o")
        data = @{
            userId = 12345
            email = "test@example.com"
            name = "Test User"
            metadata = @{
                source = "PowerShell Test"
                version = "1.0"
            }
        }
    } | ConvertTo-Json -Depth 3

    $response = Invoke-RestMethod -Uri "$baseUrl/api/webhook" `
        -Method Post `
        -Headers $headers `
        -Body $payload
    
    Write-Host "✓ Success! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   💡 Tip: Check your WEBHOOK_SECRET in .env.local" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Test 3: Fetch logs
Write-Host "Test 3: Fetching logs from API" -ForegroundColor Yellow
try {
    $logs = Invoke-RestMethod -Uri "$baseUrl/api/logs?limit=5" -Method Get
    
    Write-Host "✓ Success! Found $($logs.total) total logs" -ForegroundColor Green
    Write-Host "Showing latest $($logs.logs.Count) logs:" -ForegroundColor Cyan
    
    foreach ($log in $logs.logs) {
        Write-Host ""
        Write-Host "  📝 $($log.method) - $($log.timestamp)" -ForegroundColor White
        Write-Host "     IP: $($log.ip)" -ForegroundColor Gray
        if ($log.body) {
            Write-Host "     Body: $($log.body | ConvertTo-Json -Compress -Depth 2)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Testing complete! Visit http://localhost:3000 to view the dashboard" -ForegroundColor Green
Write-Host ""
