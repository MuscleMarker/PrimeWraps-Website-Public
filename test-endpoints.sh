#!/bin/bash

# Test script for Prime Wraps backend endpoints
# Make sure the backend is running on port 8080

echo "Testing Prime Wraps Backend Endpoints..."
echo "========================================"

# Test 1: Health check endpoint
echo "1. Testing health check endpoint..."
curl -X GET http://localhost:8080/api/contact/health
echo -e "\n"

# Test 2: Contact test endpoint
echo "2. Testing contact test endpoint..."
curl -X GET http://localhost:8080/api/contact/test
echo -e "\n"

# Test 3: Auth test endpoint
echo "3. Testing auth test endpoint..."
curl -X GET http://localhost:8080/api/auth/test
echo -e "\n"

# Test 4: Auth debug endpoint (POST)
echo "4. Testing auth debug endpoint (POST)..."
curl -X POST http://localhost:8080/api/auth/debug
echo -e "\n"

# Test 5: Login endpoint (should return 400 for missing body)
echo "5. Testing login endpoint (should return 400 for missing body)..."
curl -X POST http://localhost:8080/api/auth/login
echo -e "\n"

# Test 6: Login endpoint with valid JSON
echo "6. Testing login endpoint with valid JSON..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
echo -e "\n"

echo "Testing complete!" 