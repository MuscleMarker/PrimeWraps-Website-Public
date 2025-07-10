# Test script for Prime Wraps backend endpoints (PowerShell)
# Make sure the backend is running on port 8080

Write-Host "Testing Prime Wraps Backend Endpoints..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Test 1: Health check endpoint
Write-Host "1. Testing health check endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/contact/health" -Method GET
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Contact test endpoint
Write-Host "2. Testing contact test endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/contact/test" -Method GET
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Auth test endpoint
Write-Host "3. Testing auth test endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/test" -Method GET
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Auth debug endpoint (POST)
Write-Host "4. Testing auth debug endpoint (POST)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/debug" -Method POST
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Login endpoint (should return 400 for missing body)
Write-Host "5. Testing login endpoint (should return 400 for missing body)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Login endpoint with valid JSON
Write-Host "6. Testing login endpoint with valid JSON..." -ForegroundColor Yellow
try {
    $body = @{
        username = "admin"
        password = "password"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "Testing complete!" -ForegroundColor Green 